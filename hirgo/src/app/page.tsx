'use client';

import SearchComponent from "@/components/SearchComponent";
import {FeaturesSection} from "@/components/features-section";
import {CvCarousel} from "@/components/cv-carousel";
import {PremiumJobPostings} from "@/components/premium-job-postings";
import {FooterComponent} from "@/components/footer";
import { motion } from "framer-motion";

// If using Next.js 13+ with app directory, we need to make this a client component

export default function Dashboard() {
    return (
        <>
            <div className="relative w-full h-80 flex flex-col items-center justify-center overflow-hidden">
                {/* Background with gradient and pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
                    <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]"/>
                </div>

                {/* Animated circles */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                {/* Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full">
                    <motion.h1
                        className="text-white font-bold text-5xl sm:text-6xl lg:text-7xl mb-6"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                    >
                        <span className="block mb-2">İdeal işini tap</span>
                        {/*<span className="block">Axtarışa indi başla</span>*/}
                    </motion.h1>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.3}}
                    >
                        <SearchComponent/>
                    </motion.div>
                </div>

                {/* Decorative elements */}
            </div>
            <FeaturesSection/>
            <CvCarousel/>
            <PremiumJobPostings/>
            <FooterComponent/>
        </>
    );
};