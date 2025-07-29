import {useState, useEffect, useCallback, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {BookCard} from '../../common/BookCard/BookCard';
import {backendApi} from '../../../api';
import type {BookData} from "../../../model/BookData";
import type {CartItem} from "../../../model/CartItem";
import type {AppDispatch, RootState} from "../../../store/store";
import {getAllBooks} from "../../../slices/bookSlice";
import {addItemToCart, decreaseQuantity, increaseQuantity, clearCart} from "../../../slices/cartSlice";
import {AxiosError} from 'axios';

export function BorrowBookPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {list: books, error: bookError, loading: booksLoading} = useSelector((state: RootState) => state.books);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loadingCount, setLoadingCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const startLoading = () => setLoadingCount((prev) => prev + 1);
    const stopLoading = () => {
        if (isMounted.current) {
            setLoadingCount((prev) => Math.max(0, prev - 1));
        }
    };

    const fetchBorrowingList = useCallback(async () => {
        try {
            startLoading();
            if (isMounted.current) setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                const authError = 'Please log in to view your borrowing list';
                if (isMounted.current) setError(authError);
                toast.error(authError, {toastId: 'fetch-borrowing-auth-error'});
                navigate('/auth');
                return;
            }
            const response = await backendApi.get('/borrowing-list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const borrowingList = response.data;
            dispatch(clearCart());
            if (borrowingList.books && borrowingList.books.length > 0) {
                borrowingList.books.forEach((book: BookData) => {
                    dispatch(addItemToCart(book));
                });
            } else {
                toast.info('Your borrowing list is empty', {toastId: 'fetch-borrowing-empty'});
            }
        } catch (err: unknown) {
            let errorMessage = 'Failed to fetch borrowing list';
            if (err instanceof AxiosError) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    errorMessage = err.response?.data?.error || 'Unauthorized: Please log in again';
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    navigate('/auth');
                } else if (err.response?.status === 404) {
                    errorMessage = 'Your borrowing list is empty';
                    dispatch(clearCart());
                    toast.info(errorMessage, {toastId: 'fetch-borrowing-empty'});
                } else {
                    errorMessage = err.response?.data?.error || err.message || errorMessage;
                }
            }
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, {toastId: 'fetch-borrowing-error'});
            console.error(err);
        } finally {
            stopLoading();
        }
    }, [dispatch, navigate]);

    const refreshBooks = async () => {
        try {
            startLoading();
            if (isMounted.current) setError(null);
            await dispatch(getAllBooks()).unwrap();
            toast.info('Book list refreshed', {toastId: 'refresh-books'});
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh book list';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, {toastId: 'refresh-books-error'});
            console.error(err);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                startLoading();
                await Promise.all([
                    dispatch(getAllBooks()).unwrap(),
                    fetchBorrowingList(),
                ]);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to initialize data';
                if (isMounted.current) setError(errorMessage);
                toast.error(errorMessage, {toastId: 'init-data-error'});
                console.error(err);
            } finally {
                stopLoading();
            }
        };

        fetchData();
    }, [dispatch, fetchBorrowingList]);

    const addToBorrowingList = async (book: BookData) => {
        try {
            startLoading();
            if (isMounted.current) setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                const authError = 'Please log in to add books to your borrowing list';
                if (isMounted.current) setError(authError);
                toast.error(authError, {toastId: 'add-borrowing-auth-error'});
                navigate('/auth');
                return;
            }
            await backendApi.post('/borrowing-list/add', {isbn: book.isbn}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(addItemToCart(book));
            toast.success('Book added to borrowing list!', {toastId: `add-book-${book.isbn}`});
            await dispatch(getAllBooks()).unwrap();
        } catch (err: unknown) {
            let errorMessage = 'Failed to add book to borrowing list';
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.message || err.message || errorMessage;
                if (err.response?.status === 400 && errorMessage === 'Book is not available') {
                    toast.error(`Sorry, "${book.title}" is currently unavailable. Please try another book.`, {
                        toastId: `add-book-error-${book.isbn}`,
                    });
                    await dispatch(getAllBooks()).unwrap();
                } else {
                    toast.error(errorMessage, {toastId: `add-book-error-${book.isbn}`});
                }
            }
            if (isMounted.current) setError(errorMessage);
            console.error(err);
        } finally {
            stopLoading();
        }
    };

    const removeFromBorrowingList = async (isbn: string) => {
        try {
            startLoading();
            if (isMounted.current) setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                const authError = 'Please log in to remove books from your borrowing list';
                if (isMounted.current) setError(authError);
                toast.error(authError, {toastId: 'remove-borrowing-auth-error'});
                navigate('/auth');
                return;
            }
            await backendApi.delete(`/borrowing-list/remove/${isbn}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(decreaseQuantity(isbn));
            toast.success('Book removed from borrowing list!', {toastId: `remove-book-${isbn}`});
            await dispatch(getAllBooks()).unwrap();
        } catch (err: unknown) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error || err.message || 'Failed to remove book from borrowing list'
                : 'Failed to remove book from borrowing list';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, {toastId: `remove-book-error-${isbn}`});
            console.error(err);
        } finally {
            stopLoading();
        }
    };

    const confirmBorrowing = async () => {
        if (cartItems.length === 0) {
            toast.warn('Your borrowing list is empty!', {toastId: 'empty-cart'});
            return;
        }
        try {
            startLoading();
            if (isMounted.current) setError(null);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) {
                const authError = 'User not authenticated. Please log in.';
                if (isMounted.current) setError(authError);
                toast.error(authError, {toastId: 'auth-error'});
                navigate('/auth');
                return;
            }
            for (const item of cartItems) {
                await backendApi.post('/transactions/borrow', {
                    userId,
                    bookId: item.book._id,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success(`Borrowed "${item.book.title}" successfully!`, {toastId: `borrow-${item.book._id}`});
            }
            dispatch(clearCart());
            toast.success('All books borrowed successfully!', {toastId: 'borrow-success'});
            await dispatch(getAllBooks()).unwrap();
            navigate('/');
        } catch (err: unknown) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error || err.message || 'Failed to confirm borrowing'
                : 'Failed to confirm borrowing';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, {toastId: 'borrow-error'});
            console.error(err);
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#B0DB9C] mb-6">Borrow Books</h1>

            {(error || bookError) && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error || bookError}
                </div>
            )}

            {(loadingCount > 0 || booksLoading) && (
                <div className="text-center text-[#B0DB9C] mb-4">Loading...</div>
            )}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Available Books</h2>
                    <button
                        onClick={refreshBooks}
                        className="bg-[#B0DB9C] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#CAE8BD] disabled:opacity-50"
                        disabled={loadingCount > 0 || booksLoading}
                    >
                        Refresh Books
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books
                        .filter((book) => book.availability)
                        .map((book) => (
                            <BookCard
                                key={book.isbn}
                                data={book}
                                onAddToCart={() => addToBorrowingList(book)}
                                onRemoveFromCart={removeFromBorrowingList}
                            />
                        ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Borrowing List</h2>
                {cartItems.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cartItems.map((item: CartItem) => (
                                <div
                                    key={item.book.isbn}
                                    className="bg-white rounded-3xl shadow-lg p-6 border-2 border-[#ECFAE5]"
                                >
                                    <h3 className="text-lg font-bold text-gray-800">{item.book.title}</h3>
                                    <p className="text-[#B0DB9C] font-semibold">{item.book.author}</p>
                                    <p className="text-gray-600">ISBN: {item.book.isbn}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => dispatch(decreaseQuantity(item.book._id))}
                                                disabled={item.itemCount <= 1}
                                                className="w-8 h-8 bg-[#CAE8BD] text-gray-700 rounded-full disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-[#B0DB9C]">{item.itemCount}</span>
                                            <button
                                                onClick={() => dispatch(increaseQuantity(item.book._id))}
                                                className="w-8 h-8 bg-[#B0DB9C] text-white rounded-full"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromBorrowingList(item.book.isbn)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600"
                                            disabled={loadingCount > 0}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={confirmBorrowing}
                            className="mt-6 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-[#CAE8BD] hover:to-[#B0DB9C] transition-all duration-200 shadow-md hover:shadow-lg"
                            disabled={loadingCount > 0}
                        >
                            Confirm Borrowing
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-600">Your borrowing list is empty.</p>
                )}
            </div>
        </div>
    );
}