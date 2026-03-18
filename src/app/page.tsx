"use client";

import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/navbar";
import { TutorCard } from "@/components/tutors/tutor-card";
import { tutorService } from "@/lib/services/tutor.service";
import type { TutorProfile } from "@/types/api";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Code2,
  Globe2,
  GraduationCap,
  Loader2,
  MessageSquare,
  Music,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutors = await tutorService.getAllTutors();
        tutors.sort((a, b) => b.averageRating - a.averageRating);
        setFeaturedTutors(tutors.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured tutors", error);
        toast.error("Failed to load featured tutors");
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background opacity-40 dark:from-indigo-900/40"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Connect with Expert, <br /> Tutor
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Find your perfect tutor from thousands of experts. Book sessions
                instantly and start learning today.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex gap-4">
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-xl">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition">
                  Search Tutors
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillBridge
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Find Your Tutor",
                description:
                  "Browse through our extensive list of expert tutors. Filter by subject, price, rating, and availability to find your perfect match.",
                icon: Search,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Book a Session",
                description:
                  "View tutor availability and book a session that fits your schedule. Instant confirmation with flexible timing options.",
                icon: BookOpen,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "3",
                title: "Start Learning",
                description:
                  "Join your session and start learning! After completion, leave a review to help other students find great tutors.",
                icon: TrendingUp,
                color: "from-orange-500 to-red-500",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </div>

                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    {item.step}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Tutors Section */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Meet{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Top
              </span>{" "}
              Tutors
            </h2>

            <p className="max-w-[500px] text-gray-500 md:text-lg dark:text-gray-400">
              Learn from the very best.
            </p>
            <Link
              href="/tutors"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center group"
            >
              View All Tutors{" "}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {loadingTutors ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : featuredTutors.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {featuredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No tutors available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillBridge?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We connect you with the world's best tutors, making quality
                education accessible to everyone, everywhere.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: CheckCircle,
                    title: "Verified Expert Tutors",
                    description:
                      "All tutors are thoroughly vetted and certified in their subjects",
                  },
                  {
                    icon: Star,
                    title: "Highly Rated Platform",
                    description:
                      "Join thousands of satisfied students with 4.9/5 average rating",
                  },
                  {
                    icon: MessageSquare,
                    title: "Instant Communication",
                    description:
                      "Real-time chat and video sessions for seamless learning",
                  },
                  {
                    icon: TrendingUp,
                    title: "Track Your Progress",
                    description:
                      "Monitor your learning journey with detailed analytics",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="text-8xl text-center mb-6">📚</div>
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      95%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Student Satisfaction</span>
                    <span className="text-2xl font-bold text-blue-600">
                      4.9/5
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Categories */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Meet {""}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Top
              </span>{" "}
              Works
            </h2>
            <p className="max-w-[500px] text-gray-500 md:text-lg dark:text-gray-400">
              Find the perfect area to upgrade your skills.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center group"
            >
              View All Categories{" "}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Code2,
                label: "Programming",
                color: "text-blue-500",
                bg: "bg-blue-100 dark:bg-blue-900/20",
              },
              {
                icon: Globe2,
                label: "Teaching",
                color: "text-green-500",
                bg: "bg-green-100 dark:bg-green-900/20",
              },
              {
                icon: Music,
                label: "Exerise",
                color: "text-pink-500",
                bg: "bg-pink-100 dark:bg-pink-900/20",
              },
              {
                icon: GraduationCap,
                label: "Academics",
                color: "text-orange-500",
                bg: "bg-orange-100 dark:bg-orange-900/20",
              },
            ].map((cat, i) => (
              <Link href="/" key={i} className="group">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center space-y-4 h-full">
                  <div className={`p-4 rounded-full ${cat.bg}`}>
                    <cat.icon className={`w-8 h-8 ${cat.color}`} />
                  </div>
                  <span className="font-semibold text-lg">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already learning with SkillBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition">
                Get Started Free
              </button>
            </Link>
            <Link href="/tutors">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition">
                Browse Tutors
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
