import type { IAnimationPreset } from '../types.js';

export const ANIMATION_PRESETS: readonly IAnimationPreset[] = [
  // --- Page Transitions ---
  {
    name: 'fade-in',
    category: 'transition',
    css: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n.fade-in { animation: fadeIn 0.3s ease-out; }',
    tailwindClass: 'animate-in fade-in-0',
    duration: '0.3s',
  },
  {
    name: 'slide-up',
    category: 'transition',
    css: '@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n.slide-up { animation: slideUp 0.4s ease-out; }',
    tailwindClass: 'animate-in slide-in-from-bottom-2',
    duration: '0.4s',
  },
  {
    name: 'slide-in-right',
    category: 'transition',
    css: '@keyframes slideInRight { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }\n.slide-in-right { animation: slideInRight 0.3s ease-out; }',
    tailwindClass: 'animate-in slide-in-from-right-2',
    duration: '0.3s',
  },
  {
    name: 'scale-in',
    category: 'transition',
    css: '@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }\n.scale-in { animation: scaleIn 0.2s ease-out; }',
    tailwindClass: 'animate-in zoom-in-95',
    duration: '0.2s',
  },

  // --- Micro-Interactions ---
  {
    name: 'hover-lift',
    category: 'micro-interaction',
    css: '.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }\n.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgb(0 0 0 / 0.1); }',
    tailwindClass: 'transition-all hover:-translate-y-0.5 hover:shadow-md',
    duration: '0.2s',
  },
  {
    name: 'hover-glow',
    category: 'micro-interaction',
    css: '.hover-glow { transition: box-shadow 0.2s ease; }\n.hover-glow:hover { box-shadow: 0 0 20px rgba(var(--primary), 0.3); }',
    duration: '0.2s',
  },
  {
    name: 'press-scale',
    category: 'micro-interaction',
    css: '.press-scale { transition: transform 0.1s ease; }\n.press-scale:active { transform: scale(0.97); }',
    tailwindClass: 'active:scale-[0.97] transition-transform',
    duration: '0.1s',
  },
  {
    name: 'focus-ring',
    category: 'micro-interaction',
    css: '.focus-ring:focus-visible { outline: 2px solid hsl(var(--ring)); outline-offset: 2px; }',
    tailwindClass: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    duration: '0s',
  },

  // --- Loading States ---
  {
    name: 'skeleton-pulse',
    category: 'loading',
    css: '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\n.skeleton-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }',
    tailwindClass: 'animate-pulse',
    duration: '2s',
  },
  {
    name: 'spinner',
    category: 'loading',
    css: '@keyframes spin { to { transform: rotate(360deg); } }\n.spinner { animation: spin 1s linear infinite; }',
    tailwindClass: 'animate-spin',
    duration: '1s',
  },
  {
    name: 'bounce-dots',
    category: 'loading',
    css: '@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }\n.bounce-dots { animation: bounce 1.4s infinite ease-in-out both; }',
    tailwindClass: 'animate-bounce',
    duration: '1.4s',
  },

  // --- Scroll ---
  {
    name: 'scroll-fade-up',
    category: 'scroll',
    css: '.scroll-fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }\n.scroll-fade-up.visible { opacity: 1; transform: translateY(0); }',
    duration: '0.6s',
  },
] as const;

export function getAnimationsByCategory(category: IAnimationPreset['category']): IAnimationPreset[] {
  return ANIMATION_PRESETS.filter((a) => a.category === category);
}
