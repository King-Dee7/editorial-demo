"use client";

import React from "react";

export default function SectionEditorial() {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 flex items-center justify-between overflow-hidden bg-white px-8 md:px-16 lg:px-24">
      {/* Left Column: Week in Fashion Article + Square Image */}
      <div className="relative w-[34%] h-[78%] flex flex-col justify-end gap-6 md:gap-8 z-10">
        {/* Article Summary */}
        <div className="parallax-text max-w-[340px] will-change-transform">
          <div className="editorial-line w-8 h-[1.5px] bg-black mb-4 origin-left will-change-transform" />
          <h2 className="editorial-heading font-sans font-black text-lg md:text-xl tracking-[0.2em] text-black uppercase mb-3 leading-tight flex flex-wrap gap-x-2 will-change-transform">
            <span className="inline-flex">
              <span className="week-letter inline-block will-change-transform">W</span>
              <span className="week-letter inline-block will-change-transform">E</span>
              <span className="week-letter inline-block will-change-transform">E</span>
              <span className="week-letter inline-block will-change-transform">K</span>
            </span>
            <span className="inline-flex">
              <span className="week-letter inline-block will-change-transform">I</span>
              <span className="week-letter inline-block will-change-transform">N</span>
            </span>
            <span className="inline-flex">
              <span className="week-letter inline-block will-change-transform">F</span>
              <span className="week-letter inline-block will-change-transform">A</span>
              <span className="week-letter inline-block will-change-transform">S</span>
              <span className="week-letter inline-block will-change-transform">H</span>
              <span className="week-letter inline-block will-change-transform">I</span>
              <span className="week-letter inline-block will-change-transform">O</span>
              <span className="week-letter inline-block will-change-transform">N</span>
            </span>
          </h2>
          <p className="editorial-desc text-zinc-600 font-sans text-[11px] md:text-xs leading-relaxed tracking-normal flex flex-wrap gap-x-1 will-change-transform">
            {[
              "Hae",
              "paginae",
              "proponent",
              "Musa",
              "adiuvante",
              "in",
              "lingua",
              "Latina",
              "nunc",
              "etiam",
              "facta",
              "et",
              "ficta,",
              "non",
              "solum",
              "«arma",
              "virumque»",
              "canunt,",
              "sed",
              "etiam",
              "«fullones",
              "ululamque»."
            ].map((word, i) => (
              <span key={i} className="desc-word inline-block will-change-transform">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom Left Square Image */}
        <div className="editorial-thumb-card parallax-mid relative w-[85%] h-[48%] rounded-none overflow-hidden bg-zinc-100 shadow-lg group will-change-[transform,opacity]">
          <div className="editorial-thumb w-full h-full will-change-transform">
            <img
              src="/images/section2-fashion-thumb.jpg"
              alt="Fashion Portrait Thumb"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
        </div>
      </div>

      {/* Center Column: Soft Pastel Block + Rotated EDITORIAL Typography */}
      <div className="relative w-[32%] h-[78%] flex items-center justify-center z-10">
        {/* Soft Pink/Peach Gradient Horizontal Banner */}
        <div className="editorial-banner parallax-bg absolute left-0 md:left-2 bottom-3 md:bottom-1 lg:bottom-[-6px] w-[115%] md:w-[130%] h-40 md:h-48 lg:h-52 bg-gradient-to-br from-[#fbc2ff]/80 to-[#ffdfd4]/90 -z-10 will-change-transform origin-right" />

        {/* Rotated EDITORIAL Text Split into Two Columns with Individual Letter Spans */}
        <div className="editorial-title-wrap parallax-mid relative flex items-center justify-center w-full h-full will-change-transform">
          <div className="absolute flex flex-col gap-4 md:gap-8 -rotate-90 origin-center text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-didone font-medium text-black uppercase leading-none tracking-widest whitespace-nowrap mix-blend-multiply">
            <div className="flex">
              <span className="editorial-letter inline-block will-change-transform">E</span>
              <span className="editorial-letter inline-block will-change-transform">D</span>
              <span className="editorial-letter inline-block will-change-transform">I</span>
              <span className="editorial-letter inline-block will-change-transform">T</span>
            </div>
            <div className="flex ml-16 md:ml-24 lg:ml-32">
              <span className="editorial-letter inline-block will-change-transform">O</span>
              <span className="editorial-letter inline-block will-change-transform">R</span>
              <span className="editorial-letter inline-block will-change-transform">I</span>
              <span className="editorial-letter inline-block will-change-transform">A</span>
              <span className="editorial-letter inline-block will-change-transform">L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Tall Portrait Image (Milkshake / Model) */}
      <div className="relative w-[30%] h-[78%] flex items-center justify-end z-10">
        <div className="editorial-tall-card parallax-fg relative w-full h-[88%] rounded-none overflow-hidden bg-zinc-100 shadow-xl group will-change-[clip-path,transform,opacity]">
          <div className="editorial-tall w-full h-full will-change-transform">
            <img
              src="/images/section2-editorial-tall.jpg"
              alt="Editorial Tall Model"
              className="w-full h-full object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
