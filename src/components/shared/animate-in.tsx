"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * AnimateIn — A reusable scroll-triggered animation wrapper.
 * 
 * HOW IT WORKS:
 * 1. The component wraps its children in a <div> with the CSS class "reveal"
 * 2. The "reveal" class starts the element as invisible (opacity: 0) and shifted down
 * 3. An IntersectionObserver watches when the element enters the viewport
 * 4. When visible, it adds the "reveal-visible" class, triggering a smooth CSS transition
 * 5. The "once" behavior ensures the animation only plays the first time (no re-hiding)
 * 
 * PROPS:
 * - children: The content to animate
 * - className: Additional CSS classes to add to the wrapper
 * - delay: Stagger delay in ms (e.g. 100, 200, 300 for cascading effects)
 * - threshold: How much of the element needs to be visible before triggering (0 to 1)
 * 
 * USAGE:
 *   <AnimateIn>
 *     <h2>This fades in when scrolled into view</h2>
 *   </AnimateIn>
 * 
 *   <AnimateIn delay={200}>
 *     <Card>This appears 200ms after the previous element</Card>
 *   </AnimateIn>
 */
type AnimateInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
}: AnimateInProps) {
  // Reference to the DOM element we're observing
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create an IntersectionObserver that watches when our element
    // scrolls into view. "threshold" controls how much needs to be visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is visible in the viewport...
        if (entry.isIntersecting) {
          // Add the class that triggers the CSS transition
          element.classList.add("reveal-visible");
          // Stop observing — we only want to animate in once
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    // Cleanup: stop observing when component unmounts
    return () => observer.unobserve(element);
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
