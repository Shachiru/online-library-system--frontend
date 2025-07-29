import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {motion} from 'framer-motion';
import {AxiosError} from 'axios';
import {backendApi} from '../../../api';
import {UserProfile} from '../UserProfile/UserProfile';
import type {UserProfile as UserProfileType} from '../../../model/ComponentProps';

export function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                toast.error('Please log in to view your profile');
                navigate('/login');
                return;
            }

            try {
                let accessToken;
                let userId;

                // Try to refresh token first, fallback to decoding existing token
                try {
                    const tokenResponse = await backendApi.post('/auth/refresh', {
                        refreshToken: refreshToken
                    });
                    accessToken = tokenResponse.data.accessToken;
                    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
                    userId = tokenPayload.id;
                } catch (refreshError) {
                    // Fallback: decode the refresh token directly
                    const tokenPayload = JSON.parse(atob(refreshToken.split('.')[1]));
                    userId = tokenPayload.id;
                    accessToken = refreshToken;
                }

                if (!userId) {
                    throw new Error('Could not extract user ID from token');
                }

                // Store for future use
                localStorage.setItem('token', accessToken);
                localStorage.setItem('userId', userId);

                // Fetch user data
                const response = await backendApi.get(`/auth/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                setUser(response.data);

            } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        toast.error('Session expired. Please log in again.');
                        localStorage.clear();
                        navigate('/login');
                    } else if (err.response?.status === 404) {
                        toast.error('User profile not found. Please contact support.');
                    } else {
                        toast.error('Failed to load profile data. Please try again.');
                    }
                } else {
                    toast.error('An unexpected error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData().catch((err: unknown) => {
            console.error('Unhandled error in fetchUserData:', err);
        });
    }, [navigate]);

    const handleUserUpdate = (updatedUser: UserProfileType) => {
        setUser(updatedUser);
    };

    const handleUserDelete = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-white via-[#4A9782]/5 to-[#004030]/10 flex items-center justify-center">
                <motion.div
                    animate={{rotate: 360}}
                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                    className="w-8 h-8 border-2 border-[#4A9782]/20 border-t-[#4A9782] rounded-full"
                />
            </div>
        );
    }

    if (!user) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-white via-[#4A9782]/5 to-[#004030]/10 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#004030] mb-2">Profile Not Found</h2>
                    <p className="text-[#004030]/70">Unable to load your profile data.</p>
                </div>
            </div>
        );
    }

    return (
        <UserProfile
            user={user}
            onUpdate={handleUserUpdate}
            onDelete={handleUserDelete}
        />
    );
}