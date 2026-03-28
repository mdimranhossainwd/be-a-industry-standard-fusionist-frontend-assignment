// ─── Shared ──────────────────────────────────────────────────────────────────

export type IdeaStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  iconUrl?: string | null;
}

export interface IdeaAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface IdeaCount {
  votes: number;
  comments: number;
}

// ─── Idea ─────────────────────────────────────────────────────────────────────

export interface Idea {
  id: string;
  title: string;
  slug: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  status: IdeaStatus;
  isPaid: boolean;
  price: string | null;
  isHighlighted: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: IdeaAuthor;
  category: Category;
  images: string[];
  _count: IdeaCount;
  rejectionFeedback: string | null;
}

// ─── Paginated list ───────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedIdeas {
  data: Idea[];
  meta: PaginationMeta;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface PieChartEntry {
  status: IdeaStatus;
  count: number;
}

export interface BarChartEntry {
  label: string;
  count: number;
}

export interface RecentPayment {
  id: string;
  amount: number;
  createdAt: string;
  idea: { id: string; title: string };
}

export interface MemberDashboardStats {
  myIdeaCount: number;
  totalVotesReceived: number;
  upvotesReceived: number;
  downvotesReceived: number;
  commentsReceived: number;
  commentsMade: number;
  purchasedIdeasCount: number;
  totalSpent: number;
  pieChartData: PieChartEntry[];
  barChartData: BarChartEntry[];
  recentIdeas: Pick<
    Idea,
    | "id"
    | "title"
    | "slug"
    | "status"
    | "isPaid"
    | "createdAt"
    | "rejectionFeedback"
    | "category"
    | "_count"
  >[];
  recentPayments: RecentPayment[];
}

// ─── API create/update payloads ───────────────────────────────────────────────

export interface CreateIdeaPayload {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  categoryId: string;
  image?: string;
  isPaid: boolean;
  price?: number;
}

export interface UpdateIdeaPayload extends Partial<CreateIdeaPayload> {
  status?: IdeaStatus;
}

export interface IdeaListParams {
  page?: number;
  limit?: number;
  status?: IdeaStatus | "ALL";
  search?: string;
}

export interface ApiResponse<TData = unknown> {
  success: boolean;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export interface IdeaProfile {
  id: string;
  title: string;
  slug: string;
  problemStatement?: string | null;
  proposedSolution?: string | null;
  description?: string | null;
  status: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  isPaid: boolean;
  price?: string | null;
  isHighlighted: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
    iconUrl?: string | null;
  };
  comments?: {
    id: string;
    content: string;
    isDeleted?: boolean;
    parentId?: string | null;
    createdAt?: string;
    author: { id: string; name: string; image: string | null };
    _count?: { replies: number };
    replies?: [];
  }[];
  _count: {
    votes: number;
    comments: number;
  };
  isLocked?: boolean;
}

// Matches /admin/stats API response exactly

export interface AdminPieChartEntry {
  status: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  count: number;
}

export interface AdminBarChartEntry {
  month: string;
  count: number;
}

export interface AdminPendingIdea {
  id: string;
  title: string;
  slug: string;
  isHighlighted?: boolean;
  status: string;
  createdAt: string;
  author: { id: string; name: string };
  category: { id: string; name: string };
}

export interface AdminNewUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminRecentPayment {
  id: string;
  amount: number;
  createdAt: string;
  user?: { name: string };
  idea?: { title: string };
}

export interface AdminDashboardStats {
  userCount: number;
  activeUserCount: number;
  inactiveUserCount: number;
  ideaCount: number;
  totalRevenue: number;
  totalTransactions: number;
  pieChartData: AdminPieChartEntry[];
  barChartData: AdminBarChartEntry[];
  recentActivities: {
    pendingIdeas: AdminPendingIdea[];
    newUsers: AdminNewUser[];
    recentPayments: AdminRecentPayment[];
  };
  topVotedIdeas: {
    id: string;
    title: string;
    votes?: number;
    _count?: { votes: number };
  }[];
}

// ─── Status display config ────────────────────────────────────────────────────

export const ADMIN_STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    color: "#888780",
    badgeClass: "bg-muted text-muted-foreground border-transparent",
  },
  UNDER_REVIEW: {
    label: "Under review",
    color: "#EF9F27",
    badgeClass:
      "bg-yellow-100 text-yellow-800 border-transparent dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  APPROVED: {
    label: "Approved",
    color: "#1D9E75",
    badgeClass:
      "bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    color: "#E24B4A",
    badgeClass:
      "bg-red-100 text-red-800 border-transparent dark:bg-red-900/30 dark:text-red-400",
  },
} as const;
