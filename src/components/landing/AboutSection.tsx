import { Badge } from "@/components/ui/badge";
import { Award, Heart, Leaf, Lightbulb, Target, Users } from "lucide-react";

export function AboutSection() {
  const stats = [
    { label: "Ideas Shared", value: "2.4k+", icon: Lightbulb },
    { label: "Active Members", value: "18.0k+", icon: Users },
    { label: "Projects Launched", value: "340+", icon: Target },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Sustainability First",
      description: "Every idea we promote contributes to environmental conservation and sustainable development."
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "We believe in the power of collective action and community-driven innovation."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We maintain high standards and rigorous evaluation for all featured projects."
    }
  ];

  return (
    <section className="py-24 bg-bgSecondary/30 dark:bg-bgSecondary/10" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            Our Story
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-textPrimary">
            Empowering <span className="text-emerald-600">Eco-Innovators</span>
          </h2>
          <p className="text-lg text-textSecondary leading-relaxed">
            EcoSpark was born from a simple belief: the best solutions for our planet come from 
            passionate individuals who see problems differently. We're building a global community 
            to bring sustainable ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-8 bg-bgPrimary dark:bg-bgPrimary/50 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-textPrimary mb-1">{stat.value}</div>
              <div className="text-sm text-textSecondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="group p-8 rounded-2xl hover:bg-bgPrimary dark:hover:bg-bgPrimary/30 transition-all border border-transparent hover:border-border">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <v.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-textPrimary">{v.title}</h3>
              <p className="text-textSecondary text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
