"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, PackagePlus, LayoutDashboard, Settings, Trash2, Store, PackageSearch, MessageCircleQuestion, Menu, X } from "lucide-react";
import { logoutAction } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "sonner";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: PackageSearch, label: "Products" },
    { href: "/admin/new", icon: PackagePlus, label: "Add Product" },
    { href: "/admin/faq", icon: MessageCircleQuestion, label: "FAQ" },
  ];

  const sysLinks = [
    { href: "/admin/settings", icon: Settings, label: "Settings" },
    { href: "/admin/trash", icon: Trash2, label: "Trash", className: "hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 font-sans text-brand-dark dark:text-zinc-100 selection:bg-[#111] dark:selection:bg-zinc-100 selection:text-white dark:selection:text-zinc-900 transition-colors duration-300">
      <Toaster richColors position="bottom-right" />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-[#EAEAEA] dark:border-zinc-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#111] dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
            <Store className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-lg text-brand-dark dark:text-zinc-100">Hobbits Wood</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle className="p-2 text-brand-dark dark:text-zinc-100 hover:scale-110 transition-transform flex items-center justify-center" />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-brand-dark dark:text-zinc-100">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[280px] border-r border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Logo Area (Desktop) */}
        <div className="hidden lg:flex p-8 items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#111] dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
            <Store className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xl tracking-wide text-brand-dark dark:text-zinc-100">Hobbits Wood</span>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="flex lg:hidden p-4 items-center justify-between border-b border-[#EAEAEA] dark:border-zinc-800 mb-4">
          <span className="font-serif font-bold text-lg text-brand-dark dark:text-zinc-100">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 lg:px-6 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark dark:text-brand-light mb-4 px-2">Manage</p>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 lg:py-2.5 text-sm font-medium transition-all group ${isActive ? "bg-[#111] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md" : "text-[#444] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-dark dark:hover:text-white"}`}
                >
                  <link.icon className={`h-5 w-5 lg:h-4 lg:w-4 transition-colors ${isActive ? "text-white dark:text-zinc-900" : "text-brand-dark dark:text-brand-light group-hover:text-brand-dark dark:group-hover:text-zinc-100"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark dark:text-brand-light mt-8 mb-4 px-2">System</p>
          <nav className="space-y-1">
            {sysLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 lg:py-2.5 text-sm font-medium transition-all group ${isActive ? "bg-[#111] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md" : link.className || "text-[#444] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-dark dark:hover:text-white"}`}
                >
                  <link.icon className={`h-5 w-5 lg:h-4 lg:w-4 transition-colors ${isActive ? "text-white dark:text-zinc-900" : "text-brand-dark dark:text-brand-light group-hover:text-brand-dark dark:group-hover:text-zinc-100"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile / Logout / Theme */}
        <div className="p-4 lg:p-6 border-t border-[#EAEAEA] dark:border-zinc-800 bg-[#FAFAFA]/50 dark:bg-zinc-900/50 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-zinc-800 dark:to-zinc-700 border border-white dark:border-zinc-700 shadow-sm flex items-center justify-center">
                <span className="text-sm font-bold text-gray-500 dark:text-zinc-300">AD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Admin</p>
                <p className="text-xs text-brand-dark dark:text-brand-light">Store Owner</p>
              </div>
            </div>
            <div className="hidden lg:block"><ThemeToggle className="p-2 text-brand-dark dark:text-zinc-100 hover:scale-110 transition-transform flex items-center justify-center" /></div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 p-3 lg:p-2 text-brand-dark dark:text-brand-light dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg border border-[#EAEAEA] dark:border-zinc-800 transition-all duration-300"
              title="Logout"
            >
              <LogOut className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </form>
        </div>
      </aside>

        {/* Main Content Area */}
      <main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0 min-w-0">
        <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-8 lg:p-12 transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
