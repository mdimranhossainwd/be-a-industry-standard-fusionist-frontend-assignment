"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminService, PlatformStatistics } from "@/lib/services/admin.service";

export default function AdminDashboardPage() {
  useAuth("ADMIN");
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getStatistics();
        setStats(data);
      } catch (error) {
        console.error("Failed to load statistics:", error);
        toast.error("Failed to load platform statistics");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        Unable to load platform statistics.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and statistics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="All platform users"
        />
        <StatCard
          title="Tutors"
          value={stats.totalTutors}
          icon={BookOpen}
          description="Tutor accounts"
        />
        <StatCard
          title="Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          description="Total bookings"
        />
        <StatCard
          title="Revenue"
          value={stats.totalCompletedBookings}
          icon={TrendingUp}
          description="Completed bookings"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent bookings.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">
                      {booking.student.name} → {booking.tutor.name}
                    </span>
                    <span className="text-gray-500">
                      {new Date(booking.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
