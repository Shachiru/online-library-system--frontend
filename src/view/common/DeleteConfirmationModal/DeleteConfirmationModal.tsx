import {motion, AnimatePresence} from 'framer-motion';
import {AlertTriangle, Trash2, X} from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    userName: string;
    isLoading?: boolean;
}

export function DeleteConfirmationModal({
                                            isOpen,
                                            onConfirm,
                                            onCancel,
                                            userName,
                                            isLoading = false
                                        }: DeleteConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{opacity: 0, scale: 0.9, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.9, y: 20}}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Warning Icon */}
                            <motion.div
                                className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                                whileHover={{scale: 1.1, rotate: 5}}
                            >
                                <AlertTriangle className="w-8 h-8 text-red-500"/>
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-center text-[#004030] mb-2">
                                Delete Account
                            </h3>

                            {/* Message */}
                            <p className="text-center text-gray-600 mb-6">
                                Are you sure you want to delete your account, <strong>{userName}</strong>?
                                This action cannot be undone and all your data will be permanently removed.
                            </p>

                            {/* Warning Box */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"/>
                                    <div className="text-sm text-red-700">
                                        <p className="font-medium mb-1">This will permanently:</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>Delete your account and profile</li>
                                            <li>Remove all your borrowing history</li>
                                            <li>Cancel any active book reservations</li>
                                            <li>Log you out of all devices</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                    whileHover={!isLoading ? {scale: 1.02} : {}}
                                    whileTap={!isLoading ? {scale: 0.98} : {}}
                                >
                                    <X size={18}/>
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                                    whileHover={!isLoading ? {
                                        scale: 1.02,
                                        boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
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
                                        <Trash2 size={18}/>
                                    )}
                                    {isLoading ? 'Deleting...' : 'Delete Account'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}