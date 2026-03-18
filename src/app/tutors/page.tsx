"use client";

import { useState, useEffect } from "react";
import { Loader2, Filter, X } from "lucide-react";
import type { TutorProfile, Category } from "@/types/api";
import { tutorService } from "@/lib/services/tutor.service";
import { categoryService } from "@/lib/services/category.service";
import { Header } from "@/components/layout/navbar";
import { TutorFilters } from "@/components/tutors/tutor-filters";
import { TutorCard } from "@/components/tutors/tutor-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/footer";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minRate: 0,
    maxRate: 200,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await tutorService.getAllTutors({
          search: filters.search || undefined,
          categoryId:
            filters.categoryId && filters.categoryId !== "all"
              ? filters.categoryId
              : undefined,
          minRate: filters.minRate || undefined,
          maxRate: filters.maxRate || undefined,
        });
        if (!cancelled) {
          setTutors(data);
          setTotalPages(Math.max(1, Math.ceil(data.length / 9)));
        }
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
        if (!cancelled) {
          setTutors([]);
          setTotalPages(1);
          toast.error("Failed to load tutors");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, filters]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const pagedTutors = tutors.slice((page - 1) * 9, page * 9);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query });
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters({ ...filters, categoryId });
    setPage(1);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters({ ...filters, minRate: min, maxRate: max });
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2">
              Find Your Perfect Tutor
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-xl mx-auto px-2 sm:px-4">
              Browse {tutors.length} expert tutors and start learning today
            </p>
          </motion.div>
        </div>

        {/* subtle gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/20 to-transparent"></div>
      </section>


      <main className="flex-1 pb-6 sm:pb-8 md:pb-12 mt-4 sm:mt-6 md:mt-10">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          {/* Mobile Filter Button */}
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
            {/* Filters Sidebar */}
            <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
              <TutorFilters
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                categories={categories}
              />
            </aside>

            {/* Tutors Grid */}
            <div className="lg:col-span-3 p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : tutors.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 sm:py-12 md:py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mx-1 sm:mx-2 md:mx-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                    <Filter className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 px-3 sm:px-4">
                    No tutors found
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-6 px-3 sm:px-4">
                    Try adjusting your filters to see more results
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {pagedTutors.map((tutor) => (
                      <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                  </div>

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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <Button
                            key={p}
                            variant={p === page ? "default" : "outline"}
                            onClick={() => setPage(p)}
                            size="sm"
                            className={
                              p === page
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 min-w-[40px]"
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
      <Footer />
    </div>
  );
}
