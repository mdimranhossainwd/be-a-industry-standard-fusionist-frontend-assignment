"use client";

import { createSubscriberAction } from "@/app/admin/newsletter/_action";
import { useState } from "react";
import { toast } from "sonner";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    const result = await createSubscriberAction(email.trim());
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setEmail("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <section className="bg-[#efede7] py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-[#d4d5db] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#3f3f3f] mb-5 shadow-sm">
          <span className="mr-2">📬</span>
          Weekly community updates
        </div>

        <h1 className="font-black leading-tight text-[clamp(1.5rem,5vw,3rem)] text-[#1a1a1a]">
          Stay in the
          {/* <br /> */}
          <span className="text-[#1e7f3a]"> eco loop</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#55606d]">
          Get weekly highlights of top-voted ideas, newly approved projects, and
          community milestones — straight to your inbox.
        </p>

        <div className="mt-8">
          <form
            onSubmit={handleSubscribe}
            className="flex items-center rounded-full bg-white py-2 px-3 shadow-sm ring-1 ring-[#e2e8f0] md:px-1.5"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-full px-4 py-2 text-sm text-[#333] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-2 rounded-full bg-[#1e7f3a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#16612b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          <p className="mt-3 text-xs text-[#5e6879]">
            No spam. Unsubscribe anytime. 🌱 We're eco-friendly with emails too.
          </p>
        </div>
      </div>
    </section>
  );
}
