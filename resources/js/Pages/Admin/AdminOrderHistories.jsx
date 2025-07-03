import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../Components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../Components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import Profile from "../../../images/Profile.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import dayjs from "dayjs";
import Empty from "../../../images/Empty.png";
import { useOrderSetting } from "@/contexts/OrderSettingContext";
import { useSearch } from "@/contexts/SearchContext";

export default function AdminOrderHistories() {
    const [loading, setLoading] = useState(false);
    const { form: orderSetting } = useOrderSetting();
    // state to store orders
    let [orders, setOrders] = useState([]);
    const { query } = useSearch();

    console.log("Order:", orders);
    // state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    // rows to show in a page
    const rowsPerPage = 10;

    // fetch data that send from backend
    let getOrders = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/orders");
            let data = res.data;
            setOrders(data.orders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function in useEffect to run when user enter the page
    useEffect(() => {
        getOrders();
    }, []);

    const filteredOrders = orders.filter(
        (order) =>
            order.order_number?.toLowerCase().includes(query.toLowerCase()) ||
            order.name?.toLowerCase().includes(query.toLowerCase())
    );

    const indexOfLastOrder = currentPage * rowsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );

    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const [selectedFilter, setSelectedFilter] = useState("all");

    const handleFilterChange = (filterValue) => {
        setSelectedFilter(filterValue);

        axios
            .get(`/api/orders?filter=${filterValue}`)
            .then((response) => {
                const data = response.data;
                if (data.orders) {
                    setOrders(data.orders);
                    console.log(data.order);
                }
            })
            .catch((error) => {
                console.error("Axios request failed:", error);
            });
    };

    useEffect(() => {
        handleFilterChange("all");
    }, []);

    const handleCancel = async (orderId) => {
        try {
            await axios
                .put(`/api/order/${orderId}/status`, {
                    status: "cancelled",
                })
                .then((res) => {
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === orderId
                                ? { ...order, status: "cancelled" }
                                : order
                        )
                    );
                });
        } catch (error) {
            console.error("Failed to cancel order:", error);
        }
    };

    const OrderItemSkeleton = () => (
        <ul className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2 animate-pulse">
            <li className="basis-[15%]">
                <div className="h-3 w-20 bg-gray-300 rounded" />
            </li>
            <li className="basis-[25%] flex gap-2 items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="h-3 w-24 bg-gray-300 rounded" />
            </li>
            <li className="basis-[20%]">
                <div className="h-3 w-16 bg-gray-300 rounded" />
            </li>
            <li className="basis-[15%]">
                <div className="h-4 w-24 bg-gray-200 rounded-sm" />
            </li>
            <li className="basis-[20%] space-y-1">
                <div className="h-2 w-28 bg-gray-300 rounded" />
                <div className="h-2 w-20 bg-gray-200 rounded" />
            </li>
            <li className="basis-[5%]">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
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
            <h1 className="text-lg font-medium">
                {orders.length} Orders Found
            </h1>
            <ul className="mt-6 flex gap-3 items-center space-x-4">
                <li>
                    <button
                        onClick={() => handleFilterChange("all")}
                        className="relative hover:text-gray-950 group"
                    >
                        All
                        <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-accentRed transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => handleFilterChange("new")}
                        to=""
                        className="relative hover:text-gray-950 group"
                    >
                        New
                        <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-accentRed transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => handleFilterChange("delivered")}
                        className="relative hover:text-gray-950 group"
                    >
                        Delivered
                        <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-accentRed transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => handleFilterChange("cancelled")}
                        className="relative hover:text-gray-950 group"
                    >
                        Cancelled
                        <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-accentRed transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </li>
            </ul>
            <hr className="border-t-gray-300 mt-3" />
            <div className="mt-8 overflow-x-auto">
                <div className="min-w-[920px] lg:min-w-[880px]">
                    <ul className="flex items-center px-3 py-4 bg-accentRed text-white rounded-md shadow-md mb-4">
                        <li className="basis-[15%]">Order</li>
                        <li className="basis-[25%]">Customer Name</li>
                        <li className="basis-[20%]">Total</li>
                        <li className="basis-[15%]">Status</li>
                        <li className="basis-[20%]">Ordered at</li>
                        <li className="basis-[5%]"></li>
                    </ul>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <OrderItemSkeleton key={i} />
                        ))
                    ) : orders.length === 0 ? (
                        <div className="absolute inset-0 z-10  bg-lightBackground flex flex-col items-center justify-center text-center font-medium text-accentRed h-full">
                            <img
                                src={Empty}
                                alt="No data"
                                className="mx-auto w-60"
                            />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                No data to show.
                            </h2>
                            <p className="text-gray-500 mb-4 text-sm">
                                The table you are looking for is empty.
                            </p>
                        </div>
                    ) : (
                        currentOrders.map((order) => (
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
                                        parseFloat(orderSetting.deliveryFee)
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
                                ${
                                    order?.status === "cancelled"
                                        ? "text-red-500 bg-red-100"
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
                                            <DropdownMenuItem
                                                className="text-accentRed"
                                                onClick={() =>
                                                    handleCancel(order.id)
                                                }
                                            >
                                                Cancel
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </li>
                            </ul>
                        ))
                    )}
                </div>
            </div>
            <div className="mt-8 flex">
                <div className="ml-auto">
                    <Pagination className="text-accentRed">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className={`cursor-pointer ${
                                        currentPage === 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                />
                            </PaginationItem>
                            {Array.from(
                                {
                                    length: Math.ceil(
                                        orders.length / rowsPerPage
                                    ),
                                },
                                (_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            onClick={() =>
                                                handlePageChange(index + 1)
                                            }
                                            isActive={currentPage === index + 1}
                                            className="cursor-pointer"
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    className={`cursor-pointer ${
                                        currentPage === totalPages
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={
                                        currentPage ===
                                        Math.ceil(orders.length / rowsPerPage)
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </motion.div>
    );
}
