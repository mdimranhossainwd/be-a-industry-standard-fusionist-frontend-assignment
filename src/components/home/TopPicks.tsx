"use client";

import * as motion from "framer-motion/client";
import { ArrowUpRight } from "lucide-react";

export default function TopPicks() {
  const topIdeas = [
    {
      rank: 1,
      title: "Floating Solar on Canals",
      desc: "Our top voted idea this month: covering irrigation channels to halt water loss while powering communities.",
      upvotes: "4.5K",
      comments: "128",
      category: "Energy",
      author: "Sarah Doe",
    },
    {
      rank: 2,
      title: "Jute Biodegradable Packaging",
      desc: "Replacing plastic from fast-moving consumer goods with locally-sourced jute packaging that roots in 30 days.",
      upvotes: "3.2K",
      comments: "94",
      category: "Waste",
      author: "Robert Fox",
    },
    {
      rank: 3,
      title: "Solar rickshaw hubs",
      desc: "Transforming the transport network by turning clean transport into a centrally accessible, huge system.",
      upvotes: "2.8K",
      comments: "72",
      category: "Transport",
      author: "Eleanor Pena",
    },
  ];

  return (
    <section className="bg-[#071810] py-24 relative overflow-hidden">
      {/* Background Dots Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 mb-4 rounded-full bg-yellow-500/10 text-yellow-500 font-bold text-xs uppercase tracking-widest border border-yellow-500/20">
              ⚡ TOP RATED
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-syne text-white leading-tight">
              The community's <br />
              <span className="text-primary-green">top 3 picks</span>
            </h2>
          </div>
          <p className="text-gray-400 mt-6 md:mt-0 font-medium tracking-wide">
            Explore trending projects and back the solutions of the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {topIdeas.map((idea, idx) => (
            <motion.div
              key={idea.rank}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors cursor-pointer overflow-hidden backdrop-blur-sm"
            >
              {/* Giant Number Background */}
              <div className="absolute -right-4 -top-8 text-[180px] font-bold font-syne text-white/5 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                #{idea.rank}
              </div>

              <div className="relative z-10">
                <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary-green mb-4">
                  <span className="w-1.5 h-1.5 bg-primary-green rounded-full mr-2"></span>
                  {idea.category}
                </span>

                <h3 className="text-2xl font-bold font-syne text-white mb-4 group-hover:text-primary-green transition-colors">
                  {idea.title}
                </h3>

                <p className="text-gray-400 text-sm md:text-base mb-8 line-clamp-3 leading-relaxed">
                  {idea.desc}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="flex items-center gap-4 text-sm font-semibold text-white/80">
                    <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5 text-primary-green" />{" "}
                      {idea.upvotes}
                    </span>
                    <span className="text-gray-500">💬 {idea.comments}</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-green text-sm font-bold flex items-center gap-1">
                    View Idea &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
