import { Heart, Star, ShoppingCart, Search } from "lucide-react";
import Product from "../../../images/Product.png";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/Components/ui/alert-dialog.jsx";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/contexts/CartContext";
import dayjs from "dayjs";
import { useSearch } from "@/contexts/SearchContext";

export default function ProductCards() {
    const { query, setQuery } = useSearch();
    // state to store products
    let [products, setProducts] = useState([]);
    // state for loading
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart();

    const [wishlistItems, setWishlistItems] = useState([]);

    const [openOutOfStock, setOpenOutOfStock] = useState(false);
    const [outOfStockProduct, setOutOfStockProduct] = useState(null);

    // fetch data that send from backend
    let getProducts = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/products");
            let data = res.data;
            const today = dayjs();

            const visibleProducts = data.products.filter(
                (product) => product.visibility === 1
            );

            setProducts(visibleProducts);
        } catch (error) {
            console.error("Error fetching menus:", error);
        } finally {
            setLoading(false);
        }
    };

    // state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    // rows to show in a page
    const rowsPerPage = 6;

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

    // Fetch wishlist to know liked items
    const getWishlistItems = async () => {
        try {
            const res = await axios.get("/api/wishlist?filter=product");
            setWishlistItems(res.data.items);
        } catch (error) {
            console.error("Failed to fetch wishlist items:", error);
        }
    };

    useEffect(() => {
        getProducts();
        getWishlistItems();
    }, []);

    const toggleWishlist = async (id, type) => {
        try {
            const formData = new FormData();
            formData.append("items[0][id]", id);
            formData.append("items[0][type]", type);

            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            await axios.post("/api/wishlist/toggle", formData, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            getWishlistItems();
        } catch (err) {
            console.error("Failed to toggle wishlist", err);
        }
    };

    // Helper to check if item is in wishlist
    const isInWishlist = (id, type) => {
        return wishlistItems.some(
            (item) =>
                item.item_type === type &&
                ((type === "product" && item.product.id === id) ||
                    (type === "product" && item.product.id === id))
        );
    };

    const SkeletonCard = () => (
        <div className="px-3 py-2 bg-white border border-gray-400 shadow-lg rounded-xl animate-pulse">
            <div className="flex justify-between mb-2">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-8 h-3 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="w-44 md:w-40 xl:w-36 h-52 bg-gray-200 rounded mx-auto my-3"></div>
            <div className="flex justify-between items-center my-3">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-2 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.2 }}
        >
            <div className="w-[96%] lg:w-[97%] mx-auto my-8 px-3 md:px-6">
                <div className="flex justify-between">
                    <div className="flex flex-col items-center mx-auto md:block md:mx-0">
                        <div>
                            <h2 className="text-3xl md:text-2xl font-semibold mb-1 relative inline-block">
                                Our Products
                            </h2>
                            <div className="flex items-center">
                                <div className="w-36 md:w-28 h-[2px] bg-accentRed"></div>
                                <div className="w-1 h-1 bg-accentRed rounded-full ml-2"></div>
                            </div>
                        </div>
                        <p className="md:text-sm text-gray-800 mt-2">
                            Here are our products that can take you home.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                </div>

                <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-[97%] xl:w-[93%] mx-auto">
                    {loading
                        ? Array.from({ length: 6 }).map((_, idx) => (
                              <SkeletonCard key={idx} />
                          ))
                        : currentProducts.map((product) => (
                              <div
                                  key={product.id}
                                  className="px-3 py-2 bg-white border border-gray-400 shadow-lg rounded-xl"
                              >
                                  <div className="flex justify-between">
                                      <button
                                          onClick={() =>
                                              toggleWishlist(
                                                  product.id,
                                                  "product"
                                              )
                                          }
                                          className={`${
                                              isInWishlist(
                                                  product.id,
                                                  "product"
                                              )
                                                  ? "text-accentRed"
                                                  : "text-gray-500"
                                          }`}
                                      >
                                          <Heart
                                              size={20}
                                              fill={
                                                  isInWishlist(
                                                      product.id,
                                                      "product"
                                                  )
                                                      ? "red"
                                                      : "none"
                                              }
                                          />
                                      </button>
                                      <a
                                          href=""
                                          className="text-sm flex items-center gap-1 text-accentYellow"
                                      >
                                          <Star
                                              size={16}
                                              fill="currentColor"
                                              className="text-accentYellow"
                                          />{" "}
                                          {product.rating}
                                      </a>
                                  </div>
                                  <img
                                      src={`/storage/${product.image}`}
                                      alt={product.name}
                                      className="w-44 md:w-40 xl:w-36 h-52 object-cover mx-auto my-3"
                                  />
                                  <div className="flex justify-between items-center my-3">
                                      <div>
                                          <h1 className="font-medium mb-1">
                                              {product.name}
                                          </h1>
                                          <p className="text-sm font-medium">
                                              {product.promotion &&
                                              new Date() >=
                                                  new Date(product.startDate) &&
                                              new Date() <=
                                                  new Date(product.endDate) ? (
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
                                          </p>
                                          {product.promotion &&
                                              new Date() >=
                                                  new Date(product.startDate) &&
                                              new Date() <=
                                                  new Date(product.endDate) && (
                                                  <p className="text-xs text-gray-500">
                                                      Promo period:{" "}
                                                      {dayjs(
                                                          product.startDate
                                                      ).format("MMM D")}{" "}
                                                      -{" "}
                                                      {dayjs(
                                                          product.endDate
                                                      ).format("MMM D")}
                                                  </p>
                                              )}
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                          <div>
                                              {product.stock === 0 && (
                                                  <span className="px-1 py-1 text-xs bg-red-100 text-accentRed rounded-md">
                                                      Out of Stock
                                                  </span>
                                              )}
                                          </div>
                                          <div className="">
                                              {product.stock > 0 ? (
                                                  <button
                                                      onClick={() =>
                                                          addToCart(
                                                              product,
                                                              "product"
                                                          )
                                                      }
                                                      className="bg-accentRed hover:bg-hoverRed duration-300 rounded-full px-2 py-2"
                                                  >
                                                      <ShoppingCart
                                                          size={16}
                                                          className="text-white"
                                                      />
                                                  </button>
                                              ) : (
                                                  <button
                                                      onClick={() => {
                                                          setOpenOutOfStock(
                                                              true
                                                          );
                                                          setOutOfStockProduct(
                                                              product
                                                          );
                                                      }}
                                                      className="bg-accentRed hover:bg-hoverRed duration-300 rounded-full px-2 py-2 opacity-50"
                                                  >
                                                      <ShoppingCart
                                                          size={16}
                                                          className="text-white"
                                                      />
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                      <AlertDialog
                                          open={openOutOfStock}
                                          onOpenChange={setOpenOutOfStock}
                                      >
                                          <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                      Out of Stock
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                      {outOfStockProduct?.name}{" "}
                                                      is currently out of stock.
                                                      We’re working to restock
                                                      it as quickly as possible.
                                                      Thank you for your
                                                      patience!
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                      Okay
                                                  </AlertDialogCancel>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                  </div>
                              </div>
                          ))}
                </div>
                <div className="mt-4">
                    <Pagination>
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
