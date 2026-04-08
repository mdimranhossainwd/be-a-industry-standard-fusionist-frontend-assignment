import type { MemberDashboardStats, IdeaStatus } from "@/types/api.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InsightSeverity = "positive" | "neutral" | "warning" | "info";

export interface Insight {
  id: string;
  severity: InsightSeverity;
  emoji: string;
  headline: string;
  detail: string;
  /** 0-100 relevance score — higher = shown first */
  score: number;
}

export interface InsightReport {
  insights: Insight[];
  performanceScore: number; // 0-100 overall health score
  performanceLabel: string;
  generatedAt: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Find the status with the highest count in the pie data */
function dominantStatus(
  pieData: MemberDashboardStats["pieChartData"]
): { status: IdeaStatus; count: number } | null {
  if (!pieData?.length) return null;
  return pieData.reduce((max, cur) => (cur.count > max.count ? cur : max));
}

/** Find the peak bar chart label (highest count period) */
function peakPeriod(
  barData: MemberDashboardStats["barChartData"]
): { label: string; count: number } | null {
  if (!barData?.length) return null;
  return barData.reduce((max, cur) => (cur.count > max.count ? cur : max));
}

// ─── Core engine ─────────────────────────────────────────────────────────────

export function generateInsights(stats: MemberDashboardStats): InsightReport {
  const insights: Insight[] = [];

  const totalIdeas = stats.myIdeaCount ?? 0;
  const totalVotes = stats.totalVotesReceived ?? 0;
  const upvotes = stats.upvotesReceived ?? 0;
  const downvotes = stats.downvotesReceived ?? 0;
  const commentsReceived = stats.commentsReceived ?? 0;
  const commentsMade = stats.commentsMade ?? 0;
  const purchased = stats.purchasedIdeasCount ?? 0;
  const spent = stats.totalSpent ?? 0;

  // Count ideas by status
  const statusMap: Partial<Record<IdeaStatus, number>> = {};
  for (const entry of stats.pieChartData ?? []) {
    statusMap[entry.status] = entry.count;
  }
  const approved = statusMap["APPROVED"] ?? 0;
  const rejected = statusMap["REJECTED"] ?? 0;
  const underReview = statusMap["UNDER_REVIEW"] ?? 0;
  const drafts = statusMap["DRAFT"] ?? 0;

  const approvalRate = pct(approved, totalIdeas);
  const sentimentRate = pct(upvotes, totalVotes);
  const engagementPerIdea =
    totalIdeas > 0 ? Math.round(commentsReceived / totalIdeas) : 0;

  // ── 1. Idea portfolio ──────────────────────────────────────────────────────
  if (totalIdeas === 0) {
    insights.push({
      id: "no-ideas",
      severity: "info",
      emoji: "🚀",
      headline: "Ready to make an impact?",
      detail:
        "You haven't submitted any ideas yet. Share your first eco-friendly idea and start gathering votes from the community!",
      score: 90,
    });
  } else {
    insights.push({
      id: "portfolio-size",
      severity: "neutral",
      emoji: "💡",
      headline: `You have ${plural(totalIdeas, "idea")} in your portfolio.`,
      detail:
        approved > 0
          ? `${plural(approved, "idea")} approved, ${underReview} under review${drafts > 0 ? `, and ${plural(drafts, "draft")} waiting to be submitted` : ""}.`
          : underReview > 0
            ? `${plural(underReview, "idea")} are currently under review — hang tight!`
            : `All ideas are still in draft. Submit them to earn community votes.`,
      score: 50,
    });
  }

  // ── 2. Approval rate ──────────────────────────────────────────────────────
  if (totalIdeas >= 2 && (approved > 0 || rejected > 0)) {
    if (approvalRate >= 70) {
      insights.push({
        id: "high-approval",
        severity: "positive",
        emoji: "🏆",
        headline: `Outstanding! ${approvalRate}% approval rate.`,
        detail: `${plural(approved, "idea")} out of ${totalIdeas} got approved — that's top-tier quality. Keep up the excellent work!`,
        score: 95,
      });
    } else if (approvalRate >= 40) {
      insights.push({
        id: "mid-approval",
        severity: "neutral",
        emoji: "📈",
        headline: `${approvalRate}% of your ideas are approved.`,
        detail: `You're on a solid track. Focus on detailed problem statements and clear proposed solutions to push your approval rate higher.`,
        score: 70,
      });
    } else {
      insights.push({
        id: "low-approval",
        severity: "warning",
        emoji: "⚠️",
        headline: `Only ${approvalRate}% approval rate so far.`,
        detail: `${plural(rejected, "idea")} rejected. Review the rejection feedback on each idea — small refinements can make a big difference.`,
        score: 85,
      });
    }
  }

  // ── 3. Community sentiment (upvote ratio) ─────────────────────────────────
  if (totalVotes >= 3) {
    if (sentimentRate >= 75) {
      insights.push({
        id: "great-sentiment",
        severity: "positive",
        emoji: "🔥",
        headline: `Community loves your ideas — ${sentimentRate}% upvote ratio!`,
        detail: `You've received ${plural(upvotes, "upvote")} vs ${downvotes} downvotes. The community is strongly resonating with your submissions.`,
        score: 92,
      });
    } else if (sentimentRate >= 50) {
      insights.push({
        id: "ok-sentiment",
        severity: "neutral",
        emoji: "👍",
        headline: `${sentimentRate}% positive community reaction.`,
        detail: `${upvotes} upvotes vs ${downvotes} downvotes. Consider refining descriptions to better convey the environmental impact.`,
        score: 65,
      });
    } else {
      insights.push({
        id: "poor-sentiment",
        severity: "warning",
        emoji: "📉",
        headline: `More downvotes than upvotes (${sentimentRate}% positive).`,
        detail: `The community feedback suggests rethinking your approach. Engage with comments to understand specific concerns.`,
        score: 88,
      });
    }
  }

  // ── 4. Engagement depth ───────────────────────────────────────────────────
  if (totalIdeas > 0) {
    if (commentsReceived === 0) {
      insights.push({
        id: "no-comments",
        severity: "info",
        emoji: "💬",
        headline: "No comments received yet.",
        detail:
          "Spark conversations by making ${plural(commentsMade, 'comment')} in the community — engagement is reciprocal!",
        score: 55,
      });
    } else if (engagementPerIdea >= 5) {
      insights.push({
        id: "high-engagement",
        severity: "positive",
        emoji: "🗣️",
        headline: `High engagement — avg ${engagementPerIdea} comments per idea.`,
        detail: `${plural(commentsReceived, "comment")} received across your ideas. You're driving real conversation — that's a strong community signal.`,
        score: 80,
      });
    } else {
      insights.push({
        id: "low-engagement",
        severity: "info",
        emoji: "💬",
        headline: `${plural(commentsReceived, "comment")} received (avg ${engagementPerIdea}/idea).`,
        detail: `Reply to comments and refine your proposals to boost discussion. Community interaction improves visibility.`,
        score: 58,
      });
    }
  }

  // ── 5. Peak activity period ───────────────────────────────────────────────
  const peak = peakPeriod(stats.barChartData ?? []);
  if (peak && peak.count > 0) {
    insights.push({
      id: "peak-period",
      severity: "info",
      emoji: "📅",
      headline: `Most active period: ${peak.label} (${plural(peak.count, "activity")}).`,
      detail:
        "Timing matters — try submitting or updating ideas during your peak period to maximise early votes.",
      score: 45,
    });
  }

  // ── 6. Pending drafts nudge ───────────────────────────────────────────────
  if (drafts >= 2) {
    insights.push({
      id: "drafts-nudge",
      severity: "warning",
      emoji: "📝",
      headline: `${plural(drafts, "draft")} waiting to be submitted.`,
      detail:
        "Ideas sitting in draft get zero community votes. Submit them today and start collecting feedback!",
      score: 82,
    });
  }

  // ── 7. Purchased ideas ────────────────────────────────────────────────────
  if (purchased > 0) {
    insights.push({
      id: "purchased",
      severity: "info",
      emoji: "🛒",
      headline: `You've invested in ${plural(purchased, "premium idea")}.`,
      detail: `Total investment: ৳${spent}. Explore more curated ideas in the marketplace to grow your collection.`,
      score: 40,
    });
  }

  // ── 8. Under-review nudge ─────────────────────────────────────────────────
  if (underReview >= 3) {
    insights.push({
      id: "many-under-review",
      severity: "info",
      emoji: "🔍",
      headline: `${plural(underReview, "idea")} currently under review.`,
      detail:
        "Our moderators are actively reviewing your submissions. Use this time to polish your draft ideas or engage with the community.",
      score: 60,
    });
  }

  // ─── Performance score ────────────────────────────────────────────────────
  let performanceScore = 30; // base

  if (totalIdeas > 0) performanceScore += 10;
  if (approved > 0) performanceScore += Math.min(approvalRate * 0.3, 25);
  if (totalVotes > 0) performanceScore += Math.min(sentimentRate * 0.2, 20);
  if (commentsReceived > 0) performanceScore += Math.min(engagementPerIdea * 2, 10);
  if (purchased > 0) performanceScore += 5;

  performanceScore = Math.min(Math.round(performanceScore), 100);

  const performanceLabel =
    performanceScore >= 80
      ? "Excellent"
      : performanceScore >= 60
        ? "Good"
        : performanceScore >= 40
          ? "Growing"
          : "Getting started";

  // Sort by score descending, keep top 4 to avoid clutter
  const sortedInsights = insights
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    insights: sortedInsights,
    performanceScore,
    performanceLabel,
    generatedAt: new Date(),
  };
}
