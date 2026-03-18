// Availability types
export type AvailabilityMap = Record<string, string[]>;

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR";
}

export interface AuthResponse {
  token?: string;
  user: User;
}

export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  tutorProfile?: TutorProfile | null;
}

// Tutor types
export interface TutorProfile {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  bio?: string | null;
  subjects: string[];
  hourlyRate: number;
  availability?: AvailabilityMap;
  averageRating: number;
  totalReviews: number;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTutorProfileRequest {
  bio?: string;
  subjects: string[];
  hourlyRate: number;
  categoryIds?: string[];
  availability?: AvailabilityMap;
}

export interface UpdateAvailabilityRequest {
  availability: AvailabilityMap;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

// Booking types
export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
    tutorProfile?: TutorProfile | null;
  };
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  tutorId: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingStatusRequest {
  status: "COMPLETED" | "CANCELLED";
}

// Review types
export interface Review {
  id: string;
  studentId: string;
  tutorProfileId: string;
  student: {
    id: string;
    name: string;
  };
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface CreateReviewRequest {
  tutorProfileId: string;
  rating: number;
  comment?: string;
}

export interface TutorReviewsSummary {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minRate?: number;
  maxRate?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
