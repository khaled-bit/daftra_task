import Product from "../../../images/Product.png";
import { Heart, Star, ShoppingCart, Upload, ChevronDown } from "lucide-react";
import { Switch } from "../../Components/ui/switch";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
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
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/Components/ui/label";
import DatePicker from "@/Components/DatePicker";
import axios from "axios";
import Loading from "@/Components/Loading";

export default function ProductForm() {
    const [image, setImage] = useState(null); //for new image upload

    // prepare state to store form data
    const [form, setForm] = useState({
        name: "",
        price: "",
        rating: "",
        stock: "",
        promotion: "",
        startDate: "",
        endDate: "",
        visibility: true,
    });
    // store errors state
    const [errors, setErrors] = useState({});

    // use state to check dialog open or not and control
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // take id for edit feature
    let { id } = useParams();
    // state to check the page is create page or edit page
    let [isEdit, setIsEdit] = useState(false);
    // state for loading
    const [loading, setLoading] = useState(false);

    // check the id is exist or not (number or undefined)
    useEffect(() => {
        console.log(id);
        setIsEdit(!!id);
    }, [id]);

    const [imageUrl, setImageUrl] = useState(null); // for displaying the existing image

    // state to store detail of the product related to ID
    let [productDetail, setProductDetails] = useState(null);

    // fetch data to show prev data in input fields
    let getDetails = async (id) => {
        let res = await fetch("/api/product/" + id);
        let data = await res.json();
        setProductDetails(data.product);
    };

    // call data fetching function depend on id changes
    useEffect(() => {
        getDetails(id);
    }, [id]);

    useEffect(() => {
        if (productDetail) {
            setImageUrl(productDetail.image);
            // Convert the backend date string to a Date object
            const startDate = productDetail.startDate
                ? new Date(productDetail.startDate)
                : null;
            const endDate = productDetail.endDate
                ? new Date(productDetail.endDate)
                : null;
            setForm({
                name: productDetail.name,
                price: productDetail.price,
                rating: productDetail.rating,
                stock: productDetail.stock,
                promotion: productDetail.promotion,
                startDate: startDate,
                endDate: endDate,
                featured: productDetail.featured,
                visibility: productDetail.visibility,
            });
        }
    }, [productDetail]);

    // form submit function
    const submit = async (e) => {
        e.preventDefault();
        setIsDialogOpen(false);
        setLoading(true);

        // url and method to use in sending data using axios
        let url = isEdit ? "/api/product/" + id : "/api/product/create";
        let method = "post";

        // create new object to store form data to send
        let formData = new FormData();

        console.log("Form Data before submitting:", form);

        // store state data in object
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("rating", form.rating);
        formData.append("stock", form.stock);
        formData.append("promotion", form.promotion || "");
        if (form.startDate) {
            formData.append(
                "startDate",
                format(new Date(form.startDate), "yyyy-MM-dd")
            );
        }
        if (form.endDate) {
            formData.append(
                "endDate",
                format(new Date(form.endDate), "yyyy-MM-dd")
            );
        }
        formData.append("visibility", form.visibility ? "1" : "0");

        console.log("Form data after appending:", formData);

        if (image) {
            formData.append("image", image);
        }

        if (isEdit) {
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
                res.data.message === "Product created successfully." ||
                res.data.message === "Product updated successfully."
            ) {
                navigate("/admin/products");
            }
        } catch (error) {
            console.error("Error creating product:", error);

            // failed condition
            if (error.response && error.response.status === 422) {
                setIsDialogOpen(false);
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

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

    // Handle other custom components' inputs
    const handleCustomChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image input
    const uploadImg = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // calculating discounts
    const getDiscountedPrice = (price, promo, startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
            !promo ||
            isNaN(promo) ||
            !startDate ||
            !endDate ||
            now < start ||
            now > end
        ) {
            return price;
        }

        return (price - (price * promo) / 100).toFixed(2);
    };

    if (loading) {
        return (
            <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
                <div className="lg:pt-24 lg:w-[68%] xl:w-[74%] lg:ml-[32%] xl:ml-[26%] pt-20 h-[83vh] flex items-center justify-center pointer-events-auto">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ visibility: "hidden", opacity: 0 }}
            whileInView={{ visibility: "visible", opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="mx-2 md:mx-4 py-8 relative lg:flex gap-3"
        >
            <div className="w-full lg:w-[70%]">
                <h1 className="text-lg font-medium">
                    {isEdit ? "Edit" : "Create"} Product
                </h1>
                <form action="" className="mt-6 md:px-3">
                    <div className="flex justify-center mt-8 px-4 py-6 border border-gray-300 bg-white shadow-lg rounded-md">
                        <div
                            className="w-full border-2 border-dashed border-gray-400 p-8 rounded-lg text-center"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file && file.type.startsWith("image/")) {
                                    setImage(file);
                                }
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <Upload className="text-gray-700 text-4xl mb-4" />

                                <Label
                                    htmlFor="image-upload"
                                    className="flex items-center gap-1 justify-center cursor-pointer text-gray-700"
                                >
                                    <p className="hidden md:block">
                                        Drop your image here or
                                    </p>
                                    <p className="text-accentRed font-bold">
                                        Click to browse
                                    </p>
                                </Label>

                                <Input
                                    id="image-upload"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadImg}
                                    className="hidden"
                                />
                                <p className="mt-4 text-sm">
                                    or drag and drop an image
                                </p>
                                {imageUrl && !image && (
                                    <div className="mt-4">
                                        <img
                                            src={`/storage/${imageUrl}`}
                                            alt="Existing Preview"
                                            className="max-w-[130px] h-auto rounded-lg"
                                        />
                                    </div>
                                )}
                                {image && (
                                    <div className="mt-4">
                                        <img
                                            src={
                                                image
                                                    ? URL.createObjectURL(image)
                                                    : ""
                                            }
                                            alt="Preview"
                                            className="max-w-[130px] h-auto rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.image?.[0] && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.image[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 px-4 py-6 border border-gray-300 bg-white  shadow-lg rounded-md">
                        <h2 className="font-medium">General Information</h2>
                        <div>
                            <div className="mt-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Enter product name"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.name && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    value={form.price}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Enter your price"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.price && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.price[0]}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Label htmlFor="rating">Rating</Label>
                                <Input
                                    id="rating"
                                    name="rating"
                                    value={form.rating}
                                    onChange={handleInputChange}
                                    type="number"
                                    placeholder="Enter product rating"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.rating && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.rating[0]}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleInputChange}
                                    type="number"
                                    placeholder="Enter product stock"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.stock && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.stock[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 px-4 py-6 border border-gray-300 bg-white  shadow-lg rounded-md">
                        <h2 className="font-medium">Promotion</h2>
                        <div>
                            <div className="mt-3">
                                <Label htmlFor="promotion">
                                    Promotion (Percentage)
                                </Label>
                                <Input
                                    id="promotion"
                                    name="promotion"
                                    value={form.promotion}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Enter promotion"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.promotion && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.promotion[0]}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Label htmlFor="startDate">Start Date</Label>
                                <DatePicker
                                    id="startDate"
                                    name="startDate"
                                    selectedDate={form.startDate}
                                    onDateChange={(date) =>
                                        handleCustomChange("startDate", date)
                                    }
                                    placeholder="Select your start date"
                                    className="border-gray-500"
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.startDate[0]}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Label htmlFor="endDate">End Date</Label>
                                <DatePicker
                                    id="endDate"
                                    name="endDate"
                                    selectedDate={form.endDate}
                                    onDateChange={(date) =>
                                        handleCustomChange("endDate", date)
                                    }
                                    placeholder="Select your end date"
                                    className="mt-1 border-gray-500"
                                />
                                {errors.endDate && (
                                    <p className="text-red-500 mt-1 text-sm">
                                        {errors.endDate[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 px-4 py-6 border border-gray-300 bg-white  shadow-lg rounded-md">
                        <h1 className="font-medium">Actions</h1>
                        <div className="mt-3 flex flex-col gap-2">
                            <Label htmlFor="Visibility">Publish or Draft</Label>
                            <Switch
                                id="visibility"
                                name="visibility"
                                checked={form.visibility}
                                onCheckedChange={(checked) =>
                                    handleCustomChange("visibility", checked)
                                }
                            />
                            {errors.visibility && (
                                <p className="text-red-500 mt-1 text-sm">
                                    {errors.visibility[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <AlertDialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <AlertDialogTrigger>
                                <Button
                                    type="button"
                                    variant="default"
                                    className="rounded-lg bg-accentRed text-white hover:bg-hoverRed duration-300"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure you want to add this in
                                        your menu?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={submit}>
                                        Submit
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </form>
            </div>
            <div className="lg:w-[30%] lg:max-w-[295px] xl:max-w-[285px] hidden lg:block fixed right-4">
                <h1 className="text-lg font-medium mb-6">Preview</h1>
                <div className="px-3 py-4 bg-white border border-gray-400 shadow-lg rounded-xl">
                    <div className="flex justify-between">
                        <a href="">
                            <Heart size={16} className="text-accentRed" />
                        </a>
                        <a
                            href=""
                            className="text-sm flex items-center gap-1 text-accentYellow"
                        >
                            <Star
                                size={16}
                                fill="currentColor"
                                className="text-accentYellow"
                            />{" "}
                            {form.rating || 4.3}
                        </a>
                    </div>
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)} // For create feature, use uploaded image
                            alt="Live Preview"
                            className="w-auto h-36 object-cover mx-auto my-3"
                        />
                    ) : isEdit && imageUrl ? ( // If editing and imageUrl is available, use the menu image
                        <img
                            src={`/storage/${imageUrl}`} // imageUrl is the path to the image stored in the database
                            alt="Menu Image"
                            className="w-auto h-36 object-cover mx-auto my-3"
                        />
                    ) : (
                        <img
                            src={Product} // Default image when no image is uploaded or available
                            alt="product"
                            className="w-auto h-36 object-cover mx-auto my-3"
                        />
                    )}
                    <div className="flex justify-between items-center my-3">
                        <div>
                            <h1 className="text-sm font-medium mb-1">
                                {form.name || "Eain Chat Mote Hti"}
                            </h1>
                            <p className="text-sm font-medium">
                                {form.promotion &&
                                new Date() >= new Date(form.startDate) &&
                                new Date() <= new Date(form.endDate) ? (
                                    <div className="flex items-center gap-2">
                                        <span className="line-through text-sm text-gray-500">
                                            {form.price || 6.12} $
                                        </span>
                                        <span className="font-bold text-red-600">
                                            {getDiscountedPrice(
                                                form.price,
                                                form.promotion,
                                                form.startDate,
                                                form.endDate
                                            )}{" "}
                                            $
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-bold text-gray-800">
                                        {form.price || 6.12} $
                                    </span>
                                )}
                            </p>
                        </div>
                        <button className="bg-accentRed hover:bg-hoverRed duration-300 rounded-full px-2 py-2">
                            <ShoppingCart size={16} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
