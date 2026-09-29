"use client";

import React from "react";

interface SectionHeroProps {
  onExplore?: () => void;
}

export default function SectionHero({ onExplore }: SectionHeroProps) {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 bg-white overflow-hidden">
      
      {/* Background Image Container - Extends ~63% of the screen */}
      <div className="hero-portrait absolute top-0 left-0 w-[63%] h-full z-0 will-change-[clip-path,transform] [clip-path:inset(0%_100%_0%_0%)]">
        <img
          src="/images/section1-vanity.jpg"
          alt="The Little Vanity Portrait"
          className="hero-img w-full h-full object-cover object-right grayscale"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop";
          }}
        />
        {/* Soft edge blend just in case the image isn't perfectly white on the right */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-white pointer-events-none" />
      </div>

      {/* Typography and Foreground Elements */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        
        {/* Top-Right Badge: SPECIAL ISSUE (Hero section only, matching the inspo) */}
        <div className="hero-badge opacity-0 absolute top-20 sm:top-24 md:top-28 right-8 sm:right-14 md:right-20 lg:right-28 z-20 pointer-events-none select-none will-change-transform">
          <img
            src="/ChatGPT Image Sep 28, 2026, 02_34_52 PM.png"
            alt="Special Issue"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-md"
          />
        </div>
        
        {/* Soft Pink Organic Shape Asset */}
        <div className="hero-shape opacity-0 absolute right-[2%] md:right-[3%] lg:right-[4%] top-[48%] -translate-y-1/2 pointer-events-none z-0 will-change-transform">
          <img
            src="/ChatGPT Image Sep 28, 2026, 02_38_49 PM.png"
            alt="Pink Organic Shape"
            className="w-72 md:w-96 h-auto mix-blend-multiply opacity-95 will-change-transform"
          />
        </div>

        {/* Text container positioned carefully to overlap the 63% image boundary */}
        <div className="absolute right-[4%] md:right-[6%] lg:right-[8%] top-[48%] -translate-y-1/2 flex flex-col items-start w-fit z-10 pointer-events-none">
          <div className="flex flex-col items-start w-fit">
            {/* Sub-Heading - Perfectly justified to span the exact width of the main heading */}
            <div className="w-full flex justify-between font-serif text-[10px] md:text-xs text-black uppercase mb-1 md:mb-2 font-medium px-1">
              <span className="little-letter opacity-0 inline-block will-change-transform">T</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">H</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">E</span>
              <span className="w-3 md:w-6"></span>
              <span className="little-letter opacity-0 inline-block will-change-transform">L</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">I</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">T</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">T</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">L</span>
              <span className="little-letter opacity-0 inline-block will-change-transform">E</span>
            </div>

            {/* Master Heading */}
            <h1 className="font-didone text-[5.5rem] md:text-[8rem] lg:text-[10rem] font-bold tracking-tight text-black leading-none select-none mix-blend-normal flex">
              <span className="vanity-letter opacity-0 inline-block will-change-transform">V</span>
              <span className="vanity-letter opacity-0 inline-block will-change-transform">A</span>
              <span className="vanity-letter opacity-0 inline-block will-change-transform">N</span>
              <span className="vanity-letter opacity-0 inline-block will-change-transform">I</span>
              <span className="vanity-letter opacity-0 inline-block will-change-transform">T</span>
              <span className="vanity-letter opacity-0 inline-block will-change-transform">Y</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
