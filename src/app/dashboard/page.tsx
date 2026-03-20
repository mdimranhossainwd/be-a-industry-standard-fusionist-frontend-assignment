"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function MemberDashboardPage() {
  const { user, loading } = useAuth("MEMBER");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">
          Here&apos;s an overview of your EcoSpark Hub activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Total Bookings"
          value={0}
          icon={Calendar}
          description="All time bookings"
        />
        <StatCard
          title="Upcoming Sessions"
          value={0}
          icon={Clock}
          description="Confirmed sessions"
        />
        <StatCard
          title="Completed"
          value={0}
          icon={CheckCircle}
          description="Finished sessions"
        />
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              You haven&apos;t booked any sessions yet
            </p>
            <Link href="/tutors">
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600">
                Browse Tutors
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/tutors">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 cursor-pointer">
                Find a Tutor
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button variant="outline" className="w-full cursor-pointer">
                View My Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
