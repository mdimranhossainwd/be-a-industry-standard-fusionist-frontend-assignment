import Discover from "@/components/home/Discover";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Newsletter from "@/components/home/Newsletter";
import TopPicks from "@/components/home/TopPicks";
import Trending from "@/components/home/Trending";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full overflow-hidden">
        <Hero />
        <Marquee />
        <Discover />
        <Trending />
        <TopPicks />
        <Newsletter />
      </div>
      <Footer />
    </>
  );
}
