import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import {
    BookOpen,
    Search,
    Filter,
    ChevronDown,
    Edit,
    Trash2,
    PlusCircle,
    X,
    Save,
    AlertCircle,
    Tag,
    Calendar,
    User,
    FileText,
    ImageIcon,
    Star
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { backendApi } from '../../../api';
import { getAllBooks } from '../../../slices/bookSlice';
import { addItemToCart } from '../../../slices/cartSlice';
import type { AppDispatch, RootState } from '../../../store/store';
import type { BookData } from '../../../model/BookData';
import type { BookFormData } from '../../../model/ComponentProps';

export function BookPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { list: books, loading: isLoadingBooks } = useSelector((state: RootState) => state.books);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        genre: '',
        year: '',
        availability: 'all'
    });

    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';

    // Form for add/edit modal
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm<BookFormData>();

    const watchCoverImage = watch('coverImage');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Update preview image when coverImage field changes
    useEffect(() => {
        if (watchCoverImage && watchCoverImage.trim() !== '') {
            setPreviewImage(watchCoverImage);
        } else {
            setPreviewImage(null);
        }
    }, [watchCoverImage]);

    // Fetch books on component mount
    useEffect(() => {
        dispatch(getAllBooks());
    }, [dispatch]);

    // Reset form when modal is opened/closed
    useEffect(() => {
        if (isModalOpen) {
            if (selectedBook) {
                // Editing existing book
                setValue('title', selectedBook.title);
                setValue('author', selectedBook.author);
                setValue('isbn', selectedBook.isbn);
                setValue('genre', selectedBook.genre);
                setValue('publicationYear', selectedBook.publicationYear);
                setValue('availability', selectedBook.availability);
                setValue('coverImage', selectedBook.coverImage || '');
            } else {
                // Adding new book
                reset({
                    title: '',
                    author: '',
                    isbn: '',
                    genre: '',
                    publicationYear: new Date().getFullYear(),
                    availability: true,
                    coverImage: ''
                });
            }
        }
    }, [isModalOpen, selectedBook, setValue, reset]);

    // Handle book form submission (add/edit)
    const handleBookSubmit = async (data: BookFormData) => {
        try {
            setIsSubmitting(true);

            const bookData = {
                title: data.title.trim(),
                author: data.author.trim(),
                isbn: data.isbn.trim(),
                genre: data.genre,
                publicationYear: parseInt(data.publicationYear.toString()),
                availability: data.availability,
                coverImage: data.coverImage?.trim() || null
            };

            if (selectedBook) {
                // Update existing book
                await backendApi.put(`/books/update/${selectedBook.isbn}`, bookData);
                toast.success(`Book "${bookData.title}" updated successfully!`);
            } else {
                // Add new book
                await backendApi.post('/books/save', bookData);
                toast.success(`Book "${bookData.title}" added successfully!`);
            }

            // Refresh book list
            dispatch(getAllBooks());
            setIsModalOpen(false);

        } catch (err: unknown) {
            console.error('Error saving book:', err);
            let errorMessage = 'Failed to save book';

            if (err instanceof AxiosError) {
                const errorResponse = err.response?.data as { message?: string };
                errorMessage = errorResponse?.message || err.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle book deletion
    const handleDeleteBook = async () => {
        if (!selectedBook) return;

        try {
            setIsSubmitting(true);
            await backendApi.delete(`/books/delete/${selectedBook.isbn}`);
            toast.success(`Book "${selectedBook.title}" deleted successfully!`);

            // Refresh book list
            dispatch(getAllBooks());
            setIsDeleteModalOpen(false);
            setSelectedBook(null);
        } catch (err: unknown) {
            console.error('Error deleting book:', err);
            let errorMessage = 'Failed to delete book';

            if (err instanceof AxiosError) {
                const errorResponse = err.response?.data as { message?: string };
                errorMessage = errorResponse?.message || err.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle book card click to view details
    const handleBookClick = (book: BookData) => {
        navigate(`/book/${book.isbn}`);
    };

    // Handle add to cart
    const handleAddToCart = (e: React.MouseEvent, book: BookData) => {
        e.stopPropagation(); // Prevent navigating to book details
        if (book.availability) {
            dispatch(addItemToCart(book));
            toast.success(`"${book.title}" added to cart`);
        }
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is handled in filteredBooks
    };

    // Filter books based on search query and filters
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            // Search query
            const matchesSearch =
                searchQuery === '' ||
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

            // Genre filter
            const matchesGenre =
                filters.genre === '' ||
                book.genre.toLowerCase() === filters.genre.toLowerCase();

            // Year filter
            const matchesYear =
                filters.year === '' ||
                book.publicationYear.toString() === filters.year;

            // Availability filter
            const matchesAvailability =
                filters.availability === 'all' ||
                (filters.availability === 'available' && book.availability) ||
                (filters.availability === 'unavailable' && !book.availability);

            return matchesSearch && matchesGenre && matchesYear && matchesAvailability;
        });
    }, [books, searchQuery, filters]);

    // Get unique genres and years for filters
    const uniqueGenres = useMemo(() => {
        const genres = [...new Set(books.map(book => book.genre))];
        return genres.sort();
    }, [books]);

    const uniqueYears = useMemo(() => {
        const years = [...new Set(books.map(book => book.publicationYear.toString()))];
        return years.sort().reverse();
    }, [books]);

    // Get badge class for genre
    const getGenreBadgeClass = (genre: string) => {
        const genreMap: Record<string, string> = {
            'Mystery': 'bg-blue-100 text-blue-800',
            'Classic': 'bg-amber-100 text-amber-800',
            'Novel': 'bg-purple-100 text-purple-800',
            'Fiction': 'bg-green-100 text-green-800',
            'Non-Fiction': 'bg-red-100 text-red-800',
            'Science': 'bg-cyan-100 text-cyan-800',
            'Science Fiction': 'bg-indigo-100 text-indigo-800',
            'Fantasy': 'bg-violet-100 text-violet-800',
            'Romance': 'bg-pink-100 text-pink-800',
            'Thriller': 'bg-orange-100 text-orange-800',
            'Biography': 'bg-emerald-100 text-emerald-800',
            'History': 'bg-yellow-100 text-yellow-800',
            'Technology': 'bg-blue-100 text-blue-800',
            'Education': 'bg-teal-100 text-teal-800'
        };

        return genreMap[genre] || 'bg-gray-100 text-gray-800';
    };

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.3
            }
        }
    };

    // Genre options
    const genreOptions = [
        { value: '', label: 'Select a genre', disabled: true },
        { value: 'Fiction', label: 'Fiction' },
        { value: 'Non-Fiction', label: 'Non-Fiction' },
        { value: 'Mystery', label: 'Mystery' },
        { value: 'Science Fiction', label: 'Science Fiction' },
        { value: 'Fantasy', label: 'Fantasy' },
        { value: 'Romance', label: 'Romance' },
        { value: 'Thriller', label: 'Thriller' },
        { value: 'Biography', label: 'Biography' },
        { value: 'History', label: 'History' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Education', label: 'Education' },
        { value: 'Health & Fitness', label: 'Health & Fitness' },
        { value: 'Travel', label: 'Travel' },
        { value: 'Business', label: 'Business' },
        { value: 'Self-Help', label: 'Self-Help' },
        { value: 'Classic', label: 'Classic' },
        { value: 'Novel', label: 'Novel' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#4A9782]/5 to-[#004030]/10 py-8">
            {/* Header */}
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-[#004030] to-[#4A9782] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                        whileHover={{
                            scale: 1.1,
                            rotateY: 15,
                            boxShadow: "0 20px 40px rgba(0, 64, 48, 0.3)"
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <BookOpen className="w-8 h-8 text-white"/>
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#004030] mb-2">
                        Browse Our <span className="bg-gradient-to-r from-[#004030] to-[#4A9782] bg-clip-text text-transparent">Book Collection</span>
                    </h1>
                    <p className="text-[#004030]/70 text-lg max-w-2xl mx-auto">
                        Explore our extensive library of books across various genres and topics
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#4A9782]/20 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search books by title, author or ISBN..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-[#4A9782]/20 rounded-xl bg-white text-[#004030] placeholder-[#4A9782]/60 focus:border-[#4A9782] focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                                    />
                                    <motion.div
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A9782]"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Search size={18} />
                                    </motion.div>
                                </form>
                            </div>

                            {/* Filter Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="md:w-48"
                            >
                                <button
                                    onClick={() => setFilterOpen(!filterOpen)}
                                    className="w-full px-4 py-3 bg-[#004030] text-white rounded-xl flex items-center justify-center space-x-2 hover:bg-[#00553f] transition-colors duration-200 shadow-md"
                                >
                                    <Filter size={18} />
                                    <span>Filter Books</span>
                                    <motion.div
                                        animate={{ rotate: filterOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown size={18} />
                                    </motion.div>
                                </button>
                            </motion.div>

                            {/* Admin: Add Book Button */}
                            {isAdmin && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="md:w-48"
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedBook(null);
                                            setIsModalOpen(true);
                                        }}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-[#004030] to-[#4A9782] text-white rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 shadow-md"
                                    >
                                        <PlusCircle size={18} />
                                        <span>Add New Book</span>
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Filter Panel */}
                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 mt-4 border-t border-[#4A9782]/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Genre Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-[#004030] mb-2">Genre</label>
                                            <select
                                                value={filters.genre}
                                                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                                                className="w-full px-3 py-2 border-2 border-[#4A9782]/20 rounded-lg focus:border-[#4A9782] focus:outline-none bg-white text-[#004030]"
                                            >
                                                <option value="">All Genres</option>
                                                {uniqueGenres.map((genre) => (
                                                    <option key={genre} value={genre}>
                                                        {genre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Publication Year Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-[#004030] mb-2">Publication Year</label>
                                            <select
                                                value={filters.year}
                                                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                                className="w-full px-3 py-2 border-2 border-[#4A9782]/20 rounded-lg focus:border-[#4A9782] focus:outline-none bg-white text-[#004030]"
                                            >
                                                <option value="">All Years</option>
                                                {uniqueYears.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Availability Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-[#004030] mb-2">Availability</label>
                                            <select
                                                value={filters.availability}
                                                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                                                className="w-full px-3 py-2 border-2 border-[#4A9782]/20 rounded-lg focus:border-[#4A9782] focus:outline-none bg-white text-[#004030]"
                                            >
                                                <option value="all">All Books</option>
                                                <option value="available">Available Only</option>
                                                <option value="unavailable">Unavailable Only</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setFilters({ genre: '', year: '', availability: 'all' });
                                                setSearchQuery('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-[#004030] rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                        >
                                            Clear Filters
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Books Grid */}
                <div className="mb-12">
                    {isLoadingBooks ? (
                        <div className="flex justify-center items-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-12 h-12 border-4 border-[#4A9782]/30 border-t-[#4A9782] rounded-full"
                            />
                            <span className="ml-3 text-[#004030] font-medium">Loading books...</span>
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredBooks.map((book) => (
                                <motion.div
                                    key={book._id}
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    {/* Book Card - Previously BookTab component */}
                                    <motion.div
                                        whileHover={{
                                            y: -8,
                                            boxShadow: "0 20px 25px -5px rgba(0, 64, 48, 0.1), 0 10px 10px -5px rgba(0, 64, 48, 0.04)"
                                        }}
                                        className="relative rounded-lg shadow-md bg-white overflow-hidden cursor-pointer"
                                        onClick={() => handleBookClick(book)}
                                    >
                                        <div className="relative h-48 bg-gray-200">
                                            {book.coverImage ? (
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#004030]/5 to-[#4A9782]/10">
                                                    <svg className="w-12 h-12 text-[#4A9782]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Genre Badge */}
                                            <div className="absolute top-2 right-2">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getGenreBadgeClass(book.genre)}`}>
                                                  {book.genre}
                                                </span>
                                            </div>

                                            {/* Availability Badge */}
                                            <div className="absolute bottom-2 left-2">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${book.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                  {book.availability ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-[#004030] line-clamp-1 mb-1">{book.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">By {book.author}</p>

                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-sm ml-1">{book.averageRating.toFixed(1)}</span>
                                                </div>

                                                <button
                                                    onClick={(e) => handleAddToCart(e, book)}
                                                    disabled={!book.availability}
                                                    className={`${
                                                        book.availability
                                                            ? 'bg-[#004030] hover:bg-[#00553f] text-white'
                                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    } px-3 py-1 rounded-md text-xs font-medium transition-colors`}
                                                >
                                                    {book.availability ? 'Add to Cart' : 'Not Available'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Admin Actions Overlay */}
                                    {isAdmin && (
                                        <div className="absolute top-2 left-2 flex space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1, backgroundColor: "#004030" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBook(book);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 bg-[#004030]/90 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Edit size={16} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBook(book);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2 bg-red-500/90 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-20"
                        >
                            <svg className="w-16 h-16 text-[#4A9782]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            </svg>
                            <h3 className="text-xl font-bold text-[#004030] mb-2">No books found</h3>
                            <p className="text-[#004030]/70">
                                {searchQuery || filters.genre || filters.year || filters.availability !== 'all'
                                    ? "Try adjusting your filters to find more books"
                                    : "There are no books in our collection yet"}
                            </p>
                            {isAdmin && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedBook(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="mt-4 px-6 py-2 bg-[#004030] text-white rounded-xl inline-flex items-center space-x-2 hover:bg-[#00553f] transition-colors duration-200"
                                >
                                    <PlusCircle size={18} />
                                    <span>Add First Book</span>
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-[#4A9782]/20 p-6 mb-8"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-bold text-[#004030]">{books.length}</div>
                            <div className="text-sm text-[#4A9782]">Total Books</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#004030]">{books.filter(b => b.availability).length}</div>
                            <div className="text-sm text-[#4A9782]">Available Books</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#004030]">{uniqueGenres.length}</div>
                            <div className="text-sm text-[#4A9782]">Genres</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#004030]">{uniqueYears.length}</div>
                            <div className="text-sm text-[#4A9782]">Publication Years</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Add/Edit Book Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-2xl shadow-2xl border border-[#4A9782]/20 w-full max-w-3xl max-h-[90vh] overflow-auto"
                        >
                            <div className="p-6 border-b border-[#4A9782]/20">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-[#004030]">
                                        {selectedBook ? 'Edit Book' : 'Add New Book'}
                                    </h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={24} className="text-[#004030]" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmit(handleBookSubmit)} className="space-y-4">
                                    {/* Book Title */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[#004030] font-semibold mb-2">
                                            <BookOpen size={18} />
                                            Book Title *
                                        </label>
                                        <input
                                            {...register('title', {
                                                required: 'Book title is required',
                                                minLength: { value: 2, message: 'Title must be at least 2 characters' },
                                                maxLength: { value: 200, message: 'Title must be less than 200 characters' }
                                            })}
                                            type="text"
                                            placeholder="Enter the book title"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                errors.title
                                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                    : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                            }`}
                                        />
                                        {errors.title && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                <AlertCircle size={16} />
                                                {errors.title.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Author */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[#004030] font-semibold mb-2">
                                            <User size={18} />
                                            Author *
                                        </label>
                                        <input
                                            {...register('author', {
                                                required: 'Author name is required',
                                                minLength: { value: 2, message: 'Author name must be at least 2 characters' },
                                                maxLength: { value: 100, message: 'Author name must be less than 100 characters' }
                                            })}
                                            type="text"
                                            placeholder="Enter the author's name"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                errors.author
                                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                    : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                            }`}
                                        />
                                        {errors.author && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                <AlertCircle size={16} />
                                                {errors.author.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* ISBN & Genre Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-[#004030] font-semibold mb-2">
                                                <FileText size={18} />
                                                ISBN *
                                            </label>
                                            <input
                                                {...register('isbn', {
                                                    required: 'ISBN is required',
                                                    pattern: {
                                                        value: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
                                                        message: 'Please enter a valid ISBN'
                                                    }
                                                })}
                                                type="text"
                                                placeholder="Enter ISBN"
                                                disabled={selectedBook !== null} // Changed from !!selectedBook to selectedBook !== null
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                    selectedBook !== null ? 'bg-gray-100 cursor-not-allowed' : ''
                                                } ${
                                                    errors.isbn
                                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                        : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                                }`}
                                            />
                                            {errors.isbn && (
                                                <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                    <AlertCircle size={16} />
                                                    {errors.isbn.message}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-[#004030] font-semibold mb-2">
                                                <Tag size={18} />
                                                Genre *
                                            </label>
                                            <select
                                                {...register('genre', { required: 'Genre is required' })}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 bg-white ${
                                                    errors.genre
                                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                        : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                                }`}
                                            >
                                                {genreOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disabled}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.genre && (
                                                <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                    <AlertCircle size={16} />
                                                    {errors.genre.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Publication Year */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[#004030] font-semibold mb-2">
                                            <Calendar size={18} />
                                            Publication Year *
                                        </label>
                                        <input
                                            {...register('publicationYear', {
                                                required: 'Publication year is required',
                                                min: { value: 1000, message: 'Year must be after 1000' },
                                                max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                                                valueAsNumber: true
                                            })}
                                            type="number"
                                            placeholder="Enter publication year"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                errors.publicationYear
                                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                    : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                            }`}
                                        />
                                        {errors.publicationYear && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                <AlertCircle size={16} />
                                                {errors.publicationYear.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Cover Image URL */}
                                    <div>
                                        <label className="flex items-center gap-2 text-[#004030] font-semibold mb-2">
                                            <ImageIcon size={18} />
                                            Cover Image URL (Optional)
                                        </label>
                                        <input
                                            {...register('coverImage', {
                                                pattern: {
                                                    value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                                                    message: 'Please enter a valid image URL (jpg, jpeg, png, gif, webp)'
                                                }
                                            })}
                                            type="url"
                                            placeholder="https://example.com/book-cover.jpg"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                errors.coverImage
                                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                    : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                            }`}
                                        />
                                        {errors.coverImage && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                <AlertCircle size={16} />
                                                {errors.coverImage.message}
                                            </div>
                                        )}

                                        {/* Image Preview */}
                                        {previewImage && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                                <img
                                                    src={previewImage}
                                                    alt="Cover preview"
                                                    className="w-24 h-32 object-cover rounded-lg shadow-md"
                                                    onError={() => setPreviewImage(null)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Availability Toggle */}
                                    <div>
                                        <label className="flex items-center gap-3 text-[#004030] font-semibold cursor-pointer bg-[#4A9782]/5 p-4 rounded-xl border border-[#4A9782]/20 hover:bg-[#4A9782]/10 transition-colors duration-200">
                                            <input
                                                {...register('availability')}
                                                type="checkbox"
                                                className="w-5 h-5 text-[#4A9782] border-[#4A9782]/30 rounded focus:ring-[#4A9782]/50 focus:ring-2"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Star size={18} className="text-[#4A9782]" />
                                                <span>Book is available for borrowing</span>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-2">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-300"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 64, 48, 0.2)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 py-3 px-6 bg-gradient-to-r from-[#004030] to-[#4A9782] text-white rounded-xl font-medium shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                                    />
                                                    <span>{selectedBook ? 'Updating...' : 'Saving...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    <span>{selectedBook ? 'Update Book' : 'Save Book'}</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-red-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-red-600">Delete Book</h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={24} className="text-gray-500" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="mb-4 text-gray-700">
                                        Are you sure you want to delete the following book?
                                    </p>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <h4 className="font-bold text-[#004030]">{selectedBook.title}</h4>
                                        <p className="text-sm text-gray-600">by {selectedBook.author}</p>
                                        <p className="text-sm text-gray-500">ISBN: {selectedBook.isbn}</p>
                                    </div>
                                    <p className="mt-4 text-red-500 text-sm">This action cannot be undone.</p>
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDeleteBook}
                                        className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-medium shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                                />
                                                <span>Deleting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={18} />
                                                <span>Delete Book</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}