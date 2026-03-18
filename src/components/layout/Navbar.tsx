import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#faf8f3]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-syne text-primary-green">
          <div className="w-8 h-8 rounded bg-primary-green flex items-center justify-center text-white">
            <span>E</span>
          </div>
          EcoSpark Hub
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-primary-green transition-colors">Home</Link>
          <Link href="/ideas" className="hover:text-primary-green transition-colors">Ideas</Link>
          <Link href="/leaderboard" className="hover:text-primary-green transition-colors">Leaderboard</Link>
          <Link href="/about" className="hover:text-primary-green transition-colors">About Us</Link>
          <Link href="/blog" className="hover:text-primary-green transition-colors">Blog</Link>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-primary-green hover:bg-primary-green/90 text-white rounded-full px-6 py-5 hidden sm:flex text-sm font-medium">
            Add Your Idea &rarr;
          </Button>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="Avatar" />
            <AvatarFallback>EH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
