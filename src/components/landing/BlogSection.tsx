import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

export function BlogSection() {
  const posts = [
    {
      title: "The Future of Sustainable Innovation: 2024 Trends",
      excerpt: "Explore emerging eco-innovation trends that are set to transform industries for a greener future.",
      author: "Dr. Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Trends",
      slug: "future-sustainable-innovation-2024",
    },
    {
      title: "How AI is Revolutionizing Environmental Monitoring",
      excerpt: "Discover how AI is transforming the way we track and respond to environmental changes globaly.",
      author: "Marcus Rodriguez",
      date: "Dec 12, 2024",
      readTime: "6 min read",
      category: "Technology",
      slug: "ai-environmental-monitoring",
    },
    {
      title: "Community Power: Grassroots Environmental Solutions",
      excerpt: "How local movements are creating lasting change through collective action and shared ideas.",
      author: "David Park",
      date: "Dec 08, 2024",
      readTime: "7 min read",
      category: "Community",
      slug: "community-environmental-solutions",
    },
  ];

  return (
    <section className="py-24 bg-bgPrimary dark:bg-bgPrimary/10" id="blog">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
              Community Blog
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-textPrimary">
              Fresh <span className="text-teal-600">Perspectives</span>
            </h2>
            <p className="text-lg text-textSecondary leading-relaxed">
              Stay ahead with the latest stories, research, and breakthroughs from our global sustainability network.
            </p>
          </div>
          <Button variant="ghost" asChild className="group text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20">
            <Link href="/blog">
              Explore All Articles 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="group bg-bgPrimary dark:bg-bgPrimary/50 border border-border rounded-2xl overflow-hidden hover:border-teal-200 dark:hover:border-teal-900/50 transition-all shadow-sm hover:shadow-xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="secondary" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-xs text-textSecondary">
                    <Clock size={12} className="mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-textPrimary group-hover:text-teal-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-textSecondary text-sm mb-8 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
                      <User size={14} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-xs font-semibold text-textPrimary">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-textSecondary font-bold">
                    <Calendar size={10} />
                    {post.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
