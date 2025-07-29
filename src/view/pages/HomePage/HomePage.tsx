import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {motion, type Variants} from "framer-motion";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {getAllBooks} from "../../../slices/bookSlice.ts";
import {BookCard} from "../../common/BookCard/BookCard.tsx";

export function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const {list} = useSelector((state: RootState) => state.books);

    useEffect(() => {
        dispatch(getAllBooks());
    }, [dispatch]);

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
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const cardVariants: Variants = {
        hidden: {y: 50, opacity: 0, scale: 0.9},
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const floatingAnimation = {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };

    const floatingAnimationDelayed1 = {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1
        }
    };

    const floatingAnimationDelayed2 = {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 2
        }
    };

    const backgroundAnimation1 = {
        x: [0, 100, 0],
        y: [0, -50, 0],
        rotate: [0, 180, 360],
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear" as const
        }
    };

    const backgroundAnimation2 = {
        x: [0, -80, 0],
        y: [0, 30, 0],
        rotate: [360, 180, 0],
        transition: {
            duration: 15,
            repeat: Infinity,
            ease: "linear" as const
        }
    };

    const loadingAnimation = {
        rotateY: [0, 360],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear" as const
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
                className="relative overflow-hidden bg-gradient-to-br from-white via-[#4A9782]/5 to-[#004030]/10 py-16"
            >
                {/* Floating 3D Elements */}
                <motion.div
                    animate={floatingAnimation}
                    className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-[#4A9782]/20 to-[#004030]/20 rounded-xl rotate-12 blur-sm"
                />
                <motion.div
                    animate={floatingAnimationDelayed1}
                    className="absolute top-32 right-20 w-12 h-12 bg-gradient-to-br from-[#004030]/20 to-[#4A9782]/20 rounded-full blur-sm"
                />
                <motion.div
                    animate={floatingAnimationDelayed2}
                    className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-[#4A9782]/15 to-[#004030]/15 rounded-2xl rotate-45 blur-sm"
                />

                <div className="relative container mx-auto px-6 text-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl mx-auto"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                        >
                            Welcome to{" "}
                            <motion.span
                                className="bg-gradient-to-r from-[#004030] to-[#4A9782] bg-clip-text text-transparent"
                                whileHover={{scale: 1.05}}
                                transition={{duration: 0.3}}
                            >
                                LibraryHub
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-[#004030]/70 mb-6 leading-relaxed max-w-2xl mx-auto"
                        >
                            Discover your next favorite book from our extensive collection of literature,
                            fiction, and educational resources.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 30px rgba(0, 64, 48, 0.3)",
                                    rotateY: 5
                                }}
                                whileTap={{scale: 0.95}}
                                className="bg-gradient-to-r from-[#004030] to-[#4A9782] text-white px-6 py-3 rounded-xl font-medium text-base shadow-lg transition-all duration-300 flex items-center space-x-2"
                                style={{transformStyle: "preserve-3d"}}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <span>Explore Books</span>
                            </motion.button>

                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "#4A9782",
                                    color: "white",
                                    rotateY: -5
                                }}
                                whileTap={{scale: 0.95}}
                                className="border-2 border-[#4A9782] text-[#004030] px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 flex items-center space-x-2"
                                style={{transformStyle: "preserve-3d"}}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                </svg>
                                <span>Browse Collection</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8}}
                className="py-12 bg-white border-t border-[#4A9782]/10"
            >
                <div className="container mx-auto px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {[
                            {
                                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                                value: `${list.length}+`,
                                label: "Books"
                            },
                            {
                                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                                value: "500+",
                                label: "Readers"
                            },
                            {
                                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                                value: "25+",
                                label: "Categories"
                            },
                            {
                                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                                value: "24/7",
                                label: "Access"
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 10,
                                    boxShadow: "0 10px 25px rgba(0, 64, 48, 0.15)"
                                }}
                                className="text-center p-4 rounded-xl bg-gradient-to-br from-white to-[#4A9782]/5 border border-[#4A9782]/10 cursor-pointer"
                                style={{transformStyle: "preserve-3d"}}
                            >
                                <motion.div
                                    whileHover={{rotateZ: 360}}
                                    transition={{duration: 0.6}}
                                    className="w-10 h-10 bg-gradient-to-br from-[#004030] to-[#4A9782] rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d={stat.icon}/>
                                    </svg>
                                </motion.div>
                                <h3 className="text-2xl font-bold text-[#004030] mb-1">{stat.value}</h3>
                                <p className="text-[#4A9782] font-medium text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Books Section */}
            <motion.div
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.8}}
                className="py-16"
            >
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{y: 30, opacity: 0}}
                        whileInView={{y: 0, opacity: 1}}
                        viewport={{once: true}}
                        transition={{duration: 0.6}}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#004030] mb-3">
                            Featured <span
                            className="bg-gradient-to-r from-[#004030] to-[#4A9782] bg-clip-text text-transparent">Collection</span>
                        </h2>
                        <p className="text-lg text-[#004030]/70 max-w-xl mx-auto mb-4">
                            Handpicked selections from our extensive library
                        </p>
                        <motion.div
                            initial={{width: 0}}
                            whileInView={{width: 60}}
                            viewport={{once: true}}
                            transition={{duration: 0.8, delay: 0.3}}
                            className="h-1 bg-gradient-to-r from-[#004030] to-[#4A9782] mx-auto rounded-full"
                        />
                    </motion.div>

                    {list.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {list.map((book, index) => (
                                <motion.div
                                    key={book._id}
                                    variants={cardVariants}
                                    custom={index}
                                    whileHover={{
                                        y: -10,
                                        rotateY: 5,
                                        boxShadow: "0 20px 40px rgba(0, 64, 48, 0.2)"
                                    }}
                                    style={{transformStyle: "preserve-3d"}}
                                >
                                    <BookCard data={book}/>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 0.6}}
                            className="text-center py-16"
                        >
                            <motion.div
                                animate={loadingAnimation}
                                className="w-16 h-16 bg-gradient-to-br from-[#004030]/10 to-[#4A9782]/10 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                            >
                                <svg className="w-8 h-8 text-[#4A9782]" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                </svg>
                            </motion.div>
                            <h3 className="text-xl font-bold text-[#004030] mb-2">Loading Collection...</h3>
                            <p className="text-[#4A9782]">Fetching the latest books</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8}}
                className="py-16 bg-gradient-to-r from-[#004030] to-[#4A9782] relative overflow-hidden"
            >
                {/* Animated background elements */}
                <motion.div
                    animate={backgroundAnimation1}
                    className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full"
                />
                <motion.div
                    animate={backgroundAnimation2}
                    className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-xl"
                />

                <div className="relative container mx-auto px-6 text-center">
                    <motion.h2
                        initial={{y: 30, opacity: 0}}
                        whileInView={{y: 0, opacity: 1}}
                        viewport={{once: true}}
                        transition={{duration: 0.6}}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Start Your Reading Journey
                    </motion.h2>

                    <motion.p
                        initial={{y: 30, opacity: 0}}
                        whileInView={{y: 0, opacity: 1}}
                        viewport={{once: true}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="text-lg text-white/90 mb-6 max-w-xl mx-auto"
                    >
                        Join our community of book lovers and discover your next great read
                    </motion.p>

                    <motion.button
                        initial={{y: 30, opacity: 0}}
                        whileInView={{y: 0, opacity: 1}}
                        viewport={{once: true}}
                        transition={{duration: 0.6, delay: 0.4}}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 15px 35px rgba(255, 255, 255, 0.3)",
                            rotateY: 5
                        }}
                        whileTap={{scale: 0.95}}
                        className="bg-white text-[#004030] px-6 py-3 rounded-xl font-bold text-base shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                        style={{transformStyle: "preserve-3d"}}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                        <span>Explore Library</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}