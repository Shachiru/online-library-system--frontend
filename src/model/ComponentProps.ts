import type {BookData} from './BookData';

export interface FormFieldProps {
    label: string;
    name: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    disabled?: boolean;
}

export interface InputFieldProps extends FormFieldProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
}

export interface SelectFieldProps extends FormFieldProps {
    options: Array<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
    multiple?: boolean;
}

export interface BookCardProps {
    data: BookData;
    onAddToCart?: () => void;
    onRemoveFromCart?: (isbn: string) => void;
    showActions?: boolean;
    compact?: boolean;
}

export interface AdminBookSaveProps {
    initialData?: Partial<BookData>;
    onSave?: (book: BookData) => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

export interface BookFormHandlers {
    onSubmit: (data: BookFormData) => Promise<void>;
    onReset: () => void;
    onFieldChange?: (field: string, value: unknown) => void; // Changed from 'any' to 'unknown'
}

export interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    availability: boolean;
    coverImage?: string;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    lastLoginAt?: string;
    createdAt?: string;
}

export interface UserProfileFormData {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export interface UserProfileProps {
    user: UserProfile;
    onUpdate?: (user: UserProfile) => void;
    onDelete?: () => void;
    isModal?: boolean;
    onClose?: () => void;
}

export interface DeleteConfirmationProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    userName: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    children: React.ReactNode;
}

export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    className?: string;
}

export interface NavItemProps {
    label: string;
    href: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export interface CartItemProps {
    book: BookData;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
    showActions?: boolean;
}

export interface SearchFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: {
        genre?: string;
        author?: string;
        year?: number;
        availability?: boolean;
    };
    onFilterChange: (filters: Record<string, unknown>) => void; // Fixed type
    onClear: () => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
}

export interface LoadingProps {
    isLoading: boolean;
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    overlay?: boolean;
}

export interface ErrorProps {
    error: string | null;
    onRetry?: () => void;
    onDismiss?: () => void;
}