export type IdeaStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ALL";

export interface IdeaListParams {
  page?: number;
  limit?: number;
  status?: IdeaStatus;
  search?: string;
}

export const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    badgeClass:
      "bg-muted text-muted-foreground hover:bg-muted border-transparent",
  },
  UNDER_REVIEW: {
    label: "Under review",
    badgeClass:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  APPROVED: {
    label: "Approved",
    badgeClass:
      "bg-green-100 text-green-800 hover:bg-green-100 border-transparent dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    badgeClass:
      "bg-red-100 text-red-800 hover:bg-red-100 border-transparent dark:bg-red-900/30 dark:text-red-400",
  },
} as const;
