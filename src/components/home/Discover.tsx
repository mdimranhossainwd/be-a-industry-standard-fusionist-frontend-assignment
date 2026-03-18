"use client";

import { Button } from "@/components/ui/button";
import { Search, Zap, Trash2, Car, Droplet, Leaf, Building2 } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Discover() {
  const categories = [
    { name: "All", icon: null },
    { name: "Energy", icon: <Zap className="w-4 h-4" /> },
    { name: "Waste", icon: <Trash2 className="w-4 h-4" /> },
    { name: "Transportation", icon: <Car className="w-4 h-4" /> },
    { name: "Water", icon: <Droplet className="w-4 h-4" /> },
    { name: "Biodiversity", icon: <Leaf className="w-4 h-4" /> },
    { name: "Urban", icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col mb-8">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary-green/10 text-primary-green font-bold text-xs uppercase tracking-widest">
            FIND IDEAS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-syne text-gray-900 leading-tight">
            Discover <span className="text-primary-green">sustainable</span> <br/> solutions near you
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl text-lg">
            Search thousands of community ideas and discover solutions that matter most to you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-2xl bg-white rounded-full p-2 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary-green/20 focus-within:border-primary-green transition-all mt-8">
          <Search className="w-5 h-5 text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Search ideas by topic, category, location..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder:text-gray-400 font-dm"
          />
          <Button className="bg-primary-green hover:bg-primary-green/90 text-white rounded-full px-8 py-6 flex items-center gap-2 text-base font-medium">
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          {categories.map((cat, idx) => (
            <button
              key={cat.name}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                idx === 0 
                ? "bg-gray-100 text-gray-900 border-gray-200" 
                : "bg-white text-gray-600 border-gray-200 hover:border-primary-green hover:text-primary-green shadow-sm"
              }`}
            >
              <span className={idx === 1 || idx === 3 ? "text-blue-500" : idx === 2 ? "text-amber-500" : idx === 4 ? "text-cyan-500" : idx === 5 ? "text-green-500" : idx === 6 ? "text-orange-500" : ""}>
                {cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
