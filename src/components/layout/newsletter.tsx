const TOP_PICKS = [
  {
    category: "Energy",
    icon: "⚡",
    title: "Floating Solar on Canals",
    description:
      "The most-loved idea of the season — combining irrigation infrastructure with clean energy generation at massive scale.",
    votes: "1,240",
    author: "by Tanvir Khan",
    color: "#9ce56d",
  },
  {
    category: "Waste",
    icon: "♻️",
    title: "Jute Biodegradable Packaging",
    description:
      "Eliminating plastic from Dhaka's largest market districts with locally-sourced jute packaging that costs 20% less.",
    votes: "876",
    author: "by Nafisa Sultana",
    color: "#6fd3a4",
  },
  {
    category: "Transport",
    icon: "🚍",
    title: "Solar Rickshaw Hubs",
    description:
      "Transforming thousands of livelihoods by making clean transport economically viable for daily wage workers.",
    votes: "654",
    author: "by Masud Rana",
    color: "#7fd3ff",
  },
];

export default function TopPicksSection() {
  return (
    <section className="bg-[#0f1116] py-20 relative overflow-hidden">
      <div className="absolute -top-16 left-1/4 w-72 h-72 bg-[#2d5a27]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-10 bottom-0 w-60 h-60 bg-[#2d5a27]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-3">
          <div>
            <p className="text-[#4caf50] text-[11px] font-bold tracking-widest uppercase mb-2">
              🏆 TOP VOTED
            </p>
            <h2 className="font-black leading-tight text-[clamp(2rem,4vw,3rem)]">
              <span className="text-white">The community's</span>
              <br />
              <span className="text-[#4caf50]">top 3 picks</span>
            </h2>
          </div>
          <p className="text-[#b0b0b0] text-xs sm:text-sm max-w-md">
            Ranked by total upvotes from verified community members.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {TOP_PICKS.map((pick, i) => (
            <div
              key={pick.title}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute -right-1 top-0 text-white/10 text-[6rem] leading-none font-black pointer-events-none select-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10 flex items-center justify-between mb-3">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: pick.color }}
                >
                  {pick.icon} {pick.category}
                </span>
                <span className="text-[#888] text-xl font-black opacity-80">
                  #{i + 1}
                </span>
              </div>

              <h3 className="relative z-10 text-white text-[1.06rem] sm:text-xl font-bold leading-snug mb-2">
                {pick.title}
              </h3>
              <p className="relative z-10 text-[#c0c0c0] text-xs sm:text-[12px] leading-relaxed mb-5">
                {pick.description}
              </p>

              <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3">
                <div>
                  <div
                    className="text-2xl sm:text-3xl font-black"
                    style={{ color: pick.color }}
                  >
                    {pick.votes}
                  </div>
                  <div className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#999] mt-0.5">
                    upvotes
                  </div>
                </div>
                <div className="text-[#aaa] text-[11px] sm:text-xs">
                  {pick.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
