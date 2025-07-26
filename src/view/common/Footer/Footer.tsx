export function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white relative overflow-hidden">
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-[#B0DB9C] via-[#CAE8BD] to-[#DDF6D2]"></div>

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#B0DB9C]/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#CAE8BD]/10 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#B0DB9C] to-[#CAE8BD] rounded-2xl mr-4 flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] bg-clip-text text-transparent">
                                LibraryHub
                            </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed max-w-md mb-8">
                            Your premier destination for discovering, exploring, and managing an extensive collection of books.
                            Join thousands of readers in their literary journey with our comprehensive library management system.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-full flex items-center justify-center hover:from-[#B0DB9C]/30 hover:to-[#CAE8BD]/30 transition-all duration-200 cursor-pointer group">
                                <svg className="w-6 h-6 text-[#B0DB9C] group-hover:text-[#CAE8BD] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-full flex items-center justify-center hover:from-[#B0DB9C]/30 hover:to-[#CAE8BD]/30 transition-all duration-200 cursor-pointer group">
                                <svg className="w-6 h-6 text-[#B0DB9C] group-hover:text-[#CAE8BD] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                </svg>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-full flex items-center justify-center hover:from-[#B0DB9C]/30 hover:to-[#CAE8BD]/30 transition-all duration-200 cursor-pointer group">
                                <svg className="w-6 h-6 text-[#B0DB9C] group-hover:text-[#CAE8BD] transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-[#B0DB9C] flex items-center">
                            <div className="w-2 h-8 bg-gradient-to-b from-[#B0DB9C] to-[#CAE8BD] rounded-full mr-3"></div>
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                { name: 'Browse Books', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                                { name: 'New Arrivals', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { name: 'Popular Books', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                                { name: 'Author Spotlight', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <a href="#" className="text-gray-300 hover:text-[#B0DB9C] transition-colors duration-200 flex items-center group">
                                        <div className="w-8 h-8 bg-[#CAE8BD]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#B0DB9C]/20 transition-colors duration-200">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                                            </svg>
                                        </div>
                                        <span className="font-medium">{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-[#B0DB9C] flex items-center">
                            <div className="w-2 h-8 bg-gradient-to-b from-[#B0DB9C] to-[#CAE8BD] rounded-full mr-3"></div>
                            Contact Us
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5 text-[#B0DB9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-[#CAE8BD] font-semibold">Email</p>
                                    <p className="text-gray-300 hover:text-[#B0DB9C] transition-colors duration-200 cursor-pointer">support@libraryhub.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5 text-[#B0DB9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-[#CAE8BD] font-semibold">Phone</p>
                                    <p className="text-gray-300 hover:text-[#B0DB9C] transition-colors duration-200 cursor-pointer">(123) 456-7890</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5 text-[#B0DB9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-[#CAE8BD] font-semibold">Address</p>
                                    <p className="text-gray-300">123 Library Lane<br/>Book City, BC 12345</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-16 pt-12 border-t border-gray-700">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#B0DB9C] to-[#CAE8BD] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <h4 className="text-2xl font-bold text-[#B0DB9C] mb-3">Stay Updated</h4>
                        <p className="text-gray-300 mb-8 text-lg">Get notified about new book arrivals, exclusive events, and special offers</p>
                        <div className="flex max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 bg-gray-800 rounded-l-lg border border-gray-700 focus:outline-none focus:border-[#B0DB9C] text-white placeholder-gray-400"
                            />
                            <button className="px-6 py-4 bg-gradient-to-r from-[#B0DB9C] to-[#CAE8BD] rounded-r-lg text-gray-900 font-bold hover:shadow-lg hover:from-[#CAE8BD] hover:to-[#ECFAE5] transition-all duration-300">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t border-gray-700">
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        {['About Us', 'Privacy Policy', 'Terms of Service', 'FAQ', 'Support', 'Careers'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-gray-400 hover:text-[#B0DB9C] transition-colors duration-200"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-8 border-t border-gray-800">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#B0DB9C]/20 to-[#CAE8BD]/20 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#B0DB9C]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 112 0v1a1 1 0 11-2 0v-1zm0-3a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-400">© {new Date().getFullYear()} LibraryHub. All rights reserved.</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Designed with <span className="text-[#B0DB9C]">♥</span> for book lovers everywhere
                    </p>
                </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-[#DDF6D2] via-[#CAE8BD] to-[#B0DB9C]"></div>
        </footer>
    );
}