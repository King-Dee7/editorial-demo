"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import Header from "@/components/Header";
import FooterControls from "@/components/FooterControls";
import SectionHero from "@/components/sections/SectionHero";
import SectionEditorial from "@/components/sections/SectionEditorial";
import SectionSensuality from "@/components/sections/SectionSensuality";
import SectionManifesto from "@/components/sections/SectionManifesto";
import SectionConfidence from "@/components/sections/SectionConfidence";
import SectionLookbook from "@/components/sections/SectionLookbook";
import SectionGig from "@/components/sections/SectionGig";

const MemoizedSectionHero = memo(SectionHero);
const MemoizedSectionEditorial = memo(SectionEditorial);
const MemoizedSectionSensuality = memo(SectionSensuality);
const MemoizedSectionManifesto = memo(SectionManifesto);
const MemoizedSectionConfidence = memo(SectionConfidence);
const MemoizedSectionLookbook = memo(SectionLookbook);
const MemoizedSectionGig = memo(SectionGig);

const TOTAL_SECTIONS = 7;
const sectionProgressTargets = [0, 0.1788, 0.3431, 0.5073, 0.6715, 0.8358, 1.0];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastActiveSectionRef = useRef<number>(0);
  const isNavigatingRef = useRef<number | null>(null);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const introCompletedRef = useRef<boolean>(false);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [activeSection, setActiveSection] = useState<number>(0);

  // Scroll to a specific section smoothly
  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      if (introTimelineRef.current && !introCompletedRef.current) {
        introTimelineRef.current.progress(1);
      }
      if (!scrollTriggerRef.current) return;
      const targetIdx = Math.max(0, Math.min(TOTAL_SECTIONS - 1, sectionIndex));

      // Immediately set active section on click
      isNavigatingRef.current = targetIdx;
      lastActiveSectionRef.current = targetIdx;
      setActiveSection(targetIdx);

      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
      navTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = null;
      }, 900);

      const st = scrollTriggerRef.current;
      const totalDistance = st.end - st.start;
      const targetProg = sectionProgressTargets[targetIdx];
      const targetScroll = st.start + targetProg * totalDistance;

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    },
    []
  );

  const handlePrev = useCallback(() => {
    scrollToSection(lastActiveSectionRef.current - 1);
  }, [scrollToSection]);

  const handleNext = useCallback(() => {
    scrollToSection(lastActiveSectionRef.current + 1);
  }, [scrollToSection]);

  const handleHeroExplore = useCallback(() => {
    scrollToSection(1);
  }, [scrollToSection]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const sections = gsap.utils.toArray<HTMLElement>(".editorial-section");

      let tl: gsap.core.Timeline | null = null;

      const initScrollTrigger = () => {
        // Main Master Timeline pinned to the container
        // Extra window.innerWidth * 0.9 added to scroll distance for the sticky hero disassembly phase
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + window.innerWidth * 0.9}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = self.progress;

            // Direct CSS custom property update - 0 React re-renders during 60/120fps scroll!
            document.documentElement.style.setProperty(
              "--scroll-percent",
              `${(prog * 100).toFixed(2)}%`
            );

            // While navigating via click, hold active state until close to destination
            if (isNavigatingRef.current !== null) {
              const targetProg = sectionProgressTargets[isNavigatingRef.current];
              if (Math.abs(prog - targetProg) < 0.02) {
                isNavigatingRef.current = null;
              } else {
                return;
              }
            }

            // Calibrated section thresholds matching visual arrival
            let currentIdx = 0;
            if (prog < 0.14) {
              currentIdx = 0; // Section 0: The Little Vanity (Hero finishes at ~0.14)
            } else if (prog < 0.26) {
              currentIdx = 1; // Section 1: Week in Fashion (centered at 0.1788)
            } else if (prog < 0.42) {
              currentIdx = 2; // Section 2: Unleash Sensuality (centered at 0.3431)
            } else if (prog < 0.59) {
              currentIdx = 3; // Section 3: Atelier Silhouette (centered at 0.5073)
            } else if (prog < 0.75) {
              currentIdx = 4; // Section 4: Confidence (centered at 0.6715)
            } else if (prog < 0.92) {
              currentIdx = 5; // Section 5: Lookbook (centered at 0.8358)
            } else {
              currentIdx = 6; // Section 6: The Gig (centered at 1.0)
            }

            if (currentIdx !== lastActiveSectionRef.current) {
              lastActiveSectionRef.current = currentIdx;
              setActiveSection(currentIdx);
            }
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;

      // ==========================================
      // PHASE 1: STICKY HERO DISASSEMBLY & SLIDER SUCTION (Time 0 -> 0.85)
      // Track stays completely STILL (x: 0).
      // Screen does NOT slide horizontally.
      // The portrait slider slides shut to the left, creating a suction slipstream
      // that pulls all scattered letters across the screen into the left void.
      // ==========================================
      const heroPortrait = sections[0].querySelector(".hero-portrait");
      const heroShape = sections[0].querySelector(".hero-shape");
      const heroBadge = sections[0].querySelector(".hero-badge");
      const vanityLetters = sections[0].querySelectorAll(".vanity-letter");
      const littleLetters = sections[0].querySelectorAll(".little-letter");

      // 1. The Portrait Slider: Slides leftward and closes shut
      if (heroPortrait) {
        tl.fromTo(
          heroPortrait,
          {
            x: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
          },
          {
            x: -600,
            clipPath: "inset(0% 100% 0% 0%)",
            opacity: 1,
            duration: 0.85,
            ease: "power1.inOut",
          },
          0
        );
      }

      // 2. The VANITY Letters: Moving left concurrently with the slider from the very start,
      // scattering vertically and tilting as they travel across the screen
      if (vanityLetters.length > 0) {
        tl.fromTo(
          vanityLetters,
          { x: 0, y: 0, rotate: 0, opacity: 1 },
          {
            // Sweeps left continuously in lockstep with the slider
            x: (i) => -850 - i * 80,
            // Scattered vertical dispersion
            y: (i) => (i % 2 === 0 ? -45 - i * 6 : 40 + i * 6),
            // Aerodynamic tilt
            rotate: (i) => (i % 2 === 0 ? -16 + i * 2 : 14 - i * 3),
            opacity: 0,
            duration: 0.85,
            ease: "power1.inOut", // moves immediately in lockstep with the slider!
            stagger: 0.008, // minimal stagger so all letters move left concurrently
          },
          0
        );
      }

      // 3. THE LITTLE Sub-heading Letters: Swept to the left in tandem
      if (littleLetters.length > 0) {
        tl.fromTo(
          littleLetters,
          { x: 0, y: 0, rotate: 0, opacity: 1 },
          {
            x: (i) => -650 - i * 45,
            y: (i) => -35 - (i % 3) * 15,
            rotate: (i) => (i % 2 === 0 ? -18 : 16),
            opacity: 0,
            duration: 0.85,
            ease: "power1.inOut",
            stagger: 0.006,
          },
          0
        );
      }

      // 4. The Pink Shape: Moves left concurrently with the slider and collapses
      if (heroShape) {
        tl.fromTo(
          heroShape,
          { x: 0, y: 0, scale: 1, opacity: 0.95 },
          {
            x: -550,
            y: 40,
            scale: 0.4,
            opacity: 0,
            duration: 0.85,
            ease: "power1.inOut",
          },
          0
        );
      }

      // 5. Special Issue Badge: Collapses with the hero section
      if (heroBadge) {
        tl.fromTo(
          heroBadge,
          { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 },
          {
            x: -500,
            y: -40,
            rotate: -25,
            scale: 0.4,
            opacity: 0,
            duration: 0.85,
            ease: "power1.inOut",
          },
          0
        );
      }

      // ==========================================
      // PHASE 2: HORIZONTAL TRACK TRANSLATION (Time 0.08 -> 5.48)
      // Sections smoothly translate across the viewport through Section 7!
      // ==========================================
      tl.to(
        track,
        {
          x: getScrollAmount,
          duration: 5.4,
          ease: "none",
        },
        0.08
      );

      // ==========================================
      // PHASE 3: SECTION 2 ASSEMBLY CHOREOGRAPHY (Time 0.10 -> 0.90)
      // Letters and images assemble into place as Section 2 arrives!
      // ==========================================
      const sec2 = sections[1];
      if (sec2) {
        const sec2Letters = sec2.querySelectorAll(".editorial-letter");
        const sec2ThumbCard = sec2.querySelector(".editorial-thumb-card");
        const sec2TallCard = sec2.querySelector(".editorial-tall-card");
        const sec2Banner = sec2.querySelector(".editorial-banner");
        const sec2Line = sec2.querySelector(".editorial-line");
        const sec2WeekLetters = sec2.querySelectorAll(".week-letter");
        const sec2DescWords = sec2.querySelectorAll(".desc-word");

        // 1. EDITORIAL Letters: Fly in from scattered positions, untilt, and snap together
        if (sec2Letters.length > 0) {
          const scatterX = [-55, 45, -35, 55, -60, 50, -40, 35, -30];
          const scatterY = [60, -50, 45, -60, 70, -45, 55, -40, 50];
          const scatterRotate = [-20, 18, -15, 22, -18, 16, -18, 20, -14];

          tl.fromTo(
            sec2Letters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRotate[i % scatterRotate.length],
              scale: 0.75,
              opacity: 0.1,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.78,
              ease: "power2.out",
              stagger: 0.015,
            },
            0.12
          );
        }

        // 2. Tall Model Card: Whole card pulls open and glides into position
        if (sec2TallCard) {
          tl.fromTo(
            sec2TallCard,
            {
              x: 80,
              y: 25,
              scale: 0.92,
              clipPath: "inset(0% 0% 0% 100%)",
              opacity: 0.3,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 0.78,
              ease: "power2.out",
            },
            0.12
          );
        }

        // 3. Square Thumbnail Card: Whole card rises up from the bottom and scales into place
        if (sec2ThumbCard) {
          tl.fromTo(
            sec2ThumbCard,
            {
              y: 85,
              scale: 0.88,
              opacity: 0.2,
            },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
            },
            0.14
          );
        }

        // 4. Soft Pink/Peach Banner: Expands horizontally under the letters
        if (sec2Banner) {
          tl.fromTo(
            sec2Banner,
            {
              scaleX: 0.3,
              x: 70,
              opacity: 0,
            },
            {
              scaleX: 1,
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
            },
            0.10
          );
        }

        // 5. Left Column "WEEK IN FASHION" Article Elements Assembly
        if (sec2Line) {
          tl.fromTo(
            sec2Line,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            0.14
          );
        }

        // Heading Letters: Scatter in X, Y, rotate, scale and snap together
        if (sec2WeekLetters.length > 0) {
          const scatterX = [-25, 20, -18, 22, -30, 25, -20, 18, -22, 26, -15, 20, -24];
          const scatterY = [30, -25, 20, -28, 35, -22, 28, -30, 22, -26, 30, -20, 25];
          const scatterRot = [-15, 12, -14, 18, -16, 14, -18, 15, -12, 16, -14, 18, -15];

          tl.fromTo(
            sec2WeekLetters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.75,
              opacity: 0.1,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.72,
              ease: "power2.out",
              stagger: 0.015,
            },
            0.14
          );
        }

        // Latin Paragraph Words: Typeset word-by-word assembly cascading into place
        if (sec2DescWords.length > 0) {
          tl.fromTo(
            sec2DescWords,
            {
              y: (i) => 22 + (i % 4) * 6,
              x: (i) => (i % 2 === 0 ? -12 : 14),
              rotate: (i) => (i % 2 === 0 ? -8 : 9),
              scale: 0.8,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.68,
              ease: "power2.out",
              stagger: 0.012,
            },
            0.18
          );
        }

        // ==========================================
        // SECTION 2 DISASSEMBLY CHOREOGRAPHY (Time 0.98 -> 1.80)
        // Sucked to the far left as Section 3 comes in!
        // ==========================================
        const sec2TitleWrap = sec2.querySelector(".editorial-title-wrap");

        // 1. EDITORIAL Title & Letters: Sucked to the left while scattering and tilting
        if (sec2TitleWrap) {
          tl.to(
            sec2TitleWrap,
            {
              x: -850,
              opacity: 0,
              duration: 0.82,
              ease: "power1.inOut",
            },
            0.98
          );
        }

        if (sec2Letters.length > 0) {
          tl.to(
            sec2Letters,
            {
              x: (i) => (i % 2 === 0 ? -80 - i * 15 : 80 + i * 15),
              y: (i) => (i % 2 === 0 ? 60 + i * 8 : -60 - i * 8),
              rotate: (i) => (i % 2 === 0 ? -32 + i * 4 : 28 - i * 5),
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
              stagger: 0.008,
            },
            0.98
          );
        }

        // 2. Tall Model Card: WHOLE CARD closes shut like a slider to the left and sweeps across
        if (sec2TallCard) {
          tl.to(
            sec2TallCard,
            {
              x: -650,
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
            },
            0.98
          );
        }

        // 3. Square Thumbnail Card: WHOLE CARD sucked to the far left and collapses
        if (sec2ThumbCard) {
          tl.to(
            sec2ThumbCard,
            {
              x: -550,
              y: -30,
              scale: 0.65,
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
            },
            0.98
          );
        }

        // 4. Soft Pink/Peach Banner: Collapses to the left
        if (sec2Banner) {
          tl.to(
            sec2Banner,
            {
              x: -600,
              scaleX: 0.2,
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
            },
            0.98
          );
        }

        // 5. Left Column "WEEK IN FASHION" Article Elements: Sucked to the left
        if (sec2Line) {
          tl.to(
            sec2Line,
            { x: -500, scaleX: 0, opacity: 0, duration: 0.48, ease: "power1.inOut" },
            0.98
          );
        }

        if (sec2WeekLetters.length > 0) {
          tl.to(
            sec2WeekLetters,
            {
              x: (i) => -600 - i * 20,
              y: (i) => (i % 2 === 0 ? -35 - i * 3 : 40 + i * 3),
              rotate: (i) => (i % 2 === 0 ? -24 : 22),
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
              stagger: 0.006,
            },
            0.98
          );
        }

        if (sec2DescWords.length > 0) {
          tl.to(
            sec2DescWords,
            {
              x: (i) => -520 - i * 12,
              y: (i) => (i % 2 === 0 ? -25 : 30),
              rotate: (i) => (i % 2 === 0 ? -14 : 16),
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
              stagger: 0.005,
            },
            0.98
          );
        }
      }

      // ==========================================
      // PHASE 4: SECTION 3 ASSEMBLY CHOREOGRAPHY (Time 1.28 -> 1.96)
      // Words and headlines assemble VISIBLY on-screen as Section 3 arrives!
      // Centerpiece lady image slides in from the RIGHT as the LAST element!
      // ==========================================
      const sec3 = sections[2];
      if (sec3) {
        const unleashLetters = sec3.querySelectorAll(".unleash-letter");
        const yourLetters = sec3.querySelectorAll(".your-letter");
        const sensualityLetters = sec3.querySelectorAll(".sensuality-letter");
        const tantraTitleLetters = sec3.querySelectorAll(".tantra-title-letter");
        const tantraDescLetters = sec3.querySelectorAll(".tantra-desc-letter");
        const sensualityModel = sec3.querySelector(".sensuality-model");
        const sensualityCircle = sec3.querySelector(".sensuality-circle");
        const sensualityCta = sec3.querySelector(".sensuality-cta");

        // 1. "Tantra for beginners" - Assembles visibly as left column crosses into view
        if (tantraTitleLetters.length > 0) {
          const scatterX = [-25, 25, -20, 24, -26, 22, -24, 20, -22, 25, -20, 24, -22, 26, -24, 20, -25, 22, -20, 24];
          const scatterY = [32, -30, 28, -32, 35, -28, 30, -34, 28, -30, 34, -28, 30, -32, 35, -28, 32, -30, 28, -32];
          const scatterRot = [-22, 20, -18, 22, -20, 18, -22, 20, -18, 22, -20, 18, -22, 20, -18, 22, -18, 20, -22, 18];

          tl.fromTo(
            tantraTitleLetters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.7,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.007,
            },
            1.28
          );
        }

        // 2. Latin Article Body - Every letter assembles in tandem
        if (tantraDescLetters.length > 0) {
          tl.fromTo(
            tantraDescLetters,
            {
              y: (i) => 24 + (i % 5) * 5,
              x: (i) => (i % 2 === 0 ? -12 : 14),
              rotate: (i) => (i % 2 === 0 ? -16 : 18),
              scale: 0.75,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.32,
              ease: "power2.out",
              stagger: 0.002,
            },
            1.32
          );
        }

        // 3. Giant SENSUALITY Headline Letters: Fly in from scattered positions and snap together
        // Timing set to 1.38 so letters assemble right as the heading enters the screen!
        if (sensualityLetters.length > 0) {
          const scatterX = [-70, 65, -55, 70, -75, 60, -65, 70, -60, 65];
          const scatterY = [90, -80, 75, -90, 100, -80, 85, -75, 80, -75];
          const scatterRot = [-24, 20, -18, 22, -20, 18, -22, 22, -18, 20];

          tl.fromTo(
            sensualityLetters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.65,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.012,
            },
            1.38
          );
        }

        // 4. UNLEASH Headline Letters: Fly down and lock into upper grid as heading arrives
        if (unleashLetters.length > 0) {
          tl.fromTo(
            unleashLetters,
            {
              y: (i) => -100 - (i % 3) * 20,
              x: (i) => (i % 2 === 0 ? -40 : 40),
              rotate: (i) => (i % 2 === 0 ? -22 : 20),
              scale: 0.7,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.014,
            },
            1.38
          );
        }

        // 5. YOUR Subtitle Letters: Assemble beside model head
        if (yourLetters.length > 0) {
          tl.fromTo(
            yourLetters,
            {
              x: -50,
              y: 30,
              rotate: (i) => (i % 2 === 0 ? -18 : 16),
              scale: 0.7,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.32,
              ease: "power2.out",
              stagger: 0.015,
            },
            1.42
          );
        }

        // 6. CTA Pink Gradient Circle: Expands under the arrow button
        if (sensualityCircle) {
          tl.fromTo(
            sensualityCircle,
            {
              scale: 0.2,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            1.55
          );
        }

        // 7. Sensuality Centerpiece Model Image: Slides in from the RIGHT AFTER all words assemble!
        // Arrives as the LAST element in the scene (1.72 -> 1.96)
        if (sensualityModel) {
          tl.fromTo(
            sensualityModel,
            {
              x: 420,
              y: 0,
              scale: 0.94,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.26,
              ease: "power2.out",
            },
            1.72
          );
        }

        // ==========================================
        // SECTION 3 DISASSEMBLY / EXIT (Time 1.98 -> 2.55)
        // Disassembles and gets sucked to the left as Section 4 arrives!
        // ==========================================

        // 1. Centerpiece Model Cutout: Swept to the left with an aerodynamic suction drift
        if (sensualityModel) {
          tl.to(
            sensualityModel,
            {
              x: -650,
              y: 25,
              scale: 0.85,
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
            },
            1.98
          );
        }

        // 2. SENSUALITY Letters: Disassemble and get sucked into the left void
        if (sensualityLetters.length > 0) {
          tl.to(
            sensualityLetters,
            {
              x: (i) => -600 - i * 25,
              y: (i) => (i % 2 === 0 ? -45 - i * 4 : 50 + i * 4),
              rotate: (i) => (i % 2 === 0 ? -28 : 24),
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
              stagger: 0.008,
            },
            1.98
          );
        }

        // 3. UNLEASH Letters: Disassemble and lift into the left slipstream
        if (unleashLetters.length > 0) {
          tl.to(
            unleashLetters,
            {
              x: (i) => -550 - i * 30,
              y: (i) => -60 - (i % 3) * 15,
              rotate: (i) => (i % 2 === 0 ? -24 : 22),
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
              stagger: 0.008,
            },
            1.98
          );
        }

        // 4. YOUR Subtitle Letters: Pulled left into the void
        if (yourLetters.length > 0) {
          tl.to(
            yourLetters,
            {
              x: -450,
              y: -35,
              rotate: (i) => (i % 2 === 0 ? -20 : 18),
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
              stagger: 0.006,
            },
            1.98
          );
        }

        // 5. "Tantra for beginners" Title & Latin Article Words: Sucked to the left
        if (tantraTitleLetters.length > 0) {
          tl.to(
            tantraTitleLetters,
            {
              x: (i) => -480 - i * 15,
              y: (i) => (i % 2 === 0 ? -30 : 35),
              rotate: (i) => (i % 2 === 0 ? -22 : 20),
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
              stagger: 0.005,
            },
            1.98
          );
        }

        if (tantraDescLetters.length > 0) {
          tl.to(
            tantraDescLetters,
            {
              x: (i) => -420 - i * 8,
              y: (i) => (i % 2 === 0 ? -20 : 25),
              rotate: (i) => (i % 2 === 0 ? -14 : 16),
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
              stagger: 0.002,
            },
            1.98
          );
        }

        // 6. CTA Button & Soft Circle: Collapse into the left
        if (sensualityCircle) {
          tl.to(
            sensualityCircle,
            {
              x: -350,
              scale: 0.2,
              opacity: 0,
              duration: 0.45,
              ease: "power1.inOut",
            },
            1.98
          );
        }

        if (sensualityCta) {
          tl.to(
            sensualityCta,
            {
              x: -400,
              opacity: 0,
              duration: 0.48,
              ease: "power1.inOut",
            },
            1.98
          );
        }
      }

      // ==========================================
      // PHASE 5: SECTION 4 (BE YOUR OWN MUSE) CHOREOGRAPHY
      // Entrance assembly (Time 2.18 -> 2.68)
      // Exit disassembly (Time 2.88 -> 3.45)
      // ==========================================
      const sec4 = sections[3];
      if (sec4) {
        const beLetters = sec4.querySelectorAll(".be-letter");
        const museLetters = sec4.querySelectorAll(".muse-letter");
        const museCard = sec4.querySelector(".muse-card");
        const museImg = sec4.querySelector(".muse-img");
        const museBlob = sec4.querySelector(".muse-blob");
        const museStamp = sec4.querySelector(".muse-stamp");
        const museDescWords = sec4.querySelectorAll(".muse-desc-word");
        const museDesc2Words = sec4.querySelectorAll(".muse-desc2-word");

        // --- ENTRANCE ASSEMBLY (Time 2.18 -> 2.68) ---

        // 1. "BE" Letters: Fly down and tilt into place
        if (beLetters.length > 0) {
          tl.fromTo(
            beLetters,
            {
              y: -80,
              x: -30,
              rotate: -22,
              scale: 0.7,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.02,
            },
            2.18
          );
        }

        // 2. Muse Photo Card: Reveals with bottom-left slide and zoom settling
        if (museCard) {
          tl.fromTo(
            museCard,
            {
              y: 70,
              x: -40,
              scale: 0.88,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.36,
              ease: "power2.out",
            },
            2.22
          );
        }

        if (museImg) {
          tl.fromTo(
            museImg,
            { scale: 1.15 },
            { scale: 1, duration: 0.36, ease: "power2.out" },
            2.22
          );
        }

        // 3. Pink Blob: Blooms behind the words and overlaps the photo
        if (museBlob) {
          tl.fromTo(
            museBlob,
            {
              scale: 0.25,
              opacity: 0,
              rotate: -15,
            },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.38,
              ease: "power2.out",
            },
            2.25
          );
        }

        // 4. "YOUR", "OWN", "MUSE" Letters: Fly in from scattered angles and snap together
        if (museLetters.length > 0) {
          const scatterX = [-65, 60, -50, 65, -55, 60, -45, 55, -50, 60, -55];
          const scatterY = [85, -75, 70, -85, 90, -75, 80, -70, 75, -70, 80];
          const scatterRot = [-24, 20, -18, 22, -20, 18, -22, 20, -18, 22, -20];

          tl.fromTo(
            museLetters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.65,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.012,
            },
            2.28
          );
        }

        // 5. Paragraph 1 Words under MUSE
        if (museDescWords.length > 0) {
          tl.fromTo(
            museDescWords,
            {
              y: 22,
              x: (i) => (i % 2 === 0 ? -8 : 10),
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              opacity: 1,
              duration: 0.30,
              ease: "power2.out",
              stagger: 0.004,
            },
            2.36
          );
        }

        // 6. Spinning Stamp: Zooms and spins in
        if (museStamp) {
          tl.fromTo(
            museStamp,
            {
              scale: 0.2,
              opacity: 0,
              rotate: -180,
            },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.35,
              ease: "power2.out",
            },
            2.42
          );
        }

        // 7. Far Right Paragraph 2 Words
        if (museDesc2Words.length > 0) {
          tl.fromTo(
            museDesc2Words,
            {
              y: 22,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.30,
              ease: "power2.out",
              stagger: 0.003,
            },
            2.45
          );
        }

        // --- EXIT DISASSEMBLY (Time 2.88 -> 3.45) ---

        // 1. "BE" Letters: Sucked into the left void
        if (beLetters.length > 0) {
          tl.to(
            beLetters,
            {
              x: (i) => -500 - i * 25,
              y: (i) => (i % 2 === 0 ? -35 : 35),
              rotate: -24,
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
            },
            2.88
          );
        }

        // 2. Muse Photo Card: Sweeps left and closes shut
        if (museCard) {
          tl.to(
            museCard,
            {
              x: -650,
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
            },
            2.88
          );
        }

        // 3. Pink Blob: Collapses into the left
        if (museBlob) {
          tl.to(
            museBlob,
            {
              x: -550,
              scale: 0.3,
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
            },
            2.88
          );
        }

        // 4. "YOUR", "OWN", "MUSE" Letters: Disassemble and get pulled left
        if (museLetters.length > 0) {
          tl.to(
            museLetters,
            {
              x: (i) => -580 - i * 20,
              y: (i) => (i % 2 === 0 ? -40 - i * 3 : 45 + i * 3),
              rotate: (i) => (i % 2 === 0 ? -26 : 24),
              opacity: 0,
              duration: 0.54,
              ease: "power1.inOut",
              stagger: 0.007,
            },
            2.88
          );
        }

        // 5. Paragraphs: Sucked to the left
        if (museDescWords.length > 0) {
          tl.to(
            museDescWords,
            {
              x: (i) => -450 - i * 8,
              opacity: 0,
              duration: 0.48,
              ease: "power1.inOut",
              stagger: 0.003,
            },
            2.88
          );
        }

        if (museDesc2Words.length > 0) {
          tl.to(
            museDesc2Words,
            {
              x: (i) => -450 - i * 8,
              opacity: 0,
              duration: 0.48,
              ease: "power1.inOut",
              stagger: 0.003,
            },
            2.88
          );
        }

        // 6. Spinning Stamp: Collapses into left
        if (museStamp) {
          tl.to(
            museStamp,
            {
              x: -450,
              scale: 0.2,
              opacity: 0,
              duration: 0.48,
              ease: "power1.inOut",
            },
            2.88
          );
        }
      }

      // ==========================================
      // PHASE 6: SECTION 5 (DON'T HIDE YOURSELF) CHOREOGRAPHY
      // Entrance assembly (Time 3.08 -> 3.58)
      // Exit disassembly (Time 3.78 -> 4.35)
      // ==========================================
      const sec5 = sections[4];
      if (sec5) {
        const dontLetters = sec5.querySelectorAll(".dont-letter");
        const hideLetters = sec5.querySelectorAll(".hide-letter");
        const yourselfLetters = sec5.querySelectorAll(".yourself-letter");
        const confidenceBanner = sec5.querySelector(".confidence-banner");
        const confidenceCard = sec5.querySelector(".confidence-card");
        const confidenceImg = sec5.querySelector(".confidence-img");
        const confidenceTitleLetters = sec5.querySelectorAll(".confidence-title-letter");
        const confidenceP1Words = sec5.querySelectorAll(".confidence-p1-word");
        const confidenceP2Words = sec5.querySelectorAll(".confidence-p2-word");
        const confidenceCircle = sec5.querySelector(".confidence-circle");
        const confidenceCta = sec5.querySelector(".confidence-cta");

        // --- ENTRANCE ASSEMBLY (Time 3.08 -> 3.58) ---

        // 1. Pastel Gradient Banner: Expands into place
        if (confidenceBanner) {
          tl.fromTo(
            confidenceBanner,
            {
              scaleX: 0.2,
              x: -120,
              opacity: 0,
            },
            {
              scaleX: 1,
              x: 0,
              opacity: 1,
              duration: 0.36,
              ease: "power2.out",
            },
            3.08
          );
        }

        // 2. Portrait Photo Container & Image
        if (confidenceCard) {
          tl.fromTo(
            confidenceCard,
            {
              y: 70,
              x: -50,
              scale: 0.88,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.38,
              ease: "power2.out",
            },
            3.12
          );
        }

        if (confidenceImg) {
          tl.fromTo(
            confidenceImg,
            { scale: 1.15 },
            { scale: 1, duration: 0.38, ease: "power2.out" },
            3.12
          );
        }

        // 3. Rotated Vertical Letters: DON'T, HIDE, and YOURSELF
        if (dontLetters.length > 0) {
          tl.fromTo(
            dontLetters,
            {
              y: (i) => 25 + i * 8,
              x: (i) => -30 - (i % 2) * 15,
              rotate: -15,
              opacity: 0,
              scale: 0.7,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.32,
              ease: "power2.out",
              stagger: 0.015,
            },
            3.18
          );
        }

        if (hideLetters.length > 0) {
          tl.fromTo(
            hideLetters,
            {
              y: (i) => 25 + i * 8,
              x: (i) => -30 - (i % 2) * 15,
              rotate: -15,
              opacity: 0,
              scale: 0.7,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.32,
              ease: "power2.out",
              stagger: 0.015,
            },
            3.22
          );
        }

        if (yourselfLetters.length > 0) {
          const scatterX = [-45, 40, -35, 45, -40, 35, -45, 40];
          const scatterY = [55, -50, 45, -55, 50, -45, 50, -45];
          const scatterRot = [-18, 16, -14, 18, -16, 14, -16, 14];

          tl.fromTo(
            yourselfLetters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.65,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.014,
            },
            3.26
          );
        }

        // 4. Right Column: "Get self confident" headline
        if (confidenceTitleLetters.length > 0) {
          tl.fromTo(
            confidenceTitleLetters,
            {
              y: -25,
              opacity: 0,
              scale: 0.8,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.30,
              ease: "power2.out",
              stagger: 0.008,
            },
            3.32
          );
        }

        // 5. Paragraphs
        if (confidenceP1Words.length > 0) {
          tl.fromTo(
            confidenceP1Words,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
              stagger: 0.003,
            },
            3.36
          );
        }

        if (confidenceP2Words.length > 0) {
          tl.fromTo(
            confidenceP2Words,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
              stagger: 0.003,
            },
            3.40
          );
        }

        // 6. CTA Circle & Button
        if (confidenceCircle) {
          tl.fromTo(
            confidenceCircle,
            {
              scale: 0.2,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.26,
              ease: "power2.out",
            },
            3.44
          );
        }

        if (confidenceCta) {
          tl.fromTo(
            confidenceCta,
            {
              x: 30,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.26,
              ease: "power2.out",
            },
            3.46
          );
        }

        // --- EXIT DISASSEMBLY (Time 3.78 -> 4.35) ---

        // 1. Pastel Banner: Collapses left
        if (confidenceBanner) {
          tl.to(
            confidenceBanner,
            {
              x: -550,
              scaleX: 0.2,
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        // 2. Photo Card: Closes shut like a sliding shutter to the left
        if (confidenceCard) {
          tl.to(
            confidenceCard,
            {
              x: -650,
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        // 3. Rotated Vertical Letters: Disassemble and get pulled left
        if (dontLetters.length > 0) {
          tl.to(
            dontLetters,
            {
              x: -500,
              y: (i) => -30 - i * 5,
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        if (hideLetters.length > 0) {
          tl.to(
            hideLetters,
            {
              x: -520,
              y: (i) => -30 - i * 5,
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        if (yourselfLetters.length > 0) {
          tl.to(
            yourselfLetters,
            {
              x: (i) => -600 - i * 20,
              y: (i) => (i % 2 === 0 ? -40 : 40),
              rotate: (i) => (i % 2 === 0 ? -24 : 22),
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
              stagger: 0.007,
            },
            3.78
          );
        }

        // 4. Right Column Elements: Disperse into left void
        if (confidenceTitleLetters.length > 0) {
          tl.to(
            confidenceTitleLetters,
            {
              x: -450,
              opacity: 0,
              duration: 0.48,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        if (confidenceP1Words.length > 0) {
          tl.to(
            confidenceP1Words,
            {
              x: (i) => -420 - i * 6,
              opacity: 0,
              duration: 0.46,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        if (confidenceP2Words.length > 0) {
          tl.to(
            confidenceP2Words,
            {
              x: (i) => -420 - i * 6,
              opacity: 0,
              duration: 0.46,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        if (confidenceCircle) {
          tl.to(
            confidenceCircle,
            {
              x: -380,
              scale: 0.2,
              opacity: 0,
              duration: 0.45,
              ease: "power1.inOut",
            },
            3.78
          );
        }

        if (confidenceCta) {
          tl.to(
            confidenceCta,
            {
              x: -380,
              opacity: 0,
              duration: 0.45,
              ease: "power1.inOut",
            },
            3.78
          );
        }
      }

      // ==========================================
      // PHASE 7: SECTION 6 (THE LOOKBOOK) ASSEMBLY CHOREOGRAPHY (Time 3.95 -> 4.50)
      // Letters, dual overlapping fashion cards, background circle, and CTA assemble
      // as Section 6 enters the viewport, and reverse-disassemble when scrolling back out!
      // ==========================================
      const sec6 = sections[5];
      if (sec6) {
        const lookbookCircleBg = sec6.querySelector(".lookbook-circle-bg");
        const lookbookTitleLetters = sec6.querySelectorAll(".lookbook-title-letter");
        const lookbookSeasonLetters = sec6.querySelectorAll(".lookbook-season-letter");
        const lookbookCard1 = sec6.querySelector(".lookbook-card-1");
        const lookbookImg1 = sec6.querySelector(".lookbook-img-1");
        const lookbookCard2 = sec6.querySelector(".lookbook-card-2");
        const lookbookImg2 = sec6.querySelector(".lookbook-img-2");
        const lookbookCopyWords = sec6.querySelectorAll(".lookbook-copy-word");
        const lookbookDescWords = sec6.querySelectorAll(".lookbook-desc-word");
        const lookbookCtaCircle = sec6.querySelector(".lookbook-cta-circle");
        const lookbookCta = sec6.querySelector(".lookbook-cta");

        // 1. Background Pink Gradient Circle: Blooms and scales into view
        if (lookbookCircleBg) {
          tl.fromTo(
            lookbookCircleBg,
            {
              scale: 0.25,
              opacity: 0,
              rotate: -15,
            },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.40,
              ease: "power2.out",
            },
            3.95
          );
        }

        // 2. "THE LOOKBOOK" Letters: Fly in from dynamic scatter and lock together
        if (lookbookTitleLetters.length > 0) {
          const scatterX = [-50, 45, -40, 50, -45, 40, -35, 45, -40, 35, -45, 40];
          const scatterY = [65, -60, 55, -65, 70, -55, 60, -50, 65, -55, 60, -50];
          const scatterRot = [-20, 18, -16, 22, -18, 16, -20, 18, -16, 20, -18, 16];

          tl.fromTo(
            lookbookTitleLetters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.65,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.38,
              ease: "power2.out",
              stagger: 0.012,
            },
            4.00
          );
        }

        // 3. "SEASON 2020" Letters: Cascades down from above with tilt
        if (lookbookSeasonLetters.length > 0) {
          tl.fromTo(
            lookbookSeasonLetters,
            {
              y: -40,
              x: (i) => (i % 2 === 0 ? -20 : 25),
              rotate: (i) => (i % 2 === 0 ? -15 : 12),
              scale: 0.75,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.36,
              ease: "power2.out",
              stagger: 0.014,
            },
            4.08
          );
        }

        // 4. Image 1: Left Dark Profile Portrait reveals from bottom-left
        if (lookbookCard1) {
          tl.fromTo(
            lookbookCard1,
            {
              y: 75,
              x: -45,
              scale: 0.88,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.40,
              ease: "power2.out",
            },
            4.06
          );
        }

        if (lookbookImg1) {
          tl.fromTo(
            lookbookImg1,
            { scale: 1.18 },
            { scale: 1, duration: 0.40, ease: "power2.out" },
            4.06
          );
        }

        // 5. Image 2: Foreground Lying Portrait slides in overlapping Image 1
        if (lookbookCard2) {
          tl.fromTo(
            lookbookCard2,
            {
              y: 80,
              x: 60,
              scale: 0.88,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.40,
              ease: "power2.out",
            },
            4.16
          );
        }

        if (lookbookImg2) {
          tl.fromTo(
            lookbookImg2,
            { scale: 1.20 },
            { scale: 1, duration: 0.40, ease: "power2.out" },
            4.16
          );
        }

        // 6. Right Column: Story Subhead Words
        if (lookbookCopyWords.length > 0) {
          tl.fromTo(
            lookbookCopyWords,
            {
              y: 24,
              x: (i) => (i % 2 === 0 ? -10 : 12),
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              opacity: 1,
              duration: 0.30,
              ease: "power2.out",
              stagger: 0.004,
            },
            4.22
          );
        }

        // 7. Right Column: Body Paragraph Words
        if (lookbookDescWords.length > 0) {
          tl.fromTo(
            lookbookDescWords,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
              stagger: 0.003,
            },
            4.26
          );
        }

        // 8. CTA Circle & Button
        if (lookbookCtaCircle) {
          tl.fromTo(
            lookbookCtaCircle,
            {
              scale: 0.2,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            4.32
          );
        }

        if (lookbookCta) {
          tl.fromTo(
            lookbookCta,
            {
              x: 35,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            4.34
          );
        }

        // --- SECTION 6 EXIT DISASSEMBLY (Time 4.68 -> 5.25) ---
        // As Section 7 approaches, Section 6 elements disassemble to the left
        if (lookbookTitleLetters.length > 0) {
          tl.to(
            lookbookTitleLetters,
            {
              x: (i) => -550 - i * 20,
              y: (i) => (i % 2 === 0 ? -30 : 35),
              rotate: (i) => (i % 2 === 0 ? -20 : 18),
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookSeasonLetters.length > 0) {
          tl.to(
            lookbookSeasonLetters,
            {
              x: -500,
              y: -30,
              opacity: 0,
              duration: 0.50,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookCard1) {
          tl.to(
            lookbookCard1,
            {
              x: -620,
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
              duration: 0.52,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookCard2) {
          tl.to(
            lookbookCard2,
            {
              x: -660,
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
              duration: 0.55,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookCircleBg) {
          tl.to(
            lookbookCircleBg,
            {
              x: -520,
              scale: 0.25,
              opacity: 0,
              duration: 0.48,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookCopyWords.length > 0) {
          tl.to(
            lookbookCopyWords,
            {
              x: -420,
              opacity: 0,
              duration: 0.46,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookDescWords.length > 0) {
          tl.to(
            lookbookDescWords,
            {
              x: -420,
              opacity: 0,
              duration: 0.46,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookCtaCircle) {
          tl.to(
            lookbookCtaCircle,
            {
              x: -360,
              scale: 0.2,
              opacity: 0,
              duration: 0.45,
              ease: "power1.inOut",
            },
            4.68
          );
        }

        if (lookbookCta) {
          tl.to(
            lookbookCta,
            {
              x: -360,
              opacity: 0,
              duration: 0.45,
              ease: "power1.inOut",
            },
            4.68
          );
        }
      }

      // ==========================================
      // PHASE 8: SECTION 7 (THE GIG) ASSEMBLY CHOREOGRAPHY (Time 4.85 -> 5.48)
      // Left: 4-Line Master Headline | Right: Fashion Card + Subhead + Pitch Body
      // ==========================================
      const sec7 = sections[6];
      if (sec7) {
        const gigLine1Letters = sec7.querySelectorAll(".gig-line1-letter");
        const gigLine2Letters = sec7.querySelectorAll(".gig-line2-letter");
        const gigLine3Letters = sec7.querySelectorAll(".gig-line3-letter");
        const gigLine4Letters = sec7.querySelectorAll(".gig-line4-letter");
        const gigCard = sec7.querySelector(".gig-card");
        const gigImg = sec7.querySelector(".gig-img");
        const gigRect = sec7.querySelector(".gig-rect");
        const gigSubWords = sec7.querySelectorAll(".gig-sub-word");
        const gigDescWords = sec7.querySelectorAll(".gig-desc-word");

        // 1. Left Column: Line 1 "DON'T PRETEND" Letters assemble
        if (gigLine1Letters.length > 0) {
          tl.fromTo(
            gigLine1Letters,
            {
              y: -50,
              opacity: 0,
              rotate: -12,
              scale: 0.8,
            },
            {
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.015,
            },
            4.88
          );
        }

        // 2. Left Column: Line 2 "YOU DIDN'T JUST SCROLL" Letters
        if (gigLine2Letters.length > 0) {
          const scatterX = [-50, 45, -40, 50, -45, 40, -35, 45, -40, 35, -45, 40, -35];
          const scatterY = [60, -55, 50, -60, 65, -50, 55, -45, 60, -50, 55, -45, 50];
          const scatterRot = [-18, 16, -14, 20, -16, 14, -18, 16, -14, 18, -16, 14, -16];

          tl.fromTo(
            gigLine2Letters,
            {
              x: (i) => scatterX[i % scatterX.length],
              y: (i) => scatterY[i % scatterY.length],
              rotate: (i) => scatterRot[i % scatterRot.length],
              scale: 0.7,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.010,
            },
            4.96
          );
        }

        // 3. Left Column: Line 3 "BACK & FORTH TO WATCH" Letters
        if (gigLine3Letters.length > 0) {
          tl.fromTo(
            gigLine3Letters,
            {
              y: -40,
              x: (i) => (i % 2 === 0 ? -20 : 25),
              rotate: (i) => (i % 2 === 0 ? -12 : 14),
              scale: 0.75,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.012,
            },
            5.04
          );
        }

        // 4. Left Column: Line 4 "THE LETTERS ASSEMBLE." Letters
        if (gigLine4Letters.length > 0) {
          tl.fromTo(
            gigLine4Letters,
            {
              y: 40,
              x: (i) => (i % 2 === 0 ? 20 : -20),
              rotate: (i) => (i % 2 === 0 ? 15 : -12),
              scale: 0.72,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power2.out",
              stagger: 0.012,
            },
            5.12
          );
        }

        // 5. Left Column: Subhead & Pitch Body Words under the headline
        if (gigSubWords.length > 0) {
          tl.fromTo(
            gigSubWords,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
              stagger: 0.004,
            },
            5.08
          );
        }

        if (gigDescWords.length > 0) {
          tl.fromTo(
            gigDescWords,
            {
              y: 18,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.26,
              ease: "power2.out",
              stagger: 0.003,
            },
            5.14
          );
        }

        // 6. Right Column: Pastel Gradient Rectangle reveals
        if (gigRect) {
          tl.fromTo(
            gigRect,
            {
              y: 60,
              x: -30,
              scale: 0.90,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.40,
              ease: "power2.out",
            },
            4.96
          );
        }

        // 7. Right Column: Editorial Photo Card reveals overlapping the rectangle
        if (gigCard) {
          tl.fromTo(
            gigCard,
            {
              y: 50,
              x: 30,
              scale: 0.92,
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.38,
              ease: "power2.out",
            },
            5.00
          );
        }

        if (gigImg) {
          tl.fromTo(
            gigImg,
            { scale: 1.02, opacity: 0.8 },
            { scale: 1, opacity: 1, duration: 0.38, ease: "power2.out" },
            5.04
          );
        }
      }

      if (tl) {
        scrollTriggerRef.current = (tl as any).scrollTrigger as ScrollTrigger;
      }
    };

      // ==========================================
      // INTRO OPENING SEQUENCE
      // 1) The plain white bg
      // 2) The nav links listed 1 by 1 dramatically
      // 3) The image comes in like it's being slid open
      // 4) The heading letters appear as it is being assembled
      // ==========================================
      const heroPortrait = sections[0]?.querySelector(".hero-portrait");
      const heroImg = sections[0]?.querySelector(".hero-img");
      const heroShape = sections[0]?.querySelector(".hero-shape");
      const heroBadge = sections[0]?.querySelector(".hero-badge");
      const vanityLetters = sections[0]?.querySelectorAll(".vanity-letter");
      const littleLetters = sections[0]?.querySelectorAll(".little-letter");

      const headerLogo = document.querySelector(".header-logo");
      const navItems = document.querySelectorAll(".nav-item");
      const headerActions = document.querySelector(".header-actions");
      const footerControls = document.querySelector(".footer-controls");

      // 1) Ensure plain white background initially
      gsap.set(
        [
          headerLogo,
          navItems,
          headerActions,
          vanityLetters,
          littleLetters,
          heroShape,
          heroBadge,
          footerControls,
        ],
        { opacity: 0 }
      );
      if (heroPortrait) {
        gsap.set(heroPortrait, {
          clipPath: "inset(0% 100% 0% 0%)",
          x: -35,
          opacity: 1,
        });
      }

      // Temporarily lock scroll during the opening sequence
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const introTl = gsap.timeline({
        onComplete: () => {
          introCompletedRef.current = true;
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          initScrollTrigger();
        },
      });
      introTimelineRef.current = introTl;

      // 1) Plain white background hold
      introTl.to({}, { duration: 0.35 });

      // 2) The nav links listed 1 by 1 dramatically
      if (headerLogo) {
        introTl.fromTo(
          headerLogo,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
        );
      }

      if (navItems.length > 0) {
        introTl.fromTo(
          navItems,
          {
            opacity: 0,
            y: -22,
            rotateX: -40,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.45,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }

      if (headerActions) {
        introTl.fromTo(
          headerActions,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
          "-=0.25"
        );
      }

      // 3) The image comes in like it's being slid open
      if (heroPortrait) {
        introTl.fromTo(
          heroPortrait,
          {
            clipPath: "inset(0% 100% 0% 0%)",
            x: -35,
            opacity: 1,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: "power3.inOut",
          },
          "+=0.05"
        );
      }

      if (heroImg) {
        introTl.fromTo(
          heroImg,
          { scale: 1.08 },
          { scale: 1, duration: 1.15, ease: "power2.out" },
          "<"
        );
      }

      // 4) The heading letters appear as it is being assembled
      if (vanityLetters && vanityLetters.length > 0) {
        introTl.fromTo(
          vanityLetters,
          {
            x: (i) => [-60, 50, -55, 45, -50, 40][i % 6],
            y: (i) => [55, -50, 60, -45, 50, -40][i % 6],
            rotate: (i) => [-16, 14, -18, 15, -12, 16][i % 6],
            scale: 0.65,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      if (littleLetters && littleLetters.length > 0) {
        introTl.fromTo(
          littleLetters,
          {
            y: -22,
            opacity: 0,
            scale: 0.8,
            rotate: (i) => (i % 2 === 0 ? -12 : 12),
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.5,
            stagger: 0.025,
            ease: "power2.out",
          },
          "<+=0.1"
        );
      }

      if (heroShape) {
        introTl.fromTo(
          heroShape,
          {
            scale: 0.5,
            opacity: 0,
            rotate: -10,
          },
          {
            scale: 1,
            opacity: 0.95,
            rotate: 0,
            duration: 0.75,
            ease: "power2.out",
          },
          "<"
        );
      }

      if (heroBadge) {
        introTl.fromTo(
          heroBadge,
          {
            scale: 0.3,
            opacity: 0,
            rotate: -20,
          },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.65,
            ease: "back.out(1.5)",
          },
          "<+=0.1"
        );
      }

      if (footerControls) {
        introTl.fromTo(
          footerControls,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  // Ensure scroll starts at top on refresh so intro sequence can play cleanly
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // Keyboard navigation handler in independent effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (introTimelineRef.current && !introCompletedRef.current) {
        introTimelineRef.current.progress(1);
      }
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="relative bg-white min-h-screen selection:bg-rose-200 selection:text-black">
      {/* Persistent Top Editorial Header */}
      <Header onNavigateSection={scrollToSection} activeSection={activeSection} />

      {/* Main Horizontal Scroll Container Pinned by GSAP */}
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        {/* Horizontal Track holding all 7 sections */}
        <div
          ref={trackRef}
          className="flex flex-row w-[700vw] h-full will-change-transform"
        >
          {/* Section * 01: The Little Vanity */}
          <MemoizedSectionHero onExplore={handleHeroExplore} />

          {/* Section * 02: Week in Fashion / Editorial */}
          <MemoizedSectionEditorial />

          {/* Section * 03: Unleash Your Sensuality */}
          <MemoizedSectionSensuality />

          {/* Section * 04: Form & Shadows / Atelier */}
          <MemoizedSectionManifesto />

          {/* Section * 05: Get Self Confident / Don't Hide Yourself */}
          <MemoizedSectionConfidence />

          {/* Section * 06: The Lookbook Season 2020 */}
          <MemoizedSectionLookbook />

          {/* Section * 07: You Saw The Scroll / The Gig */}
          <MemoizedSectionGig />
        </div>
      </div>

      {/* Persistent Bottom Editorial Navigation & Progress Bar */}
      <FooterControls
        activeSection={activeSection}
        totalSections={TOTAL_SECTIONS}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
