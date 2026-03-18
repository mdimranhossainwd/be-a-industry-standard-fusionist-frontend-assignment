"use client";

import * as motion from "framer-motion/client";

export default function Marquee() {
  const words = [
    "100% RENEWABLE",
    "IDEAS THAT SCORE",
    "GREEN ENERGY",
    "SUSTAINABLE LIFESTYLES",
    "ZERO EMISSIONS",
    "CLEAN TECH",
  ];

  return (
    <div className="w-full bg-[#11231a] py-4 overflow-hidden border-y border-white/10 flex items-center relative z-10">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap min-w-full"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              {words.map((word, j) => (
                <div key={`${i}-${j}`} className="flex items-center gap-8">
                  <span className="text-white font-syne font-bold tracking-widest text-sm whitespace-nowrap">
                    {word}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-green"></div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
