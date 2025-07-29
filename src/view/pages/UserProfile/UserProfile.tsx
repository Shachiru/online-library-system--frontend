import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {motion, AnimatePresence, type Variants} from 'framer-motion';
import {toast} from 'react-toastify';
import {AxiosError} from 'axios';
import {
    User,
    Mail,
    Lock,
    Edit3,
    Save,
    X,
    Trash2,
    Eye,
    EyeOff,
    Shield,
    Calendar,
    ArrowLeft,
    UserCheck,
    AlertTriangle
} from 'lucide-react';
import {backendApi} from '../../../api';
import type {
    UserProfileFormData,
    UserProfileProps
} from '../../../model/ComponentProps';
import {DeleteConfirmationModal} from '../../common/DeleteConfirmationModal/DeleteConfirmationModal';

interface ErrorResponse {
    message?: string;
}

interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
}

export function UserProfile({
                                user,
                                onUpdate,
                                onDelete,
                                isModal = false,
                                onClose
                            }: UserProfileProps) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch,
        setValue
    } = useForm<UserProfileFormData>({
        defaultValues: {
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const watchNewPassword = watch('newPassword');

    useEffect(() => {
        reset({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    }, [user, reset]);

    const handleUpdateProfile = async (data: UserProfileFormData) => {
        try {
            setIsLoading(true);

            const updateData: UpdateUserPayload = {
                name: data.name.trim(),
                email: data.email.trim(),
            };

            if (data.newPassword && data.currentPassword) {
                updateData.password = data.newPassword;
            }

            const response = await backendApi.put(`/auth/update/${user._id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                const updatedUser = response.data;
                toast.success('Profile updated successfully!');

                // Update localStorage if name changed
                if (updatedUser.name !== user.name) {
                    localStorage.setItem('username', updatedUser.name);
                }

                if (onUpdate) {
                    onUpdate(updatedUser);
                }

                setIsEditing(false);
                setValue('currentPassword', '');
                setValue('newPassword', '');
                setValue('confirmPassword', '');
            }
        } catch (err: unknown) {
            console.error('Error updating profile:', err);
            let errorMessage = 'Failed to update profile';

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
    };

    const handleDeleteProfile = async () => {
        try {
            setIsDeleting(true);

            const response = await backendApi.delete(`/auth/delete/${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                toast.success('Profile deleted successfully!');

                ['token', 'refreshToken', 'username', 'role', 'userId'].forEach(key => {
                    localStorage.removeItem(key);
                });

                if (onDelete) {
                    onDelete();
                } else {
                    navigate('/login');
                }
            }
        } catch (err: unknown) {
            console.error('Error deleting profile:', err);
            let errorMessage = 'Failed to delete profile';

            if (err instanceof AxiosError) {
                const errorResponse = err.response?.data as ErrorResponse;
                errorMessage = errorResponse?.message || err.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
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

    const cardVariants: Variants = {
        hidden: {opacity: 0, scale: 0.95, rotateY: -10},
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.5,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ProfileContent = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
                <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-[#004030] to-[#4A9782] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                    whileHover={{
                        scale: 1.1,
                        rotateY: 15,
                        boxShadow: "0 20px 40px rgba(0, 64, 48, 0.3)"
                    }}
                    style={{transformStyle: "preserve-3d"}}
                >
                    <User className="w-12 h-12 text-white"/>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#004030] mb-2">
                    {isEditing ? 'Edit Profile' : 'User Profile'}
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin'
                            ? 'bg-[#004030]/10 text-[#004030]'
                            : 'bg-[#4A9782]/10 text-[#4A9782]'
                    }`}>
                        {user.role === 'admin' ? (
                            <div className="flex items-center gap-1">
                                <Shield size={14}/>
                                Administrator
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <UserCheck size={14}/>
                                User
                            </div>
                        )}
                    </span>
                </div>
            </motion.div>

            {/* Profile Form/Display */}
            <motion.div
                variants={cardVariants}
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#4A9782]/20 overflow-hidden"
            >
                <div className="p-6">
                    <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
                        {/* Name Field */}
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                <User size={18}/>
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {value: 2, message: 'Name must be at least 2 characters'}
                                    })}
                                    type="text"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                        errors.name
                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                            : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                    }`}
                                />
                            ) : (
                                <div
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-[#004030]">
                                    {user.name}
                                </div>
                            )}
                            {errors.name && (
                                <motion.p
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                >
                                    <AlertTriangle size={16}/>
                                    {errors.name.message}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Email Field */}
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-[#004030] font-semibold mb-3">
                                <Mail size={18}/>
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                        errors.email
                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                            : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                    }`}
                                />
                            ) : (
                                <div
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-[#004030]">
                                    {user.email}
                                </div>
                            )}
                            {errors.email && (
                                <motion.p
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    className="flex items-center gap-2 text-red-500 text-sm mt-2"
                                >
                                    <AlertTriangle size={16}/>
                                    {errors.email.message}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Password Change Section */}
                        {isEditing && (
                            <motion.div
                                variants={itemVariants}
                                className="border-t border-[#4A9782]/20 pt-6"
                            >
                                <h3 className="text-lg font-semibold text-[#004030] mb-4 flex items-center gap-2">
                                    <Lock size={18}/>
                                    Change Password (Optional)
                                </h3>

                                {/* Current Password */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[#004030] font-medium mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register('currentPassword')}
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="w-full px-4 py-3 pr-12 border-2 border-[#4A9782]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 focus:border-[#4A9782] transition-all duration-200"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-colors"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-[#004030] font-medium mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register('newPassword', {
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Password must be at least 6 characters'
                                                    }
                                                })}
                                                type={showNewPassword ? "text" : "password"}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                    errors.newPassword
                                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                        : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                                }`}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                <AlertTriangle size={16}/>
                                                {errors.newPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-[#004030] font-medium mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register('confirmPassword', {
                                                    validate: (value) =>
                                                        !watchNewPassword || value === watchNewPassword || 'Passwords do not match'
                                                })}
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/50 transition-all duration-200 ${
                                                    errors.confirmPassword
                                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                                        : 'border-[#4A9782]/20 focus:border-[#4A9782] hover:border-[#4A9782]/40'
                                                }`}
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="flex items-center gap-2 text-red-500 text-sm mt-1">
                                                <AlertTriangle size={16}/>
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Account Info */}
                        {!isEditing && (
                            <motion.div
                                variants={itemVariants}
                                className="border-t border-[#4A9782]/20 pt-6"
                            >
                                <h3 className="text-lg font-semibold text-[#004030] mb-4 flex items-center gap-2">
                                    <Calendar size={18}/>
                                    Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#4A9782]/5 p-4 rounded-xl">
                                        <p className="text-sm text-[#004030]/70 mb-1">Last Login</p>
                                        <p className="font-medium text-[#004030]">
                                            {formatDate(user.lastLoginAt)}
                                        </p>
                                    </div>
                                    <div className="bg-[#004030]/5 p-4 rounded-xl">
                                        <p className="text-sm text-[#004030]/70 mb-1">Member Since</p>
                                        <p className="font-medium text-[#004030]">
                                            {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div variants={itemVariants} className="flex gap-4 pt-6">
                            {isEditing ? (
                                <>
                                    <motion.button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-300 flex items-center justify-center gap-2"
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <X size={18}/>
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-[#004030] to-[#4A9782] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                                        whileHover={!isLoading ? {
                                            scale: 1.02,
                                            boxShadow: "0 20px 40px rgba(0, 64, 48, 0.3)"
                                        } : {}}
                                        whileTap={!isLoading ? {scale: 0.98} : {}}
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{rotate: 360}}
                                                transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                                className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                            />
                                        ) : (
                                            <Save size={18}/>
                                        )}
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 bg-gradient-to-r from-[#4A9782] to-[#004030] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 20px 40px rgba(74, 151, 130, 0.3)"
                                        }}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <Edit3 size={18}/>
                                        Edit Profile
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="bg-red-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 flex items-center justify-center gap-2 shadow-lg"
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
                                        }}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <Trash2 size={18}/>
                                        Delete
                                    </motion.button>
                                </>
                            )}
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );

    if (isModal) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{opacity: 0, scale: 0.9, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.9, y: 20}}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#4A9782]/20">
                            <h2 className="text-xl font-bold text-[#004030]">Profile Settings</h2>
                            <motion.button
                                onClick={handleClose}
                                className="p-2 text-[#004030] hover:text-[#4A9782] transition-colors rounded-lg hover:bg-[#4A9782]/10"
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                <X size={20}/>
                            </motion.button>
                        </div>

                        <div className="p-6">
                            <ProfileContent/>
                        </div>
                    </motion.div>
                </motion.div>

                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onConfirm={handleDeleteProfile}
                    onCancel={() => setShowDeleteModal(false)}
                    userName={user.name}
                    isLoading={isDeleting}
                />
            </AnimatePresence>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#4A9782]/5 to-[#004030]/10 py-8">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Button */}
                <motion.button
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    onClick={handleClose}
                    className="flex items-center gap-2 text-[#004030] hover:text-[#4A9782] transition-colors duration-200 mb-6 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-md hover:shadow-lg border border-gray-200/50"
                    whileHover={{x: -5, scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <ArrowLeft size={20}/>
                    <span className="font-medium">Back</span>
                </motion.button>

                <ProfileContent/>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleDeleteProfile}
                onCancel={() => setShowDeleteModal(false)}
                userName={user.name}
                isLoading={isDeleting}
            />
        </div>
    );
}