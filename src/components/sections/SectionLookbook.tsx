"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

function SplitChars({ text, className }: { text: string; className: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, cIdx) => (
            <span key={cIdx} className={`${className} inline-block will-change-transform`}>
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

function SplitWords({ text, className }: { text: string; className: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={wIdx} className={`${className} inline-block mr-1 will-change-transform`}>
          {word}
        </span>
      ))}
    </>
  );
}

export default function SectionLookbook() {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 flex flex-col justify-between overflow-hidden bg-white px-8 md:px-14 lg:px-20 pt-16 md:pt-20 pb-16 md:pb-20">
      
      {/* Background Pink Gradient Circle Asset */}
      <div className="lookbook-circle-bg absolute left-[15%] md:left-[18%] lg:left-[20%] top-[44%] md:top-[46%] -translate-y-1/2 pointer-events-none z-0 will-change-transform">
        <img
          src="/ChatGPT Image Sep 29, 2026, 04_33_51 AM.png"
          alt="Pink Circle"
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-contain will-change-transform"
        />
      </div>

      {/* Top Editorial Headline: THE LOOKBOOK / SEASON 2020 */}
      <div className="relative z-10 pl-2 sm:pl-6 md:pl-10 lg:pl-14 select-none">
        <h1 className="font-didone text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-medium tracking-tight text-black leading-none flex flex-wrap">
          <SplitChars text="THE LOOKBOOK" className="lookbook-title-letter" />
        </h1>
        <div className="font-didone text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-medium tracking-tight text-black leading-none pl-28 sm:pl-40 md:pl-60 lg:pl-72 mt-1 md:mt-2 flex flex-wrap">
          <span className="inline-flex mr-4 sm:mr-6">
            <SplitChars text="SEASON" className="lookbook-season-letter" />
          </span>
          <span className="font-bold inline-flex">
            <SplitChars text="2020" className="lookbook-season-letter" />
          </span>
        </div>
      </div>

      {/* Bottom Area: Dual Overlapping Fashion Imagery + Right Story */}
      <div className="relative z-10 flex items-end justify-between pl-2 sm:pl-6 md:pl-10 lg:pl-14">
        
        {/* Dual Overlapping Imagery Container */}
        <div className="relative flex items-end">
          
          {/* Image 1: Left Dark Profile Portrait */}
          <div className="lookbook-card-1 relative w-48 sm:w-56 md:w-64 lg:w-72 h-[32vh] md:h-[36vh] lg:h-[40vh] overflow-hidden bg-zinc-900 shadow-xl z-10 will-change-transform">
            <img
              src="/ChatGPT Image Sep 29, 2026, 04_32_28 AM.png"
              alt="Lookbook Profile Portrait"
              className="lookbook-img-1 w-full h-full object-cover grayscale contrast-110 will-change-transform"
            />
          </div>

          {/* Image 2: Foreground Lying Down Portrait (Overlapping Image 1) */}
          <div className="lookbook-card-2 relative w-64 sm:w-76 md:w-96 lg:w-[28rem] h-[28vh] md:h-[32vh] lg:h-[36vh] -ml-16 sm:-ml-20 md:-ml-28 -mb-3 sm:-mb-4 md:-mb-5 overflow-hidden bg-white shadow-2xl z-20 will-change-transform">
            <img
              src="/ChatGPT Image Sep 29, 2026, 04_32_31 AM.png"
              alt="Lookbook Lying Portrait"
              className="lookbook-img-2 w-full h-full object-cover grayscale contrast-110 will-change-transform"
            />
          </div>

        </div>

        {/* Right Column: Editorial Body Copy & Check This CTA */}
        <div className="relative z-20 max-w-[240px] md:max-w-[270px] lg:max-w-[300px] pb-4 md:pb-6">
          <h3 className="font-sans font-black text-xs md:text-sm text-black mb-2.5 leading-snug flex flex-wrap">
            <SplitWords
              text="Some of the best suggestions from the last collections"
              className="lookbook-copy-word"
            />
          </h3>

          <p className="text-zinc-500 font-sans text-[11px] md:text-xs leading-relaxed mb-6 flex flex-wrap">
            <SplitWords
              text="Integer id nisi nec nulla luctus lacinia non eu turpis. Etiam in ex imperdiet justo tincidunt egestas."
              className="lookbook-desc-word"
            />
          </p>

          {/* CTA with soft circle */}
          <div className="relative inline-flex items-center">
            <div className="lookbook-cta-circle absolute -left-3.5 -top-2.5 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#f8a8e5] via-[#fcbde8] to-[#fed4ba] -z-10 pointer-events-none will-change-transform" />
            <button className="lookbook-cta flex items-center gap-3 text-black font-sans font-black text-[10px] md:text-xs tracking-[0.2em] uppercase hover:text-zinc-600 transition-colors group cursor-pointer will-change-transform">
              <span>CHECK THIS</span>
              <div className="flex items-center">
                <span className="w-10 h-[1.5px] bg-black block group-hover:w-16 transition-all duration-300" />
                <ArrowRight className="w-3.5 h-3.5 -ml-1 stroke-[2.5]" />
              </div>
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
