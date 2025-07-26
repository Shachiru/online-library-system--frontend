import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { backendApi } from "../../../api.ts";
import type { UserData } from "../../../model/UserData.ts";
import { getUserFromToken } from "../../../auth/auth.ts";

type FormData = {
    email: string;
    password: string;
};

export function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

    // Debug form state
    console.log("Form state:", watch());

    const authenticateUser = async (data: FormData) => {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden border-2 border-[#CAE8BD]/20">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ECFAE5]/30 to-transparent pointer-events-none"></div>

                {/* Header */}
                <div className="relative text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#B0DB9C] to-[#CAE8BD] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Sign in to access your library account and explore our collection
                    </p>
                </div>

                {/* Go Back Link */}
                <div className="mb-8 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-[#B0DB9C] hover:text-[#CAE8BD] font-medium transition-all duration-200 flex items-center justify-center mx-auto group"
                    >
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(authenticateUser)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                                onChange={(e) => console.log("Email input:", e.target.value)}
                                className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#B0DB9C]/20 focus:border-[#B0DB9C] transition-all duration-200 ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-[#DDF6D2] bg-[#ECFAE5]/30 hover:border-[#CAE8BD]'
                                }`}
                                placeholder="Enter your email address"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-[#CAE8BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                        </div>
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                onChange={(e) => console.log("Password input:", e.target.value)}
                                className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-[#B0DB9C]/20 focus:border-[#B0DB9C] transition-all duration-200 ${
                                    errors.password ? 'border-red-300 bg-red-50' : 'border-[#DDF6D2] bg-[#ECFAE5]/30 hover:border-[#CAE8BD]'
                                }`}
                                placeholder="Enter your password"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-[#CAE8BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white font-semibold py-4 px-6 rounded-xl hover:from-[#CAE8BD] hover:to-[#B0DB9C] focus:outline-none focus:ring-2 focus:ring-[#B0DB9C] focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign In to Library</span>
                    </button>
                </form>

                {/* Additional Links */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Don't have an account?
                        <a href="#" className="text-[#B0DB9C] hover:text-[#CAE8BD] font-medium ml-1 transition-colors duration-200">
                            Contact Admin
                        </a>
                    </p>
                    <a href="#" className="text-sm text-[#CAE8BD] hover:text-[#B0DB9C] transition-colors duration-200">
                        Forgot your password?
                    </a>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD]"></div>
            </div>
        </div>
    );
}