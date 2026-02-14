"use client";

/**
 * Sanaa Glam — Review Video Player
 *
 * Renders the Remotion animated review reel in the browser.
 * Supports two modes:
 * - "cinematic" (default): No controls, auto-plays, loops — for homepage embedding
 * - "full": With playback controls — for a standalone reviews section
 *
 * The <Player> component from @remotion/player acts like a <video> element
 * but renders React components frame-by-frame instead of a video file.
 */

import { useSyncExternalStore } from "react";
import { Player } from "@remotion/player";
import { ReviewComposition, getTotalDuration } from "./review-composition";
import { REVIEWS } from "./review-data";

const FPS = 30;
const TOTAL_FRAMES = getTotalDuration(REVIEWS.length);

type ReviewPlayerProps = {
  /** "cinematic" hides controls for a clean embed. "full" shows controls. */
  mode?: "cinematic" | "full";
};

export function ReviewPlayer({ mode = "cinematic" }: ReviewPlayerProps) {
  // Client-only render signal without setState inside an effect.
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  // Loading placeholder while waiting for hydration
  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl bg-plum"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-peach/30 border-t-peach" />
          <p className="mt-3 font-serif text-sm text-peach-light/60">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl">
      <Player
        component={ReviewComposition}
        inputProps={{ reviews: REVIEWS }}
        durationInFrames={TOTAL_FRAMES}
        compositionWidth={1280}
        compositionHeight={720}
        fps={FPS}
        autoPlay
        loop
        controls={mode === "full"}
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
        }}
      />
    </div>
  );
}
