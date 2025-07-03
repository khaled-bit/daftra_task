import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { useSetting } from "@/contexts/GeneralSettingContext";

export default function Footer() {
    const { form } = useSetting();
    return (
        <>
            <hr className="border-t-gray-400 mt-4" />
            <div className="flex flex-wrap  px-3 py-6">
                <div className="mb-8 md:mb-10 w-full md:w-1/2 lg:w-1/4 px-1">
                    {form.logo && (
                        <img
                            src={`/storage/${form.logo}`} // adjust if needed
                            alt="Logo"
                            className="w-[120px]"
                        />
                    )}
                    <h3 className="text-base text-gray-800 mt-3 rw-[90%]">
                        Feel the taste of your home with our dishes just in your
                        house!
                    </h3>
                </div>
                <div className="mb-8 md:mb-10 w-full md:w-1/2 lg:w-1/4 px-1">
                    <h2 className="text-xl font-medium">Company</h2>
                    <ul className="flex flex-col gap-2 mt-4">
                        <li>
                            <Link
                                to="/"
                                className="relative hover:text-gray-950 group"
                            >
                                Home
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/products"
                                className="relative hover:text-gray-950 group"
                            >
                                Products
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/menu"
                                className="relative hover:text-gray-950 group"
                            >
                                Menu
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/reservation"
                                className="relative hover:text-gray-950 group"
                            >
                                Reservation
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="relative hover:text-gray-950 group"
                            >
                                Contact
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="mb-8 w-full md:w-1/2 lg:w-1/4 px-1">
                    <h2 className="text-xl font-medium">Company</h2>
                    <ul className="flex flex-col  gap-2 mt-4">
                        <li>
                            <Link
                                to="/about"
                                className="relative hover:text-gray-950 group"
                            >
                                About
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/blogs"
                                className="relative hover:text-gray-950 group"
                            >
                                Blogs
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                to="/blog"
                                className="relative hover:text-gray-950 group"
                            >
                                Blog
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                to="/jobs"
                                className="relative hover:text-gray-950 group"
                            >
                                Jobs
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/partnerships"
                                className="relative hover:text-gray-950 group"
                            >
                                Partnerships
                                <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-[#E32737] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="mb-8 w-full md:w-1/2 lg:w-1/4 px-1">
                    <h2 className="text-xl font-medium">Follow us in social</h2>
                    <p className="text-gray-700 mt-3 mb-4">
                        Make sure to know what we are doing and what is our new
                        dishes!
                    </p>
                    <div className="flex gap-2">
                        <a href="">
                            <Instagram />
                        </a>
                        <a href="">
                            <Facebook
                                fill="currentColor"
                                className="text-gray-800"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
