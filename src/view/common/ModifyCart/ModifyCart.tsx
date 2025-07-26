import type {BookData} from "../../../model/BookData.ts";
import type {CartItem} from "../../../model/CartItem.ts";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {decreaseQuantity, increaseQuantity} from "../../../slices/cartSlice.ts";

interface ModifyCartProps {
    data: { book: BookData };
}

export function ModifyCart({data}: ModifyCartProps) {
    const dispatch = useDispatch<AppDispatch>();

    const item = useSelector((state: RootState) => state.cart.items.find(
        (cartItem: CartItem) => cartItem.book._id === data.book._id
    ))

    const increaseItemCount = () => {
        dispatch(increaseQuantity(data.book._id));
    }

    const decreaseItemCount = () => {
        if (item && item.itemCount > 1) {
            dispatch(decreaseQuantity(data.book._id));
        } else {
            alert("Quantity cannot be less than 1");
        }
    }

    return (
        <div className="bg-gradient-to-r from-[#ECFAE5] to-[#DDF6D2] p-6 rounded-2xl border-2 border-[#CAE8BD]/40 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-[#B0DB9C] mb-1">Modify Quantity</h3>
                <p className="text-sm text-gray-600">Adjust the number of items</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-center space-x-6">
                <button
                    onClick={decreaseItemCount}
                    className="w-12 h-12 bg-gradient-to-r from-[#CAE8BD] to-[#DDF6D2] text-gray-700 rounded-full hover:from-[#B0DB9C] hover:to-[#CAE8BD] hover:text-white transition-all duration-200 flex items-center justify-center font-bold shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 group"
                    disabled={item?.itemCount === 1}
                >
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                </button>

                {/* Quantity Display */}
                <div className="bg-white px-6 py-4 rounded-2xl border-3 border-[#CAE8BD] shadow-lg min-w-[80px] text-center">
                    <div className="text-xs text-[#CAE8BD] font-semibold mb-1">Quantity</div>
                    <div className="text-2xl font-bold text-[#B0DB9C]">
                        {item?.itemCount || 0}
                    </div>
                </div>

                <button
                    onClick={increaseItemCount}
                    className="w-12 h-12 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white rounded-full hover:from-[#CAE8BD] hover:to-[#B0DB9C] transition-all duration-200 flex items-center justify-center font-bold shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 group"
                >
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>

            {/* Item Info */}
            <div className="mt-6 p-4 bg-white/60 rounded-xl border border-[#CAE8BD]/30">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#B0DB9C] to-[#CAE8BD] rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{data.book.title}</h4>
                        <p className="text-xs text-[#B0DB9C] font-medium">{data.book.author}</p>
                    </div>
                </div>
            </div>

            {/* Warning for minimum quantity */}
            {item?.itemCount === 1 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-xs text-yellow-700 font-medium">Minimum quantity is 1</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-white text-[#B0DB9C] px-4 py-2 rounded-xl border-2 border-[#CAE8BD] hover:bg-[#ECFAE5] transition-all duration-200 text-sm font-semibold">
                    Save Changes
                </button>
                <button className="flex-1 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white px-4 py-2 rounded-xl hover:from-[#CAE8BD] hover:to-[#B0DB9C] transition-all duration-200 text-sm font-semibold">
                    Update Cart
                </button>
            </div>
        </div>
    );
}