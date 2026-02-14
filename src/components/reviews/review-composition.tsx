/**
 * Sanaa Glam — Remotion Review Composition (Enhanced)
 *
 * A highly animated "video" built entirely with React + Remotion.
 * Each review slide features:
 *   - Rotating gradient background with animated angle
 *   - Floating sparkle particles that drift and fade
 *   - Stars that spin in, overshoot, and settle with spring physics
 *   - Quote text revealed word-by-word (typewriter style)
 *   - Reviewer info that slides up with elastic bounce
 *   - Animated progress dots showing which review is active
 *   - Decorative quote marks that scale and breathe
 *   - Smooth exit: everything scales down + fades out
 *
 * Key Remotion APIs used:
 * - useCurrentFrame() — current frame number (starts at 0)
 * - interpolate() — maps frame ranges to value ranges
 * - spring() — physics-based bouncy animation
 * - random() — deterministic random (same seed = same result every render)
 * - TransitionSeries — sequences slides with transitions between them
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { Review } from "./review-data";

// ---- Timing Configuration ----
const FRAMES_PER_REVIEW = 180; // 6 seconds per review (more time for animations)
const TRANSITION_FRAMES = 30;  // 1 second fade between slides

// ---- Brand Colors ----
const COLORS = {
  plumDark: "#2D1F2D",
  plum: "#3D2B3A",
  plumLight: "#5C3D5C",
  peach: "#DBA88C",
  peachLight: "#E8C5B0",
  cream: "#FAF5F2",
};

/**
 * Total video duration: (n × framesPerReview) - ((n-1) × transitionFrames)
 */
export function getTotalDuration(reviewCount: number): number {
  return reviewCount * FRAMES_PER_REVIEW - (reviewCount - 1) * TRANSITION_FRAMES;
}

// ---- Main Composition ----
type ReviewCompositionProps = { reviews: Review[] };

export const ReviewComposition: React.FC<ReviewCompositionProps> = ({ reviews }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.plumDark }}>
      <TransitionSeries>
        {reviews.map((review, index) => (
          <React.Fragment key={review.id}>
            {index > 0 && (
              <TransitionSeries.Transition
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                presentation={fade()}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={FRAMES_PER_REVIEW}>
              <ReviewSlide
                review={review}
                index={index}
                totalReviews={reviews.length}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ---- Sparkle Particle ----
// A single floating sparkle dot that drifts upward and fades

type SparkleProps = {
  seed: string;   // Deterministic random seed (Remotion requirement: no Math.random)
  delay: number;  // Frame delay before this sparkle appears
};

const Sparkle: React.FC<SparkleProps> = ({ seed, delay }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - delay;

  // Only visible after delay
  if (adjustedFrame < 0) return null;

  // Each sparkle gets random position/speed based on its seed
  const startX = random(`${seed}-x`) * 100;          // % from left
  const startY = 80 + random(`${seed}-y`) * 20;      // Start near bottom
  const speed = 0.15 + random(`${seed}-speed`) * 0.3; // Drift speed
  const size = 2 + random(`${seed}-size`) * 4;        // Dot size in px

  // Drift upward over time
  const y = startY - adjustedFrame * speed;
  // Horizontal wobble using sine wave
  const wobble = Math.sin(adjustedFrame * 0.05 + random(`${seed}-phase`) * 10) * 15;
  // Fade in, hold, then fade out
  const opacity = interpolate(adjustedFrame, [0, 15, 80, 100], [0, 0.8, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `${startX + wobble * 0.3}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLORS.peach,
        opacity,
        boxShadow: `0 0 ${size * 2}px ${COLORS.peach}60`,
      }}
    />
  );
};

// ---- Review Slide ----

type ReviewSlideProps = {
  review: Review;
  index: number;
  totalReviews: number;
};

const ReviewSlide: React.FC<ReviewSlideProps> = ({ review, index, totalReviews }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Rotating Gradient Background ----
  // The gradient angle slowly rotates for a living, breathing feel
  const gradientAngle = interpolate(frame, [0, FRAMES_PER_REVIEW], [120 + index * 30, 200 + index * 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- Entry: overall slide scales in from 95% to 100% ----
  const entryScale = interpolate(frame, [0, 25], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- Exit: everything scales down + fades out in last 25 frames ----
  const exitProgress = interpolate(frame, [FRAMES_PER_REVIEW - 25, FRAMES_PER_REVIEW], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = 1 - exitProgress * 0.08;
  const exitOpacity = 1 - exitProgress;

  // ---- Quote marks: scale in with spring, then gently breathe ----
  const quoteSpring = spring({
    fps,
    frame: frame - 8,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });
  const quoteBreathe = interpolate(frame, [0, 90, 180], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- Stars: spin in with rotation + spring scale ----
  const stars = [...Array(review.rating)].map((_, i) => {
    const starSpring = spring({
      fps,
      frame: frame - (5 + i * 6),
      config: { damping: 8, stiffness: 180, mass: 0.4 },
    });
    // Each star rotates 360° as it pops in
    const starRotation = interpolate(
      spring({ fps, frame: frame - (5 + i * 6), config: { damping: 15, stiffness: 120 } }),
      [0, 1],
      [180, 360],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { scale: starSpring, rotation: starRotation };
  });

  // ---- Word-by-word text reveal ----
  // Split the quote into words and reveal them one at a time
  const words = review.text.split(" ");
  const WORDS_START_FRAME = 20;  // When the first word appears
  const FRAMES_PER_WORD = 2;     // How fast words appear (lower = faster)

  // ---- Reviewer info: elastic slide-up ----
  const infoSpring = spring({
    fps,
    frame: frame - (WORDS_START_FRAME + words.length * FRAMES_PER_WORD + 5),
    config: { damping: 10, stiffness: 120, mass: 0.6 },
  });

  // ---- Decorative background circles ----
  const circle1X = interpolate(frame, [0, FRAMES_PER_REVIEW], [-5, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const circle2Y = interpolate(frame, [0, FRAMES_PER_REVIEW], [5, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${COLORS.plumDark} 0%, ${COLORS.plum} 45%, ${COLORS.plumLight} 100%)`,
        opacity: exitOpacity,
        transform: `scale(${entryScale * exitScale})`,
      }}
    >
      {/* ---- Floating Sparkle Particles ---- */}
      {/* 12 sparkles with staggered delays create a magical floating effect */}
      {[...Array(12)].map((_, i) => (
        <Sparkle key={i} seed={`s${index}-${i}`} delay={i * 8} />
      ))}

      {/* ---- Decorative Gradient Circles ---- */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.peach}12 0%, transparent 70%)`,
          transform: `translate(${circle1X}%, ${-circle1X}%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-8%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.plumLight}18 0%, transparent 70%)`,
          transform: `translate(${-circle2Y}%, ${circle2Y}%)`,
        }}
      />

      {/* ---- Main Content ---- */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 750,
            textAlign: "center",
          }}
        >
          {/* ---- Spinning Stars ---- */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {stars.map((star, i) => (
              <svg
                key={i}
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill={COLORS.peach}
                style={{
                  transform: `scale(${star.scale}) rotate(${star.rotation}deg)`,
                  filter: `drop-shadow(0 0 4px ${COLORS.peach}80)`,
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* ---- Breathing Quote Mark ---- */}
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 72,
              color: `${COLORS.peach}40`,
              lineHeight: 1,
              marginBottom: -8,
              transform: `scale(${quoteSpring * quoteBreathe})`,
            }}
          >
            {"\u201C"}
          </div>

          {/* ---- Word-by-Word Quote Reveal ---- */}
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 24,
              lineHeight: 1.7,
              color: COLORS.peachLight,
              fontStyle: "italic",
              margin: "0 10px",
              minHeight: 120,
            }}
          >
            {words.map((word, i) => {
              // Each word fades + slides in at its scheduled frame
              const wordFrame = WORDS_START_FRAME + i * FRAMES_PER_WORD;
              const wordOpacity = interpolate(frame, [wordFrame, wordFrame + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const wordY = interpolate(frame, [wordFrame, wordFrame + 8], [8, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <span
                  key={i}
                  style={{
                    opacity: wordOpacity,
                    display: "inline-block",
                    transform: `translateY(${wordY}px)`,
                    marginRight: 6,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* ---- Animated Separator Line ---- */}
          {/* Grows from center outward */}
          <div
            style={{
              width: interpolate(frame, [30, 60], [0, 80], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              height: 2,
              borderRadius: 1,
              background: `linear-gradient(90deg, transparent, ${COLORS.peach}60, transparent)`,
              marginTop: 24,
              marginBottom: 24,
            }}
          />

          {/* ---- Reviewer Info (Elastic Bounce In) ---- */}
          <div
            style={{
              opacity: infoSpring,
              transform: `translateY(${(1 - infoSpring) * 40}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Glowing avatar circle */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.peach}30, ${COLORS.peach}10)`,
                border: `2px solid ${COLORS.peach}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.peach,
                marginBottom: 6,
                boxShadow: `0 0 20px ${COLORS.peach}15`,
              }}
            >
              {review.name.charAt(0)}
            </div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.peachLight,
                margin: 0,
                letterSpacing: 0.5,
              }}
            >
              {review.name}
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: `${COLORS.peachLight}80`,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {review.occasion}
            </p>
          </div>
        </div>
      </AbsoluteFill>

      {/* ---- Progress Dots (bottom) ---- */}
      {/* Shows which review is currently active */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {[...Array(totalReviews)].map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i === index ? COLORS.peach : `${COLORS.peach}30`,
              transition: "all 0.3s",
              boxShadow: i === index ? `0 0 8px ${COLORS.peach}40` : "none",
            }}
          />
        ))}
      </div>

      {/* ---- Branding Watermark ---- */}
      <div
        style={{
          position: "absolute",
          top: 20,
          width: "100%",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: 12,
          color: `${COLORS.peach}30`,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Sanaa Glam
      </div>
    </AbsoluteFill>
  );
};
