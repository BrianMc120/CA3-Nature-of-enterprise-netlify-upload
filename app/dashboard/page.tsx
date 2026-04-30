"use client";

import Link from "next/link";
import ProtectedPage from "../_components/ProtectedPage";
import { useAuth } from "../_components/AuthProvider";
import { getRecommendedEvents } from "@/lib/recommendations";
import { EVENTS } from "@/lib/mockData";
import { useArrowNav } from "../_components/useArrowNav";

const MENU_CARDS = [
  { href: "/timetable", label: "My Timetable", desc: "Classes, tutorials, labs and exams",   icon: "📅", bg: "bg-amber-50",   ring: "ring-amber-200",   accent: "text-amber-800" },
  { href: "/courses",   label: "My Courses",   desc: "Course details, modules and assessments", icon: "📚", bg: "bg-emerald-50", ring: "ring-emerald-200", accent: "text-emerald-800" },
  { href: "/events",    label: "Events",        desc: "Discover and join campus events",     icon: "🎉", bg: "bg-rose-50",    ring: "ring-rose-200",    accent: "text-rose-800" },
  { href: "/rooms",     label: "Study Rooms",  desc: "Book a quiet spot to study",          icon: "🚪", bg: "bg-orange-50",  ring: "ring-orange-200",  accent: "text-orange-800" },
  { href: "/profile",   label: "My Profile",   desc: "Interests and personalised picks",    icon: "👤", bg: "bg-stone-100",  ring: "ring-stone-300",   accent: "text-stone-800" },
  { href: "/feedback",  label: "Feedback",      desc: "Share your thoughts with us",         icon: "💬", bg: "bg-yellow-50",  ring: "ring-yellow-200",  accent: "text-yellow-800" },
  { href: "/support",   label: "Get Support",  desc: "Submit a help request",                icon: "🆘", bg: "bg-red-50",     ring: "ring-red-200",     accent: "text-red-800" },
  { href: "/settings",  label: "Accessibility", desc: "Adjust text size, contrast and more", icon: "⚙️", bg: "bg-indigo-50",  ring: "ring-indigo-200",  accent: "text-indigo-800" },
  { href: "/ml",        label: "ML Insights",   desc: "Subject clustering powered by machine learning", icon: "🤖", bg: "bg-violet-50",  ring: "ring-violet-200",  accent: "text-violet-800" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const recommended = user ? getRecommendedEvents(user, EVENTS).slice(0, 2) : [];
  const handleGridKeyDown = useArrowNav("grid");

  const today = new Date().toLocaleDateString("en-IE", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <ProtectedPage>
      {/* Welcome card */}
      <section
        aria-labelledby="welcome-heading"
        className="mb-10 bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden hc-card"
      >
<p className="text-rose-100 text-base font-medium mb-2">{today}</p>
        <h1 id="welcome-heading" className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
          Hi {user?.name?.split(" ")[0]}, <br className="sm:hidden" />welcome back!
        </h1>
        <p className="text-rose-50 mt-3 text-lg max-w-md leading-relaxed">
          Everything you need for first-year campus life is right here.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">{user?.course}</span>
          <span className="bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">Year {user?.year}</span>
          <span className="bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">Week 10</span>
        </div>
      </section>

      {/* Quick access grid */}
      <section aria-labelledby="menu-heading" className="mb-12">
        <h2 id="menu-heading" className="font-serif text-2xl font-bold text-stone-900 mb-5">
          Where to next?
        </h2>
        <nav aria-label="App sections">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list" onKeyDown={handleGridKeyDown}>
            {MENU_CARDS.map((card) => (
              <li key={card.href}>
                <Link
                  href={card.href}
                  data-kbd-item
                  className={`block ${card.bg} rounded-2xl p-6 ring-1 ${card.ring} hover:shadow-md hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500 focus-visible:ring-offset-2 hc-card`}
                  aria-label={`${card.label}: ${card.desc}`}
                >
                  <span className="text-3xl block mb-3" aria-hidden="true">{card.icon}</span>
                  <span className={`block font-serif font-bold text-lg ${card.accent}`}>{card.label}</span>
                  <span className="block text-sm text-stone-700 mt-1.5 leading-relaxed hc-text-muted">{card.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <section aria-labelledby="rec-heading">
          <h2 id="rec-heading" className="font-serif text-2xl font-bold text-stone-900 mb-2">
            Picked for you
          </h2>
          <p className="text-stone-600 mb-5 text-base">Based on your interests</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
            {recommended.map((event) => (
              <li key={event.id}>
                <Link
                  href="/events"
                  className="flex gap-5 bg-white rounded-2xl border border-stone-200 p-6 hover:border-orange-300 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500 hc-card"
                  aria-label={`${event.title} on ${event.date} at ${event.time}`}
                >
                  <span className="text-4xl shrink-0" aria-hidden="true">{event.image}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-stone-900 text-lg">{event.title}</p>
                    <p className="text-sm text-stone-600 mt-1">📅 {event.date} · {event.time}</p>
                    <p className="text-sm text-stone-600">📍 {event.location}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-orange-100 text-orange-800 text-sm px-2.5 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </ProtectedPage>
  );
}
