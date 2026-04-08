import { Badge } from "@/components/ui/badge";
import { Cookie, Database, Eye, Lock, Scale, Shield } from "lucide-react";

export function PolicySection() {
  const policies = [
    {
      icon: Shield,
      title: "Data Safeguard",
      desc: "Robust encryption measures ensure your personal innovations remain strictly confidential.",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: Eye,
      title: "Full Transparency",
      desc: "Detailed insights into how we handle your data. No hidden trackers, no data trading.",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Lock,
      title: "Account Sovereignty",
      desc: "Complete control over your footprint. Access, export, or delete your data anytime.",
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: Database,
      title: "Impact Minimization",
      desc: "We only collect the absolute essentials needed to nurture community innovation.",
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      icon: Cookie,
      title: "Cookie Integrity",
      desc: "Zero non-essential trackers. We use cookies only for functional personalization.",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: Scale,
      title: "Ethical Standards",
      desc: "Our terms foster a fair, respectful, and legally compliant collaborative eco-system.",
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  return (
    <section className="py-24 bg-bgPrimary dark:bg-bgPrimary" id="policy">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20 text-textPrimary">
          <Badge
            variant="secondary"
            className="mb-4 bg-bgSecondary text-textSecondary uppercase tracking-widest text-[10px] font-black border border-border"
          >
            Trust & Governance
          </Badge>
          <h2 className="text-3xl md:text-5xl  font-bold mb-6">
            Transparency <span className="text-emerald-600">at Scale.</span>
          </h2>
          <p className="text-lg text-textSecondary leading-relaxed">
            Our legal framework is designed to protect eco-innovators and foster
            global collaboration while maintaining the highest privacy
            standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((p, i) => (
            <div
              key={i}
              className="group p-10 bg-bgSecondary/20 dark:bg-bgSecondary/10 border border-border/50 rounded-[2rem] hover:bg-bgPrimary dark:hover:bg-bgPrimary/20 hover:border-border hover:shadow-2xl transition-all"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform`}
              >
                <p.icon size={26} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-textPrimary">
                {p.title}
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
