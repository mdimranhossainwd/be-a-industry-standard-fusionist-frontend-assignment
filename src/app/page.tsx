import EcoChallengeBoard from "@/components/layout/challenge";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/navbar";
import TopPicksSection from "@/components/layout/newsletter";
import HeroSection from "@/components/pages/hero";
import { IdeaCard } from "@/components/tutors/tutor-card";
import { getUserInfo } from "@/services/auth.services";
import { Idea } from "@/types/api.types";
import HowItWorks from "../components/layout/works";
import { getIdeasAction } from "./_action";

export default async function Home() {
  const user = await getUserInfo();
  const data: Idea[] = await getIdeasAction();

  const highlightedIdeas: Idea[] = data.data?.filter(
    (idea) => idea.isHighlighted === true,
  );

  console.log(highlightedIdeas);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} />

      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a8d5a2] bg-[#e8f5e9] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4caf50]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#27500a]">
              Community-Powered Sustainability
            </span>
          </div>

          <h1
            className="text-center font-serif font-semibold tracking-tight text-[#0f172a]
text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] mb-6"
          >
            Ideas that{" "}
            <span
              className="italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
  bg-clip-text text-transparent"
            >
              spark
            </span>{" "}
            real change
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-[#777]">
            A platform where eco-conscious minds share groundbreaking ideas —
            from solar energy projects to zero-waste living.
          </p>

          {/* Buttons */}
          <div className="mb-14 flex flex-wrap justify-center gap-3">
            <button className="rounded-full px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer text-[11px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 gap-1.5">
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

      <section className="container mx-auto px-4 md:px-0">
        <h1
          className="text-center font-serif font-semibold tracking-tight text-[#0f172a]
text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] mb-6"
        >
          Featured{" "}
          <span
            className="italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
  bg-clip-text text-transparent"
          >
            spark
          </span>{" "}
          Idea
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 py-8">
          {highlightedIdeas?.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>

      <HowItWorks />

      <TopPicksSection />

      <HeroSection />

      <EcoChallengeBoard />

      <Footer />
    </div>
  );
}
