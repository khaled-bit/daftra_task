import Profile from "../../../images/Profile.jpg";
import { Mail, Phone, BadgeCheck } from "lucide-react";
import { Input } from "../../Components/ui/input";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
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
import { Label } from "@/Components/ui/label";
import Loading from "@/Components/Loading";

export default function AdminProfile() {
    const { user, setUser } = useAuth();
    const [image, setImage] = useState(null);
    // prepare state to store form data
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    // store errors state
    const [errors, setErrors] = useState({});

    const [isPasswordSuccessDialogOpen, setIsPasswordSuccessDialogOpen] =
        useState(false);

    // state for loading
    const [loading, setLoading] = useState(false);

    // prepare to move another route/page after sending data
    const navigate = useNavigate();

    // Handle HTML inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle image input
    const uploadImg = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
        }
    };

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

    // form submit function
    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // url and method to use in sending data using axios
        let url = "/api/user/" + user.id;
        let method = "post";

        // create new object to store form data to send
        let formData = new FormData();

        console.log("Form Data before submitting:", form);

        // store state data in object
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("address", form.address);

        console.log("Form data after appending:", formData);

        if (image) {
            formData.append("image", image);
        }

        formData.append("_method", "PUT");

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            // send data
            const res = await axios[method](url, formData, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            // success condition
            if (res.data.message === "User updated successfully.") {
                const updatedUser = res.data.user;

                setUser(updatedUser);

                setImage(null);
            }
        } catch (error) {
            console.error("Error updating user:", error);

            // failed condition
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordErrors, setPasswordErrors] = useState({});

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordErrors({
                confirmPassword: ["Password and Confirm Password don't match."],
            });
            return;
        }

        try {
            const res = await axios.put(`/api/user/${user.id}/changePassword`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                newPassword_confirmation: passwordForm.confirmPassword,
            });

            if (res.data.message === "Password updated successfully.") {
                setIsPasswordSuccessDialogOpen(true);
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setPasswordErrors({});
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const data = error.response.data;

                if (data.errors) {
                    setPasswordErrors(data.errors); // Object with field errors
                } else if (data.message) {
                    // Wrap single message into an object keyed by a general field or 'form'
                    setPasswordErrors({ general: [data.message] });
                } else {
                    setPasswordErrors({});
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ visibility: "hidden", opacity: 0 }}
            whileInView={{ visibility: "visible", opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="md:h-[89vh] h-full lg:h-full lg:relative flex flex-col md:flex-row gap-3 mx-2 md:mx-4 mt-2 mb-6 md:mt-6"
        >
            {loading ? (
                <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
                    <div className=" h-[83vh] flex items-center justify-center pointer-events-auto">
                        <Loading />
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full md:w-3/5 order-0 md:-order-1">
                        <div className="mt-3 px-4 py-3 bg-white shadow-md rounded-lg">
                            <h1 className="text-lg font-medium">
                                Edit Profile
                            </h1>
                            <form action="" className="mt-6">
                                <div className="flex gap-6 items-center mb-7">
                                    <img
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : user?.image
                                                ? `/storage/${user.image}`
                                                : Profile
                                        }
                                        alt="User Profile"
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-2 border-accentRed"
                                    />
                                    <div>
                                        <h1 className="font-medium">
                                            {user?.name}
                                        </h1>
                                        <p className="text-gray-800 text-sm">
                                            {user?.address}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                id="image-upload"
                                                name="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={uploadImg}
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="image-upload"
                                                className="flex justify-center items-center rounded-lg border border-accentGreen text-accentGreen hover:border-hoverGreen hover:text-hoverGreen hover:bg-gray-100 font-medium duration-300 px-3 py-1 cursor-pointer"
                                            >
                                                Upload New
                                            </Label>
                                            <button className="px-2 py-2 text-sm bg-accentRed hover:bg-accentRed duration-300 text-white rounded-md">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        className="mt-1 border-gray-500"
                                    />
                                </div>
                                <div className="md:flex gap-3">
                                    <div className="md:w-1/2 mb-4">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="text"
                                            placeholder="Enter your email"
                                            value={form.email}
                                            onChange={handleInputChange}
                                            className="mt-1 border-gray-500"
                                        />
                                    </div>
                                    <div className="md:w-1/2 mb-4">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="text"
                                            placeholder="Enter your phone"
                                            value={form.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 border-gray-500"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="address">Address</Label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="Enter your Address"
                                        value={form.address}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-crimson focus:border-crimson text-gray-700"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="px-2 py-2 text-sm bg-accentGreen hover:bg-hoverGreen duration-300 text-white rounded-md"
                                        onClick={submit}
                                    >
                                        Submit
                                    </button>
                                    <button className="px-2 py-2 text-sm bg-accentRed hover:bg-accentRed duration-300 text-white rounded-md">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="mt-3 px-4 py-3 bg-white shadow-md rounded-lg">
                            <h1 className="text-lg font-medium">
                                Security Setting
                            </h1>
                            <form action="" className="mt-6">
                                <div className="mb-4">
                                    <Label htmlFor="currentPassword">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1 border-gray-500"
                                    />
                                    {passwordErrors.general && (
                                        <p className="text-red-500 mt-1 text-sm">
                                            {passwordErrors.general[0]}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="newPassword">
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter your new password"
                                        className="mt-1 border-gray-500"
                                    />
                                    {passwordErrors.confirmPassword && (
                                        <p className="text-red-500 mt-1 text-sm">
                                            {passwordErrors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm your password"
                                        className="mt-1 border-gray-500"
                                    />
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="px-2 py-2 text-sm bg-accentGreen hover:bg-hoverGreen duration-300 text-white rounded-md"
                                        onClick={handlePasswordSubmit}
                                    >
                                        Change
                                    </button>
                                </div>
                            </form>
                            <AlertDialog
                                open={isPasswordSuccessDialogOpen}
                                onOpenChange={setIsPasswordSuccessDialogOpen}
                            >
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Password Updated Successfully!
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Your password has been changed. You
                                            can now use your new password to log
                                            in.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction
                                            onClick={() =>
                                                setIsPasswordSuccessDialogOpen(
                                                    false
                                                )
                                            }
                                        >
                                            OK
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <div className="w-full md:w-2/5 lg:max-w-[365px] -order-1 md:order-0 lg:fixed lg:right-4">
                        <div className="mt-3 px-4 py-3 bg-white shadow-md rounded-lg">
                            <h1 className="text-lg font-medium">
                                Your Account
                            </h1>
                            <img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : user?.image
                                        ? `/storage/${user.image}`
                                        : Profile
                                }
                                alt="profile"
                                className="mt-5 w-24 h-24 object-cover mx-auto rounded-full border border-accentRed"
                            />
                            <h1 className="text-center font-medium mt-1">
                                {user?.name}
                            </h1>
                            <p className="text-center text-gray-800 text-sm">
                                Admin
                            </p>
                            <hr className="border-t-gray-400 my-3" />
                            <h1 className="text-sm font-medium">
                                Personal Information
                            </h1>
                            <div className="my-3">
                                <p className="text-sm flex gap-1 items-center mb-1">
                                    <Mail
                                        size={16}
                                        className="text-accentRed"
                                    />
                                    Email
                                </p>
                                <p className="text-sm text-gray-800">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="my-3">
                                <p className="text-sm flex gap-1 items-center mb-1">
                                    <Phone
                                        size={16}
                                        className="text-accentRed"
                                    />
                                    Phone
                                </p>
                                <p className="text-sm text-gray-800">
                                    {user?.phone}
                                </p>
                            </div>

                            <div className="my-3">
                                <p className="text-sm flex gap-1 items-center mb-1">
                                    <BadgeCheck
                                        size={16}
                                        className="text-accentYellow"
                                    />
                                    Role
                                </p>
                                <p className="text-sm text-gray-800">Admin</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}
