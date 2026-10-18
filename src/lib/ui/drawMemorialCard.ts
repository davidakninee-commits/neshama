// Browser-only canvas rendering (no jsdom in this project's test setup) —
// verified live via the preview browser, same convention as PageBanner's
// flame animation and VirtualCandle's lighting interaction.

// Same flame path data as the hero banner / virtual candle, for visual
// consistency across the site.
const FLAME_OUTER =
  'M256,120 C 300,170 326,215 318,260 C 312,300 288,330 256,330 C 224,330 200,300 194,260 C 186,215 212,170 256,120 Z';
const FLAME_INNER =
  'M256,195 C 278,222 290,247 285,270 C 281,290 270,305 256,305 C 242,305 231,290 227,270 C 222,247 234,222 256,195 Z';

export interface MemorialCardData {
  name: string;
  words?: string;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Draws a square, client-side-only memorial card (candle + name + optional
 *  personal words) onto the given canvas. Nothing here is sent anywhere —
 *  the resulting image is only shared/downloaded if the visitor chooses to. */
export function drawMemorialCard(canvas: HTMLCanvasElement, data: MemorialCardData): void {
  const size = canvas.width;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);

  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, '#1e3a5f');
  bg.addColorStop(1, '#16293f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = size * 0.003;
  const inset = size * 0.045;
  ctx.strokeRect(inset, inset, size - inset * 2, size - inset * 2);

  const glowCenterY = size * 0.26;
  const glow = ctx.createRadialGradient(size / 2, glowCenterY, size * 0.01, size / 2, glowCenterY, size * 0.14);
  glow.addColorStop(0, 'rgba(197,160,89,0.55)');
  glow.addColorStop(1, 'rgba(197,160,89,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(size / 2, glowCenterY, size * 0.14, 0, Math.PI * 2);
  ctx.fill();

  const flameScale = (size * 0.16) / 512;
  ctx.save();
  ctx.translate(size / 2 - 256 * flameScale, glowCenterY - 256 * flameScale);
  ctx.scale(flameScale, flameScale);
  ctx.fillStyle = '#c5a059';
  ctx.fill(new Path2D(FLAME_OUTER));
  ctx.fillStyle = '#f9f8f5';
  ctx.fill(new Path2D(FLAME_INNER));
  ctx.restore();

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';

  ctx.fillStyle = '#c5a059';
  ctx.font = `500 ${size * 0.032}px Heebo, sans-serif`;
  ctx.fillText('לעילוי נשמת', size / 2, size * 0.42);

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${size * 0.075}px "Frank Ruhl Libre", serif`;
  ctx.fillText(data.name, size / 2, size * 0.52);

  if (data.words) {
    ctx.fillStyle = '#e8dcc5';
    ctx.font = `400 ${size * 0.032}px "Frank Ruhl Libre", serif`;
    const maxWidth = size * 0.72;
    const lines = wrapText(ctx, data.words, maxWidth).slice(0, 3);
    const lineHeight = size * 0.045;
    const startY = size * 0.61;
    lines.forEach((line, i) => ctx.fillText(line, size / 2, startY + i * lineHeight));
  }

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `600 ${size * 0.028}px "Frank Ruhl Libre", serif`;
  ctx.fillText('נשמה', size / 2, size * 0.93);
}
