// "use client";

// import { useState, useEffect } from "react";
// import { Loader2, Filter, X } from "lucide-react";
// import type { TutorProfile, Category } from "@/types/api";
// import { tutorService } from "@/lib/services/tutor.service";
// import { categoryService } from "@/lib/services/category.service";
// import { Header } from "@/components/layout/navbar";
// import { TutorFilters } from "@/components/tutors/tutor-filters";
// import { TutorCard } from "@/components/tutors/tutor-card";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import Footer from "@/components/layout/footer";

// export default function TutorsPage() {
//   const [tutors, setTutors] = useState<TutorProfile[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     search: "",
//     categoryId: "",
//     minRate: 0,
//     maxRate: 200,
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     let cancelled = false;
//     const run = async () => {
//       setLoading(true);
//       try {
//         const data = await tutorService.getAllTutors({
//           search: filters.search || undefined,
//           categoryId:
//             filters.categoryId && filters.categoryId !== "all"
//               ? filters.categoryId
//               : undefined,
//           minRate: filters.minRate || undefined,
//           maxRate: filters.maxRate || undefined,
//         });
//         if (!cancelled) {
//           setTutors(data);
//           setTotalPages(Math.max(1, Math.ceil(data.length / 9)));
//         }
//       } catch (error) {
//         console.error("Failed to fetch tutors:", error);
//         if (!cancelled) {
//           setTutors([]);
//           setTotalPages(1);
//           toast.error("Failed to load tutors");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };
//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [page, filters]);

//   const fetchCategories = async () => {
//     try {
//       const data = await categoryService.getAllCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//       toast.error("Failed to load categories");
//     }
//   };

//   const pagedTutors = tutors.slice((page - 1) * 9, page * 9);

//   const handleSearch = (query: string) => {
//     setFilters({ ...filters, search: query });
//     setPage(1);
//   };

//   const handleCategoryChange = (categoryId: string) => {
//     setFilters({ ...filters, categoryId });
//     setPage(1);
//   };

//   const handlePriceRangeChange = (min: number, max: number) => {
//     setFilters({ ...filters, minRate: min, maxRate: max });
//     setPage(1);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
//       <Header />

//       {/* Hero Section */}
//       <section className="relative pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
//         <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center text-white relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2">
//               Find Your Perfect Tutor
//             </h1>

//             <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-xl mx-auto px-2 sm:px-4">
//               Browse {tutors.length} expert tutors and start learning today
//             </p>
//           </motion.div>
//         </div>

//         {/* subtle gradient fade */}
//         <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/20 to-transparent"></div>
//       </section>

//       <main className="flex-1 pb-6 sm:pb-8 md:pb-12 mt-4 sm:mt-6 md:mt-10">
//         <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
//           {/* Mobile Filter Button */}
//           <div className="lg:hidden mb-3 sm:mb-4 md:mb-6">
//             <Button
//               onClick={() => setShowFilters(!showFilters)}
//               className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 h-10 sm:h-11 text-sm"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </Button>
//           </div>

//           <div className="grid lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
//             {/* Filters Sidebar */}
//             <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
//               <TutorFilters
//                 onSearch={handleSearch}
//                 onCategoryChange={handleCategoryChange}
//                 onPriceRangeChange={handlePriceRangeChange}
//                 categories={categories}
//               />
//             </aside>

//             {/* Tutors Grid */}
//             <div className="lg:col-span-3 p-0">
//               {loading ? (
//                 <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
//                   <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//                 </div>
//               ) : tutors.length === 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center py-10 sm:py-12 md:py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mx-1 sm:mx-2 md:mx-0"
//                 >
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
//                     <Filter className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600" />
//                   </div>
//                   <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 px-3 sm:px-4">
//                     No tutors found
//                   </h3>
//                   <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-6 px-3 sm:px-4">
//                     Try adjusting your filters to see more results
//                   </p>
//                 </motion.div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
//                     {pagedTutors.map((tutor) => (
//                       <TutorCard key={tutor.id} tutor={tutor} />
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-12 px-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => setPage(page - 1)}
//                         disabled={page === 1}
//                         className="border-gray-200 hover:bg-gray-50 w-full sm:w-auto min-w-[100px]"
//                       >
//                         Previous
//                       </Button>
//                       <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//                           <Button
//                             key={p}
//                             variant={p === page ? "default" : "outline"}
//                             onClick={() => setPage(p)}
//                             size="sm"
//                             className={
//                               p === page
//                                 ? "bg-gradient-to-r from-blue-600 to-violet-600 min-w-[40px]"
//                                 : "border-gray-200 hover:bg-gray-50 min-w-[40px]"
//                             }
//                           >
//                             {p}
//                           </Button>
//                         ))}
//                       </div>
//                       <Button
//                         variant="outline"
//                         onClick={() => setPage(page + 1)}
//                         disabled={page === totalPages}
//                         className="border-gray-200 hover:bg-gray-50 w-full sm:w-auto min-w-[100px]"
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

"use client";
import { IdeaCard } from "@/components/tutors/tutor-card";
// adjust path as needed
import type { IdeaProfile } from "@/types/api";

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
];

export default function IdeaCardDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          🌿 EcoSpark Hub — Ideas
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Showing {DUMMY_IDEAS.length} ideas (dummy data for testing)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {DUMMY_IDEAS.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
    </div>
  );
}
