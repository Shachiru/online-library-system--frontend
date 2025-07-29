import {useState} from 'react';
import {backendApi} from '../api';
import type {UserProfile} from '../model/ComponentProps';

export function useProfileModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) return;

        try {
            setIsLoading(true);
            const response = await backendApi.get(`/auth/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setUser(null);
    };

    const updateUser = (updatedUser: UserProfile) => {
        setUser(updatedUser);
    };

    return {
        isOpen,
        user,
        isLoading,
        openModal,
        closeModal,
        updateUser
    };
}