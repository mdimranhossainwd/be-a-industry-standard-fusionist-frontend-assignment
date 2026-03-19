"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { bookingService } from "@/lib/services/booking.service";
import type { Booking } from "@/types/api";
import { Calendar, DollarSign, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TutorDashboardPage() {
  const { user } = useAuth("TUTOR");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      console.log("bookings data:", data);
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const upcomingSessions = bookings?.filter(
    (b) => b.status === "CONFIRMED",
  ).length;
  const totalEarnings = bookings
    ?.filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here&apos;s your teaching overview</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Sessions"
          value={upcomingSessions}
          icon={Calendar}
          description="Confirmed bookings"
        />
        <StatCard
          title="Total Earnings"
          value={`$${totalEarnings}`}
          icon={DollarSign}
          description="Completed sessions"
        />
        <StatCard
          title="Total Sessions"
          value={bookings.length}
          icon={Star}
          description="All time"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sessions yet</p>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-violet-400" />
                    <div>
                      <h3 className="font-semibold">
                        {booking.student?.name || "Anonymous Student"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.startTime).toLocaleString()}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  {booking.totalPrice && (
                    <div className="text-lg font-bold text-blue-600">
                      ${booking.totalPrice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
