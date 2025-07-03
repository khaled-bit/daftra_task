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
import { Switch } from "../../Components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../Components/ui/dialog";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
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
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Empty from "../../../images/Empty.png";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearch } from "@/contexts/SearchContext";

export default function Category() {
    const [loading, setLoading] = useState(false);
    // prepare state to store form data
    const [form, setForm] = useState({
        category: "",
    });

    // store errors state
    const [errors, setErrors] = useState({});

    // state to control create category dialog box
    const [open, setOpen] = useState(false);

    // state to store categories to show all of the categories data
    let [categories, setCategories] = useState([]);

    // state for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // state to store detail of the category related to ID
    let [categoryDetail, setCategoryDetails] = useState(null);

    // state to store id to use in edit feature
    const [editId, setEditId] = useState(null);

    // state to control edit category dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const { query } = useSearch();

    const submit = async (e) => {
        e.preventDefault();

        const isEditing = editId !== null;

        // url and method to use in sending data using axios
        let url = isEditing
            ? `/api/category/${editId}`
            : "/api/category/create";
        let method = "post";

        // create new object to store form data to send
        let formData = new FormData();

        // store state data in object
        formData.append("category", form.category);

        if (isEditing) {
            formData.append("_method", "PUT");
        }

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
            if (
                res.data.message === "Category created successfully." ||
                res.data.message === "Category updated successfully."
            ) {
                setForm({ category: "" });
                setErrors({});
                await getCategories();

                if (isEditing) {
                    setEditDialogOpen(false);
                    setEditId(null);
                } else {
                    setOpen(false);
                }
            }
        } catch (error) {
            console.error("Error creating category:", error);

            // failed condition
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    // function to fetch all of the categories data
    let getCategories = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/categories");
            let data = res.data;
            setCategories(data.categories);

            const visibilityMap = {};
            data.categories.forEach((cat) => {
                visibilityMap[cat.id] = !!cat.visibility;
            });

            setVisibility(visibilityMap);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // call data fetching function in useEffect to run when user enter the page
    useEffect(() => {
        getCategories();
    }, []);

    // rows to show in a page
    const rowsPerPage = 10;

    const filteredCategories = categories.filter((category) =>
        category.category?.toLowerCase().includes(query.toLowerCase())
    );

    // calculate the last items, first items and set menus to show
    const indexOfLastCategory = currentPage * rowsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - rowsPerPage;
    const currentCategories = filteredCategories.slice(
        indexOfFirstCategory,
        indexOfLastCategory
    );

    const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // setting format for created_at date
    dayjs.extend(relativeTime);

    // fetch data to show prev data in input fields
    let getDetails = async (id) => {
        let res = await fetch("/api/category/" + id);
        let data = await res.json();
        setCategoryDetails(data.category);
    };

    // call data fetching function depend on id changes
    useEffect(() => {
        if (editId !== null) {
            getDetails(editId);
        }
    }, [editId]);

    // add prev data sent from backend in the form state
    useEffect(() => {
        if (categoryDetail) {
            setForm({
                category: categoryDetail.category,
            });
        }
    }, [categoryDetail]);

    const [visibility, setVisibility] = useState({});

    useEffect(() => {
        const stored = JSON.parse(
            localStorage.getItem("categoryVisibility") || "{}"
        );
        setVisibility(stored);
    }, []);

    const toggleVisibility = (categoryId, checked) => {
        setVisibility((prev) => ({
            ...prev,
            [categoryId]: checked,
        }));

        axios
            .put(`/api/category/${categoryId}/visibility`, {
                visibility: checked,
            })
            .catch((error) => {
                console.error("Error updating visibility:", error);
            });
    };

    // delete function
    let deleteCategory = async (id) => {
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            let res = await axios.delete("/api/category/" + id, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            setCategories((prev) =>
                prev.filter((category) => category.id !== id)
            );
        } catch (e) {
            console.log(e);
        }
    };

    const CategoryRowSkeleton = () => (
        <ul className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2 animate-pulse">
            <li className="basis-[5%]">
                <div className="h-3 w-3 bg-gray-300 rounded" />
            </li>
            <li className="basis-[35%]">
                <div className="h-3 w-32 bg-gray-300 rounded" />
            </li>
            <li className="basis-[15%]">
                <div className="h-4 w-10 bg-gray-300 rounded-full" />
            </li>
            <li className="basis-[18%] pl-2">
                <div className="h-3 w-8 bg-gray-300 rounded" />
            </li>
            <li className="basis-[22%]">
                <div className="h-3 w-24 bg-gray-300 rounded" />
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
                    {categories.length} Categories Found
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300 order-1 md:order-2"
                        >
                            <Plus size={16} /> Create Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                                Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                            <Label htmlFor="category" className="text-left">
                                Category Name
                            </Label>
                            <Input
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
                                    })
                                }
                                className="col-span-3 mt-1 border-gray-500"
                            />
                            {errors.category && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.category[0]}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={submit}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-8 overflow-x-auto">
                <div className="min-w-[920px] lg:min-w-[880px]">
                    <ul className="flex items-center px-3 py-4 bg-accentRed text-white rounded-md shadow-md mb-4">
                        <li className="basis-[5%]">ID</li>
                        <li className="basis-[35%]">Category</li>
                        <li className="basis-[15%]">Availability</li>
                        <li className="basis-[18%] pl-2">Related Menu</li>
                        <li className="basis-[22%]">Created at</li>
                        <li className="basis-[5%]"></li>
                    </ul>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <CategoryRowSkeleton key={i} />
                        ))
                    ) : categories.length === 0 ? (
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
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300 order-1 md:order-2 mt-2"
                                    >
                                        Create Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create New Category
                                        </DialogTitle>
                                        <DialogDescription>
                                            Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <Label
                                            htmlFor="category"
                                            className="text-left"
                                        >
                                            Category Name
                                        </Label>
                                        <Input
                                            id="category"
                                            name="category"
                                            value={form.category}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    category: e.target.value,
                                                })
                                            }
                                            className="col-span-3 mt-1 border-gray-500"
                                        />
                                        {errors.category && (
                                            <p className="text-red-500 mt-1 text-sm">
                                                {errors.category[0]}
                                            </p>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={submit}>
                                            Save changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ) : (
                        currentCategories.map((category) => (
                            <ul
                                key={category.id}
                                className="flex items-center bg-white px-3 py-4 rounded-md shadow-md mb-2"
                            >
                                <li className="basis-[5%]">{category.id}</li>
                                <li className="basis-[35%]">
                                    {category.category}
                                </li>
                                <li className="basis-[15%]">
                                    <Switch
                                        checked={
                                            visibility[category.id] || false
                                        }
                                        onCheckedChange={(checked) =>
                                            toggleVisibility(
                                                category.id,
                                                checked
                                            )
                                        }
                                    />
                                </li>
                                <li className="basis-[18%] pl-2">
                                    {category.menus_count}
                                </li>
                                <li className="basis-[22%]">
                                    {dayjs(category.created_at).fromNow()}
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
                                            <Dialog
                                                open={editDialogOpen}
                                                onOpenChange={(isOpen) => {
                                                    setEditDialogOpen(isOpen);
                                                    if (isOpen) {
                                                        setEditId(category.id);
                                                    } else {
                                                        setEditId(null);
                                                        setErrors({});
                                                        setForm({
                                                            category: "",
                                                        }); // reset when dialog closes
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button className="text-accentYellow px-2 py-0 bg-white shadow-none hover:bg-white">
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Edit Category
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Update the category
                                                            name below.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex flex-col gap-4 py-4">
                                                        <Label
                                                            htmlFor="category"
                                                            className="text-left"
                                                        >
                                                            Category Name
                                                        </Label>
                                                        <Input
                                                            id="category"
                                                            value={
                                                                form.category
                                                            }
                                                            onChange={(e) =>
                                                                setForm({
                                                                    ...form,
                                                                    category:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="col-span-3 mt-1 border-gray-500"
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="secondary">
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={submit}
                                                        >
                                                            Update
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

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
                                                                    deleteCategory(
                                                                        category.id
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
                                        categories.length / rowsPerPage
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
                                        Math.ceil(
                                            categories.length / rowsPerPage
                                        )
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
