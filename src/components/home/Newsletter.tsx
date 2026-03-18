"use client";

import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="bg-[#f4f0e6] py-24 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#e6dfc8]/30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
            <span className="text-3xl">📫</span>
          </div>
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-syne text-gray-900 leading-tight mb-6">
          Stay in the <br />
          <span className="text-primary-green relative">
            eco loop
            <svg
              className="absolute w-full h-4 -bottom-3 left-0 text-primary-green opacity-50"
              viewBox="0 0 200 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 9.5C35 3.5 100 -1.5 199 8.5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
            </svg>
          </span>
        </h2>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Get community highlights, top-rated ideas, and green funding alerts
          delivered securely once a week. Unsubscribe anytime.
        </p>

        <form className="max-w-lg mx-auto relative flex items-center shadow-lg rounded-full overflow-hidden bg-white border border-gray-200">
          <input
            type="email"
            placeholder="john@email.com"
            className="w-full py-5 pl-6 pr-36 focus:outline-none focus:ring-2 focus:ring-primary-green/20 rounded-full font-dm text-gray-800 placeholder-gray-400"
            required
          />
          <Button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-primary-green hover:bg-primary-green/90 text-white rounded-full px-8 py-6 text-sm font-semibold transition-transform hover:scale-105"
          >
            Subscribe <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-sm text-gray-400 mt-6 font-medium">
          Join 24,000+ eco-warriors 🌍 No spam, strictly planet-saving stuff.
        </p>
      </motion.div>
    </section>
  );
}
