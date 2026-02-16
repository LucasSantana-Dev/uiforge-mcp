import type { IComponentSnippet } from '../types.js';

export const badgeSnippets: IComponentSnippet[] = [
  {
    id: 'badge-default',
    name: 'Default Badge',
    category: 'atom',
    type: 'badge',
    variant: 'default',
    tags: ['label', 'tag', 'status', 'indicator'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas', 'devtools'],
    visualStyles: ['soft-depth', 'linear-modern', 'corporate-trust'],
    jsx: `<span className="inline-flex items-center rounded-md bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">Badge</span>`,
    tailwindClasses: {
      badge: 'inline-flex items-center rounded-md bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground',
    },
    a11y: { roles: ['status'], ariaAttributes: [], keyboardNav: 'N/A — decorative', contrastRatio: '4.5:1', focusVisible: false, reducedMotion: true },
    seo: { semanticElement: 'span' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['rounded-md not rounded-full for modern look', 'px-2.5 py-0.5 for compact proportions'],
      inspirationSource: 'shadcn/ui Badge',
      craftDetails: ['8pt grid aligned', 'text-xs for hierarchy subordination'],
    },
  },
  {
    id: 'badge-outline',
    name: 'Outline Badge',
    category: 'atom',
    type: 'badge',
    variant: 'outline',
    tags: ['label', 'tag', 'subtle', 'indicator'],
    mood: ['minimal', 'calm', 'professional'],
    industry: ['general', 'saas'],
    visualStyles: ['minimal-editorial', 'linear-modern', 'soft-depth'],
    jsx: `<span className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-medium text-foreground">Outline</span>`,
    tailwindClasses: {
      badge: 'inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-medium text-foreground',
    },
    a11y: { roles: ['status'], ariaAttributes: [], keyboardNav: 'N/A — decorative', contrastRatio: '4.5:1', focusVisible: false, reducedMotion: true },
    seo: { semanticElement: 'span' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['border-border uses theme token', 'no background for reduced visual weight'],
      inspirationSource: 'shadcn/ui Badge outline',
      craftDetails: ['same dimensions as default for consistency'],
    },
  },
  {
    id: 'badge-success',
    name: 'Success Badge',
    category: 'atom',
    type: 'badge',
    variant: 'success',
    tags: ['status', 'active', 'online', 'complete', 'positive'],
    mood: ['professional'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['soft-depth', 'corporate-trust', 'linear-modern'],
    jsx: `<span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
  Active
</span>`,
    tailwindClasses: {
      badge: 'inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
      dot: 'h-1.5 w-1.5 rounded-full bg-emerald-500',
    },
    a11y: { roles: ['status'], ariaAttributes: ['aria-hidden on dot'], keyboardNav: 'N/A — decorative', contrastRatio: '4.5:1', focusVisible: false, reducedMotion: true },
    seo: { semanticElement: 'span' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['dot indicator — not color-only', 'ring-inset for subtle border', 'dark mode variants included', 'emerald-700/50 not just "green"'],
      inspirationSource: 'Tailwind UI status badges',
      craftDetails: ['ring-1 ring-inset for inset border effect', 'gap-1.5 for dot spacing', 'dark: variants for theme support'],
    },
  },
  {
    id: 'badge-warning',
    name: 'Warning Badge',
    category: 'atom',
    type: 'badge',
    variant: 'warning',
    tags: ['status', 'pending', 'caution', 'alert'],
    mood: ['professional'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['soft-depth', 'corporate-trust'],
    jsx: `<span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
  Pending
</span>`,
    tailwindClasses: {
      badge: 'inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
      dot: 'h-1.5 w-1.5 rounded-full bg-amber-500',
    },
    a11y: { roles: ['status'], ariaAttributes: ['aria-hidden on dot'], keyboardNav: 'N/A — decorative', contrastRatio: '4.5:1', focusVisible: false, reducedMotion: true },
    seo: { semanticElement: 'span' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['dot + text — not color-only', 'amber tones for clear warning hierarchy'],
      inspirationSource: 'Tailwind UI status badges',
      craftDetails: ['consistent with success badge structure', 'ring-inset border'],
    },
  },
  {
    id: 'badge-error',
    name: 'Error Badge',
    category: 'atom',
    type: 'badge',
    variant: 'error',
    tags: ['status', 'error', 'failed', 'danger', 'negative'],
    mood: ['professional'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['soft-depth', 'corporate-trust'],
    jsx: `<span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
  <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
  Failed
</span>`,
    tailwindClasses: {
      badge: 'inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
      dot: 'h-1.5 w-1.5 rounded-full bg-red-500',
    },
    a11y: { roles: ['status'], ariaAttributes: ['aria-hidden on dot'], keyboardNav: 'N/A — decorative', contrastRatio: '4.5:1', focusVisible: false, reducedMotion: true },
    seo: { semanticElement: 'span' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['dot indicator — not color-only', 'consistent with success/warning family'],
      inspirationSource: 'Tailwind UI status badges',
      craftDetails: ['red-700 not destructive — these are informational not actionable', 'ring-inset border'],
    },
  },
  {
    id: 'badge-pill',
    name: 'Pill Badge',
    category: 'atom',
    type: 'badge',
    variant: 'pill',
    tags: ['tag', 'category', 'filter', 'chip'],
    mood: ['playful', 'creative', 'warm'],
    industry: ['ecommerce', 'media', 'agency'],
    visualStyles: ['retro-playful', 'gradient-mesh'],
    jsx: `<span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Category</span>`,
    tailwindClasses: {
      badge: 'inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary',
    },
    a11y: { roles: ['status'], ariaAttributes: [], keyboardNav: 'N/A — decorative', contrastRatio: '4.5:1', focusVisible: false, reducedMotion: true },
    seo: { semanticElement: 'span' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['rounded-full for pill shape', 'bg-primary/10 for subtle tinted background', 'font-semibold for tag emphasis'],
      inspirationSource: 'Vercel dashboard tags',
      craftDetails: ['primary/10 opacity for accessible tinted bg', 'px-3 py-1 for pill proportions'],
    },
  },
];
