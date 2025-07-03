import Product from "../../../images/Product.png";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
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
import { useCart } from "@/contexts/CartContext";
import dayjs from "dayjs";

export default function Promotions() {
    // state to store products
    let [products, setProducts] = useState([]);

    const { addToCart } = useCart();

    const [wishlistItems, setWishlistItems] = useState([]);

    const [openOutOfStock, setOpenOutOfStock] = useState(false);
    const [outOfStockProduct, setOutOfStockProduct] = useState(null);

    // state for loading
    const [loading, setLoading] = useState(true);

    // fetch data that send from backend
    let getProducts = async () => {
        setLoading(true);
        try {
            let res = await axios.get("/api/products");
            let data = res.data;
            const today = dayjs();

            const promotionProducts = data.products.filter((product) => {
                return (
                    product.promotion &&
                    product.visibility === 1 &&
                    dayjs(product.startDate).isBefore(today) &&
                    dayjs(product.endDate).isAfter(today)
                );
            });

            setProducts(promotionProducts);
        } catch (error) {
            console.error("Error fetching menus:", error);
        } finally {
            setLoading(false);
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
        <CarouselItem className="basis-[85%] md:basis-[75%] lg:basis-1/2">
            <div className="px-3 py-2 bg-white border border-gray-400 shadow-lg w-full rounded-xl animate-pulse">
                <div className="flex justify-between mb-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-8 h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="w-36 md:w-28 xl:w-28 h-40 bg-gray-200 rounded mx-auto my-3"></div>
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
        </CarouselItem>
    );

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
        >
            <div className="w-[96%] lg:w-[90%] mx-auto py-12 px-3 block md:flex items-center justify-center">
                <div className="w-full md:w-1/2 lg:w-1/3 mb-5">
                    <h1 className="text-4xl font-medium text-accentGreen">
                        Up to 50% off
                    </h1>
                    <h1 className="text-4xl font-medium text-accentGreen">
                        Promotion
                    </h1>
                    <p className="text-gray-800 text-xs lg:text-sm mt-3">
                        Enjoy up to 50% off! From local flavors to local
                        masterpieces, bring home the true taste of Burma. Savor
                        the perfect blend of flavors and traditions in every
                        bite.
                    </p>
                </div>
                <div className="w-full md:w-1/2 lg:w-2/3 md:ml-5">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                    >
                        <CarouselContent>
                            {loading
                                ? Array.from({ length: 2 }).map((_, idx) => (
                                      <SkeletonCard key={idx} />
                                  ))
                                : products.map((product) => (
                                      <CarouselItem
                                          key={product.id}
                                          className="basis-[85%] md:basis-[75%] lg:basis-1/2"
                                      >
                                          <div className="px-3 py-2 bg-white border border-gray-400 shadow-lg w-[100%] lg:w-full md:mx-auto rounded-xl">
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
                                                  className="w-36 md:w-28 xl:w-28 h-40 object-cover mx-auto my-3"
                                              />
                                              <div className="flex justify-between items-center my-3">
                                                  <div>
                                                      <h1 className="font-medium mb-1">
                                                          {product.name}
                                                      </h1>
                                                      <p className="text-sm font-medium">
                                                          {product.promotion &&
                                                          new Date() >=
                                                              new Date(
                                                                  product.startDate
                                                              ) &&
                                                          new Date() <=
                                                              new Date(
                                                                  product.endDate
                                                              ) ? (
                                                              <div className="flex items-center gap-1">
                                                                  <span className="text-red-600 font-semibold">
                                                                      {(
                                                                          product.price -
                                                                          (product.price *
                                                                              product.promotion) /
                                                                              100
                                                                      ).toFixed(
                                                                          2
                                                                      )}{" "}
                                                                      $
                                                                  </span>
                                                                  <span className="line-through text-sm text-gray-500">
                                                                      {
                                                                          product.price
                                                                      }{" "}
                                                                      $
                                                                  </span>
                                                              </div>
                                                          ) : (
                                                              <span>
                                                                  {
                                                                      product.price
                                                                  }{" "}
                                                                  $
                                                              </span>
                                                          )}
                                                      </p>
                                                      {product.promotion &&
                                                          new Date() >=
                                                              new Date(
                                                                  product.startDate
                                                              ) &&
                                                          new Date() <=
                                                              new Date(
                                                                  product.endDate
                                                              ) && (
                                                              <p className="text-xs text-gray-500">
                                                                  Promo period:{" "}
                                                                  {dayjs(
                                                                      product.startDate
                                                                  ).format(
                                                                      "MMM D"
                                                                  )}{" "}
                                                                  -{" "}
                                                                  {dayjs(
                                                                      product.endDate
                                                                  ).format(
                                                                      "MMM D"
                                                                  )}
                                                              </p>
                                                          )}
                                                  </div>
                                                  <div className="flex flex-col items-end gap-2">
                                                      <div>
                                                          {product.stock ===
                                                              0 && (
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
                                                                  className="p-2"
                                                              >
                                                                  <ShoppingCart
                                                                      size={20}
                                                                      className="text-accentRed"
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
                                                                  className="p-2"
                                                              >
                                                                  <ShoppingCart
                                                                      size={20}
                                                                      className="text-accentRed opacity-50"
                                                                  />
                                                              </button>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <AlertDialog
                                                      open={openOutOfStock}
                                                      onOpenChange={
                                                          setOpenOutOfStock
                                                      }
                                                  >
                                                      <AlertDialogContent>
                                                          <AlertDialogHeader>
                                                              <AlertDialogTitle>
                                                                  Out of Stock
                                                              </AlertDialogTitle>
                                                              <AlertDialogDescription>
                                                                  {
                                                                      outOfStockProduct?.name
                                                                  }{" "}
                                                                  is currently
                                                                  out of stock.
                                                                  We’re working
                                                                  to restock it
                                                                  as quickly as
                                                                  possible.
                                                                  Thank you for
                                                                  your patience!
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
                                      </CarouselItem>
                                  ))}
                        </CarouselContent>
                        <div className="flex justify-end w-full mt-8">
                            <div className="flex gap-1">
                                <CarouselPrevious className="static md:inline-flex p-2 rounded-full bg-accentRed text-white hover:bg-hoverRed hover:text-white duration-300" />
                                <CarouselNext className="static md:inline-flex p-2 rounded-full bg-accentRed text-white hover:bg-hoverRed hover:text-white duration-300" />
                            </div>
                        </div>
                    </Carousel>
                </div>
            </div>
        </motion.div>
    );
}
