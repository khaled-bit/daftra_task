import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../Components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../Components/ui/pagination";
import { ChevronDown, Ellipsis } from "lucide-react";
import Profile from "../../../images/Profile.jpg";
import { motion } from "framer-motion";
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
import Empty from "../../../images/Empty.png";
import axios from "axios";
import { useEffect } from "react";
import { useSearch } from "@/contexts/SearchContext";

export default function UsersList() {
    const [loading, setLoading] = useState(false);
    // state to store users
    let [users, setUsers] = useState([]);
    // state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    // rows to show in a page
    const rowsPerPage = 10;
    const { query } = useSearch();

    // fetch data that send from backend
    let getUsers = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/users");
            let data = res.data;
            setUsers(data.users);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function in useEffect to run when user enter the page
    useEffect(() => {
        getUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(query.toLowerCase())
    );

    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const banUser = async (id, currentStatus) => {
        try {
            let newStatus = currentStatus ? 0 : 1;

            let res = await axios.post("/api/users/banned/" + id, {
                banned: newStatus,
            });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, banned: newStatus } : user
                )
            );
        } catch (error) {
            console.error("Failed:", error);
        }
    };

    let deleteUser = async (id) => {
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            let res = await axios.delete("/api/user/" + id, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (e) {
            console.log(e);
        }
    };

    const [selectedFilter, setSelectedFilter] = useState("newest");

    const handleFilterChange = (filterValue) => {
        setSelectedFilter(filterValue);

        axios
            .get(`/api/users?sort=${filterValue}`)
            .then((response) => {
                const data = response.data;
                if (data.users) {
                    setUsers(data.users);
                    console.log(data.message);
                }
            })
            .catch((error) => {
                console.error("Axios request failed:", error);
            });
    };

    useEffect(() => {
        handleFilterChange("newest"); // initial load
    }, []);

    const UserItemSkeleton = () => (
        <ul className="flex items-center bg-white px-3 py-5 rounded-md shadow-md mb-2 animate-pulse">
            <li className="basis-[3%]">
                <div className="h-3 w-3 bg-gray-300 rounded" />
            </li>
            <li className="basis-[19%] flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                <div className="h-3 w-20 bg-gray-300 rounded" />
            </li>
            <li className="basis-[26%]">
                <div className="h-3 w-32 bg-gray-300 rounded" />
            </li>
            <li className="basis-[12%]">
                <div className="h-3 w-20 bg-gray-300 rounded" />
            </li>
            <li className="basis-[25%]">
                <div className="h-3 w-40 bg-gray-300 rounded" />
            </li>
            <li className="basis-[11%]">
                <div className="h-5 w-16 bg-gray-300 rounded-full" />
            </li>
            <li className="basis-[4%]">
                <div className="w-4 h-5 bg-gray-300 rounded-full" />
            </li>
        </ul>
    );

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="mx-2 md:mx-4 my-8"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium">
                    {users.length} Users Found
                </h1>
                <div className="hidden md:block">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button className="flex gap-1 items-center px-2 py-1 border border-gray-800 rounded-md">
                                {
                                    {
                                        newest: "Filter By Newest",
                                        oldest: "Filter By Oldest",
                                        "a-z": "Filter By A-Z",
                                        "z-a": "Filter By Z-A",
                                    }[selectedFilter]
                                }
                                <ChevronDown size={16} />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-40"
                            avoidCollisions={false}
                        >
                            <DropdownMenuItem
                                onSelect={() => handleFilterChange("newest")}
                                className="cursor-pointer"
                            >
                                Filter By Newest
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => handleFilterChange("oldest")}
                                className="cursor-pointer"
                            >
                                Filter By Oldest
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => handleFilterChange("a-z")}
                                className="cursor-pointer"
                            >
                                Filter By A-Z
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => handleFilterChange("z-a")}
                                className="cursor-pointer"
                            >
                                Filter By Z-A
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="mt-8 overflow-x-auto">
                <div className="min-w-[920px] lg:min-w-[880px]">
                    <ul className="flex items-center px-3 py-4 bg-accentRed text-white rounded-md shadow-md mb-4">
                        <li className="basis-[3%]">ID</li>
                        <li className="basis-[19%]">Name</li>
                        <li className="basis-[26%]">Email</li>
                        <li className="basis-[12%]">Phone</li>
                        <li className="basis-[25%]">Address</li>
                        <li className="basis-[11%] pl-3">Status</li>
                        <li className="basis-[4%]"></li>
                    </ul>
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                              <UserItemSkeleton key={i} />
                          ))
                        : currentUsers.map((user) => (
                              <ul
                                  key={user.id}
                                  className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2"
                              >
                                  <li className="basis-[3%]">{user.id}</li>
                                  <li className="basis-[19%] flex gap-1 items-center">
                                      <img
                                          src={
                                              user.image
                                                  ? `/storage/${user.image}`
                                                  : Profile
                                          }
                                          alt="Profile"
                                          className="w-8 h-8 object-cover rounded-full"
                                      />
                                      <p className="text-xs md:text-sm">
                                          {user.name}
                                      </p>
                                  </li>
                                  <li className="basis-[26%] text-xs md:text-sm">
                                      {user.email}
                                  </li>
                                  <li className="basis-[12%] text-xs md:text-sm">
                                      {user.phone}
                                  </li>
                                  <li className="basis-[25%] text-xs">
                                      {user.address}
                                  </li>
                                  <li className="basis-[11%]">
                                      <span
                                          className={`ml-3 text-xs md:text-sm rounded-sm px-1 py-1 ${
                                              user.banned
                                                  ? "text-accentRed bg-gray-100"
                                                  : "text-accentGreen bg-green-100"
                                          }`}
                                      >
                                          {user.banned ? "Banned" : "Active"}
                                      </span>
                                  </li>
                                  <li className="basis-[4%]">
                                      <DropdownMenu modal={false}>
                                          <DropdownMenuTrigger asChild>
                                              <button className="p-1 rounded-md hover:bg-gray-100 outline-none">
                                                  <Ellipsis size={20} />
                                              </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                              align="end"
                                              className="w-40"
                                          >
                                              <DropdownMenuItem
                                                  onClick={() =>
                                                      banUser(
                                                          user.id,
                                                          user.banned
                                                      )
                                                  }
                                                  className={
                                                      user.banned
                                                          ? "text-accentGreen"
                                                          : "text-accentYellow"
                                                  }
                                              >
                                                  {user.banned
                                                      ? "Re-activate"
                                                      : "Ban"}
                                              </DropdownMenuItem>

                                              <DropdownMenuItem asChild>
                                                  <AlertDialog>
                                                      <AlertDialogTrigger
                                                          asChild
                                                      >
                                                          <button className="text-accentRed bg-white w-full text-left px-2 py-2">
                                                              Delete
                                                          </button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent>
                                                          <AlertDialogHeader>
                                                              <AlertDialogTitle>
                                                                  Are you sure
                                                                  you want to
                                                                  delete this
                                                                  menu?
                                                              </AlertDialogTitle>
                                                              <AlertDialogDescription>
                                                                  This action
                                                                  cannot be
                                                                  undone.
                                                              </AlertDialogDescription>
                                                          </AlertDialogHeader>
                                                          <AlertDialogFooter>
                                                              <AlertDialogCancel>
                                                                  Cancel
                                                              </AlertDialogCancel>
                                                              <AlertDialogAction
                                                                  onClick={() =>
                                                                      deleteUser(
                                                                          user.id
                                                                      )
                                                                  }
                                                              >
                                                                  Delete
                                                              </AlertDialogAction>
                                                          </AlertDialogFooter>
                                                      </AlertDialogContent>
                                                  </AlertDialog>
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </li>
                              </ul>
                          ))}
                </div>
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
                                        users.length / rowsPerPage
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
                                        Math.ceil(users.length / rowsPerPage)
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
