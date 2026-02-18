import type { IDesignContext, IFigmaDesignToken, ITailwindMapping } from '../lib/types.js';
import { createLogger } from '../lib/logger.js';
import { analyzeImage } from '../lib/image-analyzer.js';
import { detectCommonPatterns, buildSuggestedContext } from '../lib/pattern-detector.js';
import { extractDesignFromUrl } from '../lib/design-extractor.js';

const logger = createLogger('analysis-service');

/**
 * Analysis Service - Handles all image and pattern analysis operations
 * Provides a unified interface for design analysis and pattern detection
 */
export class AnalysisService {
  /**
   * Analyze an image for design patterns and tokens
   * @param imageData Base64 encoded image data or image URL
   * @param options Analysis options
   * @returns Analysis results
   */
  async analyzeImage(
    imageData: string,
    options: {
      extractColors?: boolean;
      extractTypography?: boolean;
      extractLayout?: boolean;
      extractComponents?: boolean;
    } = {}
  ): Promise<{
    colors: string[];
    typography: Array<{ family: string; size: number; weight: string }>;
    layout: Array<{ type: string; position: { x: number; y: number; width: number; height: number } }>;
    components: Array<{ type: string; confidence: number }>;
    designTokens: IFigmaDesignToken[];
  }> {
    logger.info('Analyzing image for design patterns');
    
    try {
      // Convert base64 string to Buffer
      const imageBuffer = Buffer.from(imageData, 'base64');
      
      const analysis = await analyzeImage(imageBuffer, 'design-analysis');

      logger.info(`Image analysis complete: ${analysis.dominantColors.length} colors, ${analysis.detectedComponents.length} components`);
      
      // Convert IImageAnalysis to the expected return format
      return {
        colors: analysis.dominantColors.map(c => c.hex),
        typography: [], // TODO: Extract typography from layout regions
        layout: analysis.layoutRegions.map(r => ({
          type: r.role,
          position: r.bounds
        })),
        components: analysis.detectedComponents.map(c => ({
          type: c,
          confidence: 0.8 // Default confidence
        })),
        designTokens: [] // TODO: Convert to design tokens
      };
    } catch (error) {
      logger.error('Image analysis failed:', error);
      throw new Error(`Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Detect patterns from multiple sources
   * @param sources Array of sources to analyze (URLs, images, etc.)
   * @returns Pattern detection results
   */
  async detectPatterns(sources: Array<{
    type: 'url' | 'image' | 'text';
    content: string;
    metadata?: Record<string, any>;
  }>): Promise<{
    commonPatterns: Array<{
      type: string;
      frequency: number;
      confidence: number;
      examples: string[];
    }>;
    uniquePatterns: Array<{
      type: string;
      source: string;
      confidence: number;
    }>;
    recommendations: string[];
  }> {
    logger.info(`Detecting patterns from ${sources.length} sources`);
    
    try {
      // Convert sources to the expected format for detectCommonPatterns
      const scrapedPages = sources
        .filter(s => s.type === 'url')
        .map(s => ({
          url: s.content,
          title: s.metadata?.title || 'Unknown',
          description: s.metadata?.description || '',
          colors: [],
          typography: [],
          layout: [],
        }));
      
      const imageAnalyses = sources
        .filter(s => s.type === 'image')
        .map(s => ({
          imageUrl: s.content,
          colors: [],
          typography: [],
          layout: [],
          components: [],
          confidence: 0.5,
        }));
      
      const patterns = detectCommonPatterns({ scrapedPages, imageAnalyses });
      
      // Convert patterns to the expected output format
      const commonPatterns = patterns.map(p => ({
        type: p.category,
        frequency: p.frequency || 1,
        confidence: p.confidence,
        examples: p.examples || [],
      }));
      
      const uniquePatterns = patterns
        .filter(p => p.frequency === 1)
        .map(p => ({
          type: p.category,
          source: p.source || 'unknown',
          confidence: p.confidence,
        }));
      
      const recommendations = this.generateRecommendations(patterns);
      
      logger.info(`Pattern detection complete: ${commonPatterns.length} common patterns found`);
      return {
        commonPatterns,
        uniquePatterns,
        recommendations,
      };
    } catch (error) {
      logger.error('Pattern detection failed:', error);
      throw new Error(`Pattern detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract design information from a URL
   * @param url URL to analyze
   * @param options Extraction options
   * @returns Extracted design information
   */
  async extractFromUrl(
    url: string,
    options: {
      extractColors?: boolean;
      extractTypography?: boolean;
      extractLayout?: boolean;
      followRedirects?: boolean;
      timeout?: number;
    } = {}
  ): Promise<{
    url: string;
    title: string;
    colors: string[];
    typography: Array<{ family: string; size: string; weight: string }>;
    layout: string;
    metadata: {
      description?: string;
      keywords?: string[];
      author?: string;
    };
  }> {
    logger.info(`Extracting design from URL: ${url}`);
    
    try {
      const extraction = await extractDesignFromUrl(url, {
        extractColors: options.extractColors ?? true,
        extractTypography: options.extractTypography ?? true,
        extractLayout: options.extractLayout ?? true,
        followRedirects: options.followRedirects ?? true,
        timeout: options.timeout ?? 10000,
      });

      logger.info(`URL extraction complete: ${extraction.colors.length} colors found`);
      return extraction;
    } catch (error) {
      logger.error('URL extraction failed:', error);
      throw new Error(`URL extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Map design tokens to Tailwind CSS classes
   * @param designTokens Design tokens to map
   * @param options Mapping options
   * @returns Tailwind CSS mappings
   */
  async mapToTailwind(
    designTokens: IFigmaDesignToken[],
    options: {
      includeUtilities?: boolean;
      includeComponents?: boolean;
      customPrefix?: string;
    } = {}
  ): Promise<{
    mappings: ITailwindMapping[];
    customClasses: string[];
    configExtensions: Record<string, any>;
  }> {
    logger.info(`Mapping ${designTokens.length} design tokens to Tailwind CSS`);
    
    try {
      // This would integrate with the existing tailwind-mapper functionality
      // For now, we'll create a placeholder implementation
      
      const mappings: ITailwindMapping[] = [];
      const customClasses: string[] = [];
      const configExtensions: Record<string, any> = {};

      for (const token of designTokens) {
        const mapping = this.createTailwindMapping(token, options);
        if (mapping) {
          mappings.push(mapping);
          
          if (options.includeUtilities) {
            customClasses.push(this.createUtilityClass(token, options.customPrefix));
          }
          
          if (options.includeComponents) {
            this.extendConfig(token, configExtensions);
          }
        }
      }

      logger.info(`Tailwind mapping complete: ${mappings.length} mappings created`);
      return {
        mappings,
        customClasses,
        configExtensions,
      };
    } catch (error) {
      logger.error('Tailwind mapping failed:', error);
      throw new Error(`Tailwind mapping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze design context for consistency and improvements
   * @param context Design context to analyze
   * @returns Analysis results with recommendations
   */
  analyzeDesignContext(context: IDesignContext): {
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      message: string;
      suggestion: string;
    }>;
    recommendations: string[];
    completeness: {
      colors: number;
      typography: number;
      spacing: number;
      borderRadius: number;
      shadows: number;
    };
  } {
    logger.info('Analyzing design context for consistency');
    
    const issues: Array<{ type: 'error' | 'warning' | 'info'; message: string; suggestion: string }> = [];
    const recommendations: string[] = [];
    let score = 100;

    // Analyze color palette
    if (!context.colorPalette.primary) {
      issues.push({ type: 'error', message: 'Primary color is missing', suggestion: 'Add a primary color to the color palette' });
      score -= 20;
    }

    if (!context.colorPalette.background) {
      issues.push({ type: 'error', message: 'Background color is missing', suggestion: 'Add a background color to the color palette' });
      score -= 15;
    }

    if (!context.colorPalette.foreground) {
      issues.push({ type: 'warning', message: 'Foreground color is missing', suggestion: 'Add a foreground color for text' });
      score -= 10;
    }

    // Analyze typography
    if (!context.typography.fontFamily) {
      issues.push({ type: 'error', message: 'Font family is missing', suggestion: 'Specify a default font family' });
      score -= 15;
    }

    if (!context.typography.headingFont) {
      recommendations.push('Consider specifying a heading font for better hierarchy');
      score -= 5;
    }

    // Analyze spacing
    if (!context.spacing.unit || context.spacing.unit <= 0) {
      issues.push({ type: 'error', message: 'Invalid spacing unit', suggestion: 'Set a positive spacing unit value' });
      score -= 10;
    }

    if (!context.spacing.scale || context.spacing.scale.length === 0) {
      recommendations.push('Add a spacing scale for consistent spacing');
      score -= 5;
    }

    // Analyze border radius
    if (!context.borderRadius) {
      recommendations.push('Add border radius values for consistent rounded corners');
      score -= 5;
    }

    // Analyze shadows
    if (!context.shadows) {
      recommendations.push('Add shadow values for depth and elevation');
      score -= 5;
    }

    // Generate recommendations based on analysis
    if (context.colorPalette.primary && context.colorPalette.background) {
      const primary = context.colorPalette.primary;
      const background = context.colorPalette.background;
      
      // Check contrast (simplified)
      if (primary === background) {
        issues.push({ type: 'error', message: 'Primary and background colors are the same', suggestion: 'Use contrasting colors for better visibility' });
        score -= 25;
      }
    }

    const completeness = {
      colors: this.calculateCompleteness(context.colorPalette, ['primary', 'secondary', 'background', 'foreground', 'muted', 'accent', 'border', 'destructive']),
      typography: this.calculateCompleteness(context.typography, ['fontFamily', 'headingFont', 'fontSize', 'fontWeight', 'lineHeight']),
      spacing: this.calculateCompleteness(context.spacing, ['unit', 'scale']),
      borderRadius: this.calculateCompleteness(context.borderRadius, ['sm', 'md', 'lg', 'full']),
      shadows: this.calculateCompleteness(context.shadows, ['sm', 'md', 'lg']),
    };

    logger.info(`Design context analysis complete: score ${score}/100`);
    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      completeness,
    };
  }

  /**
   * Create a Tailwind mapping for a design token
   * @param token Design token
   * @param options Mapping options
   * @returns Tailwind mapping or null if not applicable
   */
  private createTailwindMapping(token: IFigmaDesignToken, options: {
    includeUtilities?: boolean;
    includeComponents?: boolean;
    customPrefix?: string;
  }): ITailwindMapping | null {
    // Simplified implementation - would use actual tailwind-mapper logic
    const className = token.name.replace(/[\/\s]/g, '-').toLowerCase();
    
    switch (token.category) {
      case 'color':
        return {
          className: `--color-${className}`,
          cssProperty: 'color',
          value: token.value.toString(),
        };
      case 'spacing':
        return {
          className: `${className}`,
          cssProperty: 'padding',
          value: `${token.value}px`,
        };
      case 'borderRadius':
        return {
          className: `rounded-${className}`,
          cssProperty: 'border-radius',
          value: `${token.value}px`,
        };
      default:
        return null;
    }
  }

  /**
   * Create a utility class for a design token
   * @param token Design token
   * @param prefix Custom prefix
   * @returns Utility class CSS
   */
  private createUtilityClass(token: IFigmaDesignToken, prefix?: string): string {
    const className = `${prefix || ''}${token.name.replace(/[\/\s]/g, '-').toLowerCase()}`;
    
    switch (token.category) {
      case 'color':
        return `.${className} { color: ${token.value}; }`;
      case 'spacing':
        return `.${className} { padding: ${token.value}px; }`;
      case 'borderRadius':
        return `.${className} { border-radius: ${token.value}px; }`;
      default:
        return `.${className} { /* ${token.category}: ${token.value} */ }`;
    }
  }

  /**
   * Extend Tailwind config with design token
   * @param token Design token
   * @param config Config object to extend
   */
  private extendConfig(token: IFigmaDesignToken, config: Record<string, any>): void {
    switch (token.category) {
      case 'color':
        if (!config.theme) config.theme = {};
        if (!config.theme.colors) config.theme.colors = {};
        config.theme.colors[token.name] = token.value;
        break;
      case 'spacing':
        if (!config.theme) config.theme = {};
        if (!config.theme.spacing) config.theme.spacing = {};
        config.theme.spacing[token.name] = `${token.value}px`;
        break;
      case 'borderRadius':
        if (!config.theme) config.theme = {};
        if (!config.theme.borderRadius) config.theme.borderRadius = {};
        config.theme.borderRadius[token.name] = `${token.value}px`;
        break;
    }
  }

  /**
   * Calculate completeness percentage for an object
   * @param obj Object to check
   * @param requiredKeys Required keys
   * @returns Completeness percentage (0-100)
   */
  private calculateCompleteness(obj: any, requiredKeys: string[]): number {
    if (!obj) return 0;
    
    const presentKeys = requiredKeys.filter(key => obj[key] !== undefined && obj[key] !== null);
    return Math.round((presentKeys.length / requiredKeys.length) * 100);
  }

  /**
   * Generate recommendations based on detected patterns
   * @param patterns Detected patterns
   * @returns Array of recommendations
   */
  private generateRecommendations(patterns: any[]): string[] {
    const recommendations: string[] = [];
    
    // Analyze patterns and generate recommendations
    if (patterns.length === 0) {
      recommendations.push('Consider adding more design sources for better pattern detection');
      return recommendations;
    }
    
    const colorPatterns = patterns.filter(p => p.category === 'colors');
    if (colorPatterns.length > 0) {
      recommendations.push('Strong color palette detected - consider using these colors consistently');
    }
    
    const typographyPatterns = patterns.filter(p => p.category === 'typography');
    if (typographyPatterns.length > 0) {
      recommendations.push('Typography patterns detected - establish a clear type hierarchy');
    }
    
    const layoutPatterns = patterns.filter(p => p.category === 'layout');
    if (layoutPatterns.length > 0) {
      recommendations.push('Layout patterns detected - maintain consistent spacing and alignment');
    }
    
    return recommendations;
  }
}

// Export singleton instance for backward compatibility
export const analysisService = new AnalysisService();
