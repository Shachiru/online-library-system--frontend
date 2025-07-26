import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {backendApi} from "../../../api.ts";
import {ThemeToggle} from "../../../components/ThemeToggle";

export function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await backendApi.post('/auth/logout', {refreshToken});
            }
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            alert("Logged out successfully!");
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert("Error logging out");
        }
    };

    return (
        <nav
            className="bg-[#F6F6F6] dark:bg-[#000000] shadow-lg border-b-2 border-[#A2D5C6] dark:border-[#A2D5C6]/50 sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] rounded-xl mr-3 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                        <svg className="w-6 h-6 text-[#F6F6F6] dark:text-[#000000]" fill="currentColor"
                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                    </div>
                    <span
                        className="text-2xl font-bold bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6] dark:to-[#CFFFE2] bg-clip-text text-transparent">
                        LibraryHub
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a
                        href="/"
                        className="relative font-medium text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] transition-all duration-200 group"
                    >
                        <span>Home</span>
                        <div
                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] group-hover:w-full transition-all duration-300"></div>
                    </a>
                    <a
                        href="/books"
                        className="relative font-medium text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] transition-all duration-200 group"
                    >
                        <span>Books</span>
                        <div
                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] group-hover:w-full transition-all duration-300"></div>
                    </a>
                    {role === 'admin' && (
                        <a
                            href="/admin"
                            className="relative font-medium text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] transition-all duration-200 group flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>Admin Dashboard</span>
                            <div
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] group-hover:w-full transition-all duration-300"></div>
                        </a>
                    )}

                    {/* Theme Toggle Button */}
                    <ThemeToggle/>

                    {username ? (
                        <div className="flex items-center space-x-4">
                            <div
                                className="bg-gradient-to-r from-[#CFFFE2]/30 to-[#F6F6F6] dark:from-[#000000] dark:to-[#000000]/80 px-4 py-2 rounded-full border-2 border-[#A2D5C6]/30 dark:border-[#A2D5C6]/50 hover:border-[#A2D5C6] transition-all duration-200">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-6 h-6 bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-[#F6F6F6] dark:text-[#000000]" fill="currentColor"
                                             viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <span
                                        className="text-sm font-semibold text-[#A2D5C6] dark:text-[#CFFFE2]">Welcome, {username}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] text-[#000000] dark:text-[#000000] px-5 py-2 rounded-full text-sm font-semibold hover:from-[#CFFFE2] hover:to-[#A2D5C6] dark:hover:from-[#CFFFE2] dark:hover:to-[#A2D5C6]/80 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] text-[#000000] dark:text-[#000000] px-6 py-2 rounded-full text-sm font-semibold hover:from-[#CFFFE2] hover:to-[#A2D5C6] dark:hover:from-[#CFFFE2] dark:hover:to-[#A2D5C6]/80 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                            </svg>
                            <span>Sign In</span>
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-4">
                    {/* Theme Toggle for Mobile */}
                    <ThemeToggle/>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] focus:outline-none p-2 rounded-lg hover:bg-[#CFFFE2]/20 dark:hover:bg-[#A2D5C6]/20 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div
                    className="md:hidden bg-gradient-to-br from-[#CFFFE2]/30 to-[#F6F6F6] dark:from-[#000000]/95 dark:to-[#000000] border-t-2 border-[#A2D5C6] dark:border-[#A2D5C6]/50 shadow-lg transition-colors duration-300">
                    <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                        <a
                            href="/"
                            className="text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] font-medium transition-colors duration-200 flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#A2D5C6]/10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span>Home</span>
                        </a>
                        <a
                            href="/books"
                            className="text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] font-medium transition-colors duration-200 flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#A2D5C6]/10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            <span>Books</span>
                        </a>
                        {role === 'admin' && (
                            <a
                                href="/admin"
                                className="text-[#000000] dark:text-[#F6F6F6] hover:text-[#A2D5C6] dark:hover:text-[#CFFFE2] font-medium transition-colors duration-200 flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#A2D5C6]/10"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>Admin Dashboard</span>
                            </a>
                        )}

                        <div className="border-t border-[#A2D5C6]/30 dark:border-[#A2D5C6]/50 pt-4">
                            {username ? (
                                <div className="space-y-4">
                                    <div
                                        className="bg-white/60 dark:bg-[#000000]/60 px-4 py-3 rounded-xl border border-[#A2D5C6]/30 dark:border-[#A2D5C6]/50">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-6 h-6 bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-[#F6F6F6] dark:text-[#000000]"
                                                     fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <span
                                                className="text-sm font-semibold text-[#A2D5C6] dark:text-[#CFFFE2]">Welcome, {username}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] text-[#000000] dark:text-[#000000] px-4 py-3 rounded-xl text-sm font-semibold hover:from-[#CFFFE2] hover:to-[#A2D5C6] dark:hover:from-[#CFFFE2] dark:hover:to-[#A2D5C6]/80 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] dark:from-[#A2D5C6]/80 dark:to-[#CFFFE2] text-[#000000] dark:text-[#000000] px-6 py-3 rounded-xl text-sm font-semibold hover:from-[#CFFFE2] hover:to-[#A2D5C6] dark:hover:from-[#CFFFE2] dark:hover:to-[#A2D5C6]/80 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                    </svg>
                                    <span>Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}