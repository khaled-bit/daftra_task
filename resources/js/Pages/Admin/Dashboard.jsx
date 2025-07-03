import {
    MoveUp,
    Utensils,
    MoveDown,
    HandPlatter,
    Circle,
    Ellipsis,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import Profile from "../../../images/Profile.jpg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../../Components/ui/sheet";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import { useOrderSetting } from "@/contexts/OrderSettingContext";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";

export default function Dashboard() {
    const { form: orderSetting } = useOrderSetting();
    // state to store orders
    let [orders, setOrders] = useState([]);
    // state for loadings
    const [loading, setLoading] = useState(false);

    console.log("Order:", orders);

    // fetch data that send from backend
    let getOrders = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/orders");
            const now = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);

            const filtered = res.data.orders.filter((order) => {
                const createdAt = new Date(order.created_at);
                return createdAt >= sevenDaysAgo && createdAt <= now;
            });

            setOrders(filtered);
        } catch {
            console.log("Error fetching orders: ", err);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function in useEffect to run when user enter the page
    useEffect(() => {
        getOrders();
    }, []);

    // state to store reservations
    let [reservations, setReservations] = useState([]);

    const [selectedReservationId, setSelectedReservationId] = useState(null);

    // fetch data that send from backend
    let getReservations = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/reservations");
            const now = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);

            const filtered = res.data.reservations.filter((reservation) => {
                const createdAt = new Date(reservation.created_at);
                return createdAt >= sevenDaysAgo && createdAt <= now;
            });

            setReservations(filtered);
        } catch {
            console.log("Error Fetching reservation: ", err);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function in useEffect to run when user enter the page
    useEffect(() => {
        getReservations();
    }, []);

    const totalRevenue = orders.reduce((acc, order) => {
        const orderTotal = (order.items ?? []).reduce((sum, item) => {
            const price =
                parseFloat(item.finalPrice) ||
                parseFloat(item.originalPrice) ||
                parseFloat(item.price) ||
                0;
            const quantity = parseInt(item.quantity ?? 1);
            return sum + price * quantity;
        }, 0);

        // Add 10% (1.1 multiplier) and delivery fee
        const deliveryFee = parseFloat(orderSetting.deliveryFee) || 0;
        return acc + orderTotal * 1.1 + deliveryFee;
    }, 0);

    const sevenDaysAgo = dayjs().subtract(7, "day");

    // Initialize counts
    let foodCount = 0;
    let productCount = 0;

    orders.forEach((order) => {
        (order.items ?? []).forEach((item) => {
            if (item.menu_id) foodCount += 1;
            else if (item.product_id) productCount += 1;
        });
    });

    const data = [
        { name: "Food Delivery", value: foodCount },
        { name: "Products Delivery", value: productCount },
        { name: "Reservations", value: reservations.length }, // keep using state here
    ];

    const COLORS = ["#DC143C", "#FF8C00", "#008000"];
    const total = data.reduce((acc, item) => acc + item.value, 0);

    const now = dayjs();
    const last7Days = Array.from(
        { length: 7 },
        (_, i) => now.subtract(6 - i, "day") // oldest to newest
    );

    const data1 = last7Days.map((date) => {
        const dayOrders = orders.filter((order) =>
            dayjs(order.created_at).isSame(date, "day")
        );

        const dailyRevenue = dayOrders.reduce((acc, order) => {
            const orderTotal = (order.items ?? []).reduce((sum, item) => {
                const price =
                    parseFloat(item.finalPrice) ||
                    parseFloat(item.originalPrice) ||
                    parseFloat(item.price) ||
                    0;
                const quantity = parseInt(item.quantity ?? 1);
                return sum + price * quantity;
            }, 0);

            return acc + orderTotal;
        }, 0);

        return {
            name: date.format("MMM D"), // e.g. "May 23"
            value: parseFloat(dailyRevenue.toFixed(2)),
        };
    });

    const StatCardSkeleton = () => (
        <div className="mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md animate-pulse">
            <div className="flex justify-between border-l-2 border-l-gray-300 px-2 py-1">
                <div>
                    <div className="h-3 w-24 bg-gray-300 rounded mb-2" />
                    <div className="h-5 w-10 bg-gray-300 rounded" />
                </div>
                <div className="h-5 w-5 bg-gray-300 rounded-full" />
            </div>
            <div className="h-3 w-32 bg-gray-300 rounded mt-4" />
        </div>
    );

    const RevenueAnalyticsSkeleton = () => (
        <div className="lg:flex gap-3">
            <div className="lg:w-[40%] mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md animate-pulse">
                <div className="h-4 w-40 bg-gray-300 rounded mb-6" />
                <div className="md:flex items-center gap-2">
                    <div className="md:w-3/5 flex justify-center items-center">
                        <div className="h-[200px] w-[200px] bg-gray-200 rounded-full" />
                    </div>
                    <div className="md:w-2/5 space-y-5 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-1">
                                <div className="h-3 w-24 bg-gray-300 rounded" />
                                <div className="h-4 w-16 bg-gray-300 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sales Analytics Skeleton */}
            <div className="lg:w-[60%] mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md animate-pulse">
                <div className="h-4 w-40 bg-gray-300 rounded mb-4" />
                <div className="w-full h-[250px] bg-gray-200 rounded" />
            </div>
        </div>
    );

    const OrderListSkeleton = () => (
        <ul className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2 animate-pulse">
            <li className="basis-[15%]">
                <div className="h-3 w-16 bg-gray-300 rounded" />
            </li>
            <li className="basis-[25%] flex gap-2 items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="h-3 w-24 bg-gray-300 rounded" />
            </li>
            <li className="basis-[20%]">
                <div className="h-3 w-20 bg-gray-300 rounded" />
            </li>
            <li className="basis-[15%]">
                <div className="h-5 w-24 bg-gray-200 rounded" />
            </li>
            <li className="basis-[20%]">
                <div className="h-3 w-24 bg-gray-300 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-300 rounded" />
            </li>
            <li className="basis-[5%]">
                <div className="w-5 h-5 bg-gray-300 rounded" />
            </li>
        </ul>
    );

    const ReservationListSkeleton = () => (
        <ul className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2 animate-pulse">
            <li className="basis-[4%]">
                <div className="h-3 w-6 bg-gray-300 rounded" />
            </li>
            <li className="basis-[14%]">
                <div className="h-3 w-24 bg-gray-300 rounded" />
            </li>
            <li className="basis-[22%]">
                <div className="h-3 w-32 bg-gray-300 rounded" />
            </li>
            <li className="basis-[12%]">
                <div className="h-3 w-10 bg-gray-300 rounded" />
            </li>
            <li className="basis-[18%]">
                <div className="h-3 w-28 bg-gray-300 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-300 rounded" />
            </li>
            <li className="basis-[12%]">
                <div className="h-3 w-12 bg-gray-300 rounded" />
            </li>
            <li className="basis-[13%]">
                <div className="h-5 w-24 bg-gray-200 rounded" />
            </li>
            <li className="basis-[5%]">
                <div className="w-5 h-5 bg-gray-300 rounded" />
            </li>
        </ul>
    );

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="mx-2 md:mx-4 my-8"
        >
            <div className="grid md:grid-cols-3 gap-3">
                {loading ? (
                    Array(3)
                        .fill(null)
                        .map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <div className="mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md">
                            <div className="flex justify-between border-l-2 border-l-accentRed px-2 py-1">
                                <div>
                                    <h1 className="text-gray-600">
                                        Total Orders
                                    </h1>
                                    <p className="text-black">
                                        {orders.length}
                                    </p>
                                </div>
                                <Utensils className="text-accentRed" />
                            </div>
                            <span className="text-sm flex gap-1 pt-3">
                                <p className="text-gray-600">
                                    Since {sevenDaysAgo.format("MMM D, YYYY")}
                                </p>
                            </span>
                        </div>
                        <div className="mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md">
                            <div className="flex justify-between border-l-2 border-l-accentRed px-2 py-1">
                                <div>
                                    <h1 className="text-gray-600">
                                        Total Reservation
                                    </h1>
                                    <p className="text-black">
                                        {reservations.length}
                                    </p>
                                </div>
                                <HandPlatter className="text-accentRed" />
                            </div>
                            <span className="text-sm flex gap-1 pt-3">
                                <p className="text-gray-600">
                                    Since {sevenDaysAgo.format("MMM D, YYYY")}
                                </p>
                            </span>
                        </div>
                        <div className="mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md">
                            <div className="flex justify-between border-l-2 border-l-accentRed px-2 py-1">
                                <div>
                                    <h1 className="text-gray-600">
                                        Total Revenue
                                    </h1>
                                    <p className="text-black">
                                        $ {totalRevenue.toFixed(2)}
                                    </p>
                                </div>
                                <HandPlatter className="text-accentRed" />
                            </div>
                            <span className="text-sm flex gap-1 pt-3">
                                <p className="text-gray-600">
                                    Since {sevenDaysAgo.format("MMM D, YYYY")}
                                </p>
                            </span>
                        </div>
                    </>
                )}
            </div>
            {loading ? (
                <RevenueAnalyticsSkeleton />
            ) : (
                <div className="lg:flex gap-3">
                    <div className="lg:w-[40%] mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md">
                        <h1 className="font-medium">Revenue Statistics</h1>
                        <div className="md:flex items-center gap-2">
                            <div className="md:w-3/5 flex flex-col items-center">
                                <div className="relative">
                                    <PieChart width={250} height={250}>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60} // Creates the donut effect
                                            outerRadius={90}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                    {/* Center Text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-xl font-bold">
                                            {total}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-2/5">
                                <div className="space-y-1 my-3">
                                    <h1 className="text-gray-600 text-sm">
                                        Food Delivery
                                    </h1>
                                    <span className="text-accentRed flex gap-1">
                                        <Circle size={20} />
                                        <p className="font-medium">
                                            {foodCount}
                                        </p>
                                    </span>
                                </div>
                                <div className="space-y-1 my-3">
                                    <h1 className="text-gray-600 text-sm">
                                        Products Delivery
                                    </h1>
                                    <span className="text-accentYellow flex gap-1">
                                        <Circle size={20} />
                                        <p className="font-medium">
                                            {productCount}
                                        </p>
                                    </span>
                                </div>
                                <div className="space-y-1 my-3">
                                    <h1 className="text-gray-600 text-sm">
                                        Reservations
                                    </h1>
                                    <span className="text-accentGreen flex gap-1">
                                        <Circle size={20} />
                                        <p className="font-medium">
                                            {reservations.length}
                                        </p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-[60%] mb-6 p-3 border border-gray-300 bg-white shadow-lg rounded-md">
                        <div className="w-full">
                            <h1 className="font-medium mb-3">
                                Sales Analytics
                            </h1>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart
                                    data={data1}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#DC143C"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
            <div className="my-8">
                <h1 className="font-medium text-lg">Recent Invoices</h1>
                <div className="mt-3 overflow-x-auto">
                    <div className="min-w-[920px] lg:min-w-[880px]">
                        <ul className="flex items-center px-3 py-4 bg-accentRed text-white rounded-md shadow-md mb-4">
                            <li className="basis-[15%]">Order</li>
                            <li className="basis-[25%]">Customer Name</li>
                            <li className="basis-[20%]">Total</li>
                            <li className="basis-[15%]">Status</li>
                            <li className="basis-[20%]">Ordered at</li>
                            <li className="basis-[5%]"></li>
                        </ul>
                        {orders.length > 0
                            ? orders.slice(0, 3).map((order) => (
                                  <ul
                                      key={order.id}
                                      className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2"
                                  >
                                      <li className="basis-[15%]">
                                          {order.order_number}
                                      </li>
                                      <li className="basis-[25%] flex gap-1 items-center">
                                          <img
                                              src={Profile}
                                              // {order.user?.profileImage || Profile }
                                              alt="Profile"
                                              className="w-10 h-10 object-cover rounded-full"
                                          />
                                          <p className="text-xs md:text-sm">
                                              {order.name}
                                          </p>
                                      </li>
                                      <li className="basis-[20%]">
                                          {(
                                              (order.items ?? []).reduce(
                                                  (total, item) =>
                                                      total +
                                                      parseFloat(
                                                          item.finalPrice ||
                                                              item.originalPrice ||
                                                              item.price ||
                                                              0
                                                      ) *
                                                          parseInt(
                                                              item.quantity ?? 1
                                                          ),
                                                  0
                                              ) *
                                                  1.1 +
                                              parseFloat(
                                                  orderSetting.deliveryFee
                                              )
                                          ).toFixed(2)}{" "}
                                          $
                                      </li>
                                      <li className="basis-[15%]">
                                          <span
                                              className={`px-1 py-1 text-sm rounded-sm 
                                ${
                                    order?.status === "confirmed"
                                        ? "text-accentGreen bg-green-100"
                                        : ""
                                }
                                ${
                                    order?.status === "processing"
                                        ? "text-accentYellow bg-yellow-100"
                                        : ""
                                }
                                ${
                                    order?.status === "out for delivery"
                                        ? "text-blue-400 bg-blue-50"
                                        : ""
                                }
                                ${
                                    order?.status === "delivered"
                                        ? "text-gray-500 bg-gray-100"
                                        : ""
                                }
                            `}
                                          >
                                              {order?.status}
                                          </span>
                                      </li>
                                      <li className="basis-[20%]">
                                          <p className="text-sm">
                                              {dayjs(order?.created_at).format(
                                                  "MMMM D, YYYY"
                                              )}
                                          </p>
                                          <p className="text-sm">
                                              {" "}
                                              {dayjs(order?.created_at).format(
                                                  "h:mm A"
                                              )}
                                          </p>
                                      </li>
                                      <li className="basis-[5%]">
                                          <DropdownMenu modal={false}>
                                              <DropdownMenuTrigger asChild>
                                                  <button className="p-1 rounded-md hover:bg-gray-100 outline-none">
                                                      <Ellipsis size={20} />
                                                  </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent
                                                  align="end"
                                                  className="w-40"
                                              >
                                                  <Link
                                                      to={`/admin/order/${order.id}`}
                                                  >
                                                      <DropdownMenuItem className="text-accentGreen">
                                                          View Details
                                                      </DropdownMenuItem>
                                                  </Link>
                                                  <DropdownMenuItem className="text-accentRed">
                                                      Cancel
                                                  </DropdownMenuItem>
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                      </li>
                                  </ul>
                              ))
                            : Array.from({ length: 3 }).map((_, i) => (
                                  <OrderListSkeleton />
                              ))}
                    </div>
                </div>
            </div>
            <div className="my-8">
                <h1 className="font-medium text-lg">Today's reservations</h1>
                <div className="mt-3 overflow-x-auto">
                    <div className="min-w-[920px] lg:min-w-[880px]">
                        <ul className="flex items-center px-3 py-4 bg-accentRed text-white rounded-md shadow-md mb-4">
                            <li className="basis-[4%]">ID</li>
                            <li className="basis-[14%]">Reservation</li>
                            <li className="basis-[22%]">Name</li>
                            <li className="basis-[12%]">Guests</li>
                            <li className="basis-[18%]">Date & Time</li>
                            <li className="basis-[12%]">Table</li>
                            <li className="basis-[13%]">Status</li>
                            <li className="basis-[5%]"></li>
                        </ul>
                        {reservations.length > 0
                            ? reservations.slice(0, 3).map((reservation) => (
                                  <ul
                                      key={reservation.id}
                                      className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2"
                                  >
                                      <li className="basis-[4%]">
                                          {reservation.id}
                                      </li>
                                      <li className="basis-[14%]">
                                          <h1 className="text-accentRed font-medium">
                                              {reservation.reservation_code}
                                          </h1>
                                      </li>
                                      <li className="basis-[22%]">
                                          {reservation.firstName}{" "}
                                          {reservation.lastName}
                                      </li>
                                      <li className="basis-[12%]">
                                          {reservation.guest}
                                      </li>
                                      <li className="basis-[18%]">
                                          <p className="text-sm">
                                              {dayjs(reservation?.date).format(
                                                  "MMMM D, YYYY"
                                              )}
                                          </p>
                                          <p className="text-sm">
                                              {" "}
                                              {reservation.time}
                                          </p>
                                      </li>
                                      <li className="basis-[12%]">
                                          <h1 className="text-accentRed font-medium">
                                              {reservation.table_no}
                                          </h1>
                                      </li>
                                      <li className="basis-[13%]">
                                          <span
                                              className={`px-1 py-1 rounded-md text-sm ${
                                                  reservation.status ===
                                                  "Confirmed"
                                                      ? "bg-green-100 text-accentGreen"
                                                      : reservation.status ===
                                                        "Canceled"
                                                      ? "bg-red-100 text-red-600"
                                                      : reservation.status ===
                                                        "Reserved"
                                                      ? "bg-yellow-100 text-yellow-700"
                                                      : "bg-gray-100 text-gray-600"
                                              }`}
                                          >
                                              {reservation.status || "Pending"}
                                          </span>
                                      </li>
                                      <li className="basis-[5%]">
                                          <DropdownMenu modal={false}>
                                              <DropdownMenuTrigger asChild>
                                                  <button className="p-1 rounded-md hover:bg-gray-100 outline-none">
                                                      <Ellipsis size={20} />
                                                  </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent
                                                  align="end"
                                                  className="w-40"
                                              >
                                                  <DropdownMenuItem
                                                      className="text-accentYellow"
                                                      onClick={() =>
                                                          setSelectedReservationId(
                                                              reservation.id
                                                          )
                                                      }
                                                  >
                                                      View Details
                                                  </DropdownMenuItem>
                                                  {reservation.status !==
                                                      "Reserved" && (
                                                      <div>
                                                          <DropdownMenuItem
                                                              onClick={() =>
                                                                  handleStatusChange(
                                                                      reservation.id,
                                                                      "Confirmed"
                                                                  )
                                                              }
                                                              className="text-accentGreen"
                                                          >
                                                              Confirm
                                                          </DropdownMenuItem>
                                                          <DropdownMenuItem
                                                              onClick={() =>
                                                                  handleStatusChange(
                                                                      reservation.id,
                                                                      "Canceled"
                                                                  )
                                                              }
                                                              className="text-accentRed"
                                                          >
                                                              Cancel
                                                          </DropdownMenuItem>
                                                      </div>
                                                  )}
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                          <Sheet
                                              open={
                                                  selectedReservationId ===
                                                  reservation.id
                                              }
                                              onOpenChange={(open) => {
                                                  if (!open)
                                                      setSelectedReservationId(
                                                          null
                                                      ); // close the sheet
                                              }}
                                          >
                                              <SheetContent className="w-[93%] md:w-[48%] flex flex-col justify-between">
                                                  <SheetHeader>
                                                      <SheetTitle>
                                                          <div className="flex gap-1">
                                                              Reservation{" "}
                                                              <div className="flex items-center basis-[28%] md:basis-[20%] text-accentRed">
                                                                  <h1 className="font-medium">
                                                                      {
                                                                          reservation.reservation_code
                                                                      }
                                                                  </h1>
                                                              </div>
                                                          </div>
                                                      </SheetTitle>
                                                  </SheetHeader>
                                                  <div>
                                                      <div className="flex items-center gap-2">
                                                          <img
                                                              src={Profile}
                                                              alt=""
                                                              className="w-16 h-16 rounded-full"
                                                          />
                                                          <div>
                                                              <h1 className="font-medium">
                                                                  {reservation
                                                                      .user
                                                                      ?.name ??
                                                                      "Guest"}
                                                              </h1>
                                                              {/* <span className="text-sm text-gray-700">
                                                            Bahan, Yangon
                                                        </span> */}
                                                          </div>
                                                      </div>
                                                      <div className="mt-8">
                                                          <div className="flex justify-between items-center mb-2">
                                                              <h1 className="text-sm font-medium">
                                                                  Name -{" "}
                                                              </h1>
                                                              <span className="text-sm text-gray-800">
                                                                  {
                                                                      reservation.firstName
                                                                  }{" "}
                                                                  {
                                                                      reservation.lastName
                                                                  }
                                                              </span>
                                                          </div>
                                                          <div className="flex justify-between items-center mb-2">
                                                              <h1 className="text-sm font-medium">
                                                                  Date -{" "}
                                                              </h1>
                                                              <span className="text-sm text-gray-800">
                                                                  {dayjs(
                                                                      reservation?.date
                                                                  ).format(
                                                                      "MMMM D, YYYY"
                                                                  )}
                                                              </span>
                                                          </div>
                                                          <div className="flex justify-between items-center mb-2">
                                                              <h1 className="text-sm font-medium">
                                                                  Time -{" "}
                                                              </h1>
                                                              <span className="text-sm text-gray-800">
                                                                  {
                                                                      reservation.time
                                                                  }
                                                              </span>
                                                          </div>
                                                          <div className="flex justify-between items-center mb-2">
                                                              <h1 className="text-sm font-medium">
                                                                  Guest -{" "}
                                                              </h1>
                                                              <span className="text-sm text-gray-800">
                                                                  {
                                                                      reservation.guest
                                                                  }{" "}
                                                                  guests
                                                              </span>
                                                          </div>
                                                          <div className="flex justify-between items-center mb-2">
                                                              <h1 className="text-sm font-medium">
                                                                  Table -{" "}
                                                              </h1>
                                                              <span className="text-sm text-accentRed">
                                                                  {
                                                                      reservation.table_no
                                                                  }
                                                              </span>
                                                          </div>
                                                          <hr className="border-t-gray-400 mt-4 mb-5" />
                                                          <div className="flex justify-between items-center mb-2">
                                                              <h1 className="text-sm font-medium">
                                                                  Phone -{" "}
                                                              </h1>
                                                              <span className="text-sm text-gray-800">
                                                                  {
                                                                      reservation.phone
                                                                  }
                                                              </span>
                                                          </div>
                                                          <div className="text-sm flex justify-between items-center mb-2">
                                                              <h1 className="font-medium">
                                                                  Email -{" "}
                                                              </h1>
                                                              <span className="text-sm text-gray-800">
                                                                  {
                                                                      reservation.email
                                                                  }
                                                              </span>
                                                          </div>
                                                          <hr className="border-t-gray-400 mt-5 mb-2" />
                                                          <div>
                                                              <h1 className="font-medium">
                                                                  Message
                                                              </h1>
                                                              <p className="text-gray-700 text-xs mt-3">
                                                                  {
                                                                      reservation.message
                                                                  }
                                                              </p>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="flex justify-end">
                                                      <Button
                                                          type="button"
                                                          className={`text-white ${
                                                              reservation.status ===
                                                              "Reserved"
                                                                  ? "bg-gray-400 cursor-not-allowed"
                                                                  : "bg-yellow-600"
                                                          }`}
                                                          onClick={() =>
                                                              handleStatusChange(
                                                                  reservation.id,
                                                                  "Reserved"
                                                              )
                                                          }
                                                      >
                                                          {reservation.status ===
                                                          "Reserved"
                                                              ? "Already Reserved"
                                                              : "Mark as Reserved"}
                                                      </Button>
                                                  </div>
                                              </SheetContent>
                                          </Sheet>
                                      </li>
                                  </ul>
                              ))
                            : Array.from({ length: 3 }).map((_, i) => (
                                  <ReservationListSkeleton />
                              ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
