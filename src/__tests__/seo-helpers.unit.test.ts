import {
  generateMetaTags,
  generateNextMetadata,
  generateJsonLd,
  generateNextJsonLd,
  createOrganizationSchema,
  createWebPageSchema,
  createProductSchema,
  performancePatterns,
  getPerformancePattern,
  getPerformancePatternsByCategory,
} from '../lib/design-references/seo-helpers/index.js';
import type { IMetaConfig } from '../lib/design-references/component-registry/types.js';

// ── Helper ─────────────────────────────────────────────────

const basicConfig: IMetaConfig = {
  title: 'Test Page',
  description: 'A test page description',
};

const fullConfig: IMetaConfig = {
  title: 'Full Test Page',
  description: 'A comprehensive test page',
  keywords: ['test', 'seo', 'meta'],
  canonical: 'https://example.com/page',
  robots: 'index, follow',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    type: 'website',
    image: 'https://example.com/og.jpg',
    url: 'https://example.com/page',
    siteName: 'Test Site',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@testsite',
    creator: '@testcreator',
    title: 'Twitter Title',
    description: 'Twitter Description',
    image: 'https://example.com/twitter.jpg',
  },
};

// ── generateMetaTags ───────────────────────────────────────

describe('seo-helpers generateMetaTags', () => {
  it('generates title and description for basic config', () => {
    const tags = generateMetaTags(basicConfig);
    expect(tags).toContain('<title>Test Page</title>');
    expect(tags).toContain('name="description"');
    expect(tags).toContain('A test page description');
  });

  it('generates keywords meta tag', () => {
    const tags = generateMetaTags(fullConfig);
    expect(tags).toContain('name="keywords"');
    expect(tags).toContain('test, seo, meta');
  });

  it('generates canonical link', () => {
    const tags = generateMetaTags(fullConfig);
    expect(tags).toContain('rel="canonical"');
    expect(tags).toContain('https://example.com/page');
  });

  it('generates Open Graph tags', () => {
    const tags = generateMetaTags(fullConfig);
    expect(tags).toContain('og:title');
    expect(tags).toContain('og:description');
    expect(tags).toContain('og:type');
    expect(tags).toContain('og:image');
    expect(tags).toContain('og:url');
    expect(tags).toContain('og:site_name');
  });

  it('generates Twitter Card tags', () => {
    const tags = generateMetaTags(fullConfig);
    expect(tags).toContain('twitter:card');
    expect(tags).toContain('twitter:site');
    expect(tags).toContain('twitter:creator');
    expect(tags).toContain('twitter:title');
    expect(tags).toContain('twitter:image');
  });

  it('generates robots meta tag', () => {
    const tags = generateMetaTags(fullConfig);
    expect(tags).toContain('name="robots"');
    expect(tags).toContain('index, follow');
  });

  it('escapes HTML entities in values', () => {
    const config: IMetaConfig = {
      title: 'Page with "quotes" & <tags>',
      description: 'Description with "special" chars',
    };
    const tags = generateMetaTags(config);
    expect(tags).not.toContain('<tags>');
    expect(tags).toContain('&amp;');
    expect(tags).toContain('&quot;');
  });

  it('omits optional fields when not provided', () => {
    const tags = generateMetaTags(basicConfig);
    expect(tags).not.toContain('og:');
    expect(tags).not.toContain('twitter:');
    expect(tags).not.toContain('canonical');
    expect(tags).not.toContain('robots');
  });
});

// ── generateNextMetadata ───────────────────────────────────

describe('seo-helpers generateNextMetadata', () => {
  it('generates valid TypeScript export', () => {
    const code = generateNextMetadata(basicConfig);
    expect(code).toContain("import type { Metadata } from 'next'");
    expect(code).toContain('export const metadata: Metadata');
    expect(code).toContain('"Test Page"');
  });

  it('includes openGraph section when provided', () => {
    const code = generateNextMetadata(fullConfig);
    expect(code).toContain('openGraph:');
    expect(code).toContain('OG Title');
  });

  it('includes twitter section when provided', () => {
    const code = generateNextMetadata(fullConfig);
    expect(code).toContain('twitter:');
    expect(code).toContain('summary_large_image');
  });

  it('includes alternates.canonical when provided', () => {
    const code = generateNextMetadata(fullConfig);
    expect(code).toContain('alternates:');
    expect(code).toContain('canonical:');
  });
});

// ── JSON-LD ────────────────────────────────────────────────

describe('seo-helpers JSON-LD', () => {
  it('generateJsonLd creates script tag with schema.org context', () => {
    const schema = createOrganizationSchema({ name: 'TestCo', url: 'https://test.co' });
    const html = generateJsonLd(schema);
    expect(html).toContain('application/ld+json');
    expect(html).toContain('https://schema.org');
    expect(html).toContain('"@type": "Organization"');
    expect(html).toContain('TestCo');
  });

  it('generateNextJsonLd creates React component', () => {
    const schema = createWebPageSchema({ name: 'Test', description: 'Desc', url: 'https://test.co' });
    const code = generateNextJsonLd(schema);
    expect(code).toContain('export default function JsonLd()');
    expect(code).toContain('dangerouslySetInnerHTML');
    expect(code).toContain('application/ld+json');
  });

  it('createOrganizationSchema includes optional fields', () => {
    const schema = createOrganizationSchema({
      name: 'TestCo',
      url: 'https://test.co',
      logo: 'https://test.co/logo.png',
      description: 'A test company',
    });
    expect(schema.type).toBe('Organization');
    expect(schema.properties).toBeDefined();
    expect(schema.properties).toEqual(expect.any(Object));
    expect(schema.properties.logo).toBe('https://test.co/logo.png');
    expect(schema.properties.description).toBe('A test company');
  });

  it('createWebPageSchema has correct type and properties', () => {
    const schema = createWebPageSchema({ name: 'Page', description: 'Desc', url: 'https://test.co' });
    expect(schema.type).toBe('WebPage');
    expect(schema.properties.name).toBe('Page');
    expect(schema.properties.url).toBe('https://test.co');
  });

  it('createProductSchema includes offers when price is provided', () => {
    const schema = createProductSchema({
      name: 'Widget',
      description: 'A widget',
      brand: 'TestBrand',
      price: '9.99',
      currency: 'USD',
    });
    expect(schema.type).toBe('Product');
    expect(schema.properties.brand).toEqual({ '@type': 'Brand', name: 'TestBrand' });
    expect(schema.properties.offers).toBeDefined();
  });

  it('createProductSchema omits offers when no price', () => {
    const schema = createProductSchema({ name: 'Widget', description: 'A widget' });
    expect(schema.properties.offers).toBeUndefined();
  });
});

// ── Performance Patterns ───────────────────────────────────

describe('seo-helpers performance patterns', () => {
  it('has at least 6 patterns', () => {
    expect(performancePatterns.length).toBeGreaterThanOrEqual(6);
  });

  it('every pattern has required fields', () => {
    for (const pattern of performancePatterns) {
      expect(pattern.id).toBeTruthy();
      expect(pattern.name).toBeTruthy();
      expect(pattern.description).toBeTruthy();
      expect(pattern.code).toBeTruthy();
      expect(pattern.impact).toBeTruthy();
      expect(pattern.category).toBeTruthy();
    }
  });

  it('getPerformancePattern returns a pattern by id', () => {
    const pattern = getPerformancePattern('lazy-image');
    expect(pattern).toBeDefined();
    expect(pattern!.id).toBe('lazy-image');
  });

  it('getPerformancePattern returns undefined for unknown id', () => {
    expect(getPerformancePattern('nonexistent-xyz')).toBeUndefined();
  });

  it('getPerformancePatternsByCategory filters correctly', () => {
    const categories = [...new Set(performancePatterns.map((p) => p.category))];
    for (const cat of categories) {
      const filtered = getPerformancePatternsByCategory(cat);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((p) => p.category === cat)).toBe(true);
    }
  });

  it('has image optimization patterns', () => {
    const imagePatterns = getPerformancePatternsByCategory('images');
    expect(imagePatterns.length).toBeGreaterThan(0);
  });

  it('has accessibility-related pattern', () => {
    const a11yPattern = getPerformancePattern('reduced-motion');
    expect(a11yPattern).toBeDefined();
    expect(a11yPattern!.category).toBe('a11y');
  });

  it('has semantic HTML pattern', () => {
    const semanticPattern = getPerformancePattern('semantic-html');
    expect(semanticPattern).toBeDefined();
    expect(semanticPattern!.category).toBe('structure');
  });
});
