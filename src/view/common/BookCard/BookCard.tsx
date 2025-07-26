import { useState } from "react";
import type { BookData } from "../../../model/BookData.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { addItemToCart, increaseQuantity, decreaseQuantity } from "../../../slices/cartSlice.ts";

type BookCardProps = {
    data: BookData;
};

export function BookCard({ data }: BookCardProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isHovered, setIsHovered] = useState(false);

    const item = useSelector((state: RootState) =>
        state.cart.items.find(cartItem => cartItem.book._id === data._id)
    );

    const addToCart = () => {
        dispatch(addItemToCart(data));
    };

    const handleIncrease = () => {
        dispatch(increaseQuantity(data._id));
    };

    const handleDecrease = () => {
        dispatch(decreaseQuantity(data._id));
    };

    return (
        <div
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-[#ECFAE5] hover:border-[#CAE8BD] group transform hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient accent top */}
            <div className="h-1 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

            <div className="p-6">
                {/* Book Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] p-4">
                    <div className="relative">
                        <img
                            className="w-full h-48 object-cover rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-500"
                            src={data.coverImage || "https://via.placeholder.com/200x280?text=No+Cover"}
                            alt={data.title}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/200x280/B0DB9C/white?text=LibraryHub";
                            }}
                        />
                        {/* Overlay on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-[#B0DB9C]/20 to-transparent rounded-xl opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
                    </div>

                    {/* Genre badge */}
                    <div className="absolute top-2 right-2">
                        <span className="bg-white/90 backdrop-blur-sm text-[#B0DB9C] px-3 py-1 rounded-full text-xs font-semibold border border-[#CAE8BD]/30">
                            {data.genre}
                        </span>
                    </div>
                </div>

                {/* Book Info */}
                <div className="mb-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
                        {data.title}
                    </h3>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-[#B0DB9C] font-semibold text-sm">{data.author}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-[#CAE8BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{data.publicationYear}</span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(data.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                            {data.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({Math.floor(Math.random() * 100) + 10} reviews)
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                    {item ? (
                        <div className="w-full bg-gradient-to-r from-[#ECFAE5] to-[#DDF6D2] p-4 rounded-2xl border-2 border-[#CAE8BD]/30 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleDecrease}
                                    disabled={item.itemCount <= 1}
                                    className="w-10 h-10 bg-gradient-to-r from-[#CAE8BD] to-[#DDF6D2] text-gray-700 rounded-full hover:from-[#B0DB9C] hover:to-[#CAE8BD] hover:text-white transition-all duration-200 flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>

                                <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#CAE8BD] shadow-sm">
                                    <span className="font-bold text-[#B0DB9C] text-lg">{item.itemCount}</span>
                                </div>

                                <button
                                    onClick={handleIncrease}
                                    className="w-10 h-10 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white rounded-full hover:from-[#CAE8BD] hover:to-[#B0DB9C] transition-all duration-200 flex items-center justify-center font-bold shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={addToCart}
                            className="w-full bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white font-semibold py-4 px-6 rounded-2xl hover:from-[#CAE8BD] hover:to-[#B0DB9C] focus:outline-none focus:ring-2 focus:ring-[#B0DB9C] focus:ring-offset-2 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group/btn"
                        >
                            <svg className="w-5 h-5 transform group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H17M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
                            </svg>
                            <span className="transform group-hover/btn:translate-x-1 transition-transform duration-200">Add to Cart</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-[#ECFAE5] to-transparent"></div>
        </div>
    );
}