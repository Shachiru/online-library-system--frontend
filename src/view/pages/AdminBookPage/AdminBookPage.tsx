import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {motion, type Variants} from 'framer-motion';
import {toast} from 'react-toastify';
import {AxiosError} from 'axios';
import {
    BookOpen,
    Save,
    Calendar,
    User,
    Tag,
    FileText,
    Image as ImageIcon,
    ArrowLeft,
    Check,
    AlertCircle,
    Star,
    BookmarkPlus
} from 'lucide-react';
import {backendApi} from '../../../api';
import type {
    AdminBookSaveProps,
    BookFormData,
    BookFormHandlers
} from '../../../model/ComponentProps';

// Component props interface
interface AdminBookSaveComponentProps extends AdminBookSaveProps {
    className?: string;
    showPreview?: boolean;
}

// Error response interface
interface ErrorResponse {
    message?: string;
}

export function AdminBookPage({
                                  initialData,
                                  onSave,
                                  onCancel,
                                  isEditing = false,
                                  className = '',
                                  showPreview = true
                              }: AdminBookSaveComponentProps = {}) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch
    } = useForm<BookFormData>({
        defaultValues: {
            title: initialData?.title || '',
            author: initialData?.author || '',
            isbn: initialData?.isbn || '',
            genre: initialData?.genre || '',
            publicationYear: initialData?.publicationYear || new Date().getFullYear(),
            availability: initialData?.availability ?? true,
            coverImage: initialData?.coverImage || ''
        }
    });

    const watchCoverImage = watch('coverImage');

    // Check if user is admin
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            toast.error('Access denied. Admin privileges required.');
            navigate('/');
        }
    }, [navigate]);

    // Update preview image when coverImage field changes
    useEffect(() => {
        if (watchCoverImage && watchCoverImage.trim() !== '') {
            setPreviewImage(watchCoverImage);
        } else {
            setPreviewImage(null);
        }
    }, [watchCoverImage]);

    const formHandlers: BookFormHandlers = {
        onSubmit: async (data: BookFormData) => {
            try {
                setIsLoading(true);

                const bookData = {
                    title: data.title.trim(),
                    author: data.author.trim(),
                    isbn: data.isbn.trim(),
                    genre: data.genre,
                    publicationYear: parseInt(data.publicationYear.toString()),
                    availability: data.availability,
                    coverImage: data.coverImage?.trim() || null
                };

                let response;
                if (isEditing && initialData?._id) {
                    response = await backendApi.put(`/books/update/${initialData.isbn}`, bookData);
                } else {
                    response = await backendApi.post('/books/save', bookData);
                }

                if (response.status === 201 || response.status === 200) {
                    setIsSuccess(true);
                    const successMessage = isEditing
                        ? `Book "${bookData.title}" updated successfully!`
                        : `Book "${bookData.title}" saved successfully!`;
                    toast.success(successMessage);

                    if (onSave) {
                        onSave(response.data);
                    }

                    // Reset form after success if not editing
                    if (!isEditing) {
                        setTimeout(() => {
                            formHandlers.onReset();
                        }, 2000);
                    }
                }
            } catch (err: unknown) {
                console.error('Error saving book:', err);
                let errorMessage = 'Failed to save book';

                if (err instanceof AxiosError) {
                    const errorResponse = err.response?.data as ErrorResponse;
                    errorMessage = errorResponse?.message || err.message || errorMessage;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }

                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },

        onReset: () => {
            reset({
                title: '',
                author: '',
                isbn: '',
                genre: '',
                publicationYear: new Date().getFullYear(),
                availability: true,
                coverImage: ''
            });
            setPreviewImage(null);
            setIsSuccess(false);
            setIsLoading(false);
        },

        onFieldChange: (field: string, value: unknown) => {
            // Handle real-time field changes if needed
            console.log(`Field ${field} changed to:`, value);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate('/');
        }
    };

    // Animation variants
    const containerVariants: Variants = {
        hidden: {opacity: 0, y: 30},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.5}
        }
    };

    // Fixed animation object - moved to useMemo to prevent recreation
    const floatingAnimation = {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };

    const secondFloatingAnimation = {
        y: [10, -10, 10],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1
        }
    };

    // Genre options
    const genreOptions = [
        {value: '', label: 'Select a genre', disabled: true},
        {value: 'Fiction', label: 'Fiction'},
        {value: 'Non-Fiction', label: 'Non-Fiction'},
        {value: 'Mystery', label: 'Mystery'},
        {value: 'Science Fiction', label: 'Science Fiction'},
        {value: 'Fantasy', label: 'Fantasy'},
        {value: 'Romance', label: 'Romance'},
        {value: 'Thriller', label: 'Thriller'},
        {value: 'Biography', label: 'Biography'},
        {value: 'History', label: 'History'},
        {value: 'Technology', label: 'Technology'},
        {value: 'Education', label: 'Education'},
        {value: 'Health & Fitness', label: 'Health & Fitness'},
        {value: 'Travel', label: 'Travel'},
        {value: 'Business', label: 'Business'},
        {value: 'Self-Help', label: 'Self-Help'}
    ];

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-white via-[#4A9782]/5 to-[#004030]/10 py-8 relative overflow-hidden ${className}`}>
            {/* Background decorative elements */}
            <motion.div
                animate={floatingAnimation}
                className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-[#4A9782]/20 to-[#004030]/20 rounded-xl rotate-12 blur-sm"
            />
            <motion.div
                animate={secondFloatingAnimation}
                className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-[#004030]/20 to-[#4A9782]/20 rounded-full blur-sm"
            />

            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <motion.button
                        variants={itemVariants}
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-[#004030] hover:text-[#4A9782] transition-colors duration-200 mb-6 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-md hover:shadow-lg border border-gray-200/50"
                        whileHover={{x: -5, scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        <ArrowLeft size={20}/>
                        <span className="font-medium">Back to Dashboard</span>
                    </motion.button>

                    <motion.div variants={itemVariants} className="text-center">
                        <motion.div
                            className="w-20 h-20 bg-gradient-to-br from-[#004030] to-[#4A9782] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                            whileHover={{
                                scale: 1.1,
                                rotateY: 15,
                                boxShadow: "0 20px 40px rgba(0, 64, 48, 0.3)"
                            }}
                            style={{transformStyle: "preserve-3d"}}
                        >
                            <BookmarkPlus className="w-10 h-10 text-white"/>
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#004030] mb-3">
                            {isEditing ? 'Edit Book Details' : 'Add New Book to Library'}
                        </h1>
                        <p className="text-[#004030]/70 text-lg max-w-xl mx-auto">
                            {isEditing
                                ? 'Update the book information in your library collection'
                                : 'Expand our collection by adding a new book with all the necessary details'
                            }
                        </p>
                    </motion.div>
                </motion.div>

                {/* Form */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#4A9782]/20 overflow-hidden"
                >
                    <div className="p-8">
                        <form onSubmit={handleSubmit(formHandlers.onSubmit)} className="space-y-6">
                            {/* Book Title */}
                            <motion.div variants={itemVariants}>
                                <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                    <BookOpen size={18}/>
                                    Book Title *
                                </label>
                                <input
                                    {...register('title', {
                                        required: 'Book title is required',
                                        minLength: {value: 2, message: 'Title must be at least 2 characters'},
                                        maxLength: {value: 200, message: 'Title must be less than 200 characters'}
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
                                    <motion.div
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                    >
                                        <AlertCircle size={16}/>
                                        {errors.title.message}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Author */}
                            <motion.div variants={itemVariants}>
                                <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                    <User size={18}/>
                                    Author *
                                </label>
                                <input
                                    {...register('author', {
                                        required: 'Author name is required',
                                        minLength: {value: 2, message: 'Author name must be at least 2 characters'},
                                        maxLength: {value: 100, message: 'Author name must be less than 100 characters'}
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
                                    <motion.div
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                    >
                                        <AlertCircle size={16}/>
                                        {errors.author.message}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* ISBN & Genre Row */}
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                        <FileText size={18}/>
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
                                        placeholder="Enter ISBN (e.g., 978-0-123456-78-9)"
                                        disabled={isEditing} // Usually ISBN shouldn't be changed when editing
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                            isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                                        } ${
                                            errors.isbn
                                                ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                        }`}
                                    />
                                    {errors.isbn && (
                                        <motion.div
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                        >
                                            <AlertCircle size={16}/>
                                            {errors.isbn.message}
                                        </motion.div>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                        <Tag size={18}/>
                                        Genre *
                                    </label>
                                    <select
                                        {...register('genre', {required: 'Genre is required'})}
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
                                        <motion.div
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                        >
                                            <AlertCircle size={16}/>
                                            {errors.genre.message}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Publication Year */}
                            <motion.div variants={itemVariants}>
                                <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                    <Calendar size={18}/>
                                    Publication Year *
                                </label>
                                <input
                                    {...register('publicationYear', {
                                        required: 'Publication year is required',
                                        min: {value: 1000, message: 'Year must be after 1000'},
                                        max: {value: new Date().getFullYear(), message: 'Year cannot be in the future'},
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
                                    <motion.div
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                    >
                                        <AlertCircle size={16}/>
                                        {errors.publicationYear.message}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Cover Image URL */}
                            <motion.div variants={itemVariants}>
                                <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                    <ImageIcon size={18}/>
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
                                    <motion.div
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                    >
                                        <AlertCircle size={16}/>
                                        {errors.coverImage.message}
                                    </motion.div>
                                )}

                                {/* Image Preview */}
                                {showPreview && previewImage && (
                                    <motion.div
                                        initial={{opacity: 0, scale: 0.9}}
                                        animate={{opacity: 1, scale: 1}}
                                        className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                                    >
                                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                        <img
                                            src={previewImage}
                                            alt="Cover preview"
                                            className="w-24 h-32 object-cover rounded-lg shadow-md"
                                            onError={() => setPreviewImage(null)}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Availability Toggle */}
                            <motion.div variants={itemVariants}>
                                <label
                                    className="flex items-center gap-3 text-[#004030] font-semibold cursor-pointer bg-[#4A9782]/5 p-4 rounded-xl border border-[#4A9782]/20 hover:bg-[#4A9782]/10 transition-colors duration-200">
                                    <input
                                        {...register('availability')}
                                        type="checkbox"
                                        className="w-5 h-5 text-[#4A9782] border-[#4A9782]/30 rounded focus:ring-[#4A9782]/50 focus:ring-2"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Star size={18} className="text-[#4A9782]"/>
                                        <span>Book is available for borrowing</span>
                                    </div>
                                </label>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div variants={itemVariants} className="pt-6">
                                <div className="flex gap-4">
                                    {isEditing && (
                                        <motion.button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-300"
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                        >
                                            Cancel
                                        </motion.button>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || isSuccess}
                                        className={`${isEditing ? 'flex-1' : 'w-full'} bg-gradient-to-r from-[#004030] to-[#4A9782] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg`}
                                        whileHover={!isLoading && !isSuccess ? {
                                            scale: 1.02,
                                            boxShadow: "0 20px 40px rgba(0, 64, 48, 0.3)",
                                            rotateY: 5
                                        } : {}}
                                        whileTap={!isLoading && !isSuccess ? {scale: 0.98} : {}}
                                        style={{transformStyle: "preserve-3d"}}
                                    >
                                        {isLoading ? (
                                            <>
                                                <motion.div
                                                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                                    animate={{rotate: 360}}
                                                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                                />
                                                {isEditing ? 'Updating Book...' : 'Saving Book...'}
                                            </>
                                        ) : isSuccess ? (
                                            <>
                                                <motion.div
                                                    initial={{scale: 0}}
                                                    animate={{scale: 1}}
                                                    transition={{type: "spring", stiffness: 500, damping: 30}}
                                                >
                                                    <Check size={20}/>
                                                </motion.div>
                                                {isEditing ? 'Book Updated Successfully!' : 'Book Saved Successfully!'}
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20}/>
                                                {isEditing ? 'Update Book' : 'Save Book to Library'}
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8 text-center"
                >
                    <p className="text-[#004030]/60 text-sm">
                        All fields marked with * are required. The book will be immediately available in the library
                        once saved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}