import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Clock,
  Users,
  Mail,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

/**
 * Admin Layout — Wraps all admin dashboard pages.
 * 
 * Features a sidebar navigation on the left with links to all admin sections.
 * Uses the plum color scheme for a distinct admin experience.
 * 
 * TODO: Phase 5 — Add NextAuth.js authentication middleware to protect
 * these routes. Only authenticated admin users should access this layout.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Sanaa Glam Admin",
  },
};

// Sidebar navigation items for the admin dashboard
const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/availability", label: "Availability", icon: Clock },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="flex min-h-screen">
      {/* ---- Sidebar Navigation ---- */}
      <aside className="hidden w-64 flex-shrink-0 bg-plum-dark lg:block">
        <div className="flex h-full flex-col">
          {/* Admin brand header */}
          <div className="flex h-16 items-center px-6">
            <Link href="/admin" className="font-serif text-lg font-bold text-peach">
              Sanaa Glam
            </Link>
            <span className="ml-2 rounded bg-peach/20 px-2 py-0.5 text-xs text-peach">
              Admin
            </span>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-peach-light/70 transition-colors hover:bg-plum-light/30 hover:text-peach"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Back to website + logout actions */}
          <div className="space-y-3 border-t border-plum-light/30 p-4">
            <Link href="/" className="block text-xs text-peach-light/50 hover:text-peach">
              ← Back to Website
            </Link>
            <form action={handleSignOut}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full border-peach/40 bg-transparent text-peach hover:bg-peach/10 hover:text-peach"
              >
                Log out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* ---- Main Content Area ---- */}
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
