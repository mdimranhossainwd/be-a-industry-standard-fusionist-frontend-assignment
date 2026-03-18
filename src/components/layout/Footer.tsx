import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071810] text-[#a0b0a8] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-syne text-white mb-6">
              <div className="w-8 h-8 rounded bg-primary-green flex items-center justify-center text-white">
                <span>E</span>
              </div>
              EcoSpark Hub
            </Link>
            <p className="text-sm mb-6 max-w-xs">
              A community portal where sustainability meets innovation. Let's work to create a greener future, together.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-white">X</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-syne font-bold mb-6 text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Submit idea</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Table/Leaderboard</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-syne font-bold mb-6 text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-syne font-bold mb-6 text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="mailto:hello@ecospark.hub" className="hover:text-white transition-colors">hello@ecospark.hub</a></li>
              <li><a href="tel:+880193132649" className="hover:text-white transition-colors">+880193-1326469</a></li>
              <li><p className="mt-4">Dhaka, Bangladesh</p></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} EcoSpark Hub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
