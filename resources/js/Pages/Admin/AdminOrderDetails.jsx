import { Progress } from "../../Components/ui/progress";
import React from "react";
import Profile from "../../../images/Profile.jpg";
import { ChevronRight, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useOrderSetting } from "@/contexts/OrderSettingContext";

export default function AdminOrderDetails() {
    const { form: orderSetting } = useOrderSetting();
    const [progress, setProgress] = React.useState(13);

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500);
        return () => clearTimeout(timer);
    }, []);

    // take id for edit feature
    let { id } = useParams();

    const [orderDetails, setOrderDetails] = useState(null);

    // fetch data to show prev data in input fields
    let getDetails = async (id) => {
        let res = await fetch("/api/order/" + id);
        let data = await res.json();
        setOrderDetails(data.order);
    };

    // call data fetching function depend on id changes
    useEffect(() => {
        getDetails(id);
    }, [id]);

    useEffect(() => {
        console.log("Order Details Status: ", orderDetails?.status); // Debugging
    }, [orderDetails]);

    const subtotal = orderDetails?.items?.reduce((acc, item) => {
        return acc + item.quantity * parseFloat(item.price);
    }, 0);

    const STATUS_ORDER = [
        "confirmed",
        "processing",
        "out for delivery",
        "delivered",
    ];

    const PROGRESS_MAP = {
        confirmed: 100,
        processing: [60, 100],
        "out for delivery": [70, 100],
        delivered: 100,
    };
    // Get progress value for a given step
    const getProgressValue = (step) => {
        const current = STATUS_ORDER.indexOf(orderDetails?.status);
        const target = STATUS_ORDER.indexOf(step);

        if (step === "processing" || step === "out for delivery") {
            if (current > target) return PROGRESS_MAP[step][1];
            if (current === target) return PROGRESS_MAP[step][0];
            return 0;
        }

        return current >= target ? 100 : 0;
    };

    const handleStatusChange = () => {
        const currentIndex = STATUS_ORDER.indexOf(orderDetails?.status);
        const nextStatus = STATUS_ORDER[currentIndex + 1];

        if (!nextStatus) return;

        axios
            .put(`/api/order/${orderDetails.id}/status`, { status: nextStatus })
            .then(() => {
                setOrderDetails((prev) => ({ ...prev, status: nextStatus }));
            });
    };

    const getNextStatusLabel = () => {
        const labels = {
            confirmed: "Start Processing",
            processing: "Out for Delivery",
            "out for delivery": "Mark as Delivered",
        };
        return labels[orderDetails?.status] || "";
    };

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="md:flex gap-3 mx-2 md:mx-4 my-8"
        >
            <div className="md:w-[60%] lg:w-[70%]">
                <div className="flex items-center gap-2">
                    <nav className="flex items-center space-x-1 text-xl text-muted-foreground ">
                        <Link to="/admin/orders" className="hover:text-primary">
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
                    <div>
                        <span
                            className={`rounded-lg text-sm px-2 py-1 border 
                    ${
                        orderDetails?.status === "confirmed"
                            ? "text-accentGreen border-accentGreen"
                            : ""
                    }
                    ${
                        orderDetails?.status === "processing"
                            ? "text-accentYellow border-accentYellow"
                            : ""
                    }
                    ${
                        orderDetails?.status === "out for delivery"
                            ? "text-blue-300 border-blue-300"
                            : ""
                    }
                    ${
                        orderDetails?.status === "delivered"
                            ? "text-gray-500 border-gray-500"
                            : ""
                    }
                `}
                        >
                            {orderDetails?.status}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                    {dayjs(orderDetails?.created_at).format(
                        "MMMM D, YYYY [at] h:mm A"
                    )}
                </p>
                <div className="my-5 px-3 py-4 bg-white shadow-lg rounded-md">
                    <h1 className="font-medium text-lg">Order Progress</h1>
                    <div className="grid grid-cols-2 gap-3 mt-7">
                        <div className="mb-7">
                            <Progress
                                value={getProgressValue("confirmed")}
                                className="w-[80%] [&>div]:bg-accentGreen"
                            />
                            <p className="text-sm text-gray-700 mt-1">
                                Order Confirmed
                            </p>
                        </div>
                        <div className="mb-7">
                            <Progress
                                value={getProgressValue("processing")}
                                className="w-[80%] [&>div]:bg-accentYellow"
                            />
                            <p className="text-sm text-gray-700 mt-1">
                                Processing
                            </p>
                        </div>
                        <div>
                            <Progress
                                value={getProgressValue("out for delivery")}
                                className="w-[80%] [&>div]:bg-blue-300"
                            />
                            <p className="text-sm text-gray-700 mt-1">
                                Out for Delivery
                            </p>
                        </div>
                        <div>
                            <Progress
                                value={getProgressValue("delivered")}
                                className="w-[80%] [&>div]:bg-gray-500"
                            />
                            <p className="text-sm text-gray-700 mt-1">
                                Delivered
                            </p>
                        </div>
                    </div>
                    <hr className="border-t-gray-400 mt-6 mb-2" />
                    <div className="flex justify-between items-center">
                        {/* <span className="text-xs md:text-sm text-gray-800 flex gap-1 md:gap-2">
                            Estimated Time:{" "}
                            <p className="text-black">April 26, 2025</p>
                        </span> */}
                        {orderDetails?.status !== "delivered" && (
                            <button
                                onClick={handleStatusChange}
                                className="px-3 py-2 bg-accentRed text-white hover:bg-hoverRed duration-300 rounded-md"
                            >
                                {getNextStatusLabel()}
                            </button>
                        )}
                    </div>
                </div>

                <div className="my-5 px-3 py-4 bg-white shadow-lg rounded-md">
                    <h1 className="font-medium text-lg">Order</h1>
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
                                key={index}
                                className="flex items-center justify-between mt-2 py-3 px-3 shadow-md"
                            >
                                <li className="basis-[53%] md:basis-[45%] ml-1 text-sm flex gap-1 items-center">
                                    <img
                                        src={`/storage/${
                                            item.menu?.image ||
                                            item.product?.image
                                        }`}
                                        alt={item.title}
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
                                    {item.price}
                                </li>
                                <li className="basis-[32%] md:basis-[25%] ml-1 text-sm">
                                    {(item.quantity * item.price).toFixed(2)} $
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
                {orderDetails?.date ||
                orderDetails?.time ||
                orderDetails?.note ? (
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
                ) : null}
            </div>
            <div className="md:w-[40%] lg:w-[30%]">
                <div className="px-3 py-4 bg-white shadow-lg rounded-md">
                    <h1 className="font-medium text-base flex gap-1 items-center">
                        Order Summary <ReceiptText size={20} />
                    </h1>
                    <hr className="border-t-gray-400 my-6" />
                    <div>
                        <div className="flex justify-between mb-4">
                            <p className=" text-gray-700">Sub Total - </p>
                            <p className=" text-black">
                                {subtotal?.toFixed(2)} ${" "}
                            </p>
                        </div>
                        <div className="flex justify-between mb-4">
                            <p className=" text-gray-700">Discount - </p>
                            <p className=" text-black">0.00 $ </p>
                        </div>
                        <div className="flex justify-between mb-4">
                            <p className=" text-gray-700">Delivery Charge - </p>
                            <p className=" text-black">
                                {orderSetting.deliveryFee.toFixed(2)} ${" "}
                            </p>
                        </div>
                        <div className="flex justify-between mb-4">
                            <p className=" text-gray-700">Tax (10%) - </p>
                            <p className=" text-black">
                                {(subtotal * 0.1).toFixed(2)} ${" "}
                            </p>
                        </div>
                        <hr className="border-t-gray-400 my-6" />
                        <div className="flex justify-between mb-4">
                            <p className=" text-gray-700">Total - </p>
                            <p className=" text-black">
                                {subtotal +
                                    subtotal * 0.1 +
                                    orderSetting.deliveryFee}{" "}
                                ${" "}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="my-5 px-3 py-4 bg-white shadow-lg rounded-md">
                    <h1 className="font-medium text-lg">Customer Details</h1>
                    <div className="flex gap-2 items-center mt-6">
                        <img
                            src={Profile}
                            alt="profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="font-medium">
                                {orderDetails?.name}
                            </h1>
                            <p className="text-xs text-gray-800">
                                {orderDetails?.email}
                            </p>
                        </div>
                    </div>
                    <hr className="border-t-gray-400 my-6" />
                    <div>
                        <div className="my-5">
                            <p className="text-gray-700 mb-2">Phone - </p>
                            <p className="text-sm text-black">
                                {orderDetails?.phone}
                            </p>
                        </div>
                        <div className="my-5">
                            <p className="text-gray-700 mb-2">
                                Delivery Address -{" "}
                            </p>
                            <p className="text-sm text-black">
                                {orderDetails?.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
