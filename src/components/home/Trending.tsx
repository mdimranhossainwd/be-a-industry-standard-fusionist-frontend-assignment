"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Trending() {
  const ideas = [
    {
      title: "Floating Solar Panels on Irrigation Canals",
      desc: "An innovative design to cover canals with solar panels, producing renewable energy while reducing water evaporation in arid regions.",
      category: "Energy",
      author: "Sarah Doe",
      upvotes: "1.2K",
      bgColor: "bg-[#f4f0e6]",
      emoji: "☀️",
      avatar: "1",
    },
    {
      title: "Biodegradable Packaging from Jute Plant",
      desc: "An eco-friendly alternative to single-use plastics made from readily available jute resources, completely compostable within 30 days.",
      category: "Waste",
      author: "Robert Fox",
      upvotes: "980",
      bgColor: "bg-green-100/50",
      emoji: "♻️",
      avatar: "2",
    },
    {
      title: "Pedal-Powered Rickshaws: Charging Hubs",
      desc: "Modify traditional cyclerickshaws with dynamos to store energy during rides, acting as mobile charging points for phones.",
      category: "Transportation",
      author: "Eleanor Pena",
      upvotes: "756",
      bgColor: "bg-blue-100",
      emoji: "🚲",
      avatar: "3",
    },
    {
      title: "Rainwater Harvesting Rooftop Tiles",
      desc: "Specially designed modular tiles that absorb and filter rainwater instantly, channeling it directly to household storage systems.",
      category: "Water",
      author: "Bessie Cooper",
      upvotes: "624",
      bgColor: "bg-cyan-100",
      emoji: "💧",
      avatar: "4",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary-green/10 text-primary-green font-bold text-xs uppercase tracking-widest">
            FEATURED IDEAS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-syne text-gray-900 leading-tight">
            Ideas making <br className="hidden md:block"/>
            <span className="font-instrument italic text-primary-green">waves</span> right now
          </h2>
        </div>
        <Button variant="outline" className="mt-6 md:mt-0 rounded-full px-6 py-5 border-gray-300 hover:bg-gray-50 text-gray-700">
          View all ideas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ideas.map((idea, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group block bg-white border border-gray-100 rounded-[2rem] p-4 transition-all hover:shadow-xl cursor-pointer"
          >
            <div className={`w-full h-56 rounded-[1.5rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-[0.98] ${idea.bgColor}`}>
              <div className="text-6xl drop-shadow-md">
                {idea.emoji}
              </div>
            </div>
            
            <div className="px-2">
              <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary-green mb-3">
                <span className="w-1.5 h-1.5 bg-primary-green rounded-full mr-2"></span>
                {idea.category}
              </span>
              
              <h3 className="text-2xl font-bold font-syne text-gray-900 mb-3 group-hover:text-primary-green transition-colors">
                {idea.title}
              </h3>
              
              <p className="text-gray-500 line-clamp-2 text-sm md:text-base mb-6 leading-relaxed">
                {idea.desc}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${idea.avatar}`} />
                    <AvatarFallback>{idea.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">{idea.author}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> {idea.upvotes}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
