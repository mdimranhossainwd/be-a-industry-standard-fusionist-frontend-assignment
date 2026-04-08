"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquare, Send, X, Sparkles, User, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { usePathname } from "next/navigation";

// Demo responses from previous turn
const CHAT_DATA = {
  member: [
    "Welcome back to EcoSphere! Ready to reduce your carbon footprint today? 🌱",
    "Want to make an impact? Try sharing a small eco-friendly idea with the community! 💡",
    "Did you know? Switching to LED bulbs uses 75% less energy than traditional ones. ⚡",
    "Feeling inspired? Head over to 'Submit Idea' to voice your sustainability solution.",
    "Small habits lead to big changes. Have you remembered your reusable bag today? 🛍️",
    "Explore the latest projects in our community and cast your vote for the best ideas!",
    "Eco Fact: One recycled glass bottle saves enough energy to power a computer for 25 minutes. 💻",
    "Need help navigating? Check out your Dashboard to see your personal impact stats. 📊",
    "Want to engage more? Try leaving a helpful comment on a project you find interesting!",
    "Sustainability tip: Composting at home can reduce your waste by up to 30%. 🍎",
    "Looking for inspiration? Check out the 'Top Voted' section to see what's trending. 🏆",
    "Your voice matters! Help the best eco-ideas grow by voting for them today. 🌿",
    "Did you know? Trees absorb about 48 pounds of carbon dioxide per year. Let's plant some ideas! 🌲",
    "Check your 'Environmental Impact' tracker to see the collective change we're making! 🌍",
    "Start a challenge! Try to go plastic-free for just one day and see how it feels. 🚫🥤",
    "New here? Start by browsing 'Sustainability Projects' to see what the community is building."
  ],
  admin: [
    "Hello Admin! You have 12 pending ideas waiting for your review. Let's take a look! 📋",
    "Platform activity is high today! Don't forget to check the latest moderation flags. 🚩",
    "Insight: Your community has submitted 45 new ideas this week. Growth is looking steady! 📈",
    "Reminder: A few user reports are still pending resolution in the management panel. ⚖️",
    "Dashboard Summary: Most active category this month is 'Renewable Energy'. ⚡",
    "Keep the community healthy! Try engaging with top contributors to boost engagement. 👋",
    "Quick Hint: You can manage user roles and permissions directly from the User Management tab.",
    "Activity Alert: There has been a 15% increase in project engagements since yesterday! ✨",
    "Don't forget to highlight the 'Idea of the Month' to encourage more high-quality submissions. 🌟",
    "System Check: All platform activities are running smoothly. No critical errors detected. ✅",
    "Moderation Tip: Consistent feedback on rejected ideas helps users submit better content next time.",
    "Insight: Newsletter subscribers increased by 20% following the last community update! 📧",
    "You have 3 new user verification requests. Head to the admin panel to process them. 👤",
    "Review Reminder: Check the 'Ended' challenges to announce winners and award badges. 🏅",
    "Admin Sync: The platform is currently hosting 1,200 active sustainability projects. Great job! 🌍",
    "Want to see more data? The 'Insights' page now has updated charts for better platform analysis."
  ]
};

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

export function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine role based on URL
  const isAdmin = pathname.startsWith("/admin");
  const role = isAdmin ? "admin" : "member";

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg: Message = {
        id: "initial",
        text: isAdmin 
          ? "Welcome to the EcoSphere Admin Control Center. How can I assist with platform management today?" 
          : "Hello! I'm your EcoSphere assistant. Looking for some sustainability tips or need help with your dashboard?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, [isAdmin, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const responses = CHAT_DATA[role];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-bgPrimary border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between text-white ${
              isAdmin ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-emerald-600 to-teal-600"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  {isAdmin ? <ShieldCheck className="size-6 text-white" /> : <Sparkles className="size-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                    EcoSphere Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-white/80 mt-1 capitalize font-medium tracking-wide">
                    {isAdmin ? "Admin Support Active" : "Sustainable Assistant Online"}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-bgSecondary/30 scroll-smooth"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-emerald-600 text-white rounded-br-none" 
                      : "bg-bgPrimary border border-border text-textPrimary rounded-bl-none"
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-emerald-100" : "text-textSecondary"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-bgPrimary border border-border px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-bgPrimary">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="bg-bgSecondary border-border rounded-xl focus-visible:ring-emerald-500 h-10 text-sm"
                />
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shrink-0 h-10 w-10 transition-transform active:scale-90"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 relative group overflow-hidden ${
          isAdmin 
            ? "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800" 
            : "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        }`}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <MessageSquare className="size-6" />
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
        )}
      </motion.button>
    </div>
  );
}
