// src/components/Navbar.tsx
"use client";

import {
  Home,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  role: "student" | "admin";
  onLogout: () => void;
}

export default function Navbar({ role, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/modules", icon: Building2, label: "Modules" },
  ];

  const links = role === "admin" ? adminLinks : [];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href={role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
              className="flex items-center gap-2"
            >
              <div className="bg-[#0092bd] rounded-lg p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Calque_2"
                  viewBox="0 0 561.27 561.27"
                  className="w-6 h-6"
                >
                  <g id="LOGO_COMPLET">
                    <path
                      id="blanc"
                      d="M274.34,91.46l-.02,378.39h-91.45l.02-378.39h91.45Zm-182.87,0h91.42V0H.02l-.02,561.27H182.87v-91.42H91.45l.02-378.39Zm274.31,469.81l-.02-561.27h195.47V91.46h-104.02l-.02,378.39h104.02v91.42h-195.47Z"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </div>
              <span className="text-[#1A1A1A] hidden sm:block">
                Digital Campus
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link, index) => {
                const Icon = link.icon;
                const isActive = pathname === link.to;
                return (
                  <Link
                    key={`${link.to}-${index}`}
                    href={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#0092bd] text-white"
                        : "text-[#5F6368] hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-[#D50000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#5F6368] hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {links.map((link, index) => {
              const Icon = link.icon;
              const isActive = pathname === link.to;
              return (
                <Link
                  key={`${link.to}-${index}`}
                  href={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#0092bd] text-white"
                      : "text-[#5F6368] hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#D50000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
