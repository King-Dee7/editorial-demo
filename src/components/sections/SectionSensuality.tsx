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

export default function SectionSensuality() {
  return (
    <section className="editorial-section relative w-screen h-screen flex-shrink-0 flex items-center justify-center overflow-hidden bg-white px-8 md:px-14 lg:px-20">
      
      {/* Background Typography: UNLEASH */}
      <div className="parallax-bg absolute top-[13%] md:top-[14%] lg:top-[15%] left-0 right-0 flex justify-center pointer-events-none select-none z-0 will-change-transform">
        <h2 className="font-didone text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.26em] pl-[0.26em] text-black uppercase leading-none font-medium flex justify-center">
          <SplitChars text="UNLEASH" className="unleash-letter" />
        </h2>
      </div>

      {/* "YOUR" text positioned neatly beside the model's head (Upper Left) */}
      <div className="absolute left-[33%] md:left-[35%] lg:left-[37%] top-[33%] md:top-[34%] -translate-y-1/2 pointer-events-none z-10">
        <span className="parallax-mid flex font-sans font-bold text-[10px] md:text-xs tracking-[0.35em] pl-[0.35em] text-black uppercase whitespace-nowrap select-none will-change-transform">
          <SplitChars text="YOUR" className="your-letter" />
        </span>
      </div>

      {/* Background Typography: SENSUALITY */}
      <div className="absolute top-[48%] md:top-[50%] lg:top-[51%] -translate-y-1/2 left-0 right-0 flex justify-center pointer-events-none select-none z-0">
        <h1 className="parallax-mid font-didone text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] tracking-[0.12em] pl-[0.12em] text-black uppercase leading-none font-bold will-change-transform flex justify-center">
          <SplitChars text="SENSUALITY" className="sensuality-letter" />
        </h1>
      </div>

      {/* Centerpiece High Fashion Model Cutout Image */}
      <div className="absolute left-1/2 -translate-x-[47%] bottom-[6%] md:bottom-[7%] lg:bottom-[8%] h-[58vh] md:h-[64vh] lg:h-[68vh] z-20 flex items-end justify-center pointer-events-none">
        <div className="sensuality-model parallax-fg h-full w-auto will-change-transform flex items-end">
          <img
            src="/ChatGPT Image Sep 28, 2026, 10_29_21 PM.png"
            alt="Sensuality Model"
            className="h-full w-auto max-w-none object-contain mix-blend-multiply grayscale contrast-110"
          />
        </div>
      </div>

      {/* Bottom-Left Column: Tantra for beginners Article & CTA */}
      <div className="absolute left-8 md:left-14 lg:left-20 bottom-12 md:bottom-16 z-30 max-w-[240px] md:max-w-[270px]">
        <div className="parallax-text will-change-transform">
          <h3 className="font-sans font-black text-xs md:text-sm text-black mb-1.5 tracking-wide flex flex-wrap">
            <SplitChars text="Tantra for beginners" className="tantra-title-letter" />
          </h3>
          <p className="text-zinc-600 font-sans text-[11px] leading-relaxed mb-5 flex flex-wrap">
            <SplitChars
              text="Ut nec ipsum sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer id nisi nec nulla luctus."
              className="tantra-desc-letter"
            />
          </p>

          {/* CTA with pure CSS soft circle */}
          <div className="relative inline-flex items-center">
            <div className="sensuality-circle absolute -left-3 -top-2.5 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#f8a8e5] via-[#fcbde8] to-[#fed4ba] -z-10 pointer-events-none will-change-transform" />
            <button className="sensuality-cta flex items-center gap-3 text-black font-sans font-black text-[10px] md:text-xs tracking-[0.2em] uppercase hover:text-zinc-600 transition-colors group cursor-pointer will-change-transform">
              <span>ARE YOU READY?</span>
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
