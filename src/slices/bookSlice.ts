import type {BookData} from "../model/BookData.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {backEndAPI} from "../api.ts";

interface BookState {
    list: BookData[],
    error: string | null | undefined
}

const initialState: BookState = {
    list: [],
    error: null
}

export const getAllBooks = createAsyncThunk('book/getAllBooks', async () => {
    const response = await backEndAPI.get("/books/all");
    return await response.data;
})

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllBooks.pending, () => {
            alert("Books are loading...")
        }).addCase(getAllBooks.fulfilled, (state, action) => {
            state.list = action.payload;
        }).addCase(getAllBooks.rejected, (state, action) => {
            state.error = action.error.message;
            alert("Error loading: " + state.error);
        })
    }
})

export default bookSlice.reducer;