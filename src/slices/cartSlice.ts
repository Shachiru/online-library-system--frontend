import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {BookData} from "../model/BookData.ts";
import type {CartItem} from "../model/CartItem.ts";

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state: CartState, action: PayloadAction<BookData>) => {
            const existingItem = state.items.find((item) => item.book._id === action.payload._id);
            if (!existingItem) {
                state.items.push({
                    book: action.payload,
                    itemCount: 1
                })
            }
        },
        increaseQuantity(state: CartState, action: PayloadAction<string>) {
            const item = state.items.find((existingItem) => existingItem.book._id === action.payload)
            if (item) {
                item.itemCount += 1
            }
        },
        decreaseQuantity(state: CartState, action: PayloadAction<string>) {
            const item = state.items.find((existingItem) => existingItem.book._id === action.payload)
            if (item && item.itemCount > 1) {
                item.itemCount -= 1
            }
        }
    }
});

export const {addItemToCart, increaseQuantity, decreaseQuantity} = cartSlice.actions;

export default cartSlice.reducer;