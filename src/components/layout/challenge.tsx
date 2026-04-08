"use client";
import { useState } from "react";

type Challenge = {
  tag: string;
  tagColor: string;
  hoveredTagColor: string;
  title: string;
  desc: string;
  prize: string;
  entries: number | null;
  daysLeft: number | null;
  status: "active" | "upcoming" | "ended";
};

const challenges: Challenge[] = [
  {
    tag: "This Month",
    tagColor: "bg-[#e1f5ee] text-[#0F6E56]",
    hoveredTagColor: "bg-[#e1f5ee] text-[#0F6E56]",
    title: "Best Solar Innovation of March",
    desc: "Submit your most creative solar energy idea. Top 3 get featured on the homepage.",
    prize: "Featured + Badge",
    entries: 38,
    daysLeft: 9,
    status: "active",
  },
  {
    tag: "Upcoming",
    tagColor: "bg-blue-50 text-blue-600",
    hoveredTagColor: "bg-blue-900 text-blue-300",
    title: "Zero Waste City Challenge",
    desc: "Design a system that can make an entire city waste-free within 5 years.",
    prize: "Featured + Badge",
    entries: null,
    daysLeft: null,
    status: "upcoming",
  },
  {
    tag: "Ended",
    tagColor: "bg-gray-100 text-gray-400",
    hoveredTagColor: "bg-gray-700 text-gray-300",
    title: "Green Transport February",
    desc: "Ideas for sustainable urban transport. Winner: EV Charging Grid by Karim A.",
    prize: "Completed",
    entries: 61,
    daysLeft: null,
    status: "ended",
  },
];

function ChallengeCard({ c }: { c: Challenge }) {
  const [hovered, setHovered] = useState(false);

  const isActive = c.status === "active";
  const isUpcoming = c.status === "upcoming";
  const isEnded = c.status === "ended";

  const isDark = isActive || (isUpcoming && hovered) || (isEnded && hovered);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: isDark ? "var(--bg-primary)" : "var(--bg-primary)",
        borderColor: isDark ? "var(--border)" : "var(--border)",
        opacity: isEnded && !hovered ? 0.6 : 1,
        transition: "background-color 0.3s, border-color 0.3s, opacity 0.3s",
      }}
      className="rounded-2xl p-6 border flex flex-col justify-between gap-4 cursor-pointer"
    >
      <div>
        <span
          className={`
            text-xs font-medium px-2 py-1 rounded-full
            transition-colors duration-300
            ${hovered ? c.hoveredTagColor : c.tagColor}
          `}
        >
          {c.tag}
        </span>

        <h3
          style={{
            color: isDark ? "var(--text-primary)" : "var(--text-primary)",
            transition: "color 0.3s",
          }}
          className="text-base font-semibold mt-3 mb-2"
        >
          {c.title}
        </h3>

        <p
          style={{
            color: isDark ? "var(--text-secondary)" : "var(--text-secondary)",
            transition: "color 0.3s",
          }}
          className="text-sm leading-relaxed"
        >
          {c.desc}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        {c.entries !== null && (
          <span
            style={{
              color: isDark ? "var(--text-secondary)" : "var(--text-secondary)",
              transition: "color 0.3s",
            }}
          >
            {c.entries} entries
          </span>
        )}

        {c.daysLeft !== null && (
          <span className="text-[#1D9E75] font-medium">
            {c.daysLeft} days left
          </span>
        )}

        {isUpcoming && (
          <span
            style={{
              color: hovered ? "#1D9E75" : "#60a5fa",
              transition: "color 0.3s",
            }}
            className="text-xs font-medium"
          >
            {hovered ? "Coming soon →" : c.prize}
          </span>
        )}

        {isEnded && (
          <span
            style={{
              color: hovered ? "#6b7280" : "#d1d5db",
              transition: "color 0.3s",
            }}
            className="text-xs"
          >
            {c.prize}
          </span>
        )}
      </div>
    </div>
  );
}

export default function EcoChallengeBoard() {
  return (
    <section className="py-16 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
          Compete & Collaborate
        </p>
        <h2 className="font-black leading-tight text-[clamp(1.5rem,5vw,3rem)] text-textPrimary">
          Eco{" "}
          <span
            className="italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
  bg-clip-text text-transparent"
          >
            Challenge
          </span>{" "}
          Board
        </h2>
        <p className="text-base text-textSecondary">
          Monthly themed challenges to spark your best ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {challenges.map((c) => (
          <ChallengeCard key={c.title} c={c} />
        ))}
      </div>
    </section>
  );
}
