"use client";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/navbar";
import TopPicksSection from "@/components/layout/newsletter";
import HeroSection from "@/components/pages/hero";
import IdeaCardDemo from "./tutors/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a8d5a2] bg-[#e8f5e9] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4caf50]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#27500a]">
              Community-Powered Sustainability
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-5 font-serif text-[clamp(2.8rem,6vw,5rem)] font-black leading-[.95] tracking-tight text-[#1a1a1a]">
            Ideas that <span className="italic text-[#2d5a27]">spark</span> real
            change
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-[#777]">
            A platform where eco-conscious minds share groundbreaking ideas —
            from solar energy projects to zero-waste living.
          </p>

          {/* Buttons */}
          <div className="mb-14 flex flex-wrap justify-center gap-3">
            <button className="rounded-full bg-[#2d5a27] px-7 py-3 text-sm font-semibold text-white hover:bg-[#1f3e1b] transition-colors">
              Explore Ideas →
            </button>
            <button className="rounded-full border border-[#c8c4bc] px-7 py-3 text-sm font-medium text-[#1a1a1a] hover:border-[#2d5a27] hover:text-[#2d5a27] transition-colors">
              Submit Idea
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { value: "2.4k+", label: "Ideas shared" },
              { value: "18.0k+", label: "Members" },
              { value: "340+", label: "Projects" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div>
                  <p className="font-serif text-2xl font-black text-[#1a1a1a]">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-[#999]">{stat.label}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-8 w-px bg-[#d8d4cc]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <IdeaCardDemo />

      <TopPicksSection />

      <HeroSection />
      <Footer />
    </div>
  );
}
