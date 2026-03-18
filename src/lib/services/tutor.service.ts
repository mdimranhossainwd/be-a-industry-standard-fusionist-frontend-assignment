import api from "@/lib/api";
import type {
  CreateTutorProfileRequest,
  PaginationParams,
  TutorProfile,
  UpdateAvailabilityRequest,
} from "@/types/api";

export const tutorService = {
  async getAllTutors(params?: PaginationParams): Promise<TutorProfile[]> {
    const queryParams: Record<string, string> = {};

    if (params) {
      if (params.search) queryParams.search = params.search;
      if (params.categoryId) queryParams.categoryId = params.categoryId;
      if (params.minRate) queryParams.minRate = params.minRate.toString();
      if (params.maxRate) queryParams.maxRate = params.maxRate.toString();
    }

    const response = await api.get<TutorProfile[]>("/tutors", {
      params: queryParams,
    });

    return response || [];
  },

  async getTutorById(id: string): Promise<TutorProfile> {
    const response = await api.get<TutorProfile>(`/tutors/${id}`);
    return response;
  },

  async createOrUpdateProfile(
    data: CreateTutorProfileRequest,
  ): Promise<TutorProfile> {
    const response = await api.put<TutorProfile>("/tutors/profile", data);
    return response;
  },

  async updateAvailability(
    data: UpdateAvailabilityRequest,
  ): Promise<TutorProfile> {
    const response = await api.put<TutorProfile>("/tutors/availability", data);
    return response;
  },

  async searchTutors(query: string, subject?: string): Promise<TutorProfile[]> {
    const params: Record<string, string> = { search: query };
    if (subject) params.subject = subject;

    const response = await api.get<TutorProfile[]>("/tutors", {
      params,
    });

    return response || [];
  },
};
