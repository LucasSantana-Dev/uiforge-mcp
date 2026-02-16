import type { IComponentSnippet } from '../types.js';

export const inputSnippets: IComponentSnippet[] = [
  {
    id: 'input-default',
    name: 'Default Input',
    category: 'atom',
    type: 'input',
    variant: 'default',
    tags: ['form', 'text', 'field', 'interactive'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['soft-depth', 'corporate-trust', 'linear-modern'],
    jsx: `<div className="space-y-2">
  <label htmlFor="input-default" className="text-sm font-medium text-foreground">Label</label>
  <input
    id="input-default"
    type="text"
    placeholder="Enter text..."
    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    aria-required="false"
  />
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-2',
      label: 'text-sm font-medium text-foreground',
      input: 'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    },
    a11y: {
      roles: ['textbox'],
      ariaAttributes: ['aria-required', 'aria-invalid', 'aria-describedby'],
      keyboardNav: 'Tab to focus, type to input',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'input' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'md'] },
    quality: {
      antiGeneric: ['visible label (not placeholder-only)', 'h-10 consistent height', 'ring-offset for layered focus'],
      inspirationSource: 'shadcn/ui Input',
      craftDetails: ['label always visible', 'placeholder as hint not label', 'transition-colors for smooth state change'],
    },
  },
  {
    id: 'input-with-icon',
    name: 'Input with Icon',
    category: 'atom',
    type: 'input',
    variant: 'with-icon',
    tags: ['form', 'search', 'icon', 'interactive'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas', 'devtools'],
    visualStyles: ['soft-depth', 'linear-modern', 'corporate-trust'],
    jsx: `<div className="space-y-2">
  <label htmlFor="input-icon" className="text-sm font-medium text-foreground">Search</label>
  <div className="relative">
    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
    <input
      id="input-icon"
      type="search"
      placeholder="Search..."
      className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-2',
      label: 'text-sm font-medium text-foreground',
      inputWrapper: 'relative',
      icon: 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
      input: 'flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    },
    a11y: {
      roles: ['searchbox'],
      ariaAttributes: ['aria-label'],
      htmlAttributes: ['autoComplete'],
      keyboardNav: 'Tab to focus, Escape to clear',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'input' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'md'] },
    quality: {
      antiGeneric: ['icon vertically centered with translate-y-1/2', 'pl-10 accounts for icon width + padding', 'aria-hidden on decorative icon'],
      inspirationSource: 'Linear search input',
      craftDetails: ['absolute positioning for icon', 'type=search for native clear button on mobile'],
    },
  },
  {
    id: 'input-floating-label',
    name: 'Floating Label Input',
    category: 'atom',
    type: 'input',
    variant: 'floating-label',
    tags: ['form', 'text', 'material', 'animated', 'interactive'],
    mood: ['premium', 'professional'],
    industry: ['saas', 'fintech', 'ecommerce'],
    visualStyles: ['soft-depth', 'corporate-trust'],
    jsx: `<div className="relative">
  <input
    id="input-floating"
    type="text"
    placeholder=" "
    className="peer flex h-12 w-full rounded-lg border border-input bg-background px-3 pt-5 pb-1 text-sm text-foreground ring-offset-background transition-colors placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    aria-required="false"
  />
  <label
    htmlFor="input-floating"
    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
  >
    Email address
  </label>
</div>`,
    tailwindClasses: {
      wrapper: 'relative',
      input: 'peer flex h-12 w-full rounded-lg border border-input bg-background px-3 pt-5 pb-1 text-sm text-foreground ring-offset-background transition-colors placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      label: 'absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs',
    },
    a11y: {
      roles: ['textbox'],
      ariaAttributes: ['aria-required', 'aria-invalid'],
      keyboardNav: 'Tab to focus, type to input',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'input' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'md'] },
    quality: {
      antiGeneric: ['CSS-only floating label using peer modifier', 'placeholder=" " trick for :not(:placeholder-shown)', 'label turns primary on focus'],
      inspirationSource: 'Material Design floating label',
      craftDetails: ['no JavaScript required', 'peer modifier for CSS-only state detection', 'smooth 200ms transition'],
    },
  },
  {
    id: 'input-textarea',
    name: 'Textarea',
    category: 'atom',
    type: 'textarea',
    variant: 'default',
    tags: ['form', 'multiline', 'text', 'interactive'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'corporate-trust', 'linear-modern'],
    jsx: `<div className="space-y-2">
  <label htmlFor="textarea-default" className="text-sm font-medium text-foreground">Message</label>
  <textarea
    id="textarea-default"
    placeholder="Type your message..."
    rows={4}
    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
    aria-required="false"
  />
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-2',
      label: 'text-sm font-medium text-foreground',
      textarea: 'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
    },
    a11y: {
      roles: ['textbox'],
      ariaAttributes: ['aria-required', 'aria-invalid', 'aria-describedby'],
      keyboardNav: 'Tab to focus, type to input',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'textarea' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'md'] },
    quality: {
      antiGeneric: ['min-h-[80px] prevents collapsed textarea', 'resize-y allows vertical but not horizontal resize'],
      inspirationSource: 'shadcn/ui Textarea',
      craftDetails: ['consistent styling with input component', 'vertical resize only'],
    },
  },
  {
    id: 'input-password',
    name: 'Password Input with Toggle',
    category: 'atom',
    type: 'input',
    variant: 'password-toggle',
    tags: ['form', 'password', 'auth', 'security', 'interactive'],
    mood: ['professional'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['soft-depth', 'corporate-trust'],
    jsx: `<div className="space-y-2">
  <label htmlFor="input-password" className="text-sm font-medium text-foreground">Password</label>
  <div className="relative">
    <input
      id="input-password"
      type="password"
      placeholder="Enter password"
      autoComplete="current-password"
      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      aria-required="true"
    />
    <button
      type="button"
      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Toggle password visibility"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
    </button>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-2',
      label: 'text-sm font-medium text-foreground',
      inputWrapper: 'relative',
      input: 'flex h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      toggle: 'absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      icon: 'h-4 w-4',
    },
    a11y: {
      roles: ['textbox'],
      ariaAttributes: ['aria-required', 'aria-label'],
      keyboardNav: 'Tab to focus input, Tab to toggle button',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'input' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'md'] },
    quality: {
      antiGeneric: ['toggle button has its own focus ring', 'autoComplete for browser autofill', 'aria-label on toggle for screen readers'],
      inspirationSource: 'shadcn/ui password input pattern',
      craftDetails: ['pr-10 accounts for toggle button', 'toggle is a separate focusable element'],
    },
  },
];
