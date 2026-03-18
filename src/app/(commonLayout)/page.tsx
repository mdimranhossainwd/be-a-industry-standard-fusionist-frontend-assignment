import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Discover from "@/components/home/Discover";
import Trending from "@/components/home/Trending";
import TopPicks from "@/components/home/TopPicks";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <Marquee />
      <Discover />
      <Trending />
      <TopPicks />
      <Newsletter />
    </div>
  );
}
