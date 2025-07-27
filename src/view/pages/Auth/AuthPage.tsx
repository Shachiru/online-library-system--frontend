import {useState, useEffect} from "react"
import {useForm} from "react-hook-form"
import {Eye, EyeOff, Mail, Lock, User, ArrowLeft, LogIn, UserPlus, AlertCircle, Check} from "lucide-react"
import {backendApi} from "../../../api.ts";
import type {UserData} from "../../../model/UserData.ts"
import {getUserFromToken} from "../../../auth/auth.ts"
import {useLocation, useNavigate} from "react-router-dom";

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
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const isSignupRoute = location.pathname === "/signup";
        if (isLoginForm === isSignupRoute) {
            setIsLoginForm(!isSignupRoute);
        }
    }, [location.pathname, isLoginForm]);

    const toggleForm = (isLogin: boolean) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setIsLoginForm(isLogin);
            navigate(isLogin ? '/login' : '/signup');
            setTimeout(() => {
                setIsAnimating(false);
            }, 600);
        }, 300);
    };

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors }
    } = useForm<LoginFormData>();

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
        watch: watchSignup
    } = useForm<SignupFormData>();

    const passwordValue = watchSignup ? watchSignup("password") : "";

    const authenticateUser = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            const userCredentials = {
                email: data.email,
                password: data.password
            };

            const response = await backendApi.post('/auth/login', userCredentials);
            console.log("Login response:", response.data);
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const user: UserData = getUserFromToken(accessToken);
            localStorage.setItem('username', user.name as string);
            localStorage.setItem('role', user.role as string);

            setIsSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed: Invalid credentials or server error");
            setIsLoading(false);
        }
    };

    const registerUser = async (data: SignupFormData) => {
        try {
            setIsLoading(true);
            // Only include fields needed for the backend
            const { name, email, password } = data;

            const response = await backendApi.post('/auth/register', { name, email, password });
            console.log("Signup response:", response.data);

            if (response.status === 201) {
                setIsSuccess(true);
                setTimeout(() => {
                    toggleForm(true); // Navigate to login after successful registration
                    setIsLoading(false);
                    setIsSuccess(false);
                }, 1000);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Registration failed: Email may already be in use or server error");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9E5] via-[#DCD0A8] to-[#4A9782] z-0">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-[#004030] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-[#4A9782] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#DCD0A8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    <div className="absolute -bottom-8 right-20 w-72 h-72 bg-[#FFF9E5] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
                </div>
            </div>

            <div className="w-full max-w-md z-10 animate-fade-in-up">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 text-[#004030] hover:text-black transition-colors duration-300 group bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg hover:bg-white/40"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"/>
                    <span className="font-medium">Back to Home</span>
                </button>

                {/* Main Card */}
                <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#DCD0A8]/30 overflow-hidden transition-all duration-500 hover:shadow-2xl ${isAnimating ? 'animate-card-flip' : ''}`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#004030] to-[#4A9782] px-8 py-6 text-center relative">
                        <div className={`w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm transition-all duration-500 hover:scale-110 hover:bg-white/30 group ${isAnimating ? 'animate-icon-flip' : ''}`}>
                            {isLoginForm ? (
                                <LogIn className={`w-8 h-8 text-white transition-all duration-300 ${isAnimating ? 'animate-icon-out' : 'group-hover:rotate-6'}`}/>
                            ) : (
                                <UserPlus className={`w-8 h-8 text-white transition-all duration-300 ${isAnimating ? 'animate-icon-out' : 'group-hover:rotate-6'}`}/>
                            )}
                        </div>
                        <h1 className={`text-2xl font-bold text-white mb-2 transition-all duration-300 ${isAnimating ? 'animate-text-swap' : ''}`}>
                            {isLoginForm ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className={`text-white/80 text-sm transition-all duration-300 ${isAnimating ? 'animate-text-swap' : ''}`}>
                            {isLoginForm
                                ? "Sign in to access your library account and explore our collection"
                                : "Join our library community and discover a world of books"}
                        </p>

                        {/* Animated accents */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white rounded-full animate-pulse-slow"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white rounded-full animate-pulse-slower"></div>
                        </div>
                    </div>

                    {/* Form Tabs with Sliding Indicator */}
                    <div className="relative flex bg-[#FFF9E5]/50">
                        {/* Sliding indicator */}
                        <div
                            className={`absolute bottom-0 h-0.5 bg-gradient-to-r from-[#004030] to-[#4A9782] transition-all duration-500 ease-in-out ${isAnimating ? 'animate-indicator-move' : ''}`}
                            style={{
                                width: "50%",
                                transform: isLoginForm ? "translateX(0%)" : "translateX(100%)",
                            }}
                        />

                        <button
                            onClick={() => toggleForm(true)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 relative z-10 ${
                                isLoginForm
                                    ? "bg-white text-[#004030] shadow-sm"
                                    : "text-[#4A9782] hover:text-[#004030] hover:bg-white/50"
                            } ${isAnimating ? 'pointer-events-none' : ''}`}
                        >
                            <LogIn className={`w-4 h-4 inline mr-2 transition-transform duration-300 ${isLoginForm ? 'rotate-0' : '-rotate-90 opacity-50'}`}/>
                            Sign In
                        </button>
                        <button
                            onClick={() => toggleForm(false)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 relative z-10 ${
                                !isLoginForm
                                    ? "bg-white text-[#004030] shadow-sm"
                                    : "text-[#4A9782] hover:text-[#004030] hover:bg-white/50"
                            } ${isAnimating ? 'pointer-events-none' : ''}`}
                        >
                            <UserPlus className={`w-4 h-4 inline mr-2 transition-transform duration-300 ${!isLoginForm ? 'rotate-0' : '-rotate-90 opacity-50'}`}/>
                            Sign Up
                        </button>
                    </div>

                    {/* Forms Container with Enhanced Animation */}
                    <div className="relative overflow-hidden">
                        {/* Dynamic height container */}
                        <div
                            className={`transition-all duration-500 ease-in-out ${isAnimating ? 'animate-container-height' : ''}`}
                            style={{
                                height: isLoginForm ? "450px" : "620px",
                            }}
                        >
                            {/* Sliding forms wrapper with 3D perspective */}
                            <div
                                className={`flex transition-transform duration-500 ease-in-out w-[200%] ${isAnimating ? 'animate-forms-swap' : ''}`}
                                style={{
                                    transform: isLoginForm ? "translateX(0%)" : "translateX(-50%)",
                                    perspective: "1000px",
                                    transformStyle: "preserve-3d",
                                    "--initial-x": isLoginForm ? "0%" : "-50%",
                                    "--target-x": isLoginForm ? "-50%" : "0%",
                                } as React.CSSProperties}
                            >
                                {/* Login Form Container */}
                                <div className={`w-1/2 px-8 py-6 ${isAnimating && !isLoginForm ? 'animate-form-out' : ''} ${isAnimating && isLoginForm ? 'animate-form-in' : ''}`}>
                                    <form onSubmit={handleLoginSubmit(authenticateUser)} className="space-y-6">
                                        {/* Email Field */}
                                        <div className="transform transition-all duration-300">
                                            <label htmlFor="email"
                                                   className="block text-sm font-semibold text-black mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A9782] transition-transform duration-300 group-focus-within:scale-110"/>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    {...registerLogin("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                            message: "Invalid email address",
                                                        },
                                                    })}
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] transition-all duration-300 bg-white group hover:shadow-md ${
                                                        loginErrors.email ? "border-red-300" : "border-[#DCD0A8] hover:border-[#4A9782]"
                                                    }`}
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                            {loginErrors.email && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in-down">
                                                    <AlertCircle className="w-4 h-4 animate-pulse"/>
                                                    {loginErrors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div className="transform transition-all duration-300">
                                            <label htmlFor="password"
                                                   className="block text-sm font-semibold text-black mb-2">
                                                Password
                                            </label>
                                            <div className="relative group">
                                                <Lock
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A9782] transition-transform duration-300 group-focus-within:scale-110"/>
                                                <input
                                                    type={showLoginPassword ? "text" : "password"}
                                                    id="password"
                                                    {...registerLogin("password", {
                                                        required: "Password is required",
                                                        minLength: {
                                                            value: 6,
                                                            message: "Password must be at least 6 characters",
                                                        },
                                                    })}
                                                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] transition-all duration-300 bg-white hover:shadow-md ${
                                                        loginErrors.password ? "border-red-300" : "border-[#DCD0A8] hover:border-[#4A9782]"
                                                    }`}
                                                    placeholder="Enter your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLoginPassword((prev) => !prev)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-all duration-300 hover:scale-110"
                                                >
                                                    {showLoginPassword ? <EyeOff className="w-5 h-5"/> :
                                                        <Eye className="w-5 h-5"/>}
                                                </button>
                                            </div>
                                            {loginErrors.password && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in-down">
                                                    <AlertCircle className="w-4 h-4 animate-pulse"/>
                                                    {loginErrors.password.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading || isSuccess}
                                            className={`w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white font-semibold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9782] focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden
                                                ${isLoading && "animate-pulse cursor-not-allowed"}
                                                ${isSuccess && "bg-green-500 cursor-not-allowed"}
                                            `}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r from-[#4A9782] to-[#DCD0A8] transition-transform duration-300 ${isSuccess ? 'translate-x-0' : 'translate-x-[-100%]'}`}></div>
                                            <div className="relative flex items-center justify-center space-x-2">
                                                {isSuccess ? (
                                                    <>
                                                        <Check className="w-5 h-5 animate-bounce" />
                                                        <span>Success!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogIn className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'animate-pulse'}`}/>
                                                        <span>{isLoading ? "Signing In..." : "Sign In to Library"}</span>
                                                    </>
                                                )}
                                            </div>
                                        </button>

                                        {/* Forgot Password */}
                                        <div className="text-center space-y-2">
                                            <a href="#"
                                               className="text-sm text-[#004030] hover:text-black transition-colors duration-300 inline-block hover:scale-105 transform"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                    </form>
                                </div>

                                {/* Signup Form Container */}
                                <div className={`w-1/2 px-8 py-6 ${isAnimating && isLoginForm ? 'animate-form-out' : ''} ${isAnimating && !isLoginForm ? 'animate-form-in' : ''}`}>
                                    <form onSubmit={handleSignupSubmit(registerUser)} className="space-y-6">
                                        {/* Name Field */}
                                        <div className="transform transition-all duration-300">
                                            <label htmlFor="name"
                                                   className="block text-sm font-semibold text-black mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative group">
                                                <User
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A9782] transition-transform duration-300 group-focus-within:scale-110"/>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    {...registerSignup("name", {
                                                        required: "Name is required",
                                                        minLength: {
                                                            value: 2,
                                                            message: "Name must be at least 2 characters",
                                                        },
                                                    })}
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] transition-all duration-300 bg-white hover:shadow-md ${
                                                        signupErrors.name ? "border-red-300" : "border-[#DCD0A8] hover:border-[#4A9782]"
                                                    }`}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            {signupErrors.name && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in-down">
                                                    <AlertCircle className="w-4 h-4 animate-pulse"/>
                                                    {signupErrors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div className="transform transition-all duration-300">
                                            <label htmlFor="signup-email"
                                                   className="block text-sm font-semibold text-black mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <Mail
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A9782] transition-transform duration-300 group-focus-within:scale-110"/>
                                                <input
                                                    type="email"
                                                    id="signup-email"
                                                    {...registerSignup("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                            message: "Invalid email address",
                                                        },
                                                    })}
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] transition-all duration-300 bg-white hover:shadow-md ${
                                                        signupErrors.email ? "border-red-300" : "border-[#DCD0A8] hover:border-[#4A9782]"
                                                    }`}
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                            {signupErrors.email && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in-down">
                                                    <AlertCircle className="w-4 h-4 animate-pulse"/>
                                                    {signupErrors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div className="transform transition-all duration-300">
                                            <label htmlFor="signup-password"
                                                   className="block text-sm font-semibold text-black mb-2">
                                                Password
                                            </label>
                                            <div className="relative group">
                                                <Lock
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A9782] transition-transform duration-300 group-focus-within:scale-110"/>
                                                <input
                                                    type={showSignupPassword ? "text" : "password"}
                                                    id="signup-password"
                                                    {...registerSignup("password", {
                                                        required: "Password is required",
                                                        minLength: {
                                                            value: 6,
                                                            message: "Password must be at least 6 characters",
                                                        },
                                                    })}
                                                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] transition-all duration-300 bg-white hover:shadow-md ${
                                                        signupErrors.password ? "border-red-300" : "border-[#DCD0A8] hover:border-[#4A9782]"
                                                    }`}
                                                    placeholder="Create a password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSignupPassword((prev) => !prev)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-all duration-300 hover:scale-110"
                                                >
                                                    {showSignupPassword ? <EyeOff className="w-5 h-5"/> :
                                                        <Eye className="w-5 h-5"/>}
                                                </button>
                                            </div>
                                            {signupErrors.password && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in-down">
                                                    <AlertCircle className="w-4 h-4 animate-pulse"/>
                                                    {signupErrors.password.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className="transform transition-all duration-300">
                                            <label htmlFor="confirm-password"
                                                   className="block text-sm font-semibold text-black mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative group">
                                                <Lock
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A9782] transition-transform duration-300 group-focus-within:scale-110"/>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id="confirm-password"
                                                    {...registerSignup("confirmPassword", {
                                                        required: "Please confirm your password",
                                                        validate: (value) => value === passwordValue || "The passwords do not match",
                                                    })}
                                                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] transition-all duration-300 bg-white hover:shadow-md ${
                                                        signupErrors.confirmPassword ? "border-red-300" : "border-[#DCD0A8] hover:border-[#4A9782]"
                                                    }`}
                                                    placeholder="Confirm your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-all duration-300 hover:scale-110"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5"/> :
                                                        <Eye className="w-5 h-5"/>}
                                                </button>
                                            </div>
                                            {signupErrors.confirmPassword && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in-down">
                                                    <AlertCircle className="w-4 h-4 animate-pulse"/>
                                                    {signupErrors.confirmPassword.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading || isSuccess}
                                            className={`w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white font-semibold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9782] focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden
                                                ${isLoading && "animate-pulse cursor-not-allowed"}
                                                ${isSuccess && "bg-green-500 cursor-not-allowed"}
                                            `}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r from-[#4A9782] to-[#DCD0A8] transition-transform duration-300 ${isSuccess ? 'translate-x-0' : 'translate-x-[-100%]'}`}></div>
                                            <div className="relative flex items-center justify-center space-x-2">
                                                {isSuccess ? (
                                                    <>
                                                        <Check className="w-5 h-5 animate-bounce" />
                                                        <span>Account Created!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'animate-pulse'}`}/>
                                                        <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Accent */}
                    <div className="h-1 bg-gradient-to-r from-[#004030] via-[#4A9782] to-[#DCD0A8] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}