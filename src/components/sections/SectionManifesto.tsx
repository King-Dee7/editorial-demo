"use client";

import React from "react";

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

export default function SectionManifesto() {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 flex items-center overflow-hidden bg-white px-8 md:px-14 lg:px-20">
      
      {/* Top-Right Stamp: FOLLOW US ON SOCIAL NETWORKS (Continuous Spin) */}
      <div className="muse-stamp absolute top-16 md:top-20 right-10 md:right-16 lg:right-24 z-20 will-change-transform">
        <img
          src="/ChatGPT Image Sep 28, 2026, 02_52_40 PM.png"
          alt="Follow us on social networks"
          className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain mix-blend-multiply animate-[spin_24s_linear_infinite] hover:scale-105 transition-transform duration-300 cursor-pointer pointer-events-auto select-none"
        />
      </div>

      {/* Main Editorial Composition */}
      <div className="relative z-10 flex items-start pl-2 sm:pl-6 md:pl-10 lg:pl-14 pt-6 md:pt-8">
        
        {/* Column 1: "BE" + The Photo below it */}
        <div className="flex flex-col items-start flex-shrink-0">
          <span className="font-didone text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-bold text-black uppercase leading-none select-none tracking-tight mb-2 md:mb-3">
            <SplitChars text="BE" className="be-letter" />
          </span>
          <div className="muse-card relative w-48 sm:w-56 md:w-68 lg:w-76 h-[44vh] md:h-[50vh] lg:h-[56vh] overflow-hidden bg-zinc-100 z-10 will-change-transform shadow-sm">
            <img
              src="/ChatGPT Image Sep 28, 2026, 02_15_45 PM.png"
              alt="Muse in car"
              className="muse-img w-full h-full object-cover grayscale contrast-110 will-change-transform"
            />
          </div>
        </div>

        {/* Column 2: "YOUR", "OWN", "MUSE" + Paragraph 1 + Pink Blob behind */}
        <div className="relative flex flex-col items-start pl-3 sm:pl-5 md:pl-7 lg:pl-8">
          
          {/* Pink Blob Asset tucked behind title and overlapping the photo */}
          <img
            src="/ChatGPT Image Sep 28, 2026, 02_38_49 PM.png"
            alt="Pink Blob"
            className="muse-blob absolute -left-16 sm:-left-20 md:-left-28 -top-8 sm:-top-12 md:-top-16 w-[340px] md:w-[440px] lg:w-[500px] h-auto object-contain pointer-events-none mix-blend-multiply -z-10 will-change-transform"
          />

          {/* Stacked Words aligning with 'BE' */}
          <div className="flex flex-col font-didone text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-bold text-black uppercase leading-none select-none tracking-tight">
            <span className="leading-none mb-2 md:mb-3">
              <SplitChars text="YOUR" className="muse-letter" />
            </span>
            <span className="leading-none mb-2 md:mb-3">
              <SplitChars text="OWN" className="muse-letter" />
            </span>
            <span className="leading-none mb-4 md:mb-6">
              <SplitChars text="MUSE" className="muse-letter" />
            </span>
          </div>

          {/* Paragraph 1 placed directly under MUSE */}
          <div className="max-w-[260px] md:max-w-[300px]">
            <p className="font-sans font-semibold text-[11px] md:text-xs text-black leading-relaxed flex flex-wrap">
              <SplitWords
                text="Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros facilisis libero, vitae commodo nunc quam et ligula ut nec ipsum sapien."
                className="muse-desc-word"
              />
            </p>
          </div>

        </div>

      </div>

      {/* Far Right Column: Paragraph 2 */}
      <div className="absolute right-10 md:right-16 lg:right-24 bottom-20 md:bottom-24 z-10 max-w-[230px] md:max-w-[260px]">
        <p className="font-sans text-[11px] md:text-xs text-zinc-600 leading-relaxed flex flex-wrap">
          <SplitWords
            text="Aenean eu enim justo. Vestibulum aliquam hendrerit molestie. Mauris malesuada nisi sit amet augue accumsan tincidunt. Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros facilisis libero, vitae commodo."
            className="muse-desc2-word"
          />
        </p>
      </div>

    </section>
  );
}
