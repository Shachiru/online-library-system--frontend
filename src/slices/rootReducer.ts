import {combineReducers} from "redux";
import bookReducer from "./bookSlice";
import cartReducer from "./cartSlice";

export const rootReducer = combineReducers({
    books: bookReducer,
    cart: cartReducer
});

export type RootReducer = ReturnType<typeof rootReducer>