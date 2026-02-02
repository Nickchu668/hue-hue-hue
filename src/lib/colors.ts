import { BACKUP_COLOR_PAIRS } from './types';

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// Convert RGB to LAB
function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  let y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  let z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;

  x /= 95.047;
  y /= 100.000;
  z /= 108.883;

  const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116);

  return [
    116 * f(y) - 16,
    500 * (f(x) - f(y)),
    200 * (f(y) - f(z)),
  ];
}

// Calculate Delta E (CIE76)
function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  );
}

// Generate colors with specific deltaE
export function generateColorPair(targetDeltaE: number, level: number): { base: string; different: string } {
  // Try to generate a good color pair
  for (let attempt = 0; attempt < 50; attempt++) {
    const h = Math.floor(Math.random() * 360);
    const s = 40 + Math.floor(Math.random() * 40); // 40-80%
    const l = 40 + Math.floor(Math.random() * 30); // 40-70%

    const baseRgb = hslToRgb(h, s, l);
    const baseLab = rgbToLab(baseRgb[0], baseRgb[1], baseRgb[2]);

    // Calculate hue shift based on level (30° for level 1 down to 1° for level 10)
    const hueShift = Math.max(1, 30 - (level - 1) * 3);
    const satShift = Math.random() > 0.5 ? 1 : -1;
    const lightShift = Math.random() > 0.5 ? 1 : -1;

    // Try different variations
    for (let hDelta = hueShift; hDelta >= 1; hDelta -= 2) {
      for (let sDelta = 5; sDelta >= 1; sDelta -= 2) {
        for (let lDelta = 5; lDelta >= 1; lDelta -= 2) {
          const newH = (h + hDelta * (Math.random() > 0.5 ? 1 : -1) + 360) % 360;
          const newS = Math.max(0, Math.min(100, s + sDelta * satShift));
          const newL = Math.max(0, Math.min(100, l + lDelta * lightShift));

          const diffRgb = hslToRgb(newH, newS, newL);
          const diffLab = rgbToLab(diffRgb[0], diffRgb[1], diffRgb[2]);

          const dE = deltaE(baseLab, diffLab);

          if (Math.abs(dE - targetDeltaE) < targetDeltaE * 0.3) {
            const toHex = (rgb: [number, number, number]) =>
              `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
            return {
              base: toHex(baseRgb),
              different: toHex(diffRgb),
            };
          }
        }
      }
    }
  }

  // Fallback to predefined pairs
  const pairIndex = (level - 1) % BACKUP_COLOR_PAIRS.length;
  return {
    base: BACKUP_COLOR_PAIRS[pairIndex][0],
    different: BACKUP_COLOR_PAIRS[pairIndex][1],
  };
}

// Generate patterns for colorblind mode
export function getPattern(index: number): string {
  const patterns = [
    'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
    'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
    'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 2px, transparent 2px)',
    'linear-gradient(90deg, transparent 48%, rgba(0,0,0,0.1) 48%, rgba(0,0,0,0.1) 52%, transparent 52%)',
  ];
  return patterns[index % patterns.length];
}
