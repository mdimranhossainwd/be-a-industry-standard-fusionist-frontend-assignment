"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TutorProfile } from "@/types/api";
import { motion } from "framer-motion";
import { Award, Star } from "lucide-react";
import Link from "next/link";

interface TutorCardProps {
  tutor: TutorProfile;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const isTopRated = (tutor.averageRating || 0) >= 4.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="hover:shadow-2xl transition-all duration-300 border-gray-100 overflow-hidden group h-full">
        <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-600 via-purple-400 to-purple-500 p-0.5 sm:p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-400 flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base md:text-xl">
                      {tutor.user?.name
                        ?.trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((w) => w[0].toUpperCase())
                        .join("")}
                    </span>
                  </div>
                </div>
              </div>
              {isTopRated && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-600 rounded-full p-0.5 sm:p-1 shadow-md">
                  <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base md:text-lg truncate text-gray-900 group-hover:text-blue-600 transition-colors">
                {tutor.user?.name || "Anonymous Tutor"}
              </h3>
              <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-900">
                  {tutor.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-xs sm:text-xs md:text-sm text-gray-500">
                  ({tutor.totalReviews || 0})
                </span>
              </div>
            </div>
          </div>

          {tutor.bio && (
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
              {tutor.bio}
            </p>
          )}

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
              {(tutor.subjects || []).slice(0, 3).map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                >
                  {subject}
                </Badge>
              ))}
              {tutor.subjects && tutor.subjects.length > 3 && (
                <Badge
                  variant="outline"
                  className="rounded-full border-blue-200 text-blue-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                >
                  +{tutor.subjects.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 sm:pt-3 md:pt-4 border-t border-gray-100 gap-2 sm:gap-3">
              <div className="shrink-0">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  ${tutor.hourlyRate}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">
                  per hour
                </span>
              </div>
              <Link href={`/tutors/${tutor.id}`} className="shrink-0">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer text-[11px] sm:text-xs md:text-sm px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
