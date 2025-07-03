import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import { useSetting } from "@/contexts/GeneralSettingContext";
import { useOrderSetting } from "@/contexts/OrderSettingContext";

export default function OrderDetails() {
    const { form: orderSetting } = useOrderSetting();
    const { form } = useSetting();
    // take id for edit feature
    let { id } = useParams();
    // state for loading
    const [loading, setLoading] = useState(false);

    const [orderDetails, setOrderDetails] = useState(null);

    console.log("Scheduled time:", orderDetails?.time);
    // fetch data to show prev data in input fields
    let getDetails = async (id) => {
        setLoading(true);
        try {
            let res = await fetch("api/order/" + id);
            let data = await res.json();
            setOrderDetails(data.order);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function depend on id changes
    useEffect(() => {
        getDetails(id);
    }, [id]);

    const subtotal = orderDetails?.items?.reduce((acc, item) => {
        return acc + item.quantity * parseFloat(item.price);
    }, 0);

    const OrderDetailsSkeleton = () => (
        <div className="md:flex gap-3 animate-pulse px-5 py-5">
            <div className="md:w-3/5 space-y-6">
                <div className="h-5 w-48 bg-gray-300 rounded"></div>

                <ul className="flex justify-between border-t-2 border-t-accentRed py-5 px-3 shadow-md">
                    <li className="basis-[53%] md:basis-[45%] ml-4 text-sm bg-gray-300 rounded h-3"></li>
                    <li className="basis-[15%] md:basis-[12%] ml-4 text-sm bg-gray-300 rounded h-3"></li>
                    <li className="md:basis-[18%] hidden md:block ml-4 text-sm bg-gray-300 rounded h-3"></li>
                    <li className="basis-[32%] md:basis-[25%] ml-4 text-sm bg-gray-300 rounded h-3"></li>
                </ul>

                {Array(2)
                    .fill(null)
                    .map((_, idx) => (
                        <ul
                            key={idx}
                            className="flex items-center justify-between mt-2 py-3 px-3 shadow-md"
                        >
                            <li className="basis-[53%] md:basis-[45%] ml-1 text-sm flex gap-1 items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div className="h-3 w-32 bg-gray-300 rounded"></div>
                            </li>
                            <li className="basis-[15%] md:basis-[12%] ml-1 text-sm bg-gray-300 rounded h-3"></li>
                            <li className="md:basis-[18%] hidden md:block ml-1 text-sm bg-gray-300 rounded h-3"></li>
                            <li className="basis-[32%] md:basis-[25%] ml-1 text-sm bg-gray-300 rounded h-3"></li>
                        </ul>
                    ))}

                <div className="flex items-center justify-between mt-2 py-3 px-3">
                    <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>

                <div className="py-5 px-3 shadow-md rounded-md space-y-4">
                    {Array(3)
                        .fill(null)
                        .map((_, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between mb-3"
                            >
                                <div className="h-2 w-32 bg-gray-300 rounded"></div>
                                <div className="h-2 w-48 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                </div>

                <div className="my-5 px-3 py-4 border-t-2 border-t-accentRed bg-white shadow-lg rounded-md space-y-4">
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                    <div className="py-5 space-y-3">
                        {Array(3)
                            .fill(null)
                            .map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between mb-3"
                                    style={{ minHeight: "20px" }}
                                >
                                    <div className="h-2 w-36 bg-gray-300 rounded"></div>
                                    <div className="h-2 w-28 bg-gray-300 rounded"></div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="md:w-2/5 space-y-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto md:mx-0"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="py-3 px-3 shadow-md rounded-md space-y-4">
                    <div className="flex justify-between mb-5">
                        <div className="h-3 w-40 bg-gray-300 rounded"></div>
                        <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    </div>
                    <div className="space-y-3">
                        {Array(5)
                            .fill(null)
                            .map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center"
                                    style={{ minHeight: "20px" }}
                                >
                                    <div className="h-3 w-36 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-28 bg-gray-300 rounded"></div>
                                </div>
                            ))}
                    </div>
                    <hr className="border-t-gray-400" />
                    <div className="flex justify-between items-center my-3">
                        <div className="h-3 w-36 bg-gray-300 rounded"></div>
                        <div className="h-3 w-28 bg-gray-300 rounded"></div>
                    </div>
                </div>
                <div className="py-5 px-3 shadow-md rounded-md border-t-2 border-t-accentRed">
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                    <div className="h-12 w-full mt-2 bg-gray-300 rounded"></div>
                </div>
                <div className="py-3 px-3 shadow-md rounded-md border-t-2 border-t-accentRed">
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                    <div className="space-y-6 mt-3">
                        {Array(4)
                            .fill(null)
                            .map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center relative"
                                    style={{ minHeight: "20px" }}
                                >
                                    <div className="w-5 h-5 rounded-full bg-gray-300 absolute z-10"></div>
                                    <div className="h-3 w-32 bg-gray-300 rounded ml-6"></div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <OrderDetailsSkeleton />;
    }
    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full flex flex-col gap-6 px-3 lg:px-4 py-8"
        >
            <div className="md:flex gap-3">
                <div className="md:w-3/5">
                    <nav className="flex items-center space-x-2 text-xl text-muted-foreground mb-4">
                        <Link to="/user/orders" className="hover:text-primary">
                            Orders
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground flex gap-2 items-center">
                            Order{" "}
                            <p className="text-accentRed">
                                {orderDetails?.order_number}
                            </p>
                        </span>
                    </nav>
                    <div className="mt-6">
                        <ul className="flex items-center justify-between border-t-2 border-t-accentRed py-5 px-3 shadow-md">
                            <li className="basis-[53%] md:basis-[45%] ml-1 text-sm">
                                Order Items
                            </li>
                            <li className="basis-[15%] md:basis-[12%] ml-1 text-sm">
                                QTY
                            </li>
                            <li className="md:basis-[18%] hidden md:block ml-1 text-sm">
                                Price
                            </li>
                            <li className="basis-[32%] md:basis-[25%] ml-1 text-sm">
                                Total
                            </li>
                        </ul>
                        {orderDetails?.items?.map((item, index) => (
                            <ul
                                key={item.id}
                                className="flex items-center justify-between mt-2 py-3 px-3 shadow-md"
                            >
                                <li className="basis-[53%] md:basis-[45%] ml-1 text-sm flex gap-1 items-center">
                                    <img
                                        src={`/storage/${
                                            item.menu?.image ||
                                            item.product?.image
                                        }`}
                                        alt="order item image"
                                        className="w-12 h-12 object-cover rounded-full"
                                    />
                                    <h1 className="font-medium text-sm">
                                        {item.title}
                                    </h1>
                                </li>
                                <li className="basis-[15%] md:basis-[12%] ml-1 text-sm">
                                    x {item.quantity}
                                </li>
                                <li className="md:basis-[18%] hidden md:block ml-1 text-sm">
                                    {item.price} $
                                </li>
                                <li className="basis-[32%] md:basis-[25%] ml-1 text-sm">
                                    {(item.price * item.quantity).toFixed(2)} $
                                </li>
                            </ul>
                        ))}
                    </div>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mt-2 py-3 px-3">
                            <h1 className="text-base">Subtotal - </h1>
                            <h1 className="font-medium mr-4">
                                {subtotal?.toFixed(2)} $
                            </h1>
                        </div>
                    </div>
                    <div className="py-5 px-3 mt-3 shadow-md rounded-md">
                        <div className="flex justify-between mb-3">
                            <h1 className="text-sm font-medium">
                                Customer Name -
                            </h1>
                            <p className="text-sm">{orderDetails?.name}</p>
                        </div>
                        <div className="flex justify-between mb-3">
                            <h1 className="text-sm font-medium">
                                Phone Number -
                            </h1>
                            <p className="text-sm">{orderDetails?.phone}</p>
                        </div>
                        <div className="flex justify-between mb-3">
                            <h1 className="text-sm font-medium">Email -</h1>
                            <p className="text-sm">{orderDetails?.email}</p>
                        </div>
                    </div>
                    <div className="my-5 px-3 py-4 border-t-2 border-t-accentRed bg-white shadow-lg rounded-md">
                        <h1 className="text-lg font-medium">
                            Scheduled Delivery
                        </h1>
                        <div className="py-5">
                            <div className="flex justify-between mb-3">
                                <h1 className="text-sm font-medium">
                                    Scheduled Date -
                                </h1>
                                <p className="text-sm">
                                    {orderDetails &&
                                    dayjs(orderDetails.date).isValid()
                                        ? dayjs(orderDetails.date).format(
                                              "MMMM D, YYYY"
                                          )
                                        : ""}
                                </p>
                            </div>
                            <div className="flex justify-between mb-3">
                                <h1 className="text-sm font-medium">
                                    Scheduled Time -
                                </h1>
                                <p className="text-sm"> {orderDetails?.time}</p>
                            </div>
                            <div className="mb-3">
                                <h1 className="text-sm font-medium">Note -</h1>
                                <p className="mt-1 text-sm">
                                    {orderDetails?.note}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:w-2/5">
                    {form.logo && (
                        <img
                            src={`/storage/${form.logo}`} // adjust if needed
                            alt="Logo"
                            className="w-24 h-auto my-3"
                        />
                    )}
                    <p className="text-sm text-gray-700">
                        If you want to change something for this order, contact
                        us via phone.
                    </p>
                    <div className="mt-3 py-3 px-3 shadow-md rounded-md">
                        <div className="flex justify-between items-center mb-5">
                            <h1 className="text-sm font-medium">
                                Order Summary
                            </h1>
                            <p
                                className={`rounded-lg text-sm p-1
                                ${
                                    orderDetails?.status === "confirmed"
                                        ? "text-accentGreen bg-green-100"
                                        : ""
                                }
                                ${
                                    orderDetails?.status === "processing"
                                        ? "text-accentYellow bg-yellow-100"
                                        : ""
                                }
                                ${
                                    orderDetails?.status === "out for delivery"
                                        ? "text-blue-400 bg-blue-50"
                                        : ""
                                }
                                ${
                                    orderDetails?.status === "delivered"
                                        ? "text-gray-500 bg-gray-100"
                                        : ""
                                }
                            `}
                            >
                                {orderDetails?.status}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-sm font-medium">Date -</h1>
                            <p className="text-sm">
                                {" "}
                                {dayjs(orderDetails?.created_at).format(
                                    "MMMM D, YYYY"
                                )}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-sm font-medium">Time -</h1>
                            <p className="text-sm">
                                {dayjs(orderDetails?.created_at).format(
                                    "h:mm A"
                                )}
                            </p>
                        </div>
                        <div className="my-3 mt-8">
                            <div className="flex justify-between items-center mb-3">
                                <h1 className="text-sm font-medium">
                                    Subtotal -{" "}
                                </h1>
                                <p className="text-sm">
                                    {subtotal?.toFixed(2)} $
                                </p>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <h1 className="text-sm font-medium">
                                    Delivery fee -
                                </h1>
                                <p className="text-sm">
                                    {orderSetting.deliveryFee.toFixed(2)} $
                                </p>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <h1 className="text-sm font-medium">Tax - </h1>
                                <p className="text-sm">
                                    {(subtotal * 0.1).toFixed(2)} $
                                </p>
                            </div>
                        </div>
                        <hr className="border-t-gray-400" />
                        <div className="flex justify-between items-center my-3">
                            <h1 className="text-sm font-medium">Total - </h1>
                            <p className="text-sm">
                                {(
                                    subtotal +
                                    subtotal * 0.1 +
                                    orderSetting.deliveryFee
                                ).toFixed(2)}{" "}
                                $
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 py-3 px-3 shadow-md rounded-md border-t-2 border-t-accentRed">
                        <h1 className="text-base font-medium">
                            Delivery Address
                        </h1>
                        <p className="text-gray-900 mt-2 text-sm">
                            {orderDetails?.address}
                        </p>
                    </div>
                    <div className="mt-3 py-3 px-3 shadow-md rounded-md border-t-2 border-t-accentRed">
                        <h1 className="text-base font-medium">
                            Order Progress
                        </h1>
                        <div className="relative pl-6 mt-3">
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-300"></div>

                            {[
                                {
                                    key: "confirmed",
                                    label: "Ordered",
                                    color: "bg-accentGreen",
                                },
                                {
                                    key: "processing",
                                    label: "Processing",
                                    color: "bg-accentYellow",
                                },
                                {
                                    key: "out for delivery",
                                    label: "Out for Delivery",
                                    color: "bg-blue-400",
                                },
                                {
                                    key: "delivered",
                                    label: "Delivered",
                                    color: "bg-gray-500",
                                },
                            ].map(({ key, label, color }, i, arr) => (
                                <div
                                    key={key}
                                    className={`flex items-center ${
                                        i < arr.length - 1 ? "mb-6" : ""
                                    } relative`}
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full relative left-[-0.8rem] z-10 ${
                                            i <=
                                            arr.findIndex(
                                                (s) =>
                                                    s.key ===
                                                    orderDetails?.status
                                            )
                                                ? color
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                    <span className="text-gray-800">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <div className="mt-3 py-3 px-3 shadow-md rounded-md">
            <h1 className="text-sm font-medium">Scheduled Delivery</h1>
            <div className="flex justify-between items-center mt-5 mb-3">
              <h1 className="text-sm font-medium">Scheduled Date -</h1>
              <p className="text-sm">23.3.2025</p>
            </div>
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-sm font-medium">Scheduled Time -</h1>
              <p className="text-sm">12:45 PM</p>
            </div>
            <div className="mb-3">
              <h1 className="text-sm font-medium">Note - </h1>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum
                exercitationem delectus sapiente asperiores, dolores libero
                dolore! Nesciunt iure quia eveniet? Quis at atque,
                necessitatibus molestias sed reprehenderit!
              </p>
            </div>
          </div> */}
                </div>
            </div>
        </motion.div>
    );
}
