import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../../Components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../Components/ui/pagination";
import { useEffect } from "react";
import Empty from "../../../images/Empty.png";
import dayjs from "dayjs";
import { useOrderSetting } from "@/contexts/OrderSettingContext";
import { useSearch } from "@/contexts/SearchContext";

export default function OrderHistories() {
    const [loading, setLoading] = useState(false);
    const { form: orderSetting } = useOrderSetting();
    // state to store orders
    let [orders, setOrders] = useState([]);

    const { query, setQuery } = useSearch();

    console.log("Order:", orders);
    // state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    // rows to show in a page
    const rowsPerPage = 10;

    // fetch data that send from backend
    let getOrders = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/user/orders");
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

    const filteredOrders = orders.filter((order) =>
        order.order_number?.toLowerCase().includes(query.toLowerCase())
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

    const OrderSkeleton = () => {
        return (
            <ul className="flex items-center justify-between border-l-2 border-l-accentRed mt-3 py-5 px-3 shadow-md animate-pulse bg-white rounded-md">
                <li className="ml-1 basis-[10%]">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
                </li>
                <li className="ml-1 basis-[20%]">
                    <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto" />
                </li>
                <li className="ml-1 basis-[23%]">
                    <div className="h-4 bg-gray-300 rounded w-4/5 mx-auto" />
                </li>
                <li className="basis-[23%]">
                    <div className="h-6 w-16 bg-gray-300 rounded-lg mx-auto" />
                </li>
                <li className="ml-1 basis-[22%] space-y-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto" />
                </li>
            </ul>
        );
    };

    const OrderCardSkeleton = () => {
        return (
            <div className="px-3 py-4 shadow-xl mt-4 rounded-md border-l-2 border-l-accentRed animate-pulse">
                <div className="flex justify-between mb-2">
                    <div className="h-6 w-24 bg-gray-300 rounded" />{" "}
                    {/* "Order ###" placeholder */}
                    <div className="h-5 w-16 bg-gray-300 rounded" />{" "}
                    {/* Status pill placeholder */}
                </div>
                <div className="h-5 bg-gray-300 rounded mb-3" />{" "}
                {/* Date/time placeholder */}
                <div className="flex justify-end">
                    <div className="h-6 w-20 bg-gray-300 rounded" />{" "}
                    {/* Price placeholder */}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full flex flex-col gap-6 px-3 lg:px-4 py-8"
        >
            <div className="block md:flex justify-between mb-0 md:mb-4">
                <h1 className="text-xl font-medium flex gap-1 items-center">
                    Your Orders
                </h1>
                <div>
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={16}
                        />
                        <Input
                            id=""
                            type="text"
                            placeholder="Search..."
                            className="mt-1 border-gray-500 pl-8 pr-4"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="hidden md:block mx-4">
                <ul className="flex items-center justify-between border-t-2 border-t-accentRed py-5 px-3 shadow-md">
                    <li className="ml-1 basis-[10%] text-accentRed">ID</li>
                    <li className="ml-1 basis-[20%] text-accentRed">Order</li>
                    <li className="ml-1 basis-[23%] text-accentRed">Total</li>
                    <li className="ml-1 basis-[23%] text-accentRed">Status</li>
                    <li className="ml-1 basis-[22%] text-accentRed">
                        Ordered at
                    </li>
                </ul>
                {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <OrderSkeleton key={idx} />
                    ))
                ) : orders.length === 0 ? (
                    <div className="lg:pt-24 lg:w-[68%] xl:w-[74%] lg:ml-[32%] xl:ml-[26%] pt-20  min-h-screen absolute inset-0 z-10  bg-white flex flex-col items-center justify-center text-center font-medium text-accentRed h-full">
                        <img
                            src={Empty}
                            alt="No data"
                            className="mx-auto w-60"
                        />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Nothing in your order history.
                        </h2>
                        <p className="text-gray-500 mb-4 text-sm">
                            You didn't order anything from us.
                        </p>
                    </div>
                ) : (
                    currentOrders.map((order) => (
                        <Link key={order.id} to={`/user/order/${order.id}`}>
                            <ul className="flex items-center justify-between border-l-2 border-l-accentRed mt-3 py-5 px-3 shadow-md hover:bg-gray-100 duration-300">
                                <li className="ml-1 basis-[10%]">{order.id}</li>
                                <li className="ml-1 basis-[20%]">
                                    {order.order_number}
                                </li>
                                <li className="ml-1 basis-[23%]">
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
                                            orderSetting.deliveryFee ?? 0
                                        )
                                    ).toFixed(2)}{" "}
                                    $
                                </li>
                                <li className="basis-[23%]">
                                    <span
                                        className={`rounded-lg text-sm p-1
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
                                <li className="ml-1 basis-[22%]">
                                    <p className="text-sm">
                                        {dayjs(order?.created_at).format(
                                            "MMMM D, YYYY"
                                        )}
                                    </p>
                                    <p className="text-sm">
                                        {dayjs(order?.created_at).format(
                                            "h:mm A"
                                        )}
                                    </p>
                                </li>
                            </ul>
                        </Link>
                    ))
                )}
            </div>

            <div className="block md:hidden">
                {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <OrderCardSkeleton key={idx} />
                    ))
                ) : currentOrders.length === 0 ? (
                    <div className="text-center font-medium text-accentRed flex flex-col items-center justify-center h-[80vh]">
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
                        <Link to="/user/order">
                            <div className="px-3 py-4 shadow-xl mt-4 rounded-md border-l-2 border-l-accentRed">
                                <div className="flex justify-between">
                                    <span className="text-lg flex items-center gap-2">
                                        Order
                                        <span className="text-xl font-medium">
                                            {order.order_number}
                                        </span>
                                    </span>
                                    <span
                                        className={`rounded-lg text-sm p-1
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
                                </div>
                                <p className="text-base text-gray-700 mt-1">
                                    {dayjs(order?.created_at).format(
                                        "MMMM D, YYYY [-] h:mm A"
                                    )}
                                </p>
                                <div className="flex justify-end">
                                    <p className="text-gray-950 font-medium mt-2 mx-3">
                                        {(order.items ?? [])
                                            .reduce(
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
                                            )
                                            .toFixed(2)}
                                        $
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
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
