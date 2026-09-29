"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FooterControlsProps {
  activeSection: number;
  totalSections: number;
  progress?: number; // Optional 0 to 1
  onPrev: () => void;
  onNext: () => void;
}

export default function FooterControls({
  activeSection,
  totalSections,
  progress,
  onPrev,
  onNext,
}: FooterControlsProps) {
  // Format as "* 01", "* 02", etc., with space to match the editorial screenshots exactly
  const formattedNumber = `* 0${activeSection + 1}`;

  return (
    <footer className="footer-controls opacity-0 fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-end justify-between px-8 py-6 md:px-14 md:py-8">
        {/* Left: Scroll Mouse Indicator */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-3">
          <div className="w-3.5 h-6 rounded-full border-[1.5px] border-white/80 flex items-start justify-center p-1">
            <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce" />
          </div>
          <div className="w-12 h-[1px] bg-white/20 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-white/80"
              style={{
                width: progress !== undefined ? `${Math.min(100, Math.max(10, progress * 100))}%` : "max(10%, var(--scroll-percent, 0%))",
              }}
            />
          </div>
        </div>

        {/* Right: Arrows + Active Number + Socials */}
        <div className="pointer-events-auto ml-auto flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Prev / Next Chevrons */}
            <div className="flex items-center gap-4 text-black">
              <button
                onClick={onPrev}
                disabled={activeSection === 0}
                aria-label="Previous Section"
                className={`p-1 transition-all hover:scale-125 cursor-pointer ${
                  activeSection === 0 ? "opacity-25 cursor-not-allowed" : "opacity-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={onNext}
                disabled={activeSection === totalSections - 1}
                aria-label="Next Section"
                className={`p-1 transition-all hover:scale-125 cursor-pointer ${
                  activeSection === totalSections - 1 ? "opacity-25 cursor-not-allowed" : "opacity-100"
                }`}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Active Section Number (e.g., * 01, * 06) */}
            <div className="font-sans font-black text-3xl md:text-4xl text-black select-none tracking-[0.1em]">
              {formattedNumber}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-[10px] font-syne font-bold tracking-widest text-zinc-400 uppercase">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition-colors"
            >
              TW
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition-colors"
            >
              FB
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition-colors"
            >
              INS
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Gradient Progress Bar */}
      <div className="w-full h-[2.5px] bg-zinc-100 relative">
        <div
          className="h-full progress-bar-gradient will-change-[width]"
          style={{
            width: progress !== undefined ? `${progress * 100}%` : "var(--scroll-percent, 0%)",
          }}
        />
      </div>
    </footer>
  );
}
