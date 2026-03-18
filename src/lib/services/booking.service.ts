import api from "@/lib/api";
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from "@/types/api";

export const bookingService = {
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<Booking>("/bookings", data);
    return response;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>("/bookings");
    return response || [];
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response;
  },

  async updateBookingStatus(
    id: string,
    data: UpdateBookingStatusRequest,
  ): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}`, data);
    return response;
  },

  async cancelBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, { status: "CANCELLED" });
  },

  async completeBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, { status: "COMPLETED" });
  },
};
