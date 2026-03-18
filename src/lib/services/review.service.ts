import api from "@/lib/api";
import type {
  CreateReviewRequest,
  Review,
  TutorReviewsSummary,
} from "@/types/api";

export const reviewService = {
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await api.post<Review>("/reviews", data);
    return response;
  },

  async getTutorReviews(tutorId: string): Promise<TutorReviewsSummary> {
    const response = await api.get<TutorReviewsSummary>(
      `/reviews/tutor/${tutorId}`,
    );
    return response;
  },
};
