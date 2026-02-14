/**
 * Sanaa Glam — Review Data
 *
 * Contains the 5 client reviews used in the animated review reel.
 * Extracted into its own file so the data can be shared between
 * the Remotion video composition and the static cards on the page.
 */

export type Review = {
  id: number;
  name: string;
  occasion: string;
  rating: number;
  text: string;
};

// 5 client reviews for the animated reel
export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Sarah M.",
    occasion: "Bridal",
    rating: 5,
    text: "Sanaa made me feel absolutely beautiful on my wedding day. The makeup lasted through tears, dancing, and everything in between!",
  },
  {
    id: 2,
    name: "Lisa K.",
    occasion: "Birthday Party",
    rating: 5,
    text: "I felt like a celebrity! The soft glam look was exactly what I wanted. Professional, punctual, and incredibly talented.",
  },
  {
    id: 3,
    name: "Anna W.",
    occasion: "Photoshoot",
    rating: 5,
    text: "The editorial look was stunning in photos. Sanaa understood my vision immediately and brought it to life better than I imagined.",
  },
  {
    id: 4,
    name: "Marie B.",
    occasion: "Gala Event",
    rating: 5,
    text: "Everyone asked who did my makeup! The full glam look was flawless and lasted the entire evening. I'll definitely be coming back.",
  },
  {
    id: 5,
    name: "Julia F.",
    occasion: "Engagement Party",
    rating: 5,
    text: "Natural, radiant, and exactly what I envisioned. Sanaa has a real gift for enhancing your features without it feeling heavy.",
  },
];
