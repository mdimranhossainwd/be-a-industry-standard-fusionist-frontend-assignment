"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 text-primary-green font-medium text-sm">
            <span>✨</span> 2.4K+ IDEAS SHARED GLOBALLY
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold font-syne leading-[1.1] text-gray-900">
            Ideas <br />
            that{" "}
            <span className="font-instrument italic text-primary-green font-normal">
              spark
            </span>{" "}
            real <br />
            <span className="relative inline-block">
              change
              <svg
                className="absolute w-full h-3 -bottom-2 left-0 text-primary-green"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.20399 9.38971C35.0931 3.25148 100.22 -1.41113 198.887 8.35859"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="8 8"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 max-w-md text-lg leading-relaxed">
            A platform where eco-conscious minds share groundbreaking ideas.
            Join the movement to ignite sustainable change, fund solutions and
            inspire the world.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button className="bg-[#1A6B3C] hover:bg-primary-green/90 text-white rounded-full px-8 py-6 text-base font-medium transition-transform hover:scale-105">
              Explore Ideas <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-medium border-gray-300 hover:bg-gray-50 transition-transform hover:scale-105"
            >
              <Play className="mr-2 w-4 h-4 fill-current" /> How it Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 mt-4 border-t border-gray-200">
            <div>
              <p className="text-3xl font-bold font-syne text-gray-900">
                2.4K+
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">
                Ideas Shared
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold font-syne text-gray-900">
                15.0K+
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">
                Upvotes
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold font-syne text-gray-900">340+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">
                Projects Funded
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Floating Card */}
        <div className="relative h-[500px] flex items-center justify-center lg:justify-end">
          {/* Gradient Blob background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary-green/20 rounded-full blur-[80px]"></div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-2"
          >
            {/* Card Image Placeholder */}
            <div className="w-full h-56 bg-[#f0ebd8] rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#f4f0e6] to-[#e6dfc8]">
              <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
                {/* Sun icon representing solar energy */}
                <span className="text-3xl">☀️</span>
              </div>
            </div>

            {/* Tag */}
            <div className="mt-6 px-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                Energy
              </span>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <h3 className="text-xl font-bold font-syne text-gray-900 leading-tight">
                Community Solar Grid for Rural Communities
              </h3>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                A project focusing on building large-scale solar grids to
                support areas without access to safe and stable electricity.
              </p>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  John Doe
                </span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-semibold text-sm">
                <span className="text-lg leading-none mb-0.5">⬆</span> 1.2K
              </div>
            </div>

            {/* Floating small badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white shadow-xl rounded-xl p-3 border border-gray-100 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Top Voted Idea 🚀
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
