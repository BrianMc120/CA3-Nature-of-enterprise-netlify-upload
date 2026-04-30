"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useArrowNav } from "./useArrowNav";

const NAV_LINKS = [
  { href: "/dashboard",  label: "Home",       icon: "🏠" },
  { href: "/timetable",  label: "Timetable",  icon: "📅" },
  { href: "/courses",    label: "Courses",    icon: "📚" },
  { href: "/events",     label: "Events",     icon: "🎉" },
  { href: "/rooms",      label: "Rooms",      icon: "🚪" },
  { href: "/profile",    label: "Profile",    icon: "👤" },
  { href: "/feedback",   label: "Feedback",   icon: "💬" },
  { href: "/support",    label: "Support",    icon: "🆘" },
  { href: "/settings",   label: "Accessibility", icon: "⚙️" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const handleNavKeyDown = useArrowNav("horizontal");

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header
      className="bg-white/90 backdrop-blur border-b border-stone-200 sticky top-0 z-40 hc-card"
      style={{ backgroundColor: "rgba(255, 250, 243, 0.95)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-xl font-bold text-stone-900 font-serif focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 rounded-lg px-1"
            aria-label="Campus Companion — go to dashboard"
          >
            <span aria-hidden="true" className="text-2xl">☕</span>
            Campus Companion
          </Link>

          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-base text-stone-700 hc-text-muted">
                Hi, {user.name.split(" ")[0]}
              </span>
              <div
                className="w-10 h-10 rounded-full bg-rose-500 text-white text-sm font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {user.avatar}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-stone-600 hover:text-red-700 transition-colors px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 hc-text-muted"
                aria-label="Log out"
              >
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav aria-label="Main navigation">
          <ul
            className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none"
            role="list"
            onKeyDown={handleNavKeyDown}
          >
            {NAV_LINKS.map((link) => {
              const active = pathname.replace(/\/$/, "") === link.href;
              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    data-kbd-item
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-base rounded-t-xl border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 whitespace-nowrap min-h-[44px] ${
                      active
                        ? "border-rose-500 text-rose-600 font-semibold bg-rose-50/60"
                        : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"
                    }`}
                  >
                    <span aria-hidden="true" className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
