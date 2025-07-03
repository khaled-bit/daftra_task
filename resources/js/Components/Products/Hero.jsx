import Products from "../../../images/products.png";
import HeroBg from "../../../images/hero-bg.jpg";
import { motion } from "framer-motion";

export default function ProductsHero() {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: false, amount: 0.2 }}
        >
            <div className="relative">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${HeroBg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.6,
                        zIndex: -1,
                    }}
                ></div>
                <div className="w-[90%] md:w-[70%] mx-auto py-10">
                    <p className="text-gray-800 text-center mb-3 text-xs md:text-sm lg:text-base">
                        For the people who is missing the taste, smell and feel
                        of Burma. We are here for you. From traditional
                        delicious Burmese food products for your taste buds, to
                        beautiful handcrafted items you can gift your beloved to
                        show your love. Order now to feel the taste and smell of
                    </p>
                    <h1 className="font-medium text-center text-5xl text-accentGreen">
                        Burma
                    </h1>
                    <img
                        src={Products}
                        alt="Products"
                        className="w-[93%] md:w-[75%] h-auto object-cover mx-auto mt-8"
                    />
                </div>
            </div>
        </motion.div>
    );
}
