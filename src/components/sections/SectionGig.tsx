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

export default function SectionGig() {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 flex items-center overflow-hidden bg-white px-6 sm:px-10 md:px-12 lg:px-16">
      
      {/* 2-Column Composition: Heading on Left, Image + Copy pushed Right */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
        
        {/* Left Column: Entire Statement Headline + Subhead & Pitch Body beneath it */}
        <div className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-center">
          
          {/* Main Statement Headline */}
          <div className="flex flex-col font-didone text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[3.1rem] font-bold text-black uppercase leading-[1.04] select-none tracking-tight mb-5 md:mb-6">
            <span className="leading-none mb-1.5 md:mb-2 whitespace-nowrap">
              <SplitChars text="DON'T PRETEND" className="gig-line1-letter" />
            </span>
            <span className="leading-none mb-1.5 md:mb-2 whitespace-nowrap">
              <SplitChars text="YOU DIDN'T JUST SCROLL" className="gig-line2-letter" />
            </span>
            <span className="leading-none mb-1.5 md:mb-2 whitespace-nowrap">
              <SplitChars text="BACK & FORTH TO WATCH" className="gig-line3-letter" />
            </span>
            <span className="leading-none whitespace-nowrap">
              <SplitChars text="THE LETTERS ASSEMBLE." className="gig-line4-letter" />
            </span>
          </div>

          {/* Subheading & Pitch Body Copy - placed directly under the headline */}
          <div className="space-y-2.5 max-w-[460px] lg:max-w-[490px]">
            <p className="font-sans font-bold text-xs sm:text-sm text-black uppercase tracking-wide leading-snug flex flex-wrap">
              <SplitWords
                text="Every great collection comes to an end, but our collaboration doesn't have to."
                className="gig-sub-word"
              />
            </p>
            <p className="font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed flex flex-wrap">
              <SplitWords
                text="If I can make letters scatter across 600vw with this level of elegance, imagine what I can do for your actual product. Let's skip the awkward 3-round interview and get straight to building."
                className="gig-desc-word"
              />
            </p>
          </div>

        </div>

        {/* Right Column: Pastel Gradient Rectangle + Fashion Portrait (overlapping) */}
        <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center md:justify-end relative">
          
          {/* Pastel Gradient Rectangle Asset - positioned beside and behind the image */}
          <div className="gig-rect relative z-0 flex-shrink-0 -mr-12 sm:-mr-16 md:-mr-20 lg:-mr-24 will-change-transform pointer-events-none select-none">
            <img
              src="/ChatGPT Image Sep 29, 2026, 03_37_46 AM.png"
              alt="Pastel Gradient Rectangle"
              className="h-[46vh] sm:h-[52vh] md:h-[58vh] lg:h-[62vh] w-auto max-h-[64vh] object-contain block mix-blend-multiply opacity-90"
            />
          </div>

          {/* Portrait Image Card overlapping on top */}
          <div className="gig-card relative z-10 flex-shrink-0 overflow-hidden bg-zinc-950 will-change-transform shadow-2xl border border-black/5">
            <img
              src="/ChatGPT Image Sep 29, 2026, 04_05_22 PM.png"
              alt="Waiting for the gig"
              className="gig-img h-[52vh] sm:h-[58vh] md:h-[64vh] lg:h-[68vh] w-auto max-h-[70vh] max-w-full object-contain block will-change-transform"
            />
          </div>

        </div>

      </div>

    </section>
  );
}
