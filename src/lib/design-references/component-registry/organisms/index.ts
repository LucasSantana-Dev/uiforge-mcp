import { registerSnippets } from '../index.js';
import { heroSnippets } from './heroes.js';
import { featureSnippets } from './features.js';
import { ctaFooterSnippets } from './cta-footer.js';

export function registerOrganisms(): void {
  registerSnippets(heroSnippets);
  registerSnippets(featureSnippets);
  registerSnippets(ctaFooterSnippets);
}

export {
  heroSnippets,
  featureSnippets,
  ctaFooterSnippets,
};
