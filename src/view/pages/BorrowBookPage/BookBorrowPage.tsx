import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { BookCard } from '../../common/BookCard/BookCard';
import { backendApi } from '../../../api';
import type { BookData } from "../../../model/BookData";
import type { AppDispatch, RootState } from "../../../store/store";
import { getAllBooks } from "../../../slices/bookSlice";
import { addItemToCart, clearCart } from "../../../slices/cartSlice";
import { AxiosError } from 'axios';

interface Transaction {
    _id: string;
    userId: string;
    bookId: string;
    status: 'borrowed' | 'returned';
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    book?: BookData;
}

export function BorrowBookPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list: books, error: bookError, loading: booksLoading } = useSelector((state: RootState) => state.books);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loadingCount, setLoadingCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [borrowedBooks, setBorrowedBooks] = useState<Transaction[]>([]);
    const [isFetchingBorrowedBooks, setIsFetchingBorrowedBooks] = useState(false);
    const [isFetchingBorrowingList, setIsFetchingBorrowingList] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataInitialized, setDataInitialized] = useState(false);
    const isMounted = useRef(true);
    const borrowedBooksUpdated = useRef(false);

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

    const fetchBorrowedBooks = useCallback(async () => {
        try {
            setIsFetchingBorrowedBooks(true);
            borrowedBooksUpdated.current = false;

            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                console.log("Token or userId missing, skipping borrowed books fetch");
                return;
            }

            console.log("Fetching borrowed books for user:", userId);
            const response = await backendApi.get(`/transactions/user/${userId}`);
            console.log("Transactions response:", response.data);

            // Get borrowed books (filter out returned books)
            const activeBorrowings = response.data.filter(
                (transaction: Transaction) => transaction.status === 'borrowed'
            );
            console.log("Active borrowings:", activeBorrowings.length);

            // First try to fetch all book details in a single request
            const bookIds = activeBorrowings.map((t: Transaction) => t.bookId).join(',');
            const bookDetails: Record<string, BookData> = {};

            try {
                if (bookIds) {
                    const booksResponse = await backendApi.get(`/books/batch?ids=${bookIds}`);
                    const fetchedBooks = booksResponse.data;

                    // Create a lookup map
                    fetchedBooks.forEach((book: BookData) => {
                        bookDetails[book._id] = book;
                    });
                    console.log("Fetched book details in batch:", Object.keys(bookDetails).length);
                }
            } catch {
                console.warn("Could not fetch books in batch, falling back to individual fetches");
            }

            // Map transaction data with book details
            const borrowedWithDetails = await Promise.all(
                activeBorrowings.map(async (transaction: Transaction) => {
                    try {
                        // First check if we already have this book from batch fetch
                        let book = bookDetails[transaction.bookId];

                        if (!book) {
                            const foundBook = books.find(b => b._id === transaction.bookId);
                            if (foundBook) {
                                book = foundBook;
                            }
                        }

                        // If still not found, fetch individually
                        if (!book) {
                            console.log(`Fetching individual book: ${transaction.bookId}`);
                            const bookResponse = await backendApi.get(`/books/${transaction.bookId}`);
                            book = bookResponse.data;
                        }

                        return { ...transaction, book };
                    } catch (err) {
                        console.error(`Failed to fetch details for book ${transaction.bookId}`, err);
                        return transaction;
                    }
                })
            );

            console.log("Processed borrowed books:", borrowedWithDetails.length);

            if (isMounted.current) {
                setBorrowedBooks(borrowedWithDetails);
                borrowedBooksUpdated.current = true;
            }
        } catch (err) {
            console.error("Error fetching borrowed books:", err);
        } finally {
            if (isMounted.current) {
                setIsFetchingBorrowedBooks(false);
            }
        }
    }, [books]);

    const fetchBorrowingList = useCallback(async () => {
        // Prevent multiple simultaneous fetches
        if (isFetchingBorrowingList) return;

        try {
            setIsFetchingBorrowingList(true);
            startLoading();

            if (isMounted.current) setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                const authError = 'Please log in to view your borrowing list';
                if (isMounted.current) setError(authError);
                toast.error(authError, { toastId: 'fetch-borrowing-auth-error' });
                navigate('/auth');
                return;
            }

            try {
                console.log("Fetching borrowing list...");
                const response = await backendApi.get('/borrowing-list');

                // Handle successful response
                dispatch(clearCart());

                if (response.data &&
                    response.data.books &&
                    Array.isArray(response.data.books) &&
                    response.data.books.length > 0) {

                    console.log(`Adding ${response.data.books.length} books to cart`);
                    response.data.books.forEach((book: BookData) => {
                        dispatch(addItemToCart(book));
                    });
                }
            } catch (err) {
                // Handle 404 case (no borrowing list yet) silently
                if (err instanceof AxiosError && err.response?.status === 404) {
                    dispatch(clearCart());
                } else if (err instanceof AxiosError && (err.response?.status === 401 || err.response?.status === 403)) {
                    // Handle auth errors
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    navigate('/auth');
                } else {
                    // Log other errors but don't display to user
                    console.error("Error fetching borrowing list:", err);
                }
            }
        } finally {
            stopLoading();
            if (isMounted.current) {
                setIsFetchingBorrowingList(false);
            }
        }
    }, [dispatch, navigate, isFetchingBorrowingList]);

    const refreshBooks = async () => {
        try {
            startLoading();
            if (isMounted.current) setError(null);
            await dispatch(getAllBooks()).unwrap();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh book list';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, { toastId: 'refresh-books-error' });
        } finally {
            stopLoading();
        }
    };

    // Initial data loading - only once
    useEffect(() => {
        // Skip if already initialized
        if (dataInitialized) return;

        const loadInitialData = async () => {
            try {
                startLoading();

                // Load books first
                await dispatch(getAllBooks()).unwrap();

                // Then load borrowing list
                await fetchBorrowingList();

                // Finally load borrowed books
                await fetchBorrowedBooks();

                setDataInitialized(true);
            } catch (err) {
                console.error("Error loading initial data:", err);
            } finally {
                stopLoading();
            }
        };

        // Handle the promise returned by loadInitialData
        loadInitialData().catch(err => {
            console.error("Failed to load initial data:", err);
        });
    }, [dispatch, fetchBorrowingList, fetchBorrowedBooks, dataInitialized]);

    const addToBorrowingList = async (book: BookData) => {
        try {
            startLoading();
            if (isMounted.current) setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                const authError = 'Please log in to add books to your borrowing list';
                if (isMounted.current) setError(authError);
                toast.error(authError, { toastId: 'add-borrowing-auth-error' });
                navigate('/auth');
                return;
            }

            await backendApi.post('/borrowing-list/add', { isbn: book.isbn });
            dispatch(addItemToCart(book));
            toast.success(`"${book.title}" added to borrowing list!`, { toastId: `add-book-${book.isbn}` });
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
                    toast.error(errorMessage, { toastId: `add-book-error-${book.isbn}` });
                }
            }
            if (isMounted.current) setError(errorMessage);
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
                toast.error(authError, { toastId: 'remove-borrowing-auth-error' });
                navigate('/auth');
                return;
            }

            await backendApi.delete(`/borrowing-list/remove/${isbn}`);

            // Instead of refreshing the whole borrowing list,
            // just remove the item from the cart directly
            await fetchBorrowingList();

            toast.success('Book removed from borrowing list!', { toastId: `remove-book-${isbn}` });
            await dispatch(getAllBooks()).unwrap();
        } catch (err: unknown) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error || err.message || 'Failed to remove book from borrowing list'
                : 'Failed to remove book from borrowing list';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, { toastId: `remove-book-error-${isbn}` });
        } finally {
            stopLoading();
        }
    };

    const confirmBorrowing = async () => {
        if (cartItems.length === 0) {
            toast.warn('Your borrowing list is empty!', { toastId: 'empty-cart' });
            return;
        }

        try {
            setIsSubmitting(true);
            if (isMounted.current) setError(null);
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) {
                const authError = 'User not authenticated. Please log in.';
                if (isMounted.current) setError(authError);
                toast.error(authError, { toastId: 'auth-error' });
                navigate('/auth');
                return;
            }

            console.log(`Processing ${cartItems.length} books for borrowing...`);

            // Process each book in the borrowing list
            for (const item of cartItems) {
                await backendApi.post('/transactions/borrow', {
                    userId,
                    bookId: item.book._id
                });
                console.log(`Borrowed: ${item.book.title}`);
            }

            toast.success('All books borrowed successfully!', { toastId: 'borrow-success' });

            // Clear the borrowing list
            dispatch(clearCart());

            // Refresh books and borrowed books
            await dispatch(getAllBooks()).unwrap();

            // Important: Add a small delay before fetching borrowed books
            // to ensure the backend has time to process the transactions
            setTimeout(async () => {
                await fetchBorrowedBooks();
            }, 500);

        } catch (err: unknown) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error || err.message || 'Failed to confirm borrowing'
                : 'Failed to confirm borrowing';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, { toastId: 'borrow-error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const returnBook = async (transactionId: string, bookTitle: string) => {
        try {
            setIsSubmitting(true);
            if (isMounted.current) setError(null);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                const authError = 'User not authenticated. Please log in.';
                if (isMounted.current) setError(authError);
                toast.error(authError, { toastId: 'auth-error' });
                navigate('/auth');
                return;
            }

            console.log(`Returning book: ${bookTitle}, Transaction ID: ${transactionId}`);
            await backendApi.post('/transactions/return', {
                transactionId,
                userId
            });

            toast.success(`"${bookTitle}" returned successfully!`, { toastId: `return-${transactionId}` });

            // Add a small delay before refreshing to ensure the backend has processed the return
            setTimeout(async () => {
                // Refresh the borrowed books list and book availability
                await fetchBorrowedBooks();
                await dispatch(getAllBooks()).unwrap();
            }, 500);

        } catch (err: unknown) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error || err.message || 'Failed to return book'
                : 'Failed to return book';
            if (isMounted.current) setError(errorMessage);
            toast.error(errorMessage, { toastId: 'return-error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle manual refresh of all data
    const handleRefresh = async () => {
        try {
            startLoading();
            await dispatch(getAllBooks()).unwrap();
            await fetchBorrowingList();
            await fetchBorrowedBooks();
            toast.info('Data refreshed successfully');
        } catch (err) {
            console.error('Error refreshing data:', err);
            toast.error('Failed to refresh data');
        } finally {
            stopLoading();
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[#004030] mb-2">Library Management</h1>
                <p className="text-[#4A9782] text-lg">Browse, borrow, and manage your books</p>
            </motion.div>

            {/* Manual Refresh Button */}
            <motion.div
                className="mb-6 flex justify-end"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={handleRefresh}
                    disabled={loadingCount > 0 || booksLoading}
                    className="bg-[#4A9782] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#004030] transition-colors duration-300 disabled:opacity-50"
                >
                    {loadingCount > 0 ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                        />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )}
                    <span>{loadingCount > 0 ? 'Refreshing...' : 'Refresh Data'}</span>
                </button>
            </motion.div>

            {(error || bookError) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error || bookError}</span>
                    </div>
                </motion.div>
            )}

            {/* Currently Borrowed Books Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-12 bg-white rounded-xl shadow-lg border border-[#4A9782]/20 overflow-hidden"
            >
                <div className="border-b border-[#4A9782]/20 bg-gradient-to-r from-[#004030]/5 to-[#4A9782]/5 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-[#004030] flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                Currently Borrowed Books
                            </h2>
                            <p className="text-[#4A9782] ml-8">Books you have checked out from the library</p>
                        </div>

                        {/* Refresh borrowed books button */}
                        <button
                            onClick={fetchBorrowedBooks}
                            disabled={isFetchingBorrowedBooks}
                            className="text-[#004030] hover:text-[#4A9782] p-2 rounded-full transition-colors duration-200"
                        >
                            <svg className={`w-5 h-5 ${isFetchingBorrowedBooks ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {isFetchingBorrowedBooks ? (
                        <div className="flex justify-center items-center py-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-10 h-10 border-4 border-[#4A9782]/30 border-t-[#4A9782] rounded-full"
                            />
                            <span className="ml-3 text-[#4A9782] font-medium">Loading your borrowed books...</span>
                        </div>
                    ) : borrowedBooks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {borrowedBooks.map((transaction) => (
                                <motion.div
                                    key={transaction._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                    }}
                                    className="bg-gradient-to-r from-[#004030]/5 to-[#4A9782]/5 rounded-xl border border-[#4A9782]/20 shadow-md overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Book cover */}
                                        {transaction.book?.coverImage ? (
                                            <div className="w-full md:w-1/3 h-48 md:h-auto">
                                                <img
                                                    src={transaction.book.coverImage}
                                                    alt={transaction.book?.title || 'Book cover'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-[#004030]/10 to-[#4A9782]/10 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-[#4A9782]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Book details */}
                                        <div className="p-6 flex-1">
                                            <h3 className="text-xl font-bold text-[#004030] mb-2">
                                                {transaction.book?.title || 'Unknown Title'}
                                            </h3>
                                            <p className="text-[#4A9782] font-medium">
                                                {transaction.book?.author || 'Unknown Author'}
                                            </p>

                                            <div className="mt-4 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Borrowed On:</span>
                                                    <span className="font-medium text-[#004030]">{formatDate(transaction.borrowDate)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Due By:</span>
                                                    <span className="font-medium text-red-600">{formatDate(transaction.dueDate)}</span>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => returnBook(transaction._id, transaction.book?.title || 'book')}
                                                    disabled={isSubmitting}
                                                    className="w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white py-2.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:from-[#4A9782] hover:to-[#004030] disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                                className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                                                            />
                                                            <span>Returning...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                            </svg>
                                                            <span>Return Book</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-[#004030]/5 rounded-xl">
                            <svg className="w-16 h-16 text-[#4A9782]/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="text-xl font-bold text-[#004030] mb-2">No Books Borrowed</h3>
                            <p className="text-[#4A9782]">
                                You don&apos;t have any borrowed books yet.<br />
                                Browse our collection below to find books to borrow.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Borrowing List Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12 bg-white rounded-xl shadow-lg border border-[#4A9782]/20 overflow-hidden"
            >
                <div className="border-b border-[#4A9782]/20 bg-gradient-to-r from-[#004030]/5 to-[#4A9782]/5 p-6">
                    <h2 className="text-2xl font-bold text-[#004030] flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Your Borrowing List
                    </h2>
                    <p className="text-[#4A9782] ml-8">Books you want to borrow</p>
                </div>

                <div className="p-6">
                    {isFetchingBorrowingList ? (
                        <div className="flex justify-center items-center py-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-10 h-10 border-4 border-[#4A9782]/30 border-t-[#4A9782] rounded-full"
                            />
                            <span className="ml-3 text-[#4A9782] font-medium">Loading your borrowing list...</span>
                        </div>
                    ) : cartItems.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.book._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-xl border border-[#4A9782]/20 shadow-md overflow-hidden"
                                    >
                                        {/* Book Cover */}
                                        <div className="h-48 bg-gradient-to-br from-[#004030]/5 to-[#4A9782]/5 relative">
                                            <img
                                                src={item.book.coverImage || "https://via.placeholder.com/200x280/4A9782/white?text=LibraryHub"}
                                                alt={item.book.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-white/90 text-[#004030] px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                                    {item.book.genre}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-[#004030] text-lg mb-1">{item.book.title}</h3>
                                            <p className="text-sm text-[#4A9782]">by {item.book.author}</p>

                                            <div className="mt-4 flex justify-end">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => removeFromBorrowingList(item.book.isbn)}
                                                    disabled={loadingCount > 0}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={confirmBorrowing}
                                    disabled={isSubmitting || cartItems.length === 0}
                                    className="bg-gradient-to-r from-[#004030] to-[#4A9782] text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:from-[#4A9782] hover:to-[#004030] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                            />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Confirm Borrowing</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-[#004030]/5 rounded-xl">
                            <svg className="w-16 h-16 text-[#4A9782]/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-xl font-bold text-[#004030] mb-2">Your Borrowing List is Empty</h3>
                            <p className="text-[#4A9782] mb-4">Add books from the collection below to your borrowing list.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Available Books Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#004030] flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        Available Books
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={refreshBooks}
                        disabled={loadingCount > 0 || booksLoading}
                        className="bg-[#004030] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00553f] disabled:opacity-50 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </motion.button>
                </div>

                {(loadingCount > 0 || booksLoading) ? (
                    <div className="flex justify-center items-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-12 h-12 border-4 border-[#4A9782]/30 border-t-[#4A9782] rounded-full"
                        />
                        <span className="ml-3 text-[#4A9782] font-medium">Loading books...</span>
                    </div>
                ) : books.filter(book => book.availability).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books
                            .filter(book => book.availability)
                            .map(book => (
                                <BookCard
                                    key={book._id}
                                    data={book}
                                    onAddToCart={() => addToBorrowingList(book)}
                                    onRemoveFromCart={removeFromBorrowingList}
                                />
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md border border-[#4A9782]/10">
                        <svg className="w-16 h-16 text-[#4A9782]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                        <h3 className="text-xl font-bold text-[#004030] mb-2">No Available Books</h3>
                        <p className="text-[#4A9782]">
                            There are currently no available books in our collection.<br />
                            Please check back later or contact a librarian for assistance.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}