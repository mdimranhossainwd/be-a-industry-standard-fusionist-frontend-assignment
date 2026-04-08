"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.services";
import {
  FilePen,
  FilePlus,
  Home,
  LightbulbIcon,
  LogOut,
  Mail,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SidebarProps {
  role: "MEMBER" | "ADMIN";
}

const memberLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/create-idea", label: "Create-Idea", icon: FilePlus },
  { href: "/dashboard/my-ideas", label: "My Ideas", icon: LightbulbIcon },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Users", icon: User },
  { href: "/admin/categories", label: "Categories", icon: FilePen },
  { href: "/admin/all-ideas", label: "All Ideas", icon: LightbulbIcon },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const links = role === "ADMIN" ? adminLinks : memberLinks;

  const closeSidebar = () => setIsOpen(false);

  function handleLogout() {
    startTransition(async () => {
      await logout();
      router.push("/login");
    });
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-bgPrimary border shadow-sm hover:bg-bgSecondary"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-textSecondary" />
        ) : (
          <Menu className="h-6 w-6 text-textSecondary" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r flex flex-col h-screen bg-[#059669]",
          "lg:sticky lg:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transform transition-transform duration-300 ease-in-out",
        )}
      >
        {/* Logo */}
        <div className="p-6 shrink-0">
          <Link
            href="/"
            className="text-2xl font-bold text-white"
            onClick={closeSidebar}
          >
            🌿 EcoSpark Hub
          </Link>
          <p className="text-sm text-emerald-100/80 mt-1">
            {role === "ADMIN" ? "Admin" : "Member"} Dashboard
          </p>
        </div>

        {/* Nav links — scrollable if too many */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg mb-1.5 transition-colors text-[14px]",
                  isActive
                    ? "bg-white/20 text-white font-semibold"
                    : "text-emerald-50/90 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout — always pinned to bottom */}
        <div className="shrink-0 p-4 border-t border-white/20">
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={handleLogout}
            className="w-full justify-start text-emerald-50/90 hover:text-white hover:bg-white/10 cursor-pointer disabled:opacity-60"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isPending ? "Logging out…" : "Logout"}
          </Button>
        </div>
      </div>
    </>
  );
}
