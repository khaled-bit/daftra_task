import DatePicker from "../../Components/DatePicker";
import TimePicker from "../../Components/TimePicker";
import EmptyCart from "../../../images/empty-cart.png";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderSetting } from "@/contexts/OrderSettingContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../Components/ui/alert-dialog.jsx";
import Loading from "@/Components/Loading";

export default function Checkout() {
    const { form: orderSetting } = useOrderSetting();
    const { cartItems, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();

    // prepare state to store form data
    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: user?.address || "",
        date: "",
        time: "",
        note: "",
    });
    // store errors state
    const [errors, setErrors] = useState({});
    // use state to check dialog open or not and control
    const [showDialog, setShowDialog] = useState(false);
    // prepare to move another route/page after sending data
    const navigate = useNavigate();
    const [stockErrorMessage, setStockErrorMessage] = useState("");
    // state for loading
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    // Handle HTML inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle other custom components' inputs
    const handleCustomChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submit = async (e) => {
        e?.preventDefault();
        setSubmitLoading(true);

        const formData = new FormData();

        console.log("Form data before appending:", form);

        // Basic order info
        formData.append("name", form.name);
        formData.append("phone", form.phone);
        formData.append("email", form.email);
        formData.append("address", form.address);
        formData.append("note", form.note);
        if (form.date) {
            formData.append("date", format(new Date(form.date), "yyyy-MM-dd"));
        } else {
            formData.append("date", "");
        }

        formData.append("time", form.time || "");

        const total = cartItems.reduce(
            (totalValue, item) =>
                totalValue +
                (item.finalPrice || item.originalPrice) * item.quantity,
            0
        );
        formData.append("total", total.toFixed(2));

        // Cart items
        cartItems.forEach((item, index) => {
            formData.append(`items[${index}][id]`, item.id);
            formData.append(`items[${index}][type]`, item.type); // <--- Add this

            if (item.type === "menu") {
                formData.append(`items[${index}][menu_id]`, item.id);
            } else {
                formData.append(`items[${index}][product_id]`, item.id);
            }

            formData.append(`items[${index}][title]`, item.title || item.name);
            formData.append(
                `items[${index}][price]`,
                (item.finalPrice || item.originalPrice).toFixed(2)
            );
            formData.append(`items[${index}][quantity]`, item.quantity);
        });

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const res = await axios.post("/api/orders/create", formData, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.message === "Order created successfully.") {
                console.log("Order submitted!");
                setForm({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    date: "",
                    time: "",
                    note: "",
                });
                setErrors({});
                clearCart();
                navigate("/review");
            }
        } catch (error) {
            console.error("Failed to submit order:", error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (
                error.response?.status === 400 &&
                error.response.data?.message?.includes("Not enough stock")
            ) {
                setStockErrorMessage(error.response.data.message);
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const subtotal = cartItems?.reduce((acc, item) => {
        const price = item.finalPrice ?? item.originalPrice; // fallback if no finalPrice
        return acc + item.quantity * parseFloat(price);
    }, 0);

    const tax = subtotal * 0.1;
    const deliveryFee = parseFloat(orderSetting?.deliveryFee ?? 0);

    const total = subtotal + tax + deliveryFee;

    const handleConfirmOrder = () => {
        if (!user) {
            setShowLoginAlert(true);
            return;
        }
        const minAmount = parseFloat(orderSetting?.minOrder ?? 0);
        if (total < minAmount) {
            setShowDialog(true);
        } else {
            submit();
        }
    };

    if (submitLoading) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-6 py-7 bg-lightBackground lg:flex gap-5">
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.2 }}
                className="lg:w-1/2 flex-1"
            >
                <div>
                    <h1 className="text-lg font-medium">
                        Delivery information
                    </h1>
                    <form
                        action=""
                        className="bg-white rounded-lg shadow-lg px-3 md:px-4 py-5 mt-3"
                    >
                        <div className="mb-3 flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter your name"
                                className="mt-1 border-gray-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>
                        <div className="md:flex gap-2">
                            <div className="mb-3 md:w-1/2 flex flex-col gap-2">
                                <label htmlFor="phone">Phone</label>
                                <Input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.phone[0]}
                                    </p>
                                )}
                            </div>
                            <div className="mb-3 md:w-1/2 flex flex-col gap-2">
                                <label htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.email && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.email[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mb-2 flex flex-col gap-2">
                            <label htmlFor="address">Address</label>
                            <Textarea
                                id="address"
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                                className="mt-1 border-gray-500"
                            ></Textarea>
                            {errors.address && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.address[0]}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
                <div className="mt-9">
                    <h1 className="text-lg font-medium">Schedule Delivery</h1>
                    <form
                        action=""
                        className="bg-white rounded-lg shadow-lg px-3 md:px-4 py-5 mt-3"
                    >
                        <div className="mb-3 flex flex-col gap-2">
                            <label htmlFor="date">Date</label>
                            <DatePicker
                                name="date"
                                selectedDate={form.date}
                                onDateChange={(date) =>
                                    handleCustomChange("date", date)
                                }
                            />
                            {errors.date && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.date[0]}
                                </p>
                            )}
                        </div>
                        <div className="mb-3 flex flex-col gap-2">
                            <label htmlFor="time">Time</label>
                            <TimePicker
                                minTime={540}
                                maxTime={1320}
                                name="time"
                                selectedTime={form.time}
                                onTimeChange={(time) =>
                                    handleCustomChange("time", time)
                                }
                            />
                            {errors.time && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.time[0]}
                                </p>
                            )}
                        </div>
                        <div className="mb-3 flex flex-col gap-2">
                            <label htmlFor="note">Note</label>
                            <Textarea
                                id="note"
                                type="text"
                                name="note"
                                value={form.note}
                                onChange={handleInputChange}
                                placeholder="Write something..."
                                className="mt-1 border-gray-500"
                            ></Textarea>
                            {errors.note && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.note[0]}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
                {/* <div className="mt-9">
          <h1 className="text-lg font-medium">Payment Method</h1>
          <div className="bg-white rounded-lg shadow-lg px-4 py-5 mt-3">
            <div className="flex items-center gap-2">
              <input type="radio" />
              <span className="text-sm text-gray-800">Cash on Delivery</span>
            </div>
          </div>
        </div> */}
            </motion.div>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.2 }}
                className="lg:w-1/2 mt-7 lg:mt-0 bg-white rounded-lg shadow-lg px-4 py-5"
            >
                <div className="h-full flex flex-col justify-between">
                    <div>
                        <h1 className="text-lg font-medium">Order Summary</h1>
                        <div className="px-0 md:px-4 py-5 mt-3">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <img
                                        src={EmptyCart}
                                        alt="Empty Cart"
                                        className="mx-auto mb-4 w-32 h-32"
                                    />
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                        Your cart is empty
                                    </h2>
                                    <p className="text-gray-500 mb-4 text-sm">
                                        Looks like you haven't added anything
                                        yet.
                                    </p>
                                    <Link to="/menu">
                                        <Button
                                            variant="default"
                                            className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300"
                                        >
                                            Browse Menu
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center mb-6"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={
                                                    `/storage/${item.image}` ||
                                                    "/default-food.jpg"
                                                }
                                                alt={item.title}
                                                className="w-16 h-auto rounded-full"
                                            />
                                            <div>
                                                <h1 className="font-medium">
                                                    {item.title || item.name}
                                                </h1>
                                                {item.promotion ? (
                                                    <div>
                                                        <span className="text-red-600 font-semibold">
                                                            $
                                                            {item.finalPrice.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                        <span className="line-through text-sm text-gray-500 ml-2">
                                                            $
                                                            {item.originalPrice.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>
                                                        $
                                                        {item.originalPrice.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1 p-1 border border-gray-300 rounded-sm shadow-sm">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.type,
                                                            -1
                                                        )
                                                    }
                                                    className="px-3 py-1"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-base font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.type,
                                                            1
                                                        )
                                                    }
                                                    className="px-3 py-1"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Subtotal & Confirm */}
                    <div>
                        <hr className="border-t-gray-400" />
                        <div className="flex justify-between my-3">
                            <h1 className="text-sm">Subtotal - </h1>
                            <p className="text-gray-800 font-medium">
                                ${subtotal.toFixed(2)}
                            </p>
                        </div>
                        <hr className="border-t-gray-400" />
                        <div className="flex justify-between my-3">
                            <h1 className="text-sm">Shipping - </h1>
                            <p className="text-gray-800 font-medium">
                                $
                                {parseFloat(orderSetting.deliveryFee)?.toFixed(
                                    2
                                )}
                            </p>
                        </div>
                        <div className="flex justify-between my-2">
                            <h1 className="text-sm">Tax (10%) - </h1>
                            <p className="text-gray-800 font-medium">
                                {" "}
                                ${(subtotal * 0.1).toFixed(2)}
                            </p>
                        </div>
                        <hr className="border-gray-400 my-5" />
                        <div className="flex justify-between my-2">
                            <h1 className="text-sm">Total - </h1>
                            <p className="text-gray-800 font-medium">
                                ${total.toFixed(2)}
                            </p>
                        </div>
                        <Button
                            onClick={handleConfirmOrder}
                            type="button"
                            variant="default"
                            className="rounded-lg w-full mt-5 bg-accentRed text-white hover:bg-hoverRed duration-300"
                        >
                            Confirm Order
                        </Button>
                    </div>
                    <AlertDialog
                        open={!!stockErrorMessage}
                        onOpenChange={() => setStockErrorMessage("")}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Stock Error</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {stockErrorMessage}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-3">
                                <AlertDialogCancel
                                    onClick={() => setStockErrorMessage("")}
                                >
                                    Close
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>We are sorry!</AlertDialogTitle>
                            <AlertDialogDescription>
                                We do not accept orders under $
                                {orderSetting?.minOrder ?? 0}. Please add more
                                items to your cart.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-3">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                                <Link to="/menu">Add More</Link>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </motion.div>
            <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Login for a Better Experience
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Logging in helps you track orders and reuse saved
                            info — or you can order as a guest.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-3 space-x-2">
                        <Button
                            className="rounded-lg bg-white text-black hover:bg-gray-200"
                            onClick={() => {
                                setShowLoginAlert(false);
                                setTimeout(() => {
                                    submit();
                                }, 100);
                            }}
                        >
                            Order Anyway
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/login")}
                            className="bg-accentRed text-white hover:bg-hoverRed hover:text-white rounded-lg"
                        >
                            Login
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
