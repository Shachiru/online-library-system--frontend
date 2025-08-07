import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { RootState } from "../../../store/store";
import type { BookCardProps } from "../../../model/ComponentProps";

export function BookCard({
                             data,
                             onAddToCart,
                             onRemoveFromCart,
                             showActions = true,
                             compact = false
                         }: BookCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Check if the book is already in the cart
    const isInCart = useSelector((state: RootState) =>
        state.cart.items.some(cartItem => cartItem.book._id === data._id)
    );

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart();
        }
    };

    const handleRemoveFromCart = () => {
        if (onRemoveFromCart) {
            onRemoveFromCart(data.isbn);
        }
    };

    // Animation variants with proper typing
    const cardVariants: Variants = {
        initial: {
            rotateY: 0,
            scale: 1,
            y: 0,
            boxShadow: "0 4px 20px rgba(0, 64, 48, 0.1)"
        },
        hover: {
            rotateY: 8,
            scale: 1.02,
            y: -8,
            boxShadow: "0 25px 50px rgba(0, 64, 48, 0.25)",
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        }
    };

    const imageVariants: Variants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1] as const
            }
        }
    };

    const overlayVariants: Variants = {
        initial: { opacity: 0 },
        hover: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const cardClasses = compact
        ? "w-full max-w-sm mx-auto"
        : "w-full max-w-sm mx-auto";

    const imageHeight = compact ? "h-40" : "h-56";
    const padding = compact ? "p-4" : "p-6";

    return (
        <motion.div
            className={cardClasses}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ transformStyle: "preserve-3d" }}
        >
            <div className="relative bg-white rounded-2xl border border-[#4A9782]/20 shadow-lg overflow-hidden backdrop-blur-sm">
                {/* Top accent line */}
                <motion.div
                    className="h-1 bg-gradient-to-r from-[#004030] via-[#4A9782] to-[#004030]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />

                <div className={padding}>
                    {/* Book Image Container */}
                    <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#4A9782]/5 to-[#004030]/5 p-3">
                        <motion.div
                            className="relative"
                            variants={imageVariants}
                        >
                            <img
                                className={`w-full ${imageHeight} object-cover rounded-lg shadow-md`}
                                src={data.coverImage || "https://via.placeholder.com/200x280?text=No+Cover"}
                                alt={data.title}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/200x280/4A9782/white?text=LibraryHub";
                                }}
                            />

                            {/* Hover overlay */}
                            <motion.div
                                variants={overlayVariants}
                                className={`absolute inset-0 bg-gradient-to-t from-[#004030]/20 via-transparent to-[#4A9782]/10 rounded-lg transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </motion.div>

                        {/* Genre Badge */}
                        <motion.div
                            className="absolute top-2 right-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="bg-white/95 backdrop-blur-sm text-[#004030] px-3 py-1 rounded-full text-xs font-semibold border border-[#4A9782]/30 shadow-sm">
                                {data.genre}
                            </span>
                        </motion.div>

                        {/* Availability Badge */}
                        <motion.div
                            className="absolute top-2 left-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                data.availability
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                                {data.availability ? 'Available' : 'Unavailable'}
                            </span>
                        </motion.div>
                    </div>

                    {/* Book Info */}
                    <div className="mb-6 space-y-3">
                        {/* Title */}
                        <motion.h3
                            className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-[#004030] line-clamp-2 leading-tight`}
                            whileHover={{ color: "#4A9782" }}
                            transition={{ duration: 0.2 }}
                        >
                            {data.title}
                        </motion.h3>

                        {/* Author */}
                        <div className="flex items-center space-x-3">
                            <motion.div
                                className="w-8 h-8 bg-gradient-to-br from-[#004030] to-[#4A9782] rounded-full flex items-center justify-center shadow-md"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                </svg>
                            </motion.div>
                            <p className="text-[#4A9782] font-semibold text-sm">{data.author}</p>
                        </div>

                        {/* Publication Year */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <motion.svg
                                    className="w-4 h-4 text-[#4A9782]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    whileHover={{ rotate: 15 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </motion.svg>
                                <span className="font-medium text-[#004030]/80">{data.publicationYear}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(data.averageRating) ? 'text-[#4A9782]' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        whileHover={{ scale: 1.2, rotate: 72 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.68-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.562-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </motion.svg>
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-[#004030]">
                                {data.averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-[#004030]/60">
                                ({data.reviews?.length || '0'} reviews)
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {showActions && data.availability && (
                        <AnimatePresence mode="wait">
                            {isInCart ? (
                                <motion.button
                                    key="remove-from-cart"
                                    onClick={handleRemoveFromCart}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "#f87171",
                                        transition: {
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25
                                        }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full bg-red-400 text-white font-semibold py-4 px-6 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                                >
                                    <motion.svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </motion.svg>
                                    <motion.span
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Remove from List
                                    </motion.span>
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="add-to-cart"
                                    onClick={handleAddToCart}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: {
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25
                                        }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white font-semibold py-4 px-6 rounded-xl hover:from-[#4A9782] hover:to-[#004030] focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group border border-[#4A9782]/20"
                                    disabled={!data.availability}
                                >
                                    <motion.svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </motion.svg>
                                    <motion.span
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Add to Borrowing List
                                    </motion.span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    )}

                    {/* Show unavailable message if book is not available */}
                    {showActions && !data.availability && (
                        <div className="mt-4 p-3 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
                            This book is currently unavailable
                        </div>
                    )}
                </div>

                {/* Bottom accent line */}
                <motion.div
                    className="h-1 bg-gradient-to-r from-transparent via-[#4A9782]/30 to-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                />
            </div>
        </motion.div>
    );
}