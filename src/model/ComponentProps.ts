import type {BookData} from './BookData';

// Common form field props
export interface FormFieldProps {
    label: string;
    name: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    disabled?: boolean;
}

// Input field specific props
export interface InputFieldProps extends FormFieldProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
}

// Select field specific props
export interface SelectFieldProps extends FormFieldProps {
    options: Array<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
    multiple?: boolean;
}

// BookCard component props
export interface BookCardProps {
    data: BookData;
    onAddToCart?: () => void;
    onRemoveFromCart?: (isbn: string) => void;
    showActions?: boolean;
    compact?: boolean;
}

// Admin form props
export interface AdminBookSaveProps {
    initialData?: Partial<BookData>;
    onSave?: (book: BookData) => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

// Form submission handlers - Fixed the type for onFieldChange
export interface BookFormHandlers {
    onSubmit: (data: BookFormData) => Promise<void>;
    onReset: () => void;
    onFieldChange?: (field: string, value: unknown) => void; // Changed from 'any' to 'unknown'
}

// Book form data (for form inputs)
export interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    availability: boolean;
    coverImage?: string;
}

// Modal/Dialog props
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    children: React.ReactNode;
}

// Button component props
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

// Navigation props
export interface NavItemProps {
    label: string;
    href: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

// Cart related props
export interface CartItemProps {
    book: BookData;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
    showActions?: boolean;
}

// Search and filter props
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

// Pagination props
export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
}

// Loading state props
export interface LoadingProps {
    isLoading: boolean;
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    overlay?: boolean;
}

// Error display props
export interface ErrorProps {
    error: string | null;
    onRetry?: () => void;
    onDismiss?: () => void;
}