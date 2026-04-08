"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Zap, Leaf, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

interface SmartInsightsProps {
  stats?: any;
}

export function SmartInsights({ stats }: SmartInsightsProps) {
  // Mock AI Analysis based on stats
  const totalVotes = stats?.totalVotes ?? 0;
  const totalIdeas = stats?.totalIdeas ?? 0;
  
  const insights = [
    {
      title: "Community Resonance",
      description: totalVotes > 10 
        ? "Your ideas are gaining significant traction! Engaging with latest comments could boost your reach by 25%." 
        : "Early stages: Sharing your ideas on social platforms could increase visibility by 40%.",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Content Strategy",
      description: totalIdeas > 0 
        ? "AI analysis suggests your next idea should focus on 'Renewable Energy' for maximum community impact." 
        : "Pro tip: Members who start with 'Waste Reduction' ideas see 30% higher initial engagement.",
      icon: BrainCircuit,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Sustainability Impact",
      description: "Based on current trends, the community is moving towards 'Circular Economy' solutions this month.",
      icon: Leaf,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <Card className="border-emerald-500/20 shadow-sm overflow-hidden bg-gradient-to-br from-bgPrimary to-emerald-50/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
          EcoSpark AI Insights
        </CardTitle>
        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Live Analysis
        </span>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight, idx) => (
            <motion.div 
              key={insight.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-2 p-3 rounded-xl bg-bgSecondary/50 border border-border/50 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${insight.bg}`}>
                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                </div>
                <h4 className="text-xs font-bold text-textPrimary">{insight.title}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-textSecondary">
                {insight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
