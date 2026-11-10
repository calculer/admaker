import { CampaignProject } from '../types/studio';
import { AD_FORMATS } from './campaignLogic';

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function exportCampaignCanvas(
  campaign: CampaignProject,
  formatType: 'png' | 'jpg'
): Promise<void> {
  const formatSpec = AD_FORMATS[campaign.format];
  const width = formatSpec.widthPx;
  const height = formatSpec.heightPx;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cfg = campaign.editorConfig;
  const isRtl = campaign.adLanguage === 'ar';
  ctx.direction = isRtl ? 'rtl' : 'ltr';

  // 1. Studio background fill
  ctx.fillStyle = cfg.backgroundTint || campaign.palette[0] || '#14201D';
  ctx.fillRect(0, 0, width, height);

  // Subtle radial studio light gradient
  const radGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.4,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.85
  );
  radGrad.addColorStop(0, `${cfg.accentColor}33`);
  radGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Render generated scene or preserved product photo
  const activeImageSrc =
    campaign.generatedSceneImageUrl ||
    campaign.productImages[campaign.activeProductImageIndex] ||
    campaign.productImages[0];

  if (activeImageSrc) {
    try {
      const img = await loadImageElement(activeImageSrc);
      ctx.save();
      const zoom = cfg.cropZoom * cfg.productScale;
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;

      let drawW = width;
      let drawH = height;
      if (imgRatio > canvasRatio) {
        drawH = height * zoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = width * zoom;
        drawH = drawW / imgRatio;
      }

      const offsetX = (cfg.productOffsetX / 100) * width;
      const offsetY = (cfg.productOffsetY / 100) * height;
      const drawX = (width - drawW) / 2 + offsetX;
      const drawY = (height - drawH) / 2 + offsetY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } catch {
      // Fallback editorial geometric frame if image fails to load in canvas
    }
  }

  // 3. Measured contrast scrim for text legibility
  const scrimAlpha = Math.max(0, Math.min(0.9, cfg.scrimOpacity));
  const scrimGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (cfg.verticalPosition === 'top') {
    scrimGrad.addColorStop(0, `rgba(14, 23, 21, ${scrimAlpha})`);
    scrimGrad.addColorStop(0.65, `rgba(14, 23, 21, ${scrimAlpha * 0.35})`);
    scrimGrad.addColorStop(1, 'rgba(14, 23, 21, 0.15)');
  } else if (cfg.verticalPosition === 'center') {
    scrimGrad.addColorStop(0, `rgba(14, 23, 21, ${scrimAlpha * 0.45})`);
    scrimGrad.addColorStop(0.5, `rgba(14, 23, 21, ${scrimAlpha})`);
    scrimGrad.addColorStop(1, `rgba(14, 23, 21, ${scrimAlpha * 0.45})`);
  } else {
    scrimGrad.addColorStop(0, 'rgba(14, 23, 21, 0.15)');
    scrimGrad.addColorStop(0.45, `rgba(14, 23, 21, ${scrimAlpha * 0.35})`);
    scrimGrad.addColorStop(1, `rgba(14, 23, 21, ${scrimAlpha})`);
  }
  ctx.fillStyle = scrimGrad;
  ctx.fillRect(0, 0, width, height);

  // 4. Optional Editorial Keyline Frame
  if (cfg.frameBorder) {
    const inset = Math.round(width * 0.035);
    ctx.strokeStyle = `${cfg.accentColor}88`;
    ctx.lineWidth = 2;
    ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
  }

  // 5. Typography Layers inside safe area
  const padX = Math.round(width * (formatSpec.safeMarginSidePct / 100));
  const padTop = Math.round(height * (formatSpec.safeMarginTopPct / 100));
  const padBottom = Math.round(height * (formatSpec.safeMarginBottomPct / 100));
  const contentWidth = width - padX * 2;

  const anchorX =
    cfg.textAlign === 'left'
      ? padX
      : cfg.textAlign === 'right'
      ? width - padX
      : width / 2;

  ctx.textAlign = cfg.textAlign;

  // Price / Edition Tag at top corner
  if (cfg.showPriceBadge && cfg.priceBadgeText.trim()) {
    const badgeFontPx = Math.round(width * 0.024);
    ctx.font = `600 ${badgeFontPx}px "IBM Plex Mono", monospace`;
    ctx.fillStyle = cfg.accentColor;
    const badgeY = padTop + badgeFontPx;
    ctx.fillText(cfg.priceBadgeText.trim(), anchorX, badgeY);
  }

  // Headline & Subtitle block
  const activeCopy = campaign.copyVariants[campaign.activeTone];
  const displayHeadline = cfg.useAlternateHeadline
    ? activeCopy.alternateHeadline
    : cfg.headlineText;

  const headlinePx = Math.round(width * 0.052 * cfg.fontSizeScale);
  const subtitlePx = Math.round(width * 0.025 * cfg.fontSizeScale);
  const ctaPx = Math.round(width * 0.024);

  const fontFamilyDisplay = isRtl
    ? '"Amiri", serif'
    : '"Cormorant Garamond", Georgia, serif';
  const fontFamilySans = isRtl
    ? '"IBM Plex Sans Arabic", sans-serif'
    : '"Plus Jakarta Sans", sans-serif';

  ctx.font = `600 ${headlinePx}px ${fontFamilyDisplay}`;
  const headlineLines = wrapCanvasText(ctx, displayHeadline, contentWidth);

  ctx.font = `400 ${subtitlePx}px ${fontFamilySans}`;
  const subtitleLines = cfg.subtitleText
    ? wrapCanvasText(ctx, cfg.subtitleText, contentWidth * 0.9)
    : [];

  const lineGapHeadline = Math.round(headlinePx * 1.18);
  const lineGapSubtitle = Math.round(subtitlePx * 1.45);
  const ctaBoxHeight = Math.round(ctaPx * 2.4);

  const totalBlockHeight =
    headlineLines.length * lineGapHeadline +
    (subtitleLines.length > 0 ? subtitleLines.length * lineGapSubtitle + 24 : 0) +
    (cfg.ctaText ? ctaBoxHeight + 36 : 0);

  let cursorY =
    cfg.verticalPosition === 'top'
      ? padTop + 70
      : cfg.verticalPosition === 'center'
      ? (height - totalBlockHeight) / 2 + headlinePx
      : height - padBottom - totalBlockHeight + headlinePx;

  // Draw Headline
  ctx.font = `600 ${headlinePx}px ${fontFamilyDisplay}`;
  ctx.fillStyle = cfg.textColor;
  for (const line of headlineLines) {
    ctx.fillText(line, anchorX, cursorY);
    cursorY += lineGapHeadline;
  }

  // Draw Subtitle
  if (subtitleLines.length > 0) {
    cursorY += 12;
    ctx.font = `400 ${subtitlePx}px ${fontFamilySans}`;
    ctx.fillStyle = `${cfg.textColor}E6`;
    for (const line of subtitleLines) {
      ctx.fillText(line, anchorX, cursorY);
      cursorY += lineGapSubtitle;
    }
  }

  // Draw CTA Button
  if (cfg.ctaText && cfg.ctaText.trim()) {
    cursorY += 24;
    ctx.font = `600 ${ctaPx}px ${fontFamilySans}`;
    const textMetrics = ctx.measureText(cfg.ctaText.trim());
    const btnW = Math.min(contentWidth, textMetrics.width + ctaPx * 2.8);
    const btnX =
      cfg.textAlign === 'left'
        ? padX
        : cfg.textAlign === 'right'
        ? width - padX - btnW
        : (width - btnW) / 2;

    ctx.fillStyle = cfg.accentColor;
    ctx.fillRect(btnX, cursorY - ctaPx, btnW, ctaBoxHeight);

    ctx.fillStyle = '#14201D';
    ctx.textAlign = 'center';
    ctx.fillText(
      cfg.ctaText.trim(),
      btnX + btnW / 2,
      cursorY - ctaPx + ctaBoxHeight * 0.64
    );
  }

  const mimeType = formatType === 'jpg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.94);
  const link = document.createElement('a');
  const slug = campaign.productName
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-|-$/g, '');
  link.download = `forma-atelier-${slug || 'campaign'}-${campaign.format.replace(':', 'x')}.${formatType}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
