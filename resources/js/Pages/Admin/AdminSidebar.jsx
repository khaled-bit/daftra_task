import {
    ChevronsLeft,
    LayoutDashboard,
    ScrollText,
    Tag,
    PackageCheck,
    Users,
    Truck,
    HandPlatter,
    AppWindowMac,
    MessageSquare,
    Send,
    NotepadText,
    Handshake,
    Search,
    Menu,
    Settings,
} from "lucide-react";
import Profile from "../../../images/Profile.jpg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../Components/ui/input";
import { motion } from "framer-motion";
import { useSetting } from "@/contexts/GeneralSettingContext";
import { useSearch } from "@/contexts/SearchContext";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSidebar() {
    const { form } = useSetting();
    const { setQuery } = useSearch();
    const { user, setUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const logout = async () => {
        try {
            await axios.post("/api/logout", null, {
                withCredentials: true,
            });
            setUser(null);
            // navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            className="flex gap-3"
        >
            <div
                className={`w-[80%] md:w-[50%] xl:w-[24%] bg-white shadow-2xl flex flex-col pt-10 h-screen fixed top-0 transition-all duration-300 z-50 ${
                    isSidebarOpen ? "left-0" : "-left-[100%]"
                } xl:left-0 z-50`}
            >
                <div className="flex justify-between items-center px-6 pb-6">
                    {form.logo && (
                        <img
                            src={`/storage/${form.logo}`} // adjust if needed
                            alt="Logo"
                            className="w-28 h-auto"
                        />
                    )}
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <ChevronsLeft size={24} />
                    </button>
                </div>
                <ul className="py-6 hover:overflow-y-auto custom-scrollbar overflow-hidden duration-300">
                    <Link to="/admin">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <LayoutDashboard size={20} /> Dashboard
                        </li>
                    </Link>
                    <Link to="/admin/menu">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <ScrollText size={20} /> Menu
                        </li>
                    </Link>
                    <Link to="/admin/category">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <Tag size={20} /> Categories
                        </li>
                    </Link>
                    <Link to="/admin/products">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <PackageCheck size={20} /> Products
                        </li>
                    </Link>
                    <Link to="/admin/orders">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <Truck size={20} /> Orders
                        </li>
                    </Link>
                    <Link to="/admin/reservation">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <HandPlatter size={20} /> Reservations
                        </li>
                    </Link>
                    <Link to="/admin/users">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <Users size={20} /> Users
                        </li>
                    </Link>
                    <Link to="/admin/blogs">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <AppWindowMac size={20} /> Blogs
                        </li>
                    </Link>
                    <Link to="/admin/reviews">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <MessageSquare size={20} /> Reviews
                        </li>
                    </Link>
                    <Link to="/admin/contact">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <Send size={20} /> Contact
                        </li>
                    </Link>
                    <Link to="/admin/jobs">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <NotepadText size={20} /> Job Posts
                        </li>
                    </Link>
                    <Link to="/admin/partnership">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <Handshake size={20} /> Partnership
                        </li>
                    </Link>
                    <Link to="/admin/settings">
                        <li className="flex gap-3 px-7 py-3 hover:text-accentRed hover:bg-white border-l-4 border-l-white hover:border-l-accentRed duration-300">
                            <Settings size={20} /> Setting
                        </li>
                    </Link>
                </ul>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 xl:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <nav className="bg-lightBackground px-4 lg:px-6 xl:w-[76%] fixed top-0 py-5 md:py-7 w-full xl:ml-[24%] flex items-center justify-between shadow-md xl:shadow-none z-40">
                <div className="flex">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="xl:hidden mr-2 text-gray-700 focus:outline-none"
                    >
                        <Menu size={20} />
                    </button>
                    <p className="text-accentRed font-medium text-lg">
                        WELCOME!
                    </p>
                </div>
                <div className="flex gap-3 md:gap-4 items-center">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <div className="w-12 h-12 rounded-full overflow-hidden cursor-pointer flex-shrink-0">
                                <img
                                    src={
                                        user?.image
                                            ? `/storage/${user.image}`
                                            : Profile
                                    }
                                    alt="Profile"
                                    className="w-12 h-12 object-cover rounded-full"
                                />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-40"
                            avoidCollisions={false}
                        >
                            <Link to="/admin/profile">
                                <DropdownMenuItem className="cursor-pointer">
                                    Profile
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                                onClick={logout}
                                className="cursor-pointer"
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/3 text-gray-500"
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
            </nav>
        </motion.div>
    );
}
