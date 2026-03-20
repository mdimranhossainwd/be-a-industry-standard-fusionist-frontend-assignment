"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { logoutAction } from "@/services/authActions";
import {
  FilePlus,
  Home,
  LightbulbIcon,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  { href: "/admin/all-ideas", label: "All Ideas", icon: LightbulbIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = role === "ADMIN" ? adminLinks : memberLinks;

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
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
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out flex flex-col h-full",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
            onClick={closeSidebar}
          >
            EcoSpark Hub
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {role === "ADMIN" ? "Admin" : "Member"} Dashboard
          </p>
        </div>

        <nav className="flex-1 px-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto">
          <form>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
