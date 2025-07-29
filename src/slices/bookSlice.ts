import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {BookData} from '../model/BookData';
import {backendApi} from '../api';
import {AxiosError} from 'axios';

interface BookState {
    list: BookData[];
    loading: boolean;
    error: string | null;
}

const initialState: BookState = {
    list: [],
    loading: false,
    error: null,
};

export const getAllBooks = createAsyncThunk('books/getAllBooks', async (_, {rejectWithValue}) => {
    try {
        const response = await backendApi.get('/books/all');
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ error?: string }>;
        return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch books');
    }
});

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAllBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default bookSlice.reducer;