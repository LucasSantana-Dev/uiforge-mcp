import type { IFigmaDesignToken, ITailwindMapping, IDesignContext } from './types.js';
import type { FigmaNode, FigmaFill } from './figma-client.js';

// Tailwind default spacing scale: class suffix → px value
const SPACING_SCALE: [string, number][] = [
  ['0', 0],
  ['px', 1],
  ['0.5', 2],
  ['1', 4],
  ['1.5', 6],
  ['2', 8],
  ['2.5', 10],
  ['3', 12],
  ['3.5', 14],
  ['4', 16],
  ['5', 20],
  ['6', 24],
  ['7', 28],
  ['8', 32],
  ['9', 36],
  ['10', 40],
  ['11', 44],
  ['12', 48],
  ['14', 56],
  ['16', 64],
  ['20', 80],
  ['24', 96],
];

// Tailwind default font-size scale: class suffix → rem value
const FONT_SIZE_SCALE: [string, string][] = [
  ['xs', '0.75rem'],
  ['sm', '0.875rem'],
  ['base', '1rem'],
  ['lg', '1.125rem'],
  ['xl', '1.25rem'],
  ['2xl', '1.5rem'],
  ['3xl', '1.875rem'],
  ['4xl', '2.25rem'],
  ['5xl', '3rem'],
  ['6xl', '3.75rem'],
  ['7xl', '4.5rem'],
  ['8xl', '6rem'],
  ['9xl', '8rem'],
];

// Tailwind default line-height scale
const LINE_HEIGHT_SCALE: [string, string][] = [
  ['none', '1'],
  ['tight', '1.25'],
  ['snug', '1.375'],
  ['normal', '1.5'],
  ['relaxed', '1.625'],
  ['loose', '2'],
];

function closestSpacing(px: number): string {
  let best = SPACING_SCALE[0];
  let bestDiff = Math.abs(px - best[1]);
  for (const entry of SPACING_SCALE) {
    const diff = Math.abs(px - entry[1]);
    if (diff < bestDiff) {
      best = entry;
      bestDiff = diff;
    }
  }
  // Use arbitrary value if the closest match is too far off (>2px)
  return bestDiff <= 2 ? best[0] : `[${px}px]`;
}

function closestFontSize(val: string): string {
  const numericRem = parseFloat(val);
  if (isNaN(numericRem)) return `[${val}]`;
  let best = FONT_SIZE_SCALE[0];
  let bestDiff = Math.abs(numericRem - parseFloat(best[1]));
  for (const entry of FONT_SIZE_SCALE) {
    const diff = Math.abs(numericRem - parseFloat(entry[1]));
    if (diff < bestDiff) {
      best = entry;
      bestDiff = diff;
    }
  }
  return bestDiff <= 0.0625 ? best[0] : `[${val}]`;
}

function closestLineHeight(val: string): string {
  const num = parseFloat(val);
  if (isNaN(num)) return `[${val}]`;
  let best = LINE_HEIGHT_SCALE[0];
  let bestDiff = Math.abs(num - parseFloat(best[1]));
  for (const entry of LINE_HEIGHT_SCALE) {
    const diff = Math.abs(num - parseFloat(entry[1]));
    if (diff < bestDiff) {
      best = entry;
      bestDiff = diff;
    }
  }
  return bestDiff <= 0.0625 ? best[0] : `[${val}]`;
}

function classifyShadow(val: string): string {
  const lower = val.toLowerCase();
  if (lower === 'none' || lower === '0') return 'shadow-none';
  // Heuristic: classify by vertical offset size
  const match = val.match(/\d+\s+(\d+)/);
  const yOffset = match ? parseInt(match[1], 10) : 0;
  if (yOffset <= 1) return 'shadow-sm';
  if (yOffset <= 3) return 'shadow';
  if (yOffset <= 6) return 'shadow-md';
  if (yOffset <= 10) return 'shadow-lg';
  if (yOffset <= 20) return 'shadow-xl';
  return 'shadow-2xl';
}

export function mapTokensToTailwind(tokens: IFigmaDesignToken[]): ITailwindMapping[] {
  const mappings: ITailwindMapping[] = [];

  for (const token of tokens) {
    switch (token.category) {
      case 'color':
        mappings.push({
          className: `text-[${token.value}]`,
          cssProperty: 'color',
          value: String(token.value),
        });
        mappings.push({
          className: `bg-[${token.value}]`,
          cssProperty: 'background-color',
          value: String(token.value),
        });
        break;

      case 'spacing': {
        const px = typeof token.value === 'number' ? token.value : parseFloat(String(token.value));
        const cls = closestSpacing(px);
        mappings.push({
          className: `p-${cls}`,
          cssProperty: 'padding',
          value: `${px}px`,
        });
        mappings.push({
          className: `m-${cls}`,
          cssProperty: 'margin',
          value: `${px}px`,
        });
        mappings.push({
          className: `gap-${cls}`,
          cssProperty: 'gap',
          value: `${px}px`,
        });
        break;
      }

      case 'typography': {
        const val = String(token.value);
        if (token.name.toLowerCase().includes('size')) {
          const cls = closestFontSize(val);
          mappings.push({
            className: `text-${cls}`,
            cssProperty: 'font-size',
            value: val,
          });
        } else if (token.name.toLowerCase().includes('weight')) {
          const weightMap: Record<string, string> = {
            '100': 'font-thin',
            '200': 'font-extralight',
            '300': 'font-light',
            '400': 'font-normal',
            '500': 'font-medium',
            '600': 'font-semibold',
            '700': 'font-bold',
            '800': 'font-extrabold',
            '900': 'font-black',
          };
          mappings.push({
            className: weightMap[val] ?? `font-[${val}]`,
            cssProperty: 'font-weight',
            value: val,
          });
        } else if (token.name.toLowerCase().includes('family')) {
          mappings.push({
            className: `font-['${val.replace(/\s/g, '_')}']`,
            cssProperty: 'font-family',
            value: val,
          });
        } else if (token.name.toLowerCase().includes('line') || token.name.toLowerCase().includes('height')) {
          const cls = closestLineHeight(val);
          mappings.push({
            className: `leading-${cls}`,
            cssProperty: 'line-height',
            value: val,
          });
        }
        break;
      }

      case 'borderRadius': {
        const radVal = String(token.value);
        const radiusMap: Record<string, string> = {
          '0': 'rounded-none',
          '2': 'rounded-sm',
          '4': 'rounded',
          '6': 'rounded-md',
          '8': 'rounded-lg',
          '12': 'rounded-xl',
          '16': 'rounded-2xl',
          '24': 'rounded-3xl',
        };
        mappings.push({
          className: radiusMap[radVal] ?? `rounded-[${radVal}px]`,
          cssProperty: 'border-radius',
          value: `${radVal}px`,
        });
        break;
      }

      case 'shadow':
        mappings.push({
          className: classifyShadow(String(token.value)),
          cssProperty: 'box-shadow',
          value: String(token.value),
        });
        break;
    }
  }

  return mappings;
}

export function extractTokensFromFigmaNode(node: FigmaNode): IFigmaDesignToken[] {
  const tokens: IFigmaDesignToken[] = [];

  if (node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills as FigmaFill[]) {
      if (fill.type === 'SOLID' && fill.color) {
        const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
        tokens.push({
          name: `${node.name}/fill`,
          type: 'color',
          value: hex,
          category: 'color',
        });
      }
    }
  }

  if (node.style) {
    const style = node.style as Record<string, unknown>;
    if (style['fontSize']) {
      tokens.push({
        name: `${node.name}/fontSize`,
        type: 'number',
        value: style['fontSize'] as number,
        category: 'typography',
      });
    }
    if (style['fontWeight']) {
      tokens.push({
        name: `${node.name}/fontWeight`,
        type: 'number',
        value: style['fontWeight'] as number,
        category: 'typography',
      });
    }
    if (style['fontFamily']) {
      tokens.push({
        name: `${node.name}/fontFamily`,
        type: 'string',
        value: style['fontFamily'] as string,
        category: 'typography',
      });
    }
    if (style['lineHeightPx']) {
      tokens.push({
        name: `${node.name}/lineHeight`,
        type: 'number',
        value: style['lineHeightPx'] as number,
        category: 'typography',
      });
    }
  }

  if (node.absoluteBoundingBox) {
    const { width, height } = node.absoluteBoundingBox;
    if (width) {
      tokens.push({ name: `${node.name}/width`, type: 'number', value: width, category: 'spacing' });
    }
    if (height) {
      tokens.push({ name: `${node.name}/height`, type: 'number', value: height, category: 'spacing' });
    }
  }

  const cornerRadius = node['cornerRadius'] as number | undefined;
  if (cornerRadius !== undefined) {
    tokens.push({
      name: `${node.name}/borderRadius`,
      type: 'number',
      value: cornerRadius,
      category: 'borderRadius',
    });
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractTokensFromFigmaNode(child));
    }
  }

  return tokens;
}

export function tokensToDesignContext(tokens: IFigmaDesignToken[]): Partial<IDesignContext> {
  const context: Partial<IDesignContext> = {};
  const colors: Record<string, string> = {};
  const fontFamilies = new Set<string>();

  for (const token of tokens) {
    if (token.category === 'color') {
      const namePart = token.name.split('/').pop()?.toLowerCase() ?? '';
      colors[namePart] = String(token.value);
    }
    if (token.category === 'typography' && token.name.toLowerCase().includes('family')) {
      fontFamilies.add(String(token.value));
    }
  }

  if (Object.keys(colors).length > 0) {
    const colorValues = Object.values(colors);
    context.colorPalette = {
      primary: colorValues[0] ?? '#2563eb',
      primaryForeground: '#ffffff',
      secondary: colorValues[1] ?? '#64748b',
      secondaryForeground: '#ffffff',
      accent: colorValues[2] ?? '#f59e0b',
      accentForeground: '#1c1917',
      background: '#ffffff',
      foreground: colorValues[3] ?? '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
    };
  }

  if (fontFamilies.size > 0) {
    const primaryFont = [...fontFamilies][0];
    context.typography = {
      fontFamily: `${primaryFont}, system-ui, sans-serif`,
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
      lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    };
  }

  return context;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) =>
    Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
