import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {BookData} from "../model/BookData.ts";
import type {CartItem} from "../model/CartItem.ts";

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart(state, action: PayloadAction<BookData>) {
            const existingItem = state.items.find((item) => item.book._id === action.payload._id);
            if (existingItem) {
                existingItem.itemCount += 1;
            } else {
                state.items.push({ book: action.payload, itemCount: 1 });
            }
        },
        decreaseQuantity(state, action: PayloadAction<string>) {
            const item = state.items.find((item) => item.book._id === action.payload);
            if (item) {
                item.itemCount -= 1;
                if (item.itemCount <= 0) {
                    state.items = state.items.filter((i) => i.book._id !== action.payload);
                }
            }
        },
        increaseQuantity(state, action: PayloadAction<string>) {
            const item = state.items.find((item) => item.book._id === action.payload);
            if (item) {
                item.itemCount += 1;
            }
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addItemToCart, decreaseQuantity, increaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;