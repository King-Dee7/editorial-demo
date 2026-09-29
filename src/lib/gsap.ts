import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export * from "gsap";
export { ScrollTrigger };
export default gsap;
