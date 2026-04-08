import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";

export function ContactSection() {
  return (
    <section
      className="py-24 bg-bgSecondary/20 dark:bg-bgSecondary/5"
      id="contact"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold uppercase tracking-widest text-[10px]"
            >
              Support & Partnerships
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-textPrimary leading-tight">
              Let's build the <span className="text-emerald-600">Future</span>{" "}
              together.
            </h2>
            <p className="text-lg text-textSecondary mb-10 leading-relaxed">
              Have questions about our mission? Interested in a partnership? Our
              expert team reached out to 50+ countries. We're here to help you
              catalyze change.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Industry Support",
                  value: "hello@ecospark.com",
                },
                {
                  icon: Phone,
                  title: "Direct Contact",
                  value: "+1 (555) 123-4567",
                },
                {
                  icon: MessageSquare,
                  title: "Expert Chat",
                  value: "Available 24/7 for Premium",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-bgPrimary dark:bg-bgPrimary/30 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-textPrimary">
                      {item.title}
                    </h4>
                    <p className="text-sm text-textSecondary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-1 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-[2.5rem]">
            <div className="bg-bgPrimary dark:bg-bgPrimary rounded-[2.2rem] p-8 md:p-12 shadow-2xl border border-border/50">
              <h3 className="text-2xl font-bold mb-8 text-textPrimary">
                Send Inquiry
              </h3>
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                      Full Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      className="h-12 rounded-xl bg-bgSecondary/30 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl bg-bgSecondary/30 border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                    Subject
                  </label>
                  <Input
                    placeholder="Project Partnership"
                    className="h-12 rounded-xl bg-bgSecondary/30 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                    Your Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your mission..."
                    rows={5}
                    className="rounded-xl bg-bgSecondary/30 border-border resize-none"
                  />
                </div>
                <Button className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-500/20 gap-3">
                  <Send size={18} />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
