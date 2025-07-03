import { useState } from "react";
import { Input } from "@/Components/ui/input";
import AuthBg from "../../../images/auth-bg.jpg";
import { Button } from "@/Components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Google from "../../../images/Google.png";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useSetting } from "@/contexts/GeneralSettingContext";
import Loading from "../Loading";

export default function Register() {
    const { form: generalForm } = useSetting();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = ["Name is required."];
        if (!form.email.trim()) newErrors.email = ["Email is required."];
        if (!form.password.trim())
            newErrors.password = ["Password is required."];

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setErrors({});

        try {
            // 1. CSRF token required for Sanctum
            await axios.get("/sanctum/csrf-cookie", {
                withCredentials: true,
            });

            // 2. Register user
            await axios.post(
                "/api/register",
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.passwordConfirmation,
                },
                { withCredentials: true }
            );

            // 3. Optional - fetch authenticated user
            const userRes = await axios.get("/api/user", {
                withCredentials: true,
            });
            setUser(userRes.data);

            console.log("Registered user:", userRes.data);

            navigate("/user"); // success redirect
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Registration failed. Try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="block md:flex md:h-screen overflow-hidden">
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="md:w-2/5 lg:w-1/2"
            >
                <img
                    src={AuthBg}
                    alt=""
                    className="h-48 md:h-full w-full object-cover sticky top-0"
                />
            </motion.div>

            <motion.div
                initial={{ y: -100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="md:w-3/5 lg:w-1/2 px-5 flex items-center lg:pt-20 overflow-y-auto py-6"
            >
                <div className="w-[97%] md:w-[90%] lg:w-[87%] mx-auto">
                    {generalForm.logo && (
                        <img
                            src={`/storage/${generalForm.logo}`} // adjust if needed
                            alt="Logo"
                            className="w-28 h-auto mb-2"
                        />
                    )}
                    <p className="text-sm text-gray-800">
                        Order the food that can make your taste bud feel like
                        you're HOME.
                    </p>

                    <form onSubmit={submit} className="mt-5">
                        <div className="mb-5">
                            <h2 className="text-2xl font-semibold mb-1 relative inline-block">
                                Register
                            </h2>
                            <div className="flex items-center">
                                <div className="w-12 h-[2px] bg-accentRed"></div>
                                <div className="w-1 h-1 bg-accentRed rounded-full ml-2"></div>
                            </div>
                        </div>

                        {errors.general && (
                            <p className="text-red-600 text-sm mb-2">
                                {errors.general}
                            </p>
                        )}

                        <div className="mb-3">
                            <label htmlFor="name" className="mb-1 block">
                                Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={handleInputChange}
                                className="border-gray-500"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="mb-1 block">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="border-gray-500"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="mb-1 block">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleInputChange}
                                className="border-gray-500"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="passwordConfirmation"
                                className="mb-1 block"
                            >
                                Confirm Password
                            </label>
                            <Input
                                id="passwordConfirmation"
                                name="passwordConfirmation"
                                type="password"
                                placeholder="Confirm your password"
                                value={form.passwordConfirmation}
                                onChange={handleInputChange}
                                className="border-gray-500"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="rounded-lg bg-accentRed mt-4 text-white w-full hover:bg-hoverRed duration-300"
                        >
                            Register
                        </Button>
                        <a href="/auth/google">
                            <Button
                                type="button"
                                className="mt-3 bg-white text-black w-full border border-gray-700 hover:bg-gray-50"
                            >
                                <img
                                    src={Google}
                                    alt="Google Logo"
                                    className="w-5 h-5 object-cover"
                                />
                                Continue with Google
                            </Button>
                        </a>

                        <p className="text-sm text-gray-800 text-center mt-1">
                            Already have an Account?{" "}
                            <Link
                                to="/login"
                                className="text-accentRed underline"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
