"use client";

import { IdeaCard } from "@/components/tutors/tutor-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IdeaProfile } from "@/types/api.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Leaf,
  Loader2,
  Lock,
  MessageSquare,
  Search,
  SlidersHorizontal,
  TrendingUp,
  UnlockIcon,
  X,
} from "lucide-react";
import { useState } from "react";
const DUMMY_IDEAS: IdeaProfile[] = [
  {
    id: "3da59534-acc6-4046-8bdd-1aee787fb435",
    title: "Smart Waste Management System",
    slug: "smart-waste-management-system-sc271",
    problemStatement:
      "Urban areas are struggling with inefficient waste collection leading to pollution and health issues.",
    proposedSolution:
      "Implement IoT-based smart bins that notify collection services when full.",
    description:
      "This system uses sensors and cloud-based dashboards to optimize waste collection routes and reduce overflow incidents.",
    status: "DRAFT",
    isPaid: true,
    price: "20",
    isHighlighted: false,
    publishedAt: null,
    createdAt: "2026-03-19T05:24:52.499Z",
    updatedAt: "2026-03-19T05:24:52.499Z",
    images: [],
    author: {
      id: "P19gtNnFKqhphXiBHpGim5hymmCMLNQ8",
      name: "Md Imran Hossain",
      image: null,
    },
    category: {
      id: "c40c4667-ce11-4327-a9ac-937ecde6eff9",
      name: "Waste",
      slug: "waste",
      color: "#f59e0b",
      iconUrl: null,
    },
    _count: { votes: 0, comments: 0 },
  },
  {
    id: "b1c2d3e4-1111-2222-3333-4444aaaabbbb",
    title: "Community Solar Power Initiative",
    slug: "community-solar-power-initiative",
    problemStatement:
      "Rural communities lack access to affordable and clean energy sources.",
    proposedSolution:
      "Set up shared solar panel grids managed by local cooperatives to distribute clean energy.",
    description:
      "A cooperative-owned solar micro-grid that provides clean energy to 500+ households at a fraction of the traditional cost.",
    status: "APPROVED",
    isPaid: false,
    price: null,
    isHighlighted: true,
    publishedAt: "2026-03-10T08:00:00.000Z",
    createdAt: "2026-03-08T10:00:00.000Z",
    updatedAt: "2026-03-10T08:00:00.000Z",
    images: [],
    author: {
      id: "user-002",
      name: "Fatema Begum",
      image: null,
    },
    category: {
      id: "cat-energy",
      name: "Energy",
      slug: "energy",
      color: "#10b981",
      iconUrl: null,
    },
    _count: { votes: 128, comments: 34 },
  },
  {
    id: "c3d4e5f6-aaaa-bbbb-cccc-ddddeeee0000",
    title: "Plastic-Free School Campaign",
    slug: "plastic-free-school-campaign",
    problemStatement:
      "Schools generate massive amounts of single-use plastic waste every day.",
    proposedSolution:
      "Introduce reusable containers, water stations, and plastic-free lunch programs in schools.",
    description:
      "An awareness and infrastructure campaign targeting 50 schools, reducing single-use plastic by an estimated 80%.",
    status: "UNDER_REVIEW",
    isPaid: false,
    price: null,
    isHighlighted: false,
    publishedAt: null,
    createdAt: "2026-03-15T12:30:00.000Z",
    updatedAt: "2026-03-16T09:00:00.000Z",
    images: [],
    author: {
      id: "user-003",
      name: "Rahim Uddin",
      image: null,
    },
    category: {
      id: "cat-waste",
      name: "Waste",
      slug: "waste",
      color: "#f59e0b",
      iconUrl: null,
    },
    _count: { votes: 45, comments: 12 },
  },
  {
    id: "d4e5f6a7-bbbb-cccc-dddd-eeee11112222",
    title: "EV Charging Network for Old Dhaka",
    slug: "ev-charging-network-old-dhaka",
    problemStatement:
      "Old Dhaka has high air pollution due to fuel-burning rickshaws and CNGs with no EV infrastructure.",
    proposedSolution:
      "Install solar-powered EV charging stations across Old Dhaka to support the transition to electric vehicles.",
    description:
      "A phased rollout plan to install 200 solar-powered EV charging points across Old Dhaka within 18 months.",
    status: "APPROVED",
    isPaid: true,
    price: "15",
    isHighlighted: false,
    publishedAt: "2026-02-28T06:00:00.000Z",
    createdAt: "2026-02-20T08:00:00.000Z",
    updatedAt: "2026-02-28T06:00:00.000Z",
    images: [],
    author: {
      id: "user-004",
      name: "Nusrat Jahan",
      image: null,
    },
    category: {
      id: "cat-transport",
      name: "Transportation",
      slug: "transportation",
      color: "#3b82f6",
      iconUrl: null,
    },
    _count: { votes: 87, comments: 21 },
  },
  {
    id: "e5f6a7b8-cccc-dddd-eeee-ffff33334444",
    title: "Rooftop Rainwater Harvesting Program",
    slug: "rooftop-rainwater-harvesting",
    problemStatement:
      "Water scarcity is a growing problem in urban Bangladesh during dry seasons.",
    proposedSolution:
      "Promote and subsidize rooftop rainwater collection systems for households and small businesses.",
    description:
      "A government-partnered subsidy program helping 1,000 households install rainwater harvesting kits to reduce dependency on groundwater.",
    status: "REJECTED",
    isPaid: false,
    price: null,
    isHighlighted: false,
    publishedAt: null,
    createdAt: "2026-01-05T10:00:00.000Z",
    updatedAt: "2026-01-15T12:00:00.000Z",
    images: [],
    author: {
      id: "user-005",
      name: "Kamal Hossain",
      image: null,
    },
    category: {
      id: "cat-energy",
      name: "Energy",
      slug: "energy",
      color: "#10b981",
      iconUrl: null,
    },
    _count: { votes: 9, comments: 3 },
  },
  {
    id: "f6a7b8c9-dddd-eeee-ffff-000011112222",
    title: "Urban Vertical Garden Initiative",
    slug: "urban-vertical-garden-initiative",
    problemStatement:
      "Cities lack green spaces, contributing to urban heat islands and poor air quality.",
    proposedSolution:
      "Install vertical gardens on building facades across city centers to improve air quality and reduce heat.",
    description:
      "Partnering with municipalities and private building owners to install 500 vertical gardens, reducing urban temperatures by up to 3°C.",
    status: "APPROVED",
    isPaid: false,
    price: null,
    isHighlighted: true,
    publishedAt: "2026-03-01T07:00:00.000Z",
    createdAt: "2026-02-25T09:00:00.000Z",
    updatedAt: "2026-03-01T07:00:00.000Z",
    images: [],
    author: {
      id: "user-006",
      name: "Sharmin Akter",
      image: null,
    },
    category: {
      id: "cat-waste",
      name: "Waste",
      slug: "waste",
      color: "#f59e0b",
      iconUrl: null,
    },
    _count: { votes: 203, comments: 56 },
  },
]; // or paste inline

// ─── Types ───────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

const DUMMY_CATEGORIES: Category[] = [
  { id: "cat-energy", name: "Energy", slug: "energy", color: "#10b981" },
  { id: "cat-waste", name: "Waste", slug: "waste", color: "#f59e0b" },
  {
    id: "cat-transport",
    name: "Transportation",
    slug: "transportation",
    color: "#3b82f6",
  },
  {
    id: "cat-prog",
    name: "Programming",
    slug: "programming",
    color: "#8b5cf6",
  },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "top_voted", label: "Top Voted" },
  { value: "commented", label: "Most Commented" },
];

const PER_PAGE = 9;

// ─── Collapsible Section Wrapper ─────────────────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            // className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar Filters ─────────────────────────────────────────────────────────
function IdeasSidebar({
  categories,
  filters,
  onChange,
  onPriceChange,
  onReset,
}: {
  categories: Category[];
  filters: {
    search: string;
    categoryId: string;
    paymentStatus: string;
    sort: string;
    minPrice: number;
    maxPrice: number;
  };
  onChange: (key: string, value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}) {
  // local slider state (only apply on mouse-up to avoid too many re-renders)
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  const hasActiveFilters =
    !!filters.categoryId ||
    filters.paymentStatus !== "all" ||
    filters.sort !== "recent" ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200;

  // Category dropdown state
  const [catOpen, setCatOpen] = useState(false);
  const selectedCat = categories.find((c) => c.id === filters.categoryId);

  const SORT_ICONS: Record<string, React.ReactNode> = {
    recent: <Clock className="h-3.5 w-3.5" />,
    top_voted: <TrendingUp className="h-3.5 w-3.5" />,
    commented: <MessageSquare className="h-3.5 w-3.5" />,
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <span className="font-bold text-sm text-gray-800">Filters</span>
          {hasActiveFilters && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              ON
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setLocalMin(0);
              setLocalMax(200);
              onReset();
            }}
            className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-0.5 transition-colors"
          >
            <X className="h-3 w-3" /> Reset all
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* ── Search ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search ideas…"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="pl-8 h-9 text-sm border-gray-200 focus-visible:ring-emerald-500 bg-gray-50"
          />
          {filters.search && (
            <button
              onClick={() => onChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ── Sort By ── */}
        <FilterSection title="Sort By">
          <div className="flex flex-col gap-1 mt-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange("sort", opt.value)}
                className={`text-left text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2.5 ${
                  filters.sort === opt.value
                    ? "bg-emerald-500 text-white font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={
                    filters.sort === opt.value ? "text-white" : "text-gray-400"
                  }
                >
                  {SORT_ICONS[opt.value]}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* ── Category Dropdown ── */}
        <FilterSection title="Category">
          <div className="relative mt-1">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 transition-colors text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedCat ? (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: selectedCat.color ?? "#10b981",
                      }}
                    />
                    <span className="font-medium text-gray-800 truncate">
                      {selectedCat.name}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">All Categories</span>
                )}
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform ${
                  catOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* All option */}
                  <button
                    onClick={() => {
                      onChange("categoryId", "");
                      setCatOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      !filters.categoryId
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onChange("categoryId", cat.id);
                        setCatOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        filters.categoryId === cat.id
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color ?? "#10b981" }}
                      />
                      {cat.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FilterSection>

        {/* ── Access Type ── */}
        <FilterSection title="Access Type">
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[
              { value: "all", label: "All", icon: null },
              {
                value: "free",
                label: "Free",
                icon: <UnlockIcon className="h-3 w-3" />,
              },
              {
                value: "paid",
                label: "Paid",
                icon: <Lock className="h-3 w-3" />,
              },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange("paymentStatus", opt.value)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all ${
                  filters.paymentStatus === opt.value
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {opt.icon && (
                  <span
                    className={
                      filters.paymentStatus === opt.value
                        ? "text-white"
                        : "text-gray-400"
                    }
                  >
                    {opt.icon}
                  </span>
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* ── Price Range (only when Paid is selected) ── */}
        <AnimatePresence>
          {filters.paymentStatus === "paid" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <FilterSection title="Price Range ($)" defaultOpen={true}>
                <div className="mt-3 px-1 space-y-3">
                  {/* Display */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      ${localMin}
                    </span>
                    <div className="flex-1 mx-2 h-px bg-gray-200" />
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      ${localMax === 200 ? "200+" : localMax}
                    </span>
                  </div>

                  {/* Min slider */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-medium">
                      Min Price
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      step={5}
                      value={localMin}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v <= localMax) setLocalMin(v);
                      }}
                      onMouseUp={() => onPriceChange(localMin, localMax)}
                      onTouchEnd={() => onPriceChange(localMin, localMax)}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb ${(localMin / 200) * 100}%, #10b981 ${(localMin / 200) * 100}%, #10b981 ${(localMax / 200) * 100}%, #e5e7eb ${(localMax / 200) * 100}%)`,
                      }}
                    />
                  </div>

                  {/* Max slider */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-medium">
                      Max Price
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      step={5}
                      value={localMax}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= localMin) setLocalMax(v);
                      }}
                      onMouseUp={() => onPriceChange(localMin, localMax)}
                      onTouchEnd={() => onPriceChange(localMin, localMax)}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb ${(localMin / 200) * 100}%, #10b981 ${(localMin / 200) * 100}%, #10b981 ${(localMax / 200) * 100}%, #e5e7eb ${(localMax / 200) * 100}%)`,
                      }}
                    />
                  </div>

                  {/* Quick presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: "Under $20", min: 0, max: 20 },
                      { label: "$20–$50", min: 20, max: 50 },
                      { label: "$50+", min: 50, max: 200 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setLocalMin(preset.min);
                          setLocalMax(preset.max);
                          onPriceChange(preset.min, preset.max);
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-all ${
                          localMin === preset.min && localMax === preset.max
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </FilterSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AllIdeasPage() {
  const [ideas, setIdeas] = useState<IdeaProfile[]>(DUMMY_IDEAS);
  const [categories] = useState<Category[]>(DUMMY_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    paymentStatus: "all",
    sort: "recent",
    minPrice: 0,
    maxPrice: 200,
  });

  // ── When API is ready, replace DUMMY_IDEAS with this block ──
  // useEffect(() => {
  //   let cancelled = false;
  //   const run = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await ideaService.getAllIdeas({
  //         search: filters.search || undefined,
  //         categoryId: filters.categoryId || undefined,
  //         isPaid:
  //           filters.paymentStatus === "paid"
  //             ? true
  //             : filters.paymentStatus === "free"
  //             ? false
  //             : undefined,
  //         sort: filters.sort,
  //       });
  //       if (!cancelled) setIdeas(data);
  //     } catch (err) {
  //       if (!cancelled) toast.error("Failed to load ideas");
  //     } finally {
  //       if (!cancelled) setLoading(false);
  //     }
  //   };
  //   run();
  //   return () => { cancelled = true; };
  // }, [filters]);

  // ── Client-side filter on dummy data ──
  const filtered = ideas
    .filter((idea) => {
      const q = filters.search.toLowerCase();
      const matchSearch =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        (idea.problemStatement ?? "").toLowerCase().includes(q) ||
        (idea.description ?? "").toLowerCase().includes(q);

      const matchCategory =
        !filters.categoryId || idea.category?.id === filters.categoryId;

      const matchPayment =
        filters.paymentStatus === "all" ||
        (filters.paymentStatus === "free" && !idea.isPaid) ||
        (filters.paymentStatus === "paid" && idea.isPaid);

      const matchPrice =
        filters.paymentStatus !== "paid" ||
        (() => {
          const price = parseFloat(idea.price ?? "0");
          return price >= filters.minPrice && price <= filters.maxPrice;
        })();

      return matchSearch && matchCategory && matchPayment && matchPrice;
    })
    .sort((a, b) => {
      if (filters.sort === "top_voted")
        return (b._count?.votes ?? 0) - (a._count?.votes ?? 0);
      if (filters.sort === "commented")
        return (b._count?.comments ?? 0) - (a._count?.comments ?? 0);
      // recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pagedIdeas = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      categoryId: "",
      paymentStatus: "all",
      sort: "recent",
      minPrice: 0,
      maxPrice: 200,
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* <Header /> */}

      {/* ── Hero Section ── */}
      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-200" />
              <span className="text-emerald-200 text-xs sm:text-sm font-semibold tracking-widest uppercase">
                EcoSpark Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2">
              Explore Sustainability Ideas
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-emerald-100 max-w-xl mx-auto px-2 sm:px-4">
              Browse {filtered.length} community-driven ideas making our planet
              greener
            </p>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-50/30 to-transparent" />
      </section>

      {/* ── Main Content ── */}
      <main className="flex-1 pb-6 sm:pb-8 md:pb-12 mt-4 sm:mt-6 md:mt-10">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-3 sm:mb-4 md:mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 h-10 sm:h-11 text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* ── Sidebar ── */}
            <aside
              className={`lg:col-span-1 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <IdeasSidebar
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onPriceChange={handlePriceChange}
                onReset={handleReset}
              />
            </aside>

            {/* ── Ideas Grid ── */}
            <div className="lg:col-span-3 p-0">
              {/* Active filter chips */}
              {(filters.categoryId ||
                filters.paymentStatus !== "all" ||
                filters.minPrice > 0 ||
                filters.maxPrice < 200) && (
                <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                  {filters.categoryId && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border-0 text-xs gap-1 cursor-pointer hover:bg-emerald-100"
                      onClick={() => handleFilterChange("categoryId", "")}
                    >
                      {
                        categories.find((c) => c.id === filters.categoryId)
                          ?.name
                      }
                      <X className="h-2.5 w-2.5" />
                    </Badge>
                  )}
                  {filters.paymentStatus !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border-0 text-xs gap-1 cursor-pointer hover:bg-emerald-100"
                      onClick={() => handleFilterChange("paymentStatus", "all")}
                    >
                      {filters.paymentStatus === "free"
                        ? "Free Only"
                        : "Paid Only"}
                      <X className="h-2.5 w-2.5" />
                    </Badge>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice < 200) && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 text-amber-700 border-0 text-xs gap-1 cursor-pointer hover:bg-amber-100"
                      onClick={() => handlePriceChange(0, 200)}
                    >
                      ${filters.minPrice}–$
                      {filters.maxPrice === 200 ? "200+" : filters.maxPrice}
                      <X className="h-2.5 w-2.5" />
                    </Badge>
                  )}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : pagedIdeas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 sm:py-12 md:py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mx-1 sm:mx-2 md:mx-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Filter className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    No ideas found
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-sm"
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Result count */}
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(page - 1) * PER_PAGE + 1}–
                      {Math.min(page * PER_PAGE, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {filtered.length}
                    </span>{" "}
                    ideas
                  </p>

                  {/* Grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${page}-${filters.sort}-${filters.categoryId}-${filters.paymentStatus}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
                    >
                      {pagedIdeas.map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} />
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-12 px-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="border-gray-200 hover:bg-gray-50 w-full sm:w-auto min-w-[100px]"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((p) => (
                          <Button
                            key={p}
                            variant={p === page ? "default" : "outline"}
                            onClick={() => setPage(p)}
                            size="sm"
                            className={
                              p === page
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 min-w-[40px] text-white border-0"
                                : "border-gray-200 hover:bg-gray-50 min-w-[40px]"
                            }
                          >
                            {p}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="border-gray-200 hover:bg-gray-50 w-full sm:w-auto min-w-[100px]"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
