import {useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
    Home,
    BookOpen,
    ShoppingCart,
    Search,
    Settings,
    LogOut,
    User,
    Moon,
    Sun,
    Menu,
    X,
    BookmarkPlus,
    Library
} from "lucide-react";
import {backendApi} from "../../../api";
import {getUserFromToken} from "../../../auth/auth.ts";
import type {NavItemProps} from "../../../model/ComponentProps";
import type {UserData} from "../../../model/UserData.ts";

// Theme hook for dark/light mode
const useTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return {isDark, toggleTheme: () => setIsDark(!isDark)};
};

// User info interface
interface UserInfo {
    name: string | null;
    role: string | null;
    userId: string | null;
}

export function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {isDark, toggleTheme} = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // User information
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: null,
        role: null,
        userId: null
    });

    // Fetch user data from /users/:id or fallback to localStorage/token
    useEffect(() => {
        const updateUserInfo = async () => {
            const token = localStorage.getItem('token');
            console.log('NavBar: Token found:', !!token);

            let name: string | null = null;
            let role: string | null = null;
            let userId: string | null = localStorage.getItem('userId');

            name = localStorage.getItem('username');
            role = localStorage.getItem('role');
            console.log('NavBar: Initial check - username:', name, 'role:', role);

            if (token) {
                try {
                    const userData = getUserFromToken(token) as UserData;

                    name = name || userData.name;
                    role = role || userData.role;
                    userId = userId || userData._id || null;
                    console.log('NavBar: Token decoded - name:', name, 'role:', role);

                    if (name) localStorage.setItem('username', name);
                    if (role) localStorage.setItem('role', role);
                    if (userId) localStorage.setItem('userId', userId);
                } catch (error) {
                    console.error('NavBar: Error decoding token:', error);
                }
            }

            if (token && userId) {
                try {
                    // For admin users, use a specific endpoint if needed
                    const endpoint = role === 'admin'
                        ? `/admin/profile/${userId}` // Try admin-specific endpoint first
                        : `/users/${userId}`;

                    console.log(`NavBar: Fetching user data from ${endpoint}`);

                    const response = await backendApi.get(endpoint, {
                        headers: {Authorization: `Bearer ${token}`}
                    });

                    console.log('NavBar: API response:', response.data);

                    // Check for various field names that might contain the username
                    // This handles differences between admin and regular user data structures
                    if (response.data) {
                        // Try all possible field names for the username
                        name = response.data.name ||
                            response.data.username ||
                            response.data.fullName ||
                            response.data.displayName ||
                            response.data.adminName || // Admin-specific field
                            name;

                        role = response.data.role || role;
                        userId = response.data._id || response.data.id || userId;

                        // Store updated values
                        if (name) localStorage.setItem('username', name);
                        if (role) localStorage.setItem('role', role);
                        if (userId) localStorage.setItem('userId', userId);
                    }
                } catch (error) {
                    console.error(`NavBar: Error fetching from ${role === 'admin' ? 'admin' : 'user'} endpoint:`, error);

                    // If admin-specific endpoint fails, try the regular user endpoint as fallback
                    if (role === 'admin') {
                        try {
                            console.log('NavBar: Trying fallback to regular user endpoint');
                            const fallbackResponse = await backendApi.get(`/users/${userId}`, {
                                headers: {Authorization: `Bearer ${token}`}
                            });

                            if (fallbackResponse.data) {
                                name = fallbackResponse.data.name ||
                                    fallbackResponse.data.username ||
                                    fallbackResponse.data.fullName ||
                                    name;

                                if (name) localStorage.setItem('username', name);
                            }
                        } catch (fallbackError) {
                            console.error('NavBar: Fallback endpoint also failed:', fallbackError);
                        }
                    }
                }
            }

            if (!name && role === 'admin') {
                name = 'Administrator';
                localStorage.setItem('username', name);
            }

            console.log('NavBar: Final user info:', {name, role, userId});

            setUserInfo({
                name: name || null,
                role: role || null,
                userId: userId || null
            });
        };

        updateUserInfo();

        window.addEventListener('storage', updateUserInfo);
        const handleAuthChange = () => updateUserInfo();
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('storage', updateUserInfo);
            window.removeEventListener('authChange', handleAuthChange);
        };

    }, [navigate, location.pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsProfileDropdownOpen(false);
            setIsMenuOpen(false);
        };

        if (isProfileDropdownOpen || isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isProfileDropdownOpen, isMenuOpen]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                await backendApi.post('/auth/logout', {refreshToken});
            }

            // Clear all auth data
            ['token', 'refreshToken', 'username', 'role', 'userId'].forEach(key => {
                localStorage.removeItem(key);
            });

            setUserInfo({name: null, role: null, userId: null});
            setIsProfileDropdownOpen(false);

            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails on server, clear local storage
            ['token', 'refreshToken', 'username', 'role', 'userId'].forEach(key => {
                localStorage.removeItem(key);
            });
            setUserInfo({name: null, role: null, userId: null});
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    };

    // Navigation items
    const navItems: NavItemProps[] = [
        {
            label: "Home",
            href: "/",
            icon: Home,
            isActive: location.pathname === "/"
        },
        {
            label: "Books",
            href: "/books",
            icon: Library,
            isActive: location.pathname === "/books"
        },
        {
            label: "Borrow",
            href: "/borrow",
            icon: ShoppingCart,
            isActive: location.pathname === "/borrow"
        },
    ];

    // Admin navigation items
    const adminNavItems: NavItemProps[] = userInfo.role === 'admin' ? [
        {
            label: "Add Book",
            href: "/admin/books/add",
            icon: BookmarkPlus,
            isActive: location.pathname === "/admin/books/add"
        },
        {
            label: "Admin Panel",
            href: "/admin",
            icon: Settings,
            isActive: location.pathname.startsWith("/admin") && location.pathname !== "/admin/books/add"
        }
    ] : [];

    const allNavItems = [...navItems, ...adminNavItems];

    return (
        <motion.nav
            initial={{y: -100, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="bg-white/95 dark:bg-[#004030]/95 backdrop-blur-md shadow-lg border-b border-[#4A9782]/20 sticky top-0 z-50"
        >
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <motion.div
                            whileHover={{rotate: 360}}
                            transition={{duration: 0.6}}
                            className="w-10 h-10 bg-gradient-to-br from-[#4A9782] to-[#004030] rounded-xl mr-3 flex items-center justify-center shadow-md"
                        >
                            <BookOpen className="w-6 h-6 text-white"/>
                        </motion.div>
                        <div className="flex flex-col">
                            <span
                                className="text-xl font-bold bg-gradient-to-r from-[#004030] to-[#4A9782] dark:from-[#4A9782] dark:to-white bg-clip-text text-transparent">
                                LibraryHub
                            </span>
                            <span className="text-xs text-[#4A9782]/70 font-medium">
                                Digital Library
                            </span>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {allNavItems.map((item, index) => {
                            const IconComponent = item.icon!;
                            return (
                                <motion.button
                                    key={item.label}
                                    initial={{opacity: 0, y: -20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: index * 0.1 + 0.3}}
                                    whileHover={{y: -2, scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={() => navigate(item.href)}
                                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                        item.isActive
                                            ? 'bg-[#4A9782]/10 text-[#004030] dark:text-[#4A9782] shadow-md'
                                            : 'text-[#004030]/70 dark:text-white/70 hover:text-[#004030] dark:hover:text-white hover:bg-[#4A9782]/5'
                                    }`}
                                >
                                    <IconComponent size={18}/>
                                    <span>{item.label}</span>
                                    {item.isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-gradient-to-r from-[#4A9782]/10 to-[#004030]/10 rounded-lg border border-[#4A9782]/20"
                                            transition={{type: "spring", stiffness: 300, damping: 30}}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center mx-8 flex-1 max-w-md">
                        <motion.div
                            className="relative w-full"
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{delay: 0.4}}
                        >
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search books, authors, genres..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-[#4A9782]/20 rounded-full bg-white dark:bg-[#004030]/50 text-[#004030] dark:text-white placeholder-[#4A9782]/60 focus:border-[#4A9782] focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] dark:hover:text-white transition-colors duration-200"
                                >
                                    <Search size={18}/>
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Mobile Search Button */}
                        <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 text-[#004030] dark:text-white hover:text-[#4A9782] dark:hover:text-[#4A9782] transition-colors duration-200 rounded-lg hover:bg-[#4A9782]/10"
                        >
                            <Search size={20}/>
                        </motion.button>

                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={toggleTheme}
                            className="p-2 text-[#004030] dark:text-white hover:text-[#4A9782] dark:hover:text-[#4A9782] transition-colors duration-200 rounded-lg hover:bg-[#4A9782]/10"
                        >
                            {isDark ? <Sun size={20}/> : <Moon size={20}/>}
                        </motion.button>

                        {/* User Profile / Auth */}
                        {userInfo.name ? (
                            <div className="relative">
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                    }}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-[#4A9782] to-[#004030] text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                        <User size={16}/>
                                    </div>
                                    <span className="text-sm font-medium sm:inline max-w-20 truncate">
                                    {userInfo.name || "User"}
                                </span>
                                    <motion.div
                                        animate={{rotate: isProfileDropdownOpen ? 180 : 0}}
                                        transition={{duration: 0.2}}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2">
                                            <path d="M6 9l6 6 6-6"/>
                                        </svg>
                                    </motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{opacity: 0, y: -10, scale: 0.95}}
                                            animate={{opacity: 1, y: 0, scale: 1}}
                                            exit={{opacity: 0, y: -10, scale: 0.95}}
                                            transition={{duration: 0.2}}
                                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#004030] rounded-xl shadow-xl border border-[#4A9782]/20 py-2 z-50"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-[#4A9782]/20">
                                                <p className="text-sm font-medium text-[#004030] dark:text-white">
                                                    Signed in as
                                                </p>
                                                <p className="text-sm text-[#4A9782] truncate font-semibold">
                                                    {userInfo.name}
                                                </p>
                                                {userInfo.role && (
                                                    <span
                                                        className="inline-block mt-1 px-2 py-1 text-xs bg-[#4A9782]/10 text-[#4A9782] rounded-full font-medium capitalize">
                                                        {userInfo.role}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Profile Actions */}
                                            <div className="py-1">
                                                <motion.button
                                                    whileHover={{backgroundColor: "rgba(74, 151, 130, 0.1)"}}
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setIsProfileDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-[#004030] dark:text-white hover:text-[#4A9782] transition-colors duration-200 flex items-center space-x-2"
                                                >
                                                    <User size={16}/>
                                                    <span>View Profile</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{backgroundColor: "rgba(74, 151, 130, 0.1)"}}
                                                    onClick={() => {
                                                        navigate('/settings');
                                                        setIsProfileDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-[#004030] dark:text-white hover:text-[#4A9782] transition-colors duration-200 flex items-center space-x-2"
                                                >
                                                    <Settings size={16}/>
                                                    <span>Settings</span>
                                                </motion.button>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-[#4A9782]/20 py-1">
                                                <motion.button
                                                    whileHover={{backgroundColor: "rgba(239, 68, 68, 0.1)"}}
                                                    onClick={handleLogout}
                                                    disabled={isLoggingOut}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                                                >
                                                    {isLoggingOut ? (
                                                        <motion.div
                                                            animate={{rotate: 360}}
                                                            transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                                            className="w-4 h-4 border-2 border-red-600/20 border-t-red-600 rounded-full"
                                                        />
                                                    ) : (
                                                        <LogOut size={16}/>
                                                    )}
                                                    <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-[#4A9782] to-[#004030] text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                            >
                                <User size={16}/>
                                <span>Sign In</span>
                            </motion.button>
                        )}

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-[#004030] dark:text-white hover:text-[#4A9782] dark:hover:text-[#4A9782] transition-colors duration-200 rounded-lg hover:bg-[#4A9782]/10"
                        >
                            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: "auto", opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            transition={{duration: 0.3}}
                            className="md:hidden border-t border-[#4A9782]/20 py-4 overflow-hidden"
                        >
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search books, authors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-[#4A9782]/20 rounded-full bg-white dark:bg-[#004030]/50 text-[#004030] dark:text-white placeholder-[#4A9782]/60 focus:border-[#4A9782] focus:outline-none transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A9782]"
                                >
                                    <Search size={18}/>
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: "auto", opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            transition={{duration: 0.3}}
                            className="lg:hidden border-t border-[#4A9782]/20 bg-white/95 dark:bg-[#004030]/95 backdrop-blur-sm overflow-hidden"
                        >
                            <div className="py-4 space-y-1">
                                {allNavItems.map((item, index) => {
                                    const IconComponent = item.icon!;
                                    return (
                                        <motion.button
                                            key={item.label}
                                            initial={{x: -20, opacity: 0}}
                                            animate={{x: 0, opacity: 1}}
                                            transition={{delay: index * 0.1}}
                                            whileHover={{x: 10, backgroundColor: "rgba(74, 151, 130, 0.1)"}}
                                            onClick={() => {
                                                navigate(item.href);
                                                setIsMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 rounded-lg mx-2 ${
                                                item.isActive
                                                    ? 'bg-[#4A9782]/10 text-[#004030] dark:text-[#4A9782]'
                                                    : 'text-[#004030] dark:text-white hover:text-[#4A9782] dark:hover:text-[#4A9782]'
                                            }`}
                                        >
                                            <IconComponent size={20}/>
                                            <span className="font-medium">{item.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}