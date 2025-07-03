import Profile from "../../../images/Profile.jpg";
import { Button } from "../../Components/ui/button";
import { motion } from "framer-motion";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import { Label } from "../../Components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "@/Components/Loading";

export default function EditProfile() {
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

    // state for loadings
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);

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
                navigate("/user");
            }
        } catch (error) {
            console.error("Error updating user:", error);

            // failed condition
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsLoading(false);
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
        setIsLoading(true);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordErrors({
                confirmPassword: ["Password and Confirm Password don't match."],
            });
            setIsLoading(false);
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
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full flex flex-col gap-6 "
        >
            {isLoading ? (
                <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
                    <div className="lg:pt-24 lg:w-[68%] xl:w-[74%] lg:ml-[32%] xl:ml-[26%] pt-20 h-[83vh] flex items-center justify-center pointer-events-auto">
                        <Loading />
                    </div>
                </div>
            ) : (
                <div className="mx-auto my-12 w-[93%] md:w-[90%] lg:w-[80%]">
                    <form action="">
                        <div className="flex gap-2">
                            <img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : user?.image
                                        ? `/storage/${user.image}`
                                        : Profile
                                }
                                alt="User Profile"
                                className="w-24 h-24 md:h-32 md:w-32 object-cover rounded-full border-2 border-accentRed"
                            />
                            <div>
                                <h2 className="text-lg font-medium">
                                    {user?.name}
                                </h2>
                                <p className="text-gray-700 text-xs">
                                    NYC, USA
                                </p>
                                <div className="flex gap-2 md:justify-start mt-3">
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
                                        className="flex rounded-lg border border-accentGreen text-accentGreen hover:border-hoverGreen hover:text-hoverGreen hover:bg-gray-100 font-medium duration-300 px-3 py-1 cursor-pointer items-center justify-center"
                                    >
                                        Upload
                                    </Label>

                                    <Button
                                        variant="default"
                                        className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300"
                                    >
                                        Delete Photo
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <div className="my-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="mt-1 border-gray-500"
                                />
                            </div>
                            <div className="md:flex gap-2">
                                <div className="md:w-1/2 my-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="mt-1 border-gray-500"
                                    />
                                </div>
                                <div className="md:w-1/2 my-3">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={form.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone"
                                        className="mt-1 border-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="my-3">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={form.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address"
                                    className="mt-1 border-gray-500"
                                ></Textarea>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={submit}
                                    className="bg-accentYellow text-black hover:bg-hoverYellow duration-300"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>

                    <form action="" className="mt-12">
                        <h2 className="font-medium mb-6 text-lg">
                            Change Password
                        </h2>
                        <div className="my-3">
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
                            {/* <a href="" className="text-sm underline mt-1 mb-3">
              forgot password?
            </a> */}
                        </div>
                        <div className="my-3">
                            <Label htmlFor="newPassword">New Password</Label>
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
                        <div className="my-3">
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
                        <div className="flex justify-end">
                            <Button
                                className="bg-accentYellow text-black hover:bg-hoverYellow duration-300"
                                onClick={handlePasswordSubmit}
                            >
                                Change
                            </Button>
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
                                    Your password has been changed. You can now
                                    use your new password to log in.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={() =>
                                        setIsPasswordSuccessDialogOpen(false)
                                    }
                                >
                                    OK
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <a href="" className="text-accentRed underline">
                        Delete Account?
                    </a>
                </div>
            )}
        </motion.div>
    );
}
