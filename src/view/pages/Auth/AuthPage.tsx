import {useState, useEffect} from "react"
import {useForm} from "react-hook-form"
import {Eye, EyeOff, Mail, Lock, User, ArrowLeft, LogIn, UserPlus, AlertCircle, Check, Sparkles, Shield, BookOpen} from "lucide-react"
import {motion, AnimatePresence, type Variants} from "framer-motion"
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
        setIsLoginForm(isLogin);
        navigate(isLogin ? '/login' : '/signup');
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
            const { name, email, password } = data;

            const response = await backendApi.post('/auth/register', { name, email, password });
            console.log("Signup response:", response.data);

            if (response.status === 201) {
                setIsSuccess(true);
                setTimeout(() => {
                    toggleForm(true);
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

    // Animation variants with proper typing
    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99],
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            rotateY: -15
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const formVariants: Variants = {
        hidden: {
            opacity: 0,
            x: isLoginForm ? -50 : 50
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.6, -0.05, 0.01, 0.99],
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            x: isLoginForm ? 50 : -50,
            transition: {
                duration: 0.3,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const inputVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        },
        focus: {
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const buttonVariants: Variants = {
        hover: {
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0, 64, 48, 0.25)",
            transition: {
                duration: 0.2,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        },
        tap: {
            scale: 0.98
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -left-40 w-80 h-80 bg-[#004030] rounded-full opacity-5"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#4A9782] rounded-full opacity-5"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#4A9782] rounded-full opacity-3"
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <motion.div
                className="w-full max-w-md z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Back Button */}
                <motion.button
                    onClick={() => navigate("/")}
                    className="mb-8 flex items-center gap-2 text-[#004030] hover:text-[#4A9782] transition-colors duration-300 group bg-white/80 backdrop-blur-sm py-3 px-6 rounded-full shadow-lg hover:shadow-xl border border-gray-200/50"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    variants={inputVariants}
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"/>
                    <span className="font-medium">Back to Home</span>
                </motion.button>

                {/* Main Card */}
                <motion.div
                    className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 overflow-hidden"
                    variants={cardVariants}
                    whileHover={{
                        y: -5,
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    {/* Header */}
                    <motion.div
                        className="bg-gradient-to-r from-[#004030] to-[#4A9782] px-8 py-10 text-center relative overflow-hidden"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {/* Floating Decorative Elements */}
                        <motion.div
                            className="absolute top-6 left-6 text-white/20"
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                        <motion.div
                            className="absolute top-6 right-6 text-white/20"
                            animate={{
                                rotate: -360,
                                y: [0, -10, 0]
                            }}
                            transition={{
                                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            <BookOpen className="w-6 h-6" />
                        </motion.div>

                        {/* Icon Container */}
                        <motion.div
                            className="w-20 h-20 bg-white/15 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-white/20"
                            whileHover={{
                                scale: 1.1,
                                rotate: 5,
                                backgroundColor: "rgba(255, 255, 255, 0.2)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isLoginForm ? 'login' : 'signup'}
                                    initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                                    transition={{ duration: 0.5, ease: "backOut" }}
                                >
                                    {isLoginForm ? (
                                        <LogIn className="w-10 h-10 text-white"/>
                                    ) : (
                                        <UserPlus className="w-10 h-10 text-white"/>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Header Text */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLoginForm ? 'login-text' : 'signup-text'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    {isLoginForm ? "Welcome Back" : "Join Our Library"}
                                </h1>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    {isLoginForm
                                        ? "Sign in to access your digital library and explore our vast collection"
                                        : "Create your account and discover a world of knowledge at your fingertips"}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Gradient Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </motion.div>

                    {/* Form Toggle Tabs */}
                    <div className="relative flex bg-gray-50/50 border-b border-gray-200/50">
                        <motion.div
                            className="absolute top-0 h-full bg-white shadow-sm rounded-t-lg z-0"
                            animate={{
                                x: isLoginForm ? 0 : "100%",
                                width: "50%"
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        />

                        <motion.button
                            onClick={() => toggleForm(true)}
                            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                                isLoginForm ? "text-[#004030]" : "text-gray-500 hover:text-[#004030]"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LogIn className="w-4 h-4"/>
                            Sign In
                        </motion.button>

                        <motion.button
                            onClick={() => toggleForm(false)}
                            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                                !isLoginForm ? "text-[#004030]" : "text-gray-500 hover:text-[#004030]"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <UserPlus className="w-4 h-4"/>
                            Sign Up
                        </motion.button>
                    </div>

                    {/* Forms Container */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {isLoginForm ? (
                                <motion.form
                                    key="login-form"
                                    onSubmit={handleLoginSubmit(authenticateUser)}
                                    className="space-y-6"
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {/* Email Field */}
                                    <motion.div variants={inputVariants}>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Address
                                        </label>
                                        <motion.div
                                            className="relative"
                                            whileFocus="focus"
                                        >
                                            <motion.div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Mail className="w-5 h-5 text-[#4A9782]"/>
                                            </motion.div>
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
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#4A9782]/20 focus:border-[#4A9782] transition-all duration-300 bg-white ${
                                                    loginErrors.email ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-[#4A9782]/50"
                                                }`}
                                                placeholder="Enter your email address"
                                            />
                                        </motion.div>
                                        <AnimatePresence>
                                            {loginErrors.email && (
                                                <motion.p
                                                    className="mt-2 text-sm text-red-600 flex items-center gap-2"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <AlertCircle className="w-4 h-4"/>
                                                    {loginErrors.email.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div variants={inputVariants}>
                                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Password
                                        </label>
                                        <motion.div
                                            className="relative"
                                            whileFocus="focus"
                                        >
                                            <motion.div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Lock className="w-5 h-5 text-[#4A9782]"/>
                                            </motion.div>
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
                                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#4A9782]/20 focus:border-[#4A9782] transition-all duration-300 bg-white ${
                                                    loginErrors.password ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-[#4A9782]/50"
                                                }`}
                                                placeholder="Enter your password"
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-colors duration-300"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showLoginPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </motion.button>
                                        </motion.div>
                                        <AnimatePresence>
                                            {loginErrors.password && (
                                                <motion.p
                                                    className="mt-2 text-sm text-red-600 flex items-center gap-2"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <AlertCircle className="w-4 h-4"/>
                                                    {loginErrors.password.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || isSuccess}
                                        className="w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/20 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden disabled:cursor-not-allowed"
                                        variants={buttonVariants}
                                        whileHover={!isLoading && !isSuccess ? "hover" : {}}
                                        whileTap={!isLoading && !isSuccess ? "tap" : {}}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {/* Success Background */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: isSuccess ? "0%" : "-100%" }}
                                            transition={{ duration: 0.5 }}
                                        />

                                        <AnimatePresence mode="wait">
                                            {isSuccess ? (
                                                <motion.div
                                                    key="success"
                                                    className="flex items-center space-x-2 relative z-10"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                >
                                                    <motion.div
                                                        animate={{ rotate: [0, 360] }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <Check className="w-5 h-5"/>
                                                    </motion.div>
                                                    <span>Success!</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="login"
                                                    className="flex items-center space-x-2 relative z-10"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                >
                                                    <motion.div
                                                        animate={isLoading ? { rotate: 360 } : {}}
                                                        transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                                                    >
                                                        <LogIn className="w-5 h-5"/>
                                                    </motion.div>
                                                    <span>{isLoading ? "Signing In..." : "Sign In to Library"}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    {/* Forgot Password */}
                                    <motion.div
                                        className="text-center"
                                        variants={inputVariants}
                                    >
                                        <motion.a
                                            href="#"
                                            className="text-sm text-[#004030] hover:text-[#4A9782] transition-colors duration-300 inline-flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Shield className="w-4 h-4"/>
                                            Forgot your password?
                                        </motion.a>
                                    </motion.div>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="signup-form"
                                    onSubmit={handleSignupSubmit(registerUser)}
                                    className="space-y-6"
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {/* Name Field */}
                                    <motion.div variants={inputVariants}>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Full Name
                                        </label>
                                        <motion.div
                                            className="relative"
                                            whileFocus="focus"
                                        >
                                            <motion.div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <User className="w-5 h-5 text-[#4A9782]"/>
                                            </motion.div>
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
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#4A9782]/20 focus:border-[#4A9782] transition-all duration-300 bg-white ${
                                                    signupErrors.name ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-[#4A9782]/50"
                                                }`}
                                                placeholder="Enter your full name"
                                            />
                                        </motion.div>
                                        <AnimatePresence>
                                            {signupErrors.name && (
                                                <motion.p
                                                    className="mt-2 text-sm text-red-600 flex items-center gap-2"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <AlertCircle className="w-4 h-4"/>
                                                    {signupErrors.name.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Email Field */}
                                    <motion.div variants={inputVariants}>
                                        <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Address
                                        </label>
                                        <motion.div
                                            className="relative"
                                            whileFocus="focus"
                                        >
                                            <motion.div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Mail className="w-5 h-5 text-[#4A9782]"/>
                                            </motion.div>
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
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#4A9782]/20 focus:border-[#4A9782] transition-all duration-300 bg-white ${
                                                    signupErrors.email ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-[#4A9782]/50"
                                                }`}
                                                placeholder="Enter your email address"
                                            />
                                        </motion.div>
                                        <AnimatePresence>
                                            {signupErrors.email && (
                                                <motion.p
                                                    className="mt-2 text-sm text-red-600 flex items-center gap-2"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <AlertCircle className="w-4 h-4"/>
                                                    {signupErrors.email.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div variants={inputVariants}>
                                        <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Password
                                        </label>
                                        <motion.div
                                            className="relative"
                                            whileFocus="focus"
                                        >
                                            <motion.div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Lock className="w-5 h-5 text-[#4A9782]"/>
                                            </motion.div>
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
                                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#4A9782]/20 focus:border-[#4A9782] transition-all duration-300 bg-white ${
                                                    signupErrors.password ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-[#4A9782]/50"
                                                }`}
                                                placeholder="Create a password"
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-colors duration-300"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showSignupPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </motion.button>
                                        </motion.div>
                                        <AnimatePresence>
                                            {signupErrors.password && (
                                                <motion.p
                                                    className="mt-2 text-sm text-red-600 flex items-center gap-2"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <AlertCircle className="w-4 h-4"/>
                                                    {signupErrors.password.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Confirm Password Field */}
                                    <motion.div variants={inputVariants}>
                                        <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-3">
                                            Confirm Password
                                        </label>
                                        <motion.div
                                            className="relative"
                                            whileFocus="focus"
                                        >
                                            <motion.div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Lock className="w-5 h-5 text-[#4A9782]"/>
                                            </motion.div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirm-password"
                                                {...registerSignup("confirmPassword", {
                                                    required: "Please confirm your password",
                                                    validate: (value) => value === passwordValue || "The passwords do not match",
                                                })}
                                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#4A9782]/20 focus:border-[#4A9782] transition-all duration-300 bg-white ${
                                                    signupErrors.confirmPassword ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-[#4A9782]/50"
                                                }`}
                                                placeholder="Confirm your password"
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4A9782] hover:text-[#004030] transition-colors duration-300"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </motion.button>
                                        </motion.div>
                                        <AnimatePresence>
                                            {signupErrors.confirmPassword && (
                                                <motion.p
                                                    className="mt-2 text-sm text-red-600 flex items-center gap-2"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <AlertCircle className="w-4 h-4"/>
                                                    {signupErrors.confirmPassword.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || isSuccess}
                                        className="w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9782]/20 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden disabled:cursor-not-allowed"
                                        variants={buttonVariants}
                                        whileHover={!isLoading && !isSuccess ? "hover" : {}}
                                        whileTap={!isLoading && !isSuccess ? "tap" : {}}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {/* Success Background */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: isSuccess ? "0%" : "-100%" }}
                                            transition={{ duration: 0.5 }}
                                        />

                                        <AnimatePresence mode="wait">
                                            {isSuccess ? (
                                                <motion.div
                                                    key="success"
                                                    className="flex items-center space-x-2 relative z-10"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                >
                                                    <motion.div
                                                        animate={{ rotate: [0, 360] }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <Check className="w-5 h-5"/>
                                                    </motion.div>
                                                    <span>Account Created!</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="signup"
                                                    className="flex items-center space-x-2 relative z-10"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                >
                                                    <motion.div
                                                        animate={isLoading ? { rotate: 360 } : {}}
                                                        transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                                                    >
                                                        <UserPlus className="w-5 h-5"/>
                                                    </motion.div>
                                                    <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}