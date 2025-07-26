import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { backendApi } from "../../../api.ts";
import type { UserData } from "../../../model/UserData.ts";
import { getUserFromToken } from "../../../auth/auth.ts";

type LoginFormData = {
    email: string;
    password: string;
};

type SignupFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoginForm, setIsLoginForm] = useState(location.pathname !== "/signup");

    // Set form based on route
    useEffect(() => {
        const isSignupRoute = location.pathname === "/signup";
        if (isLoginForm === isSignupRoute) {
            setIsLoginForm(!isSignupRoute);
        }
    }, [location.pathname, isLoginForm]);

    // Login form handling
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors }
    } = useForm<LoginFormData>();

    // Signup form handling
    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
        watch: watchSignup
    } = useForm<SignupFormData>();

    // Needed for password confirmation validation
    const passwordValue = watchSignup ? watchSignup("password") : "";

    const authenticateUser = async (data: LoginFormData) => {
        try {
            const userCredentials = {
                email: data.email,
                password: data.password
            };

            const response = await backendApi.post('/auth/login', userCredentials);
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const user: UserData = getUserFromToken(accessToken);
            localStorage.setItem('username', user.name as string);
            localStorage.setItem('role', user.role as string);

            alert("Successfully logged in!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Login failed: Invalid credentials or server error");
        }
    };

    const registerUser = async (data: SignupFormData) => {
        try {
            // Only include fields needed for the backend
            const { name, email, password } = data;

            const response = await backendApi.post('/auth/register', { name, email, password });

            if (response.status === 201) {
                alert("Registration successful! Please log in.");
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            alert("Registration failed: Email may already be in use or server error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#CFFFE2] to-[#A2D5C6] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#F6F6F6] rounded-3xl shadow-2xl p-8 relative overflow-hidden border-2 border-[#A2D5C6]/20">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#CFFFE2]/30 to-transparent pointer-events-none"></div>

                {/* Go Back Link */}
                <div className="mb-6 text-center relative z-10">
                    <button
                        onClick={() => navigate("/")}
                        className="text-[#A2D5C6] hover:text-[#CFFFE2] font-medium transition-all duration-200 flex items-center justify-center mx-auto group"
                    >
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </div>

                {/* Forms Container with sliding animation */}
                <div className="relative overflow-hidden" style={{ height: isLoginForm ? "500px" : "620px", transition: "height 0.4s ease-in-out" }}>
                    <div
                        className="transition-all duration-400 absolute w-full"
                        style={{
                            transform: isLoginForm ? 'translateX(0)' : 'translateX(-100%)',
                            transition: "transform 0.4s ease-in-out"
                        }}
                    >
                        {/* Login Form */}
                        <div className="relative">
                            {/* Header */}
                            <div className="text-center mb-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#A2D5C6] to-[#CFFFE2] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-[#F6F6F6]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#000000] to-[#000000]/70 bg-clip-text text-transparent mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-[#000000]/60 text-sm">
                                    Sign in to access your library account and explore our collection
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLoginSubmit(authenticateUser)} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-[#000000] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            {...registerLogin("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#A2D5C6]/20 focus:border-[#A2D5C6] transition-all duration-200 ${
                                                loginErrors.email ? 'border-red-300 bg-red-50' : 'border-[#CFFFE2] bg-[#CFFFE2]/30 hover:border-[#A2D5C6]'
                                            }`}
                                            placeholder="Enter your email address"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#A2D5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                    </div>
                                    {loginErrors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {loginErrors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-[#000000] mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            {...registerLogin("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters"
                                                }
                                            })}
                                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#A2D5C6]/20 focus:border-[#A2D5C6] transition-all duration-200 ${
                                                loginErrors.password ? 'border-red-300 bg-red-50' : 'border-[#CFFFE2] bg-[#CFFFE2]/30 hover:border-[#A2D5C6]'
                                            }`}
                                            placeholder="Enter your password"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#A2D5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {loginErrors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {loginErrors.password.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] text-[#000000] font-semibold py-4 px-6 rounded-xl hover:from-[#CFFFE2] hover:to-[#A2D5C6] focus:outline-none focus:ring-2 focus:ring-[#A2D5C6] focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Sign In to Library</span>
                                </button>
                            </form>

                            {/* Additional Links */}
                            <div className="mt-8 text-center space-y-2">
                                <p className="text-sm text-[#000000]/60">
                                    Don't have an account?
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="text-[#A2D5C6] hover:text-[#CFFFE2] font-medium ml-1 transition-colors duration-200"
                                    >
                                        Sign up now
                                    </button>
                                </p>
                                <a href="#" className="text-sm text-[#A2D5C6] hover:text-[#CFFFE2] transition-colors duration-200">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                    </div>

                    <div
                        className="transition-all duration-400 absolute w-full"
                        style={{
                            transform: isLoginForm ? 'translateX(100%)' : 'translateX(0)',
                            transition: "transform 0.4s ease-in-out"
                        }}
                    >
                        {/* Signup Form */}
                        <div className="relative">
                            {/* Header */}
                            <div className="text-center mb-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#A2D5C6] to-[#CFFFE2] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-[#F6F6F6]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#000000] to-[#000000]/70 bg-clip-text text-transparent mb-2">
                                    Create Account
                                </h2>
                                <p className="text-[#000000]/60 text-sm">
                                    Join our library community and discover a world of books
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSignupSubmit(registerUser)} className="space-y-6">
                                {/* Name field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-[#000000] mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="name"
                                            {...registerSignup("name", {
                                                required: "Name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Name must be at least 2 characters"
                                                }
                                            })}
                                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#A2D5C6]/20 focus:border-[#A2D5C6] transition-all duration-200 ${
                                                signupErrors.name ? 'border-red-300 bg-red-50' : 'border-[#CFFFE2] bg-[#CFFFE2]/30 hover:border-[#A2D5C6]'
                                            }`}
                                            placeholder="Enter your full name"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#A2D5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {signupErrors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {signupErrors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email field */}
                                <div>
                                    <label htmlFor="signup-email" className="block text-sm font-semibold text-[#000000] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="signup-email"
                                            {...registerSignup("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#A2D5C6]/20 focus:border-[#A2D5C6] transition-all duration-200 ${
                                                signupErrors.email ? 'border-red-300 bg-red-50' : 'border-[#CFFFE2] bg-[#CFFFE2]/30 hover:border-[#A2D5C6]'
                                            }`}
                                            placeholder="Enter your email address"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#A2D5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                    </div>
                                    {signupErrors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {signupErrors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password field */}
                                <div>
                                    <label htmlFor="signup-password" className="block text-sm font-semibold text-[#000000] mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="signup-password"
                                            {...registerSignup("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters"
                                                }
                                            })}
                                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#A2D5C6]/20 focus:border-[#A2D5C6] transition-all duration-200 ${
                                                signupErrors.password ? 'border-red-300 bg-red-50' : 'border-[#CFFFE2] bg-[#CFFFE2]/30 hover:border-[#A2D5C6]'
                                            }`}
                                            placeholder="Create a password"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#A2D5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {signupErrors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {signupErrors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password field */}
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-[#000000] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="confirm-password"
                                            {...registerSignup("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: value =>
                                                    value === passwordValue || "The passwords do not match"
                                            })}
                                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#A2D5C6]/20 focus:border-[#A2D5C6] transition-all duration-200 ${
                                                signupErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-[#CFFFE2] bg-[#CFFFE2]/30 hover:border-[#A2D5C6]'
                                            }`}
                                            placeholder="Confirm your password"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#A2D5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {signupErrors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {signupErrors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2] text-[#000000] font-semibold py-4 px-6 rounded-xl hover:from-[#CFFFE2] hover:to-[#A2D5C6] focus:outline-none focus:ring-2 focus:ring-[#A2D5C6] focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <span>Create Account</span>
                                </button>
                            </form>

                            {/* Additional Links */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-[#000000]/60">
                                    Already have an account?
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-[#A2D5C6] hover:text-[#CFFFE2] font-medium ml-1 transition-colors duration-200"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A2D5C6] to-[#CFFFE2]"></div>
            </div>
        </div>
    );
}