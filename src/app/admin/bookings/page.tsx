"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminService,
  type AdminBookingSummary,
} from "@/lib/services/admin.service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | AdminBookingSummary["status"]
  >("ALL");
  const [tutorSearch, setTutorSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBookings({
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, [statusFilter]);

  const filtered = bookings.filter((b) => {
    const tutorMatch = tutorSearch
      ? b.tutor.name.toLowerCase().includes(tutorSearch.toLowerCase())
      : true;
    const studentMatch = studentSearch
      ? b.student.name.toLowerCase().includes(studentSearch.toLowerCase())
      : true;
    return tutorMatch && studentMatch;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Bookings</h1>
          <p className="text-gray-600">
            View and monitor all platform bookings
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Filter by tutor name..."
            value={tutorSearch}
            onChange={(e) => setTutorSearch(e.target.value)}
            className="md:w-56"
          />
          <Input
            placeholder="Filter by student name..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="md:w-56"
          />
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter(val as "ALL" | AdminBookingSummary["status"])
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No bookings found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Tutor</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{b.student.name}</span>
                          <span className="text-xs text-gray-500">
                            {b.student.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{b.tutor.name}</span>
                          <span className="text-xs text-gray-500">
                            {b.tutor.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span>
                            {new Date(b.startTime).toLocaleString()} –{" "}
                            {new Date(b.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            Created {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">${b.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            b.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : b.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-700"
                                : b.status === "CANCELLED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
