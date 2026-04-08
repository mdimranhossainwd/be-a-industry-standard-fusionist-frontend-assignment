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
    <section className="bg-bgSecondary py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-border bg-bgPrimary px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-textSecondary mb-5 shadow-sm">
          <span className="mr-2">📬</span>
          Weekly community updates
        </div>

        <h1 className="font-black leading-tight text-[clamp(1.5rem,5vw,3rem)] text-textPrimary">
          Stay in the
          {/* <br /> */}
          <span
            className="italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
  bg-clip-text text-transparent"
          >
            {" "}
            eco loop
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-textSecondary">
          Get weekly highlights of top-voted ideas, newly approved projects, and
          community milestones — straight to your inbox.
        </p>

        <div className="mt-8">
          <form
            onSubmit={handleSubscribe}
            className="flex items-center rounded-full bg-bgPrimary py-2 px-3 shadow-sm ring-1 ring-border md:px-1.5"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-full px-4 py-2 text-sm text-textPrimary focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-6 py-2 px-8 font-medium rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer text-[11px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 gap-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          <p className="mt-3 text-xs text-textSecondary">
            No spam. Unsubscribe anytime. 🌱 We're eco-friendly with emails too.
          </p>
        </div>
      </div>
    </section>
  );
}
