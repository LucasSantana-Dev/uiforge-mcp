import type { IFontPairing } from '../types.js';

function googleFontsUrl(family: string, weights: number[]): string {
  const encoded = family.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weights.join(';')}&display=swap`;
}

function cssImport(heading: { family: string; weights: number[] }, body: { family: string; weights: number[] }): string {
  const families = [heading, body]
    .filter((f, i, arr) => arr.findIndex((a) => a.family === f.family) === i)
    .map((f) => `family=${f.family.replace(/ /g, '+')}:wght@${f.weights.join(';')}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

// --- Modern / Tech / SaaS ---

const interInter: IFontPairing = {
  name: 'inter-inter',
  heading: { family: 'Inter', weights: [600, 700, 800], googleFontsUrl: googleFontsUrl('Inter', [600, 700, 800]) },
  body: { family: 'Inter', weights: [400, 500], googleFontsUrl: googleFontsUrl('Inter', [400, 500]) },
  mood: ['clean', 'neutral', 'professional'],
  bestFor: ['dashboards', 'SaaS', 'dev tools', 'admin panels'],
  cssImport: cssImport({ family: 'Inter', weights: [400, 500, 600, 700, 800] }, { family: 'Inter', weights: [400, 500] }),
};

const manropeInter: IFontPairing = {
  name: 'manrope-inter',
  heading: { family: 'Manrope', weights: [600, 700, 800], googleFontsUrl: googleFontsUrl('Manrope', [600, 700, 800]) },
  body: { family: 'Inter', weights: [400, 500], googleFontsUrl: googleFontsUrl('Inter', [400, 500]) },
  mood: ['geometric', 'modern', 'trustworthy'],
  bestFor: ['tech startups', 'corporate', 'fintech'],
  cssImport: cssImport({ family: 'Manrope', weights: [600, 700, 800] }, { family: 'Inter', weights: [400, 500] }),
};

const dmSansNunito: IFontPairing = {
  name: 'dmsans-nunito',
  heading: { family: 'DM Sans', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('DM Sans', [500, 600, 700]) },
  body: { family: 'Nunito', weights: [400, 500, 600], googleFontsUrl: googleFontsUrl('Nunito', [400, 500, 600]) },
  mood: ['elegant', 'friendly', 'warm'],
  bestFor: ['education', 'health', 'community platforms'],
  cssImport: cssImport({ family: 'DM Sans', weights: [500, 600, 700] }, { family: 'Nunito', weights: [400, 500, 600] }),
};

const soraHeebo: IFontPairing = {
  name: 'sora-heebo',
  heading: { family: 'Sora', weights: [600, 700, 800], googleFontsUrl: googleFontsUrl('Sora', [600, 700, 800]) },
  body: { family: 'Heebo', weights: [400, 500], googleFontsUrl: googleFontsUrl('Heebo', [400, 500]) },
  mood: ['dynamic', 'bold', 'innovative'],
  bestFor: ['fintech', 'innovative platforms', 'AI products'],
  cssImport: cssImport({ family: 'Sora', weights: [600, 700, 800] }, { family: 'Heebo', weights: [400, 500] }),
};

const outfitZillaSlab: IFontPairing = {
  name: 'outfit-zillaslab',
  heading: { family: 'Outfit', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Outfit', [500, 600, 700]) },
  body: { family: 'Zilla Slab', weights: [400, 500], googleFontsUrl: googleFontsUrl('Zilla Slab', [400, 500]) },
  mood: ['geometric', 'contrast', 'distinctive'],
  bestFor: ['creative agencies', 'portfolios', 'design studios'],
  cssImport: cssImport({ family: 'Outfit', weights: [500, 600, 700] }, { family: 'Zilla Slab', weights: [400, 500] }),
};

// --- Elegant / Editorial / Luxury ---

const playfairAlbertSans: IFontPairing = {
  name: 'playfair-albertsans',
  heading: { family: 'Playfair Display', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Playfair Display', [500, 600, 700]) },
  body: { family: 'Albert Sans', weights: [400, 500], googleFontsUrl: googleFontsUrl('Albert Sans', [400, 500]) },
  mood: ['classic', 'elegant', 'editorial'],
  bestFor: ['luxury brands', 'editorial', 'magazines'],
  cssImport: cssImport({ family: 'Playfair Display', weights: [500, 600, 700] }, { family: 'Albert Sans', weights: [400, 500] }),
};

const frauncesPoppins: IFontPairing = {
  name: 'fraunces-poppins',
  heading: { family: 'Fraunces', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Fraunces', [500, 600, 700]) },
  body: { family: 'Poppins', weights: [400, 500], googleFontsUrl: googleFontsUrl('Poppins', [400, 500]) },
  mood: ['playful', 'trustworthy', 'warm'],
  bestFor: ['friendly brands', 'blogs', 'lifestyle'],
  cssImport: cssImport({ family: 'Fraunces', weights: [500, 600, 700] }, { family: 'Poppins', weights: [400, 500] }),
};

const bodoniRaleway: IFontPairing = {
  name: 'bodoni-raleway',
  heading: { family: 'Bodoni Moda', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Bodoni Moda', [500, 600, 700]) },
  body: { family: 'Raleway', weights: [400, 500], googleFontsUrl: googleFontsUrl('Raleway', [400, 500]) },
  mood: ['sophisticated', 'high-end', 'fashion'],
  bestFor: ['fashion', 'magazines', 'luxury e-commerce'],
  cssImport: cssImport({ family: 'Bodoni Moda', weights: [500, 600, 700] }, { family: 'Raleway', weights: [400, 500] }),
};

const prataManrope: IFontPairing = {
  name: 'prata-manrope',
  heading: { family: 'Prata', weights: [400], googleFontsUrl: googleFontsUrl('Prata', [400]) },
  body: { family: 'Manrope', weights: [400, 500], googleFontsUrl: googleFontsUrl('Manrope', [400, 500]) },
  mood: ['elegant', 'friendly', 'premium'],
  bestFor: ['premium services', 'hospitality', 'real estate'],
  cssImport: cssImport({ family: 'Prata', weights: [400] }, { family: 'Manrope', weights: [400, 500] }),
};

const piazzollaRedHat: IFontPairing = {
  name: 'piazzolla-redhat',
  heading: { family: 'Piazzolla', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Piazzolla', [500, 600, 700]) },
  body: { family: 'Red Hat Text', weights: [400, 500], googleFontsUrl: googleFontsUrl('Red Hat Text', [400, 500]) },
  mood: ['distinctive', 'personality', 'editorial'],
  bestFor: ['blogs', 'editorial content', 'cultural sites'],
  cssImport: cssImport({ family: 'Piazzolla', weights: [500, 600, 700] }, { family: 'Red Hat Text', weights: [400, 500] }),
};

// --- Friendly / Approachable / Startup ---

const montserratSourceSans: IFontPairing = {
  name: 'montserrat-sourcesans',
  heading: { family: 'Montserrat', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Montserrat', [500, 600, 700]) },
  body: { family: 'Source Sans 3', weights: [400, 500], googleFontsUrl: googleFontsUrl('Source Sans 3', [400, 500]) },
  mood: ['timeless', 'modern', 'versatile'],
  bestFor: ['general purpose', 'marketing', 'landing pages'],
  cssImport: cssImport({ family: 'Montserrat', weights: [500, 600, 700] }, { family: 'Source Sans 3', weights: [400, 500] }),
};

const lexendPublicSans: IFontPairing = {
  name: 'lexend-publicsans',
  heading: { family: 'Lexend', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Lexend', [500, 600, 700]) },
  body: { family: 'Public Sans', weights: [400, 500], googleFontsUrl: googleFontsUrl('Public Sans', [400, 500]) },
  mood: ['accessible', 'neutral', 'government'],
  bestFor: ['accessibility-focused', 'content-heavy', 'government'],
  cssImport: cssImport({ family: 'Lexend', weights: [500, 600, 700] }, { family: 'Public Sans', weights: [400, 500] }),
};

const albertSansBarlow: IFontPairing = {
  name: 'albertsans-barlow',
  heading: { family: 'Albert Sans', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Albert Sans', [500, 600, 700]) },
  body: { family: 'Barlow', weights: [400, 500], googleFontsUrl: googleFontsUrl('Barlow', [400, 500]) },
  mood: ['informal', 'geometric', 'startup'],
  bestFor: ['startups', 'landing pages', 'product sites'],
  cssImport: cssImport({ family: 'Albert Sans', weights: [500, 600, 700] }, { family: 'Barlow', weights: [400, 500] }),
};

const epilogueMulish: IFontPairing = {
  name: 'epilogue-mulish',
  heading: { family: 'Epilogue', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Epilogue', [500, 600, 700]) },
  body: { family: 'Mulish', weights: [400, 500], googleFontsUrl: googleFontsUrl('Mulish', [400, 500]) },
  mood: ['minimalist', 'clean', 'contemporary'],
  bestFor: ['fashion', 'tech', 'minimalist sites'],
  cssImport: cssImport({ family: 'Epilogue', weights: [500, 600, 700] }, { family: 'Mulish', weights: [400, 500] }),
};

const bebasNeueHeebo: IFontPairing = {
  name: 'bebasneue-heebo',
  heading: { family: 'Bebas Neue', weights: [400], googleFontsUrl: googleFontsUrl('Bebas Neue', [400]) },
  body: { family: 'Heebo', weights: [400, 500], googleFontsUrl: googleFontsUrl('Heebo', [400, 500]) },
  mood: ['bold', 'contemporary', 'impactful'],
  bestFor: ['bold headlines', 'marketing', 'events'],
  cssImport: cssImport({ family: 'Bebas Neue', weights: [400] }, { family: 'Heebo', weights: [400, 500] }),
};

// --- Accessible / High-Legibility ---

const jostAtkinson: IFontPairing = {
  name: 'jost-atkinson',
  heading: { family: 'Jost', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Jost', [500, 600, 700]) },
  body: { family: 'Atkinson Hyperlegible', weights: [400, 700], googleFontsUrl: googleFontsUrl('Atkinson Hyperlegible', [400, 700]) },
  mood: ['classic', 'clear', 'accessible'],
  bestFor: ['news', 'accessibility-first', 'government'],
  cssImport: cssImport({ family: 'Jost', weights: [500, 600, 700] }, { family: 'Atkinson Hyperlegible', weights: [400, 700] }),
};

const lexendAtkinson: IFontPairing = {
  name: 'lexend-atkinson',
  heading: { family: 'Lexend', weights: [500, 600, 700], googleFontsUrl: googleFontsUrl('Lexend', [500, 600, 700]) },
  body: { family: 'Atkinson Hyperlegible', weights: [400, 700], googleFontsUrl: googleFontsUrl('Atkinson Hyperlegible', [400, 700]) },
  mood: ['maximum-readability', 'inclusive', 'clear'],
  bestFor: ['government', 'education', 'healthcare'],
  cssImport: cssImport({ family: 'Lexend', weights: [500, 600, 700] }, { family: 'Atkinson Hyperlegible', weights: [400, 700] }),
};

export const FONT_PAIRINGS: readonly IFontPairing[] = [
  interInter,
  manropeInter,
  dmSansNunito,
  soraHeebo,
  outfitZillaSlab,
  playfairAlbertSans,
  frauncesPoppins,
  bodoniRaleway,
  prataManrope,
  piazzollaRedHat,
  montserratSourceSans,
  lexendPublicSans,
  albertSansBarlow,
  epilogueMulish,
  bebasNeueHeebo,
  jostAtkinson,
  lexendAtkinson,
] as const;

export const DEFAULT_FONT_PAIRING = 'manrope-inter';

export function getFontPairing(name: string): IFontPairing | undefined {
  return FONT_PAIRINGS.find((p) => p.name === name);
}

export function getFontPairingsByMood(mood: string): IFontPairing[] {
  return FONT_PAIRINGS.filter((p) => p.mood.some((m) => m.includes(mood.toLowerCase())));
}

export const TYPE_SCALE: Record<string, string> = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
};
