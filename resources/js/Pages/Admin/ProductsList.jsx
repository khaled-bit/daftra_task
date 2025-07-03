import { Button } from "../../Components/ui/button";
import { Plus, LayoutPanelLeft, List, Ellipsis } from "lucide-react";
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
import { motion } from "framer-motion";
import { Switch } from "../../Components/ui/switch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Empty from "../../../images/Empty.png";
import axios from "axios";
import { useSearch } from "@/contexts/SearchContext";

export default function ProductsList() {
    const [loading, setLoading] = useState(false);
    // state to store products
    let [products, setProducts] = useState([]);
    const { query } = useSearch();

    // fetch data that send from backend
    let getProducts = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/products");
            let data = res.data;
            setProducts(data.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function in useEffect to run when user enter the page
    useEffect(() => {
        getProducts();
    }, []);

    // state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    // rows to show in a page
    const rowsPerPage = 10;

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(query.toLowerCase())
    );

    const indexOfLastProduct = currentPage * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Delete function
    let deleteProduct = async (id) => {
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            let res = await axios.delete("/api/product/" + id, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (e) {
            console.log(e);
        }
    };

    const ProductRowSkeleton = () => (
        <ul className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2 animate-pulse">
            <li className="basis-[5%]">
                <div className="h-3 w-3 bg-gray-300 rounded" />
            </li>
            <li className="basis-[23%] flex gap-2 items-center">
                <div className="w-12 h-12 bg-gray-300 rounded" />
                <div className="h-3 w-24 bg-gray-300 rounded" />
            </li>
            <li className="basis-[17%] pl-2">
                <div className="h-3 w-20 bg-gray-300 rounded" />
            </li>
            <li className="basis-[9%]">
                <div className="h-3 w-6 bg-gray-300 rounded" />
            </li>
            <li className="basis-[8%]">
                <div className="h-3 w-6 bg-gray-300 rounded" />
            </li>
            <li className="basis-[11%]">
                <div className="h-4 w-20 bg-gray-300 rounded-full" />
            </li>
            <li className="basis-[10%]">
                <div className="h-3 w-10 bg-gray-300 rounded" />
            </li>
            <li className="basis-[12%]">
                <div className="h-5 w-10 bg-gray-300 rounded-full" />
            </li>
            <li className="basis-[5%]">
                <div className="h-4 w-5 bg-gray-300 rounded" />
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
            <div className="flex justify-between md:items-center">
                <h1 className="md:text-lg font-medium">
                    {products.length} Products Found
                </h1>
                <div className="flex flex-col md:flex-row items-end gap-3">
                    <div className="flex gap-2 order-2 md:order-1">
                        <Link
                            to="/admin/products"
                            className="px-1 py-1 border border-accentRed text-accentRed rounded-sm hover:bg-gray-200 duration-300"
                        >
                            <List size={20} />
                        </Link>
                        <Link
                            to="/admin/products/grid"
                            className="px-1 py-1 border border-accentRed text-accentRed rounded-sm hover:bg-gray-200 duration-300"
                        >
                            <LayoutPanelLeft size={20} />
                        </Link>
                    </div>

                    <Link
                        to="/admin/products/create"
                        className="order-1 md:order-2"
                    >
                        <Button
                            variant="default"
                            className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300"
                        >
                            <Plus size={16} /> Add product
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8 overflow-x-auto">
                <div className="min-w-[920px] lg:min-w-[880px]">
                    <ul className="flex items-center px-3 py-4 bg-accentRed text-white rounded-md shadow-md mb-4">
                        <li className="basis-[5%]">ID</li>
                        <li className="basis-[23%]">Name</li>
                        <li className="basis-[17%] pl-2">Price</li>
                        <li className="basis-[9%]">Rating</li>
                        <li className="basis-[8%]">Stock</li>
                        <li className="basis-[11%]">Status</li>
                        <li className="basis-[10%]">Promotion</li>
                        <li className="basis-[12%]">Visibility</li>
                        <li className="basis-[5%]"></li>
                    </ul>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <ProductRowSkeleton key={i} />
                        ))
                    ) : products.length === 0 ? (
                        <div className="absolute inset-0 z-10  bg-lightBackground flex flex-col items-center justify-center text-center font-medium text-accentRed h-full">
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
                            <Link
                                to="/admin/products/create"
                                className="order-1 md:order-2 mt-1"
                            >
                                <Button
                                    variant="default"
                                    className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300"
                                >
                                    Add product
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        currentProducts.map((product) => (
                            <ul
                                key={product.id}
                                className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2"
                            >
                                <li className="basis-[5%]">{product.id}</li>
                                <li className="basis-[23%] flex gap-1 items-center">
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.title}
                                        className="w-12 h-auto object-cover"
                                    />
                                    <h1 className="font-medium">
                                        {product.name}
                                    </h1>
                                </li>
                                <li className="basis-[17%] pl-2">
                                    {product.promotion &&
                                    new Date() >= new Date(product.startDate) &&
                                    new Date() <= new Date(product.endDate) ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-red-600 font-semibold">
                                                {(
                                                    product.price -
                                                    (product.price *
                                                        product.promotion) /
                                                        100
                                                ).toFixed(2)}{" "}
                                                $
                                            </span>
                                            <span className="line-through text-sm text-gray-500">
                                                {product.price} $
                                            </span>
                                        </div>
                                    ) : (
                                        <span>{product.price} $</span>
                                    )}
                                </li>
                                <li className="basis-[9%]">{product.rating}</li>
                                <li className="basis-[8%]">{product.stock}</li>
                                <li className="basis-[11%]">
                                    {product.stock === 0 ? (
                                        <span className="px-1 py-1 text-xs bg-red-100 text-accentRed rounded-md">
                                            Out of Stock
                                        </span>
                                    ) : (
                                        <span className="px-1 py-1 text-xs bg-green-100 text-green-600 rounded-md">
                                            Instock
                                        </span>
                                    )}
                                </li>
                                <li className="basis-[10%]">
                                    {product.promotion &&
                                    new Date() >= new Date(product.startDate) &&
                                    new Date() <= new Date(product.endDate)
                                        ? `${product.promotion}%`
                                        : "-"}
                                </li>
                                <li className="basis-[12%]">
                                    <Switch
                                        id={`visibility-${product.id}`}
                                        checked={product.visibility === 1}
                                        readOnly
                                    />
                                </li>
                                <li className="basis-[5%]">
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
                                            <DropdownMenuItem className="text-accentYellow">
                                                <Link
                                                    to={`/admin/product/${product.id}/edit`}
                                                >
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button className="text-accentRed bg-white w-full text-left px-2 py-2">
                                                            Delete
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure you
                                                                want to delete
                                                                this menu?
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
                                                                    deleteProduct(
                                                                        product.id
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
                        ))
                    )}
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
                                        products.length / rowsPerPage
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
                                        Math.ceil(products.length / rowsPerPage)
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
