import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getAllBooks } from "../../../slices/bookSlice.ts";
import { BookCard } from "../../common/BookCard/BookCard.tsx";

export function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.books);

    useEffect(() => {
        dispatch(getAllBooks());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ECFAE5] via-white to-[#DDF6D2]">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] py-20">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#B0DB9C]/20 to-transparent rounded-full -translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#CAE8BD]/20 to-transparent rounded-full translate-x-48 translate-y-48"></div>

                <div className="relative container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Welcome to{" "}
                            <span className="bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] bg-clip-text text-transparent">
                                LibraryHub
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                            Discover your next favorite book from our extensive collection of literature,
                            fiction, and educational resources. Your gateway to endless knowledge and adventure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-[#CAE8BD] hover:to-[#B0DB9C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Explore Books</span>
                            </button>
                            <button className="border-2 border-[#CAE8BD] text-[#B0DB9C] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#CAE8BD] hover:text-white transition-all duration-300 flex items-center space-x-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Learn More</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-white/60 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#B0DB9C] to-[#CAE8BD] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">{list.length}+</h3>
                            <p className="text-gray-600 font-medium">Books Available</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#CAE8BD] to-[#DDF6D2] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">1000+</h3>
                            <p className="text-gray-600 font-medium">Happy Readers</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#DDF6D2] to-[#ECFAE5] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <svg className="w-8 h-8 text-[#B0DB9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
                            <p className="text-gray-600 font-medium">Genres</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#B0DB9C]/80 to-[#CAE8BD]/80 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">24/7</h3>
                            <p className="text-gray-600 font-medium">Access</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Section */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Featured <span className="bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] bg-clip-text text-transparent">Books</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover handpicked selections from our extensive library collection
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] mx-auto mt-6 rounded-full"></div>
                    </div>

                    {list.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {list.map((book) => (
                                <BookCard key={book._id} data={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] rounded-3xl mx-auto mb-6 flex items-center justify-center">
                                <svg className="w-12 h-12 text-[#CAE8BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">Loading Books...</h3>
                            <p className="text-gray-500">We're fetching the latest books from our collection</p>
                            <div className="flex justify-center mt-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B0DB9C]"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Reading?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of book lovers and start your literary journey today
                    </p>
                    <button className="bg-white text-[#B0DB9C] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Browse All Books</span>
                    </button>
                </div>
            </div>
        </div>
    );
}