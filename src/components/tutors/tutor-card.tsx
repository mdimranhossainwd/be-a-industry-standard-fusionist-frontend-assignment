"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IdeaProfile } from "@/types/api";
import { motion } from "framer-motion";
import { ArrowBigUp, Eye, Lock, MessageSquare, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IdeaCardProps {
  idea: IdeaProfile;
}

// Status badge config
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const isHighlighted = idea.isHighlighted;
  const isPaid = idea.isPaid;
  const statusConfig = STATUS_CONFIG[idea.status] ?? STATUS_CONFIG["DRAFT"];
  const upvotes = idea._count?.votes ?? 0;
  const comments = idea._count?.comments ?? 0;

  // Author initials
  const authorInitials =
    idea.author?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") ?? "?";

  // Published date
  const publishedDate = idea.publishedAt
    ? new Date(idea.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date(idea.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={`hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col ${
          isHighlighted
            ? "border-emerald-400 ring-1 ring-emerald-300"
            : "border-gray-100"
        }`}
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* Thumbnail / Image Area */}
          <div className="relative w-full h-36 sm:h-40 md:h-44 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 overflow-hidden shrink-0">
            {idea.images && idea.images.length > 0 ? (
              <Image
                src={idea.images[0]}
                alt={idea.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-emerald-300" />
              </div>
            )}

            {/* Overlay badges top-left */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1">
              {/* Category */}
              {idea.category && (
                <span
                  className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm text-white"
                  style={{
                    backgroundColor: idea.category.color ?? "#059669",
                  }}
                >
                  {idea.category.name}
                </span>
              )}
              {/* Status */}
              <span
                className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border shadow-sm ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>

            {/* Paid / Free badge top-right */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              {isPaid ? (
                <span className="flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-md">
                  <Lock className="h-2.5 w-2.5" />${idea.price}
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md">
                  Free
                </span>
              )}
            </div>

            {/* Highlighted ribbon */}
            {isHighlighted && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] sm:text-xs font-semibold text-center py-0.5 tracking-wide">
                ⭐ Featured Idea
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 gap-2 sm:gap-3">
            {/* Title */}
            <h3 className="font-bold text-sm sm:text-base md:text-lg leading-snug text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {idea.title}
            </h3>

            {/* Problem Statement */}
            {idea.problemStatement && (
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {idea.problemStatement}
              </p>
            )}

            {/* Author + Date */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-3 border-t border-gray-100">
              {/* Avatar */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-[9px] sm:text-[10px] font-bold">
                  {authorInitials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate">
                  {idea.author?.name ?? "Anonymous"}
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-400">
                  {publishedDate}
                </p>
              </div>

              {/* Vote + Comment counts */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center gap-0.5 text-gray-500">
                  <ArrowBigUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                  <span className="text-[10px] sm:text-xs font-semibold">
                    {upvotes}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-gray-500">
                  <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="text-[10px] sm:text-xs font-semibold">
                    {comments}
                  </span>
                </div>
              </div>
            </div>

            {/* View Button */}
            <Link
              href={`/ideas/${idea.slug ?? idea.id}`}
              className="block mt-1 sm:mt-2"
            >
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer text-[11px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 gap-1.5">
                <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {isPaid ? "Unlock Idea" : "View Idea"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
