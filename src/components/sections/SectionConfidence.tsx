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

export default function SectionConfidence() {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 flex items-center overflow-hidden bg-white px-8 md:px-14 lg:px-20">
      
      {/* Top Left Horizontal Pastel Gradient Banner */}
      <div className="confidence-banner absolute left-[8%] md:left-[11%] lg:left-[13%] top-[19%] md:top-[21%] lg:top-[22%] w-[320px] md:w-[420px] lg:w-[480px] h-24 md:h-32 lg:h-36 bg-gradient-to-r from-[#fbc2ff]/80 via-[#fcd5e8]/80 to-[#fedecf]/90 z-0 will-change-transform" />

      {/* Main Composition: Photo + 3 Rotated Columns */}
      <div className="relative z-10 pl-6 sm:pl-10 md:pl-16 lg:pl-24 flex items-center pt-8 md:pt-12 lg:pt-14">
        
        {/* The Portrait Photo Container */}
        <div className="confidence-card relative w-52 sm:w-60 md:w-72 lg:w-80 h-[50vh] md:h-[56vh] lg:h-[62vh] flex-shrink-0 z-10 shadow-md bg-zinc-100 will-change-transform">
          <img
            src="/ChatGPT Image Sep 28, 2026, 02_16_01 PM.png"
            alt="Don't Hide Yourself Portrait"
            className="confidence-img w-full h-full object-cover grayscale contrast-110 will-change-transform"
          />

          {/* 3 Rotated Columns (DON'T | HIDE | YOURSELF) anchored to bottom-right of the photo */}
          <div className="absolute left-[calc(100%-1rem)] md:left-[calc(100%-1.6rem)] top-[94%] md:top-[93%] will-change-transform">
            <div className="flex flex-col items-start gap-2 sm:gap-2.5 md:gap-3.5 lg:gap-4 -rotate-90 origin-top-left select-none pointer-events-none whitespace-nowrap">
              
              {/* Column 1 (Leftmost): DON'T */}
              <span className="font-didone text-lg sm:text-xl md:text-2xl lg:text-[2.2rem] font-bold text-black uppercase tracking-[0.18em] leading-none flex">
                <SplitChars text="DON'T" className="dont-letter" />
              </span>

              {/* Column 2 (Middle): HIDE */}
              <span className="font-didone text-lg sm:text-xl md:text-2xl lg:text-[2.2rem] font-bold text-black uppercase tracking-[0.18em] leading-none flex">
                <SplitChars text="HIDE" className="hide-letter" />
              </span>

              {/* Column 3 (Rightmost): YOURSELF */}
              <span className="font-didone text-3xl sm:text-4xl md:text-[3.2rem] lg:text-[3.6rem] font-bold text-black uppercase tracking-[0.1em] leading-none flex">
                <SplitChars text="YOURSELF" className="yourself-letter" />
              </span>

            </div>
          </div>

        </div>

      </div>

      {/* Right Column: Editorial Body Copy & Learn More CTA */}
      <div className="absolute right-10 md:right-16 lg:right-24 top-[48%] -translate-y-1/2 max-w-[260px] md:max-w-[300px] lg:max-w-[330px] z-10">
        <div>
          <h3 className="font-sans font-black text-sm md:text-base text-black mb-3 tracking-wide flex flex-wrap">
            <SplitChars text="Get self confident" className="confidence-title-letter" />
          </h3>
        
          <p className="text-zinc-600 font-sans text-xs md:text-[13px] leading-relaxed mb-3 flex flex-wrap">
            <SplitWords
              text="Sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh finibus et."
              className="confidence-p1-word"
            />
          </p>

          <p className="text-zinc-500 font-sans text-xs md:text-[13px] leading-relaxed mb-6 flex flex-wrap">
            <SplitWords
              text="Aenean eu enim justo. Vestibulum aliquam hendrerit molestie. Mauris malesuada nisi sit amet augue accumsan tincidunt."
              className="confidence-p2-word"
            />
          </p>

          {/* CTA with pure CSS gradient circle */}
          <div className="relative inline-flex items-center">
            <div className="confidence-circle absolute -left-3.5 -top-2.5 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#f8a8e5] via-[#fcbde8] to-[#fed4ba] -z-10 pointer-events-none will-change-transform" />
            <button className="confidence-cta flex items-center gap-3 text-black font-sans font-black text-[10px] md:text-xs tracking-[0.2em] uppercase hover:text-zinc-600 transition-colors group cursor-pointer will-change-transform">
              <span>LEARN MORE</span>
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
