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
  Sparkles,
  TrendingUp,
  UnlockIcon,
  X,
} from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "top_voted", label: "Top Voted" },
  { value: "commented", label: "Most Commented" },
];

const PER_PAGE = 8;

// ─── AI Suggested Keywords ───────────────────────────────────────────────────
const AI_SUGGESTIONS = [
  "Solar Energy",
  "Zero Waste",
  "Urban Farming",
  "Plastic Free",
  "Circular Economy",
  "Water Conservation",
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface AllIdeasClientProps {
  initialIdeas: IdeaProfile[];
  initialCategories: Category[];
}

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
    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <span className="text-xs font-bold text-textSecondary uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-textSecondary" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-textSecondary" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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
    categorySlug: string;
    paymentStatus: string;
    sort: string;
    minPrice: number;
    maxPrice: number;
  };
  onChange: (key: string, value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}) {
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);
  const [catOpen, setCatOpen] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const hasActiveFilters =
    !!filters.categorySlug ||
    filters.paymentStatus !== "all" ||
    filters.sort !== "recent" ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200;

  const selectedCat = categories.find((c) => c.slug === filters.categorySlug);

  const SORT_ICONS: Record<string, React.ReactNode> = {
    recent: <Clock className="h-3.5 w-3.5" />,
    top_voted: <TrendingUp className="h-3.5 w-3.5" />,
    commented: <MessageSquare className="h-3.5 w-3.5" />,
  };

  return (
    <div className="space-y-4 sticky top-24">
      <div className="bg-bgPrimary dark:bg-bgSecondary rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
            <span className="font-bold text-sm text-textPrimary">Filters</span>
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
          {/* ── Search with AI Suggestions ── */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textSecondary pointer-events-none" />
            <Input
              placeholder="Search ideas…"
              value={filters.search}
              onFocus={() => setShowAiSuggestions(true)}
              onBlur={() => setTimeout(() => setShowAiSuggestions(false), 200)}
              onChange={(e) => onChange("search", e.target.value)}
              className="pl-8 h-9 text-sm border-border focus-visible:ring-emerald-500 bg-bgSecondary"
            />
            {filters.search && (
              <button
                onClick={() => onChange("search", "")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* AI Suggestions Dropdown */}
            <AnimatePresence>
              {showAiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 top-full mt-1.5 left-0 right-0 bg-bgPrimary border border-border rounded-xl shadow-xl p-2"
                >
                  <p className="text-[10px] font-bold text-emerald-600 px-2 py-1 flex items-center gap-1.5 mb-1 text-left">
                    <Sparkles className="h-3 w-3" /> AI TRENDING SUGGESTIONS
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {AI_SUGGESTIONS.filter((s) =>
                      s.toLowerCase().includes(filters.search.toLowerCase()),
                    ).map((s) => (
                      <button
                        key={s}
                        onClick={() => onChange("search", s)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-bgSecondary border border-border hover:border-emerald-500 hover:bg-emerald-50 transition-all text-textSecondary hover:text-emerald-700"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FilterSection title="Sort By">
            <div className="flex flex-col gap-1 mt-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange("sort", opt.value)}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2.5 ${
                    filters.sort === opt.value
                      ? "bg-emerald-500 text-white font-semibold shadow-sm"
                      : "text-textSecondary hover:bg-bgSecondary"
                  }`}
                >
                  <span
                    className={
                      filters.sort === opt.value
                        ? "text-white"
                        : "text-textSecondary"
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
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-bgSecondary hover:border-emerald-300 transition-colors text-sm"
              >
                <div className="flex items-center gap-2 min-w-0 text-left">
                  {selectedCat ? (
                    <>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: selectedCat.color ?? "#10b981",
                        }}
                      />
                      <span className="font-medium text-textPrimary truncate">
                        {selectedCat.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-textSecondary">All Categories</span>
                  )}
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-textSecondary shrink-0 transition-transform ${
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
                    className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-bgPrimary border border-border rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        onChange("categorySlug", "");
                        setCatOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left ${
                        !filters.categorySlug
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-textSecondary"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onChange("categorySlug", cat.slug);
                          setCatOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left ${
                          filters.categorySlug === cat.slug
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-textSecondary"
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
                      : "border-border text-textSecondary hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  {opt.icon && (
                    <span
                      className={
                        filters.paymentStatus === opt.value
                          ? "text-white"
                          : "text-textSecondary"
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

          {/* ── Price Range ── */}
          <AnimatePresence>
            {filters.paymentStatus === "paid" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <FilterSection title="Price Range ($)">
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-textPrimary px-1">
                      <span>${localMin}</span>
                      <span>${localMax === 200 ? "200+" : localMax}</span>
                    </div>
                    <div className="px-1">
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
                        className="w-full h-1.5 bg-bgSecondary border border-border rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </FilterSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── AI Personalized Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-lg overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-left">
            <Sparkles className="h-4 w-4 text-emerald-200" />
            <h4 className="text-[10px] font-bold tracking-widest uppercase">
              Smart Suggestion
            </h4>
          </div>
          <p className="text-[11px] leading-relaxed font-medium mb-3 text-left">
            Based on current sustainability trends, the community is looking for
            more
            <span className="text-emerald-200 font-bold ml-1">
              Electric Vehicle
            </span>{" "}
            ideas.
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="w-full bg-white/20 hover:bg-white/30 text-white border-0 h-8 text-[11px] font-bold"
            onClick={() => onChange("search", "Electric Vehicle")}
          >
            Explore EV Ideas
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export function AllIdeasClient({
  initialIdeas,
  initialCategories,
}: AllIdeasClientProps) {
  // ✅ Server থেকে আসা real data দিয়ে initialize — dummy data নেই
  const [ideas] = useState<IdeaProfile[]>(initialIdeas);
  const [categories] = useState<Category[]>(initialCategories);
  const [loading] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  console.log(categories);

  const [filters, setFilters] = useState({
    search: "",
    categorySlug: "", // ✅ id এর বদলে slug — API data তে category.slug আছে
    paymentStatus: "all",
    sort: "recent",
    minPrice: 0,
    maxPrice: 200,
  });

  // ── Client-side filtering ──
  const filtered = ideas?.data
    ?.filter((idea) => {
      const q = filters.search.toLowerCase();
      // console.log(filtered);

      const matchSearch =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        (idea.problemStatement ?? "").toLowerCase().includes(q) ||
        (idea.description ?? "").toLowerCase().includes(q);

      // ✅ slug দিয়ে category match করো
      const matchCategory =
        !filters.categorySlug || idea.category?.slug === filters.categorySlug;

      console.log(matchCategory);

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
      categorySlug: "",
      paymentStatus: "all",
      sort: "recent",
      minPrice: 0,
      maxPrice: 200,
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bgSecondary to-bgPrimary">
      {/* ── Hero Section ── */}
      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 overflow-hidden">
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
              className="w-full bg-bgPrimary text-textSecondary border border-border hover:bg-bgSecondary h-10 sm:h-11 text-sm"
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
              {(filters.categorySlug ||
                filters.paymentStatus !== "all" ||
                filters.minPrice > 0 ||
                filters.maxPrice < 200) && (
                <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                  {filters.categorySlug && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border-0 text-xs gap-1 cursor-pointer hover:bg-emerald-100"
                      onClick={() => handleFilterChange("categorySlug", "")}
                    >
                      {/* ✅ slug দিয়ে category খোঁজো */}
                      {
                        categories.find((c) => c.slug === filters.categorySlug)
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
                  className="text-center py-10 sm:py-12 md:py-20 bg-bgPrimary rounded-2xl shadow-sm border border-border mx-1 sm:mx-2 md:mx-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Filter className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-textPrimary mb-2">
                    No ideas found
                  </h3>
                  <p className="text-xs sm:text-sm text-textSecondary mb-4">
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
                  <p className="text-xs sm:text-sm text-textSecondary mb-3 sm:mb-4">
                    Showing{" "}
                    <span className="font-semibold text-textPrimary">
                      {(page - 1) * PER_PAGE + 1}–
                      {Math.min(page * PER_PAGE, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-textPrimary">
                      {filtered.length}
                    </span>{" "}
                    ideas
                  </p>

                  {/* Grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${page}-${filters.sort}-${filters.categorySlug}-${filters.paymentStatus}`}
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
                        className="border-border hover:bg-bgSecondary w-full sm:w-auto min-w-[100px]"
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
                                : "border-border hover:bg-bgSecondary min-w-[40px]"
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
                        className="border-border hover:bg-bgSecondary w-full sm:w-auto min-w-[100px]"
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
    </div>
  );
}
