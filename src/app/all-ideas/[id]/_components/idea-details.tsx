/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createCommentAction,
  createPaymentSessionAction,
  createVoteAction,
  deleteCommentAction,
  deleteVoteAction,
  getVotesAction,
} from "@/app/_action"; // ← adjust import path as needed
import { IdeaProfile } from "@/types/api.types";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  Eye,
  FileText,
  Lightbulb,
  Link2,
  Lock,
  MessageCircle,
  Send,
  Star,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  image: string | null;
}

interface VoteSummary {
  upvotes: number;
  downvotes: number;
  userVote: "UPVOTE" | "DOWNVOTE" | null;
}

interface Comment {
  id: string;
  content: string;
  isDeleted: boolean;
  parentId: string | null;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
  _count: { replies: number };
  replies?: Comment[];
}

interface Props {
  idea: IdeaProfile;
  currentUser: CurrentUser | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const H = {
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.75)",
  textFaint: "rgba(255,255,255,0.5)",
  badge: "rgba(255,255,255,0.15)",
  badgeBorder: "rgba(255,255,255,0.25)",
  paidBg: "rgba(251,191,36,0.25)",
  paidBorder: "rgba(251,191,36,0.45)",
  paidText: "#fef3c7",
  featBg: "rgba(250,204,21,0.2)",
  featBorder: "rgba(250,204,21,0.4)",
  featText: "#fef9c3",
};

const B = {
  text: "var(--text-primary)",
  textSecond: "var(--text-secondary)",
  textMuted: "var(--muted-foreground)",
  textFaint: "oklch(0.556 0 0 / 60%)",
  border: "var(--border)",
  borderLight: "oklch(1 0 0 / 10%)",
  surface: "var(--bg-primary)",
  surfaceAlt: "var(--bg-secondary)",
  divider: "var(--border)",
  upActive: "#059669",
  upActiveBg: "oklch(0.05 0.1 150 / 10%)",
  upBorder: "#bbf7d0",
  downActive: "#dc2626",
  downActiveBg: "oklch(0.1 0.1 20 / 10%)",
  downBorder: "#fecaca",
  inactive: "oklch(0.5 0 0 / 30%)",
  inactiveTxt: "var(--muted-foreground)",
  green: "#10b981",
  amber: "#f59e0b",
  blue: "#3b82f6",
  red: "#ef4444",
  btnGrad: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({
  name,
  image,
  size = 36,
  onHero = false,
}: {
  name: string;
  image?: string | null;
  size?: number;
  onHero?: boolean;
}) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        flexShrink: 0,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        letterSpacing: "0.05em",
        background: onHero
          ? "rgba(255,255,255,0.2)"
          : "linear-gradient(135deg,#10b981,#0f766e)",
        border: onHero ? "1px solid rgba(255,255,255,0.3)" : "none",
        color: "#ffffff",
      }}
    >
      {initials}
    </div>
  );
};

// ─── SectionCard ──────────────────────────────────────────────────────────────

const SectionCard = ({
  icon: Icon,
  label,
  accentColor,
  children,
}: {
  icon: React.ElementType;
  label: string;
  accentColor: string;
  children: React.ReactNode;
}) => (
  <div style={{ borderLeft: `2px solid ${accentColor}`, paddingLeft: "20px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      <Icon size={14} style={{ color: accentColor }} />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: accentColor,
        }}
      >
        {label}
      </span>
    </div>
    <p
      style={{
        fontSize: "15px",
        lineHeight: "1.85",
        color: B.textSecond,
        whiteSpace: "pre-wrap",
      }}
    >
      {children}
    </p>
  </div>
);

// ─── CommentItem ──────────────────────────────────────────────────────────────

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
  isAdmin,
  depth = 0,
}: {
  comment: Comment;
  onReply: (parentId: string, parentAuthor: string) => void;
  onDelete: (id: string) => void;
  currentUserId: string | null;
  isAdmin: boolean;
  depth?: number;
}) => {
  const canDelete = isAdmin || comment.author?.id === currentUserId;

  return (
    <div
      style={{
        marginLeft: depth > 0 ? "28px" : "0",
        marginTop: depth > 0 ? "12px" : "0",
      }}
    >
      <div className="group" style={{ display: "flex", gap: "12px" }}>
        <Avatar
          name={comment.author?.name}
          image={comment.author?.image}
          size={30}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: B.surfaceAlt,
              border: `1px solid ${B.borderLight}`,
              borderRadius: "10px",
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: B.text }}
              >
                {comment.author?.name}
              </span>
              <span style={{ fontSize: "11px", color: B.textFaint }}>
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: B.textMuted,
                lineHeight: "1.7",
              }}
            >
              {comment.isDeleted ? (
                <span style={{ fontStyle: "italic", color: B.textFaint }}>
                  [deleted]
                </span>
              ) : (
                comment.content
              )}
            </p>
          </div>

          {!comment.isDeleted && (
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "6px",
                paddingLeft: "4px",
              }}
            >
              {depth === 0 && (
                <button
                  onClick={() => onReply(comment.id, comment.author?.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: B.textFaint,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = B.green)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = B.textFaint)
                  }
                >
                  <CornerDownRight size={11} />
                  Reply
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(comment.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: B.textFaint,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#dc2626")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = B.textFaint)
                  }
                >
                  <Trash2 size={11} />
                  Delete
                </button>
              )}
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div
              style={{
                marginTop: "12px",
                paddingLeft: "16px",
                borderLeft: `1px solid ${B.borderLight}`,
              }}
            >
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  depth={1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function IdeaDetailsClient({ idea, currentUser }: Props) {
  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === "ADMIN";

  const [votes, setVotes] = useState<VoteSummary>({
    upvotes: 0,
    downvotes: 0,
    userVote: null,
  });
  const [comments, setComments] = useState<Comment[]>(() => {
    const raw = (idea as any).comments;
    if (!Array.isArray(raw)) return [];
    return raw.map((c: any) => ({
      id: c.id,
      content: c.content,
      isDeleted: c.isDeleted ?? false,
      parentId: c.parentId ?? null,
      createdAt: c.createdAt ?? new Date().toISOString(),
      author: c.author,
      _count: c._count ?? { replies: 0 },
      replies: Array.isArray(c.replies) ? c.replies : [],
    }));
  });
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    author: string;
  } | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const images = Array.isArray(idea.images) ? idea.images : [];
  const heroImage = images[0]?.url ?? null;

  // ── Fetch votes ────────────────────────────────────────────────────────────
  useEffect(() => {
    getVotesAction(idea.id)
      .then((data) => setVotes(data))
      .catch(() => {});
  }, [idea.id]);

  // ── Payment success/cancel URL parameter handle ────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      window.history.replaceState({}, "", window.location.pathname);
      window.location.reload();
    }

    if (paymentStatus === "cancelled") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // ── Vote ───────────────────────────────────────────────────────────────────
  const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
    if (!isLoggedIn) {
      setVoteError("Sign in to vote");
      return;
    }
    if (votingLoading) return;
    setVoteError(null);
    setVotingLoading(true);

    try {
      if (votes.userVote === type) {
        // Toggle off — remove vote
        await deleteVoteAction(idea.id);
        setVotes((v) => ({
          ...v,
          upvotes: type === "UPVOTE" ? v.upvotes - 1 : v.upvotes,
          downvotes: type === "DOWNVOTE" ? v.downvotes - 1 : v.downvotes,
          userVote: null,
        }));
      } else {
        // Add / switch vote
        await createVoteAction(idea.id, type);
        setVotes((v) => ({
          upvotes:
            type === "UPVOTE"
              ? v.upvotes + 1
              : v.userVote === "UPVOTE"
                ? v.upvotes - 1
                : v.upvotes,
          downvotes:
            type === "DOWNVOTE"
              ? v.downvotes + 1
              : v.userVote === "DOWNVOTE"
                ? v.downvotes - 1
                : v.downvotes,
          userVote: type,
        }));
      }
    } catch (e: any) {
      setVoteError(e?.message ?? "Something went wrong");
    } finally {
      setVotingLoading(false);
    }
  };

  // ── Comment ────────────────────────────────────────────────────────────────
  const handleComment = async () => {
    if (!commentText.trim() || !isLoggedIn || submittingComment) return;
    setSubmittingComment(true);

    try {
      const data = await createCommentAction(idea.id, {
        content: commentText.trim(),
        parentId: replyTo?.id ?? undefined,
      });

      if (data) {
        if (replyTo) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === replyTo.id
                ? { ...c, replies: [...(c.replies ?? []), data] }
                : c,
            ),
          );
        } else {
          setComments((prev) => [{ ...data, replies: [] }, ...prev]);
        }
        setCommentText("");
        setReplyTo(null);
      }
    } catch {
      // Silently fail — could add toast here
    } finally {
      setSubmittingComment(false);
    }
  };

  // ── Delete comment ─────────────────────────────────────────────────────────
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentAction(commentId);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== commentId) ?? [],
          })),
      );
    } catch {
      // Silently fail — could add toast here
    }
  };

  // ── Reply ──────────────────────────────────────────────────────────────────
  const handleReply = (parentId: string, parentAuthor: string) => {
    setReplyTo({ id: parentId, author: parentAuthor });
    setTimeout(() => commentRef.current?.focus(), 80);
  };

  // ── Copy link ──────────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Purchase ───────────────────────────────────────────────────────────────
  const handlePurchase = async () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/all-ideas/${idea.id}`;
      return;
    }

    setPurchaseLoading(true);
    try {
      const { url } = await createPaymentSessionAction(idea.id);
      if (url) {
        window.location.href = url;
      } else {
        alert("Payment failed. Try again.");
      }
    } catch (e: any) {
      alert(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const netScore = votes.upvotes - votes.downvotes;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        background: "var(--bg-secondary)",
      }}
    >
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #059669 0%, #0d9488 50%, #16a34a 100%)",
        }}
      >
        {heroImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(48px) brightness(0.35) saturate(0.6)",
              transform: "scale(1.15)",
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(5,150,105,0.75) 0%, rgba(13,148,136,0.7) 50%, rgba(22,163,74,0.75) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.6,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-28">
          <a
            href="/ideas"
            className="group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: H.textMuted,
              textDecoration: "none",
              marginBottom: "40px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = H.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = H.textMuted)}
          >
            <ArrowLeft size={14} />
            All Ideas
          </a>

          <div className="grid lg:grid-cols-5 gap-12 items-end">
            <div className="lg:col-span-3">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    background: H.badge,
                    border: `1px solid ${H.badgeBorder}`,
                    borderRadius: "6px",
                    color: H.text,
                    letterSpacing: "0.08em",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Tag size={10} />
                  {idea.category?.name?.toUpperCase()}
                </span>

                {idea.isPaid && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      background: H.paidBg,
                      border: `1px solid ${H.paidBorder}`,
                      borderRadius: "6px",
                      color: H.paidText,
                      letterSpacing: "0.08em",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Lock size={10} />
                    PREMIUM · ${idea.price}
                  </span>
                )}

                {idea.isHighlighted && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      background: H.featBg,
                      border: `1px solid ${H.featBorder}`,
                      borderRadius: "6px",
                      color: H.featText,
                      letterSpacing: "0.08em",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Star size={10} />
                    FEATURED
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontSize: "clamp(26px, 4.5vw, 48px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: H.text,
                  marginBottom: "24px",
                  textShadow: "0 2px 24px rgba(0,0,0,0.25)",
                }}
              >
                {idea.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Avatar
                    name={idea.author?.name ?? "Unknown"}
                    image={idea.author?.image}
                    size={26}
                    onHero
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: H.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    {idea.author?.name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    color: H.textFaint,
                  }}
                >
                  <Calendar size={12} />
                  {formatDate(idea.createdAt)}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    color: H.textFaint,
                  }}
                >
                  <Eye size={12} />
                  {idea._count?.votes ?? 0} votes
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    color: H.textFaint,
                  }}
                >
                  <MessageCircle size={12} />
                  {idea._count?.comments ?? 0} comments
                </div>
              </div>
            </div>

            {heroImage && (
              <div className="lg:col-span-2">
                <div
                  className="aspect-[4/3] overflow-hidden"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                  }}
                >
                  <Image
                    src={heroImage}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* BODY                                                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div
        className="max-w-6xl mx-auto px-6 pb-24"
        style={{ marginTop: "40px" }}
      >
        <div className="grid lg:grid-cols-12 gap-6">
          {/* ── Vote Rail ─────────────────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-4">
            <div className="sticky top-24 flex flex-col items-center gap-1">
              <button
                onClick={() => handleVote("UPVOTE")}
                disabled={votingLoading}
                title={isLoggedIn ? "Upvote" : "Sign in to vote"}
                style={{
                  padding: "8px",
                  background: "none",
                  border: "none",
                  cursor: isLoggedIn ? "pointer" : "default",
                  color: votes.userVote === "UPVOTE" ? B.upActive : B.inactive,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!votingLoading) e.currentTarget.style.color = B.upActive;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    votes.userVote === "UPVOTE" ? B.upActive : B.inactive;
                }}
              >
                <ChevronUp
                  size={22}
                  strokeWidth={votes.userVote === "UPVOTE" ? 2.5 : 1.5}
                />
              </button>

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color:
                    netScore > 0
                      ? B.upActive
                      : netScore < 0
                        ? B.downActive
                        : B.inactiveTxt,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {netScore}
              </span>

              <button
                onClick={() => handleVote("DOWNVOTE")}
                disabled={votingLoading}
                title={isLoggedIn ? "Downvote" : "Sign in to vote"}
                style={{
                  padding: "8px",
                  background: "none",
                  border: "none",
                  cursor: isLoggedIn ? "pointer" : "default",
                  color:
                    votes.userVote === "DOWNVOTE" ? B.downActive : B.inactive,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!votingLoading)
                    e.currentTarget.style.color = B.downActive;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    votes.userVote === "DOWNVOTE" ? B.downActive : B.inactive;
                }}
              >
                <ChevronDown
                  size={22}
                  strokeWidth={votes.userVote === "DOWNVOTE" ? 2.5 : 1.5}
                />
              </button>

              {voteError && (
                <span
                  style={{
                    fontSize: "10px",
                    color: "#dc2626",
                    textAlign: "center",
                    width: "52px",
                    lineHeight: 1.3,
                    marginTop: "4px",
                  }}
                >
                  {voteError}
                </span>
              )}

              <div
                style={{
                  width: "1px",
                  height: "28px",
                  background: B.border,
                  margin: "8px 0",
                }}
              />

              <button
                onClick={() =>
                  document
                    .getElementById("comments-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  padding: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: B.textFaint,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = B.green)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = B.textFaint)
                }
              >
                <MessageCircle size={17} strokeWidth={1.5} />
              </button>

              <button
                onClick={handleCopyLink}
                style={{
                  padding: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copied ? B.green : B.textFaint,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = B.green)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = copied ? B.green : B.textFaint)
                }
              >
                {copied ? (
                  <Check size={17} />
                ) : (
                  <Link2 size={17} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* ── Main Content ───────────────────────────────────────────── */}
          <div
            className="lg:col-span-8"
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {/* Content card */}
            <div
              style={{
                background: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {idea.isLocked ? (
                /* ── Locked ──────────────────────────────────────────── */
                <div style={{ padding: "64px 40px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      margin: "0 auto 20px",
                      background: "oklch(0.9 0.1 80 / 15%)",
                      border: "1px solid oklch(0.9 0.1 80 / 30%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Lock size={22} style={{ color: B.amber }} />
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: B.text,
                      marginBottom: "8px",
                    }}
                  >
                    Premium Content
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: B.textMuted,
                      maxWidth: "340px",
                      margin: "0 auto 24px",
                      lineHeight: 1.7,
                    }}
                  >
                    This is a paid idea. Sign in and purchase to unlock the full
                    solution and discussion.
                  </p>
                  <p
                    style={{
                      fontSize: "36px",
                      fontWeight: 800,
                      color: B.amber,
                      marginBottom: "24px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ${idea.price}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: B.textFaint,
                        marginLeft: "6px",
                      }}
                    >
                      USD
                    </span>
                  </p>
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseLoading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "12px 28px",
                      background: purchaseLoading ? "#9ca3af" : B.btnGrad,
                      color: "#fff",
                      borderRadius: "10px",
                      border: "none",
                      cursor: purchaseLoading ? "default" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {purchaseLoading
                      ? "Redirecting..."
                      : isLoggedIn
                        ? "Unlock Now"
                        : "Sign in to Purchase"}
                  </button>
                </div>
              ) : (
                /* ── Sections ────────────────────────────────────────── */
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      padding: "32px",
                      borderBottom: `1px solid ${B.divider}`,
                    }}
                  >
                    <SectionCard
                      icon={AlertTriangle}
                      label="Problem Statement"
                      accentColor={B.red}
                    >
                      {idea.problemStatement}
                    </SectionCard>
                  </div>
                  <div
                    style={{
                      padding: "32px",
                      borderBottom: `1px solid ${B.divider}`,
                    }}
                  >
                    <SectionCard
                      icon={Lightbulb}
                      label="Proposed Solution"
                      accentColor={B.green}
                    >
                      {idea.proposedSolution}
                    </SectionCard>
                  </div>
                  <div style={{ padding: "32px" }}>
                    <SectionCard
                      icon={FileText}
                      label="Detailed Description"
                      accentColor={B.blue}
                    >
                      {idea.description}
                    </SectionCard>
                  </div>

                  {images.length > 1 && (
                    <div
                      style={{
                        padding: "0 32px 32px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      {images.slice(1).map((img) => (
                        <div
                          key={img.id}
                          style={{
                            aspectRatio: "16/9",
                            overflow: "hidden",
                            borderRadius: "10px",
                            border: `1px solid ${B.borderLight}`,
                          }}
                        >
                          <Image
                            src={img.url}
                            alt={img.altText ?? ""}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Comments ────────────────────────────────────────────── */}
            {!idea.isLocked && (
              <div
                id="comments-section"
                style={{
                  background: B.surface,
                  border: `1px solid ${B.border}`,
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "32px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "28px",
                    }}
                  >
                    <MessageCircle
                      size={16}
                      style={{ color: B.textFaint }}
                      strokeWidth={1.5}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: B.textMuted,
                      }}
                    >
                      Discussion
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        background: B.borderLight,
                        color: B.textMuted,
                        borderRadius: "6px",
                      }}
                    >
                      {comments.length}
                    </span>
                  </div>

                  {isLoggedIn ? (
                    <div style={{ marginBottom: "28px" }}>
                      {replyTo && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            marginBottom: "8px",
                            background: "oklch(0.8 0.1 150 / 15%)",
                            border: "1px solid oklch(0.8 0.1 150 / 30%)",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: B.green,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <CornerDownRight size={11} />
                            Replying to <strong>{replyTo.author}</strong>
                          </span>
                          <button
                            onClick={() => setReplyTo(null)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#16a34a",
                              padding: 0,
                            }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      )}

                      <div
                        style={{
                          border: `1px solid ${B.border}`,
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: B.surfaceAlt,
                        }}
                      >
                        <textarea
                          ref={commentRef}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                              handleComment();
                          }}
                          placeholder={
                            replyTo
                              ? `Reply to ${replyTo.author}...`
                              : "Share your thoughts on this idea..."
                          }
                          rows={3}
                          style={{
                            width: "100%",
                            background: "transparent",
                            padding: "16px 16px 8px",
                            fontSize: "14px",
                            color: B.text,
                            lineHeight: "1.7",
                            border: "none",
                            outline: "none",
                            resize: "none",
                            fontFamily: "inherit",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 16px 12px",
                          }}
                        >
                          <span
                            style={{ fontSize: "11px", color: B.textFaint }}
                          >
                            ⌘ + Enter to submit
                          </span>
                          <button
                            onClick={handleComment}
                            disabled={!commentText.trim() || submittingComment}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: "6px 16px",
                              background: B.btnGrad,
                              color: "#fff",
                              borderRadius: "8px",
                              border: "none",
                              cursor: commentText.trim()
                                ? "pointer"
                                : "default",
                              opacity: commentText.trim() ? 1 : 0.4,
                            }}
                          >
                            <Send size={11} />
                            {submittingComment ? "Posting..." : "Post"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginBottom: "28px",
                        padding: "16px",
                        textAlign: "center",
                        fontSize: "13px",
                        background: B.surfaceAlt,
                        border: `1px solid ${B.borderLight}`,
                        borderRadius: "10px",
                        color: B.textMuted,
                      }}
                    >
                      <a
                        href="/login"
                        style={{
                          color: B.green,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Sign in
                      </a>{" "}
                      to join the discussion
                    </div>
                  )}

                  {comments.length === 0 ? (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                      <MessageCircle
                        size={24}
                        style={{
                          color: B.borderLight,
                          margin: "0 auto 12px",
                        }}
                        strokeWidth={1}
                      />
                      <p style={{ fontSize: "13px", color: B.textFaint }}>
                        No comments yet — start the discussion
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {comments.map((c) => (
                        <CommentItem
                          key={c.id}
                          comment={c}
                          onReply={handleReply}
                          onDelete={handleDeleteComment}
                          currentUserId={currentUser?.id ?? null}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div
            className="lg:col-span-3"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              paddingTop: "4px",
            }}
          >
            {/* Mobile vote */}
            <div
              className="lg:hidden"
              style={{
                display: "flex",
                gap: "10px",
                background: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              {(["UPVOTE", "DOWNVOTE"] as const).map((type) => {
                const active = votes.userVote === type;
                const color = type === "UPVOTE" ? B.upActive : B.downActive;
                const activeBg =
                  type === "UPVOTE" ? B.upActiveBg : B.downActiveBg;
                const activeBorder =
                  type === "UPVOTE" ? B.upBorder : B.downBorder;
                const count =
                  type === "UPVOTE" ? votes.upvotes : votes.downvotes;
                return (
                  <button
                    key={type}
                    onClick={() => handleVote(type)}
                    disabled={votingLoading}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      background: active ? activeBg : B.surfaceAlt,
                      border: `1px solid ${active ? activeBorder : B.border}`,
                      borderRadius: "8px",
                      color: active ? color : B.inactiveTxt,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {type === "UPVOTE" ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                    {count}
                  </button>
                );
              })}
            </div>

            {/* Author card */}
            <div
              style={{
                background: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: B.textFaint,
                  marginBottom: "14px",
                }}
              >
                Author
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Avatar
                  name={idea.author?.name ?? "Unknown"}
                  image={idea.author?.image}
                  size={40}
                />
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: B.text,
                    }}
                  >
                    {idea.author?.name}
                  </p>
                  <p style={{ fontSize: "12px", color: B.textFaint }}>
                    Contributor
                  </p>
                </div>
              </div>
            </div>

            {/* Details card */}
            <div
              style={{
                background: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: B.textFaint,
                  marginBottom: "14px",
                }}
              >
                Details
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  {
                    label: "Category",
                    value: idea.category?.name,
                    color: B.textSecond,
                  },
                  {
                    label: "Type",
                    value: idea.isPaid ? `Paid · $${idea.price}` : "Free",
                    color: idea.isPaid ? B.amber : B.green,
                  },
                  {
                    label: "Published",
                    value: idea.publishedAt
                      ? formatDate(idea.publishedAt)
                      : "Pending",
                    color: B.textSecond,
                  },
                  {
                    label: "Upvotes",
                    value: String(votes.upvotes),
                    color: B.upActive,
                  },
                  {
                    label: "Downvotes",
                    value: String(votes.downvotes),
                    color: votes.downvotes > 0 ? B.downActive : B.textSecond,
                  },
                  {
                    label: "Comments",
                    value: String(idea._count?.comments ?? 0),
                    color: B.textSecond,
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: B.textFaint }}>
                      {label}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                padding: "10px",
                fontSize: "12px",
                fontWeight: 600,
                background: B.surfaceAlt,
                border: `1px solid ${B.border}`,
                borderRadius: "10px",
                color: copied ? B.green : B.textMuted,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {copied ? <Check size={13} /> : <Link2 size={13} />}
              {copied ? "Link copied!" : "Copy link"}
            </button>

            {/* Sign in CTA */}
            {!isLoggedIn && (
              <a
                href="/login"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: B.btnGrad,
                  color: "#fff",
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                <User size={13} />
                Sign in to vote &amp; comment
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
