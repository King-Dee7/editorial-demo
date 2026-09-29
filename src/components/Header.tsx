"use client";

import React, { useState } from "react";
import { Share2, X } from "lucide-react";

interface HeaderProps {
  onNavigateSection?: (index: number) => void;
  activeSection?: number;
}

export default function Header({ onNavigateSection, activeSection = 0 }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Editorial", sectionIndex: 0 },
    { name: "Categories", sectionIndex: 1 },
    { name: "Prêt-à-porter", sectionIndex: 2 },
    { name: "Brands", sectionIndex: 4 },
    { name: "The Gig", sectionIndex: 6 },
  ];

  const activeNavIndex =
    activeSection === 0
      ? 0
      : activeSection === 1
      ? 1
      : activeSection === 2 || activeSection === 3
      ? 2
      : activeSection === 4 || activeSection === 5
      ? 3
      : 4;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-14 md:py-8 pointer-events-none">
        {/* Left: Minimalist Key Logo */}
        <div
          className="header-logo opacity-0 pointer-events-auto flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigateSection?.(0)}
        >
          <svg
            className="w-7 h-7 text-black transition-transform duration-300 group-hover:rotate-45"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="16" r="6" />
            <path d="M15 16h13" />
            <path d="M22 16v4" />
            <path d="M26 16v3" />
          </svg>
        </div>

        {/* Right-Aligned Group: Navigation Links + Action Icons */}
        <div className="flex items-center gap-8 md:gap-10 lg:gap-12 ml-auto">
          {/* Editorial Navigation Links */}
          <nav
            className="pointer-events-auto relative hidden md:flex items-center gap-8 lg:gap-10 text-[13px] font-sans tracking-wider"
          >
            {navItems.map((item, idx) => {
              const isActive = idx === activeNavIndex;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigateSection?.(item.sectionIndex)}
                  className={`nav-item opacity-0 relative py-1 transition-colors duration-200 hover:text-black cursor-pointer ${
                    isActive ? "text-black font-semibold" : "text-zinc-400 font-medium"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions (Share & Hamburger) */}
          <div className="header-actions opacity-0 pointer-events-auto flex items-center gap-6 md:gap-7 text-black">
            <button
              aria-label="Share"
              className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-zinc-100 transition-colors"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "The Little Vanity", url: window.location.href });
                }
              }}
            >
              <Share2 className="w-4 h-4 text-black" strokeWidth={2.2} />
            </button>

            {/* Minimalist 2-line Hamburger Menu */}
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-end gap-1.5 w-7 h-7 cursor-pointer group"
            >
              <span
                className={`h-[2px] bg-black transition-all duration-300 ${
                  menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6 group-hover:w-7"
                }`}
              />
              <span
                className={`h-[2px] bg-black transition-all duration-300 ${
                  menuOpen ? "w-6 -rotate-45 -translate-y-0.5" : "w-4 group-hover:w-6"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 text-black flex flex-col justify-center items-center gap-8 backdrop-blur-xl animate-fadeIn">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-zinc-100 text-black"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-xs uppercase tracking-widest text-zinc-400 font-syne font-bold mb-4">
            Issue Index
          </div>
          {[
            { name: "01. The Little Vanity", idx: 0 },
            { name: "02. Week in Fashion", idx: 1 },
            { name: "03. Unleash Sensuality", idx: 2 },
            { name: "04. Atelier Silhouette", idx: 3 },
            { name: "05. Don't Hide Yourself", idx: 4 },
            { name: "06. The Lookbook 2020", idx: 5 },
            { name: "07. The Gig", idx: 6 },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onNavigateSection?.(item.idx);
                setMenuOpen(false);
              }}
              className="text-2xl md:text-3xl font-didone hover:text-rose-400 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
