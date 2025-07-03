import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import AuthBg from "../../../images/auth-bg.jpg";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Google from "../../../images/Google.png";
import { useAuth } from "@/contexts/AuthContext";
import { useSetting } from "@/contexts/GeneralSettingContext";
import Loading from "../Loading";

export default function Login() {
    const { form: generalForm } = useSetting();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const { setUser } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = ["Email is required."];
        if (!form.password.trim())
            newErrors.password = ["Password is required."];

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle login
    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            setErrors({});

            // Step 1: Get CSRF cookie
            await axios.get("/sanctum/csrf-cookie", {
                withCredentials: true,
            });

            // Step 2: Send login request
            const res = await axios.post(
                "/api/login",
                {
                    email: form.email,
                    password: form.password,
                },
                {
                    withCredentials: true,
                }
            );

            // Step 3: Optional - Fetch user info
            const userRes = await axios.get("/api/user", {
                withCredentials: true,
            });
            setUser(userRes.data);

            console.log("Logged in user:", userRes.data);

            navigate("/"); // redirect on success
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Login failed. Please try again." });
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
                                Login
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
                            <label htmlFor="email" className="mb-1 block">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="mt-1 border-gray-500"
                                onChange={handleInputChange}
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
                                className="mt-1 border-gray-500"
                                onChange={handleInputChange}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <a href="#" className="text-sm text-gray-800">
                            Forgot Password?
                        </a>

                        <Button
                            type="submit"
                            className="rounded-lg bg-accentRed mt-4 text-white w-full hover:bg-hoverRed duration-300"
                        >
                            Login
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
                            Don't have an Account?{" "}
                            <Link
                                to="/register"
                                className="text-accentRed underline"
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
