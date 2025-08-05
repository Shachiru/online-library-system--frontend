import {motion, type Variants} from "framer-motion";
import {
    BookOpen,
    Mail,
    Phone,
    MapPin,
    Home,
    Star,
    Clock,
    User
} from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const containerVariants: Variants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: {y: 20, opacity: 0},
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const socialVariants: Variants = {
        hidden: {scale: 0, rotate: -180},
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring" as const,
                stiffness: 200,
                damping: 15
            }
        }
    };

    const backgroundAnimation1 = {
        x: [0, 50, 0],
        y: [0, -30, 0],
        rotate: [0, 180, 360],
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear" as const
        }
    };

    const backgroundAnimation2 = {
        x: [0, -40, 0],
        y: [0, 20, 0],
        rotate: [360, 180, 0],
        transition: {
            duration: 15,
            repeat: Infinity,
            ease: "linear" as const
        }
    };

    const quickLinks = [
        {name: 'Home', icon: Home},
        {name: 'Browse Books', icon: BookOpen},
        {name: 'New Arrivals', icon: Clock},
        {name: 'Popular', icon: Star},
        {name: 'Authors', icon: User}
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            href: 'https://facebook.com',
            icon: () => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            )
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com',
            icon: () => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            )
        },
        {
            name: 'Instagram',
            href: 'https://instagram.com',
            icon: () => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.435-3.396-1.377-.947-.942-1.377-2.093-1.377-3.396s.43-2.448 1.377-3.396c.948-.947 2.099-1.377 3.396-1.377s2.448.43 3.396 1.377c.946.948 1.376 2.099 1.376 3.396s-.43 2.454-1.376 3.396c-.948.942-2.099 1.377-3.396 1.377zm7.598-9.02h-1.78c-.893 0-1.327-.434-1.327-1.327v-1.78c0-.893.434-1.327 1.327-1.327h1.78c.893 0 1.327.434 1.327 1.327v1.78c0 .893-.434 1.327-1.327 1.327z"/>
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com',
            icon: () => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            )
        },
        {
            name: 'GitHub',
            href: 'https://github.com',
            icon: () => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            )
        }
    ];

    return (
        <motion.footer
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="bg-white dark:bg-[#004030] border-t border-[#4A9782]/20 relative overflow-hidden"
        >
            {/* Background decorative elements */}
            <motion.div
                animate={backgroundAnimation1}
                className="absolute top-5 right-10 w-20 h-20 bg-[#4A9782]/5 rounded-full"
            />
            <motion.div
                animate={backgroundAnimation2}
                className="absolute bottom-5 left-10 w-16 h-16 bg-[#004030]/5 rounded-xl"
            />

            <div className="container mx-auto px-6 py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {/* Brand Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        {/* Professional Logo */}
                        <div className="flex items-center mb-6">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-[#004030] to-[#4A9782] rounded-xl mr-4 flex items-center justify-center shadow-lg border border-[#4A9782]/20">
                                <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5}/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-[#004030] dark:text-white leading-tight">
                                    Library<span className="text-[#4A9782]">Hub</span>
                                </span>
                                <span className="text-xs text-[#4A9782] font-medium tracking-wider uppercase">
                                    Digital Library System
                                </span>
                            </div>
                        </div>

                        <p className="text-[#004030]/70 dark:text-white/70 text-sm leading-relaxed mb-6">
                            Your premier destination for discovering and managing an extensive collection of books.
                            Join thousands of readers in their literary journey.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex space-x-2">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={socialVariants}
                                    custom={index}
                                    whileHover={{
                                        scale: 1.1,
                                        rotateY: 15,
                                        boxShadow: "0 5px 15px rgba(0, 64, 48, 0.3)"
                                    }}
                                    whileTap={{scale: 0.9}}
                                    className="w-8 h-8 bg-[#4A9782]/10 dark:bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#4A9782] dark:hover:bg-[#4A9782] transition-all duration-300 group"
                                    style={{transformStyle: "preserve-3d"}}
                                >
                                    <div
                                        className="text-[#004030] dark:text-white group-hover:text-white transition-colors duration-300">
                                        <social.icon/>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold text-[#004030] dark:text-white mb-4 flex items-center">
                            <motion.div
                                whileHover={{scale: 1.2}}
                                className="w-1 h-6 bg-gradient-to-b from-[#004030] to-[#4A9782] rounded-full mr-2"
                            />
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <motion.li
                                    key={link.name}
                                    initial={{x: -20, opacity: 0}}
                                    whileInView={{x: 0, opacity: 1}}
                                    transition={{delay: index * 0.1}}
                                    viewport={{once: true}}
                                >
                                    <motion.a
                                        href="#"
                                        whileHover={{
                                            x: 5,
                                            color: "#4A9782"
                                        }}
                                        className="text-[#004030]/70 dark:text-white/70 hover:text-[#4A9782] dark:hover:text-[#4A9782] transition-all duration-200 flex items-center group text-sm"
                                    >
                                        <motion.div
                                            whileHover={{rotate: 360}}
                                            transition={{duration: 0.3}}
                                            className="w-6 h-6 bg-[#4A9782]/10 dark:bg-white/10 rounded-md flex items-center justify-center mr-2 group-hover:bg-[#4A9782]/20 transition-colors duration-200"
                                        >
                                            <link.icon className="w-3 h-3"/>
                                        </motion.div>
                                        {link.name}
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold text-[#004030] dark:text-white mb-4 flex items-center">
                            <motion.div
                                whileHover={{scale: 1.2}}
                                className="w-1 h-6 bg-gradient-to-b from-[#004030] to-[#4A9782] rounded-full mr-2"
                            />
                            Contact
                        </h3>
                        <div className="space-y-3">
                            {[
                                {icon: Mail, label: 'Email', value: 'shachirurashmika35@gmail.com'},
                                {icon: Phone, label: 'Phone', value: '+94 77 927 6268'},
                                {icon: MapPin, label: 'Address', value: 'No.247/D, Beliatta, SriLanka'}
                            ].map((contact, index) => (
                                <motion.div
                                    key={contact.label}
                                    initial={{x: 20, opacity: 0}}
                                    whileInView={{x: 0, opacity: 1}}
                                    transition={{delay: index * 0.1}}
                                    viewport={{once: true}}
                                    whileHover={{x: 5}}
                                    className="flex items-start space-x-3 cursor-pointer group"
                                >
                                    <motion.div
                                        whileHover={{
                                            scale: 1.1,
                                            rotateY: 15,
                                            boxShadow: "0 5px 15px rgba(74, 151, 130, 0.3)"
                                        }}
                                        className="w-7 h-7 bg-[#4A9782]/10 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#4A9782]/20 transition-all duration-300"
                                        style={{transformStyle: "preserve-3d"}}
                                    >
                                        <contact.icon className="w-3.5 h-3.5 text-[#4A9782]"/>
                                    </motion.div>
                                    <div>
                                        <p className="text-xs text-[#4A9782] font-medium">{contact.label}</p>
                                        <p className="text-sm text-[#004030]/70 dark:text-white/70 group-hover:text-[#4A9782] dark:group-hover:text-[#4A9782] transition-colors duration-200">
                                            {contact.value}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold text-[#004030] dark:text-white mb-4 flex items-center">
                            <motion.div
                                whileHover={{scale: 1.2}}
                                className="w-1 h-6 bg-gradient-to-b from-[#004030] to-[#4A9782] rounded-full mr-2"
                            />
                            Newsletter
                        </h3>
                        <p className="text-sm text-[#004030]/70 dark:text-white/70 mb-4">
                            Get updates on new arrivals and events
                        </p>
                        <div className="space-y-2">
                            <motion.input
                                whileFocus={{
                                    scale: 1.02,
                                    boxShadow: "0 0 20px rgba(74, 151, 130, 0.3)"
                                }}
                                type="email"
                                placeholder="Your email"
                                className="w-full px-3 py-2 text-sm border border-[#4A9782]/20 rounded-lg bg-white dark:bg-[#004030] text-[#004030] dark:text-white placeholder-[#4A9782]/60 focus:border-[#4A9782] focus:outline-none transition-all duration-200"
                            />
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 15px rgba(0, 64, 48, 0.3)",
                                    rotateY: 5
                                }}
                                whileTap={{scale: 0.95}}
                                className="w-full bg-gradient-to-r from-[#004030] to-[#4A9782] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-300"
                                style={{transformStyle: "preserve-3d"}}
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: 0.4}}
                    className="mt-8 pt-6 border-t border-[#4A9782]/20"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Footer Links */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            {['Privacy Policy', 'Terms of Service', 'FAQ', 'Support'].map((item, index) => (
                                <motion.a
                                    key={item}
                                    href="#"
                                    initial={{opacity: 0, y: 10}}
                                    whileInView={{opacity: 1, y: 0}}
                                    transition={{delay: index * 0.1}}
                                    viewport={{once: true}}
                                    whileHover={{
                                        color: "#4A9782",
                                        y: -2
                                    }}
                                    className="text-[#004030]/60 dark:text-white/60 hover:text-[#4A9782] dark:hover:text-[#4A9782] transition-all duration-200"
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </div>

                        {/* Copyright */}
                        <motion.div
                            initial={{opacity: 0}}
                            whileInView={{opacity: 1}}
                            viewport={{once: true}}
                            transition={{delay: 0.6}}
                            className="flex items-center text-sm text-[#004030]/60 dark:text-white/60"
                        >
                            <span>© {currentYear} LibraryHub. Made for Book lovers.</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
}