import React, { useState } from 'react';
import { CampaignProject, InterfaceLanguage } from '../types/studio';
import { AD_FORMATS } from '../utils/campaignLogic';
import { VISUAL_STYLES } from '../data/sampleData';

interface StudioCanvasPreviewProps {
  campaign: CampaignProject;
  showSafeAreas?: boolean;
  compact?: boolean;
  interfaceLanguage: InterfaceLanguage;
}

export const StudioCanvasPreview: React.FC<StudioCanvasPreviewProps> = ({
  campaign,
  showSafeAreas = false,
  compact = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const formatSpec = AD_FORMATS[campaign.format] || AD_FORMATS['4:5'];
  const cfg = campaign.editorConfig;
  const activeCopy = campaign.copyVariants[campaign.activeTone];
  const styleDef =
    VISUAL_STYLES.find((s) => s.id === campaign.styleId) || VISUAL_STYLES[0];

  const isAdRtl = campaign.adLanguage === 'ar';
  const activeImageSrc =
    campaign.generatedSceneImageUrl ||
    campaign.productImages[campaign.activeProductImageIndex] ||
    campaign.productImages[0];

  const displayHeadline = cfg.useAlternateHeadline
    ? activeCopy?.alternateHeadline || cfg.headlineText
    : cfg.headlineText;

  const scrimGradient =
    cfg.verticalPosition === 'top'
      ? `linear-gradient(180deg, rgba(14,23,21,${cfg.scrimOpacity}) 0%, rgba(14,23,21,${
          cfg.scrimOpacity * 0.35
        }) 60%, rgba(14,23,21,0.12) 100%)`
      : cfg.verticalPosition === 'center'
      ? `linear-gradient(180deg, rgba(14,23,21,${
          cfg.scrimOpacity * 0.4
        }) 0%, rgba(14,23,21,${cfg.scrimOpacity}) 50%, rgba(14,23,21,${
          cfg.scrimOpacity * 0.4
        }) 100%)`
      : `linear-gradient(180deg, rgba(14,23,21,0.12) 0%, rgba(14,23,21,${
          cfg.scrimOpacity * 0.38
        }) 45%, rgba(14,23,21,${cfg.scrimOpacity}) 100%)`;

  const justifyContentClass =
    cfg.verticalPosition === 'top'
      ? 'justify-start'
      : cfg.verticalPosition === 'center'
      ? 'justify-center'
      : 'justify-end';

  const textAlignClass =
    cfg.textAlign === 'left'
      ? 'text-left items-start'
      : cfg.textAlign === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  return (
    <div
      dir={isAdRtl ? 'rtl' : 'ltr'}
      data-testid="studio-canvas-preview"
      className="relative w-full overflow-hidden select-none shadow-sm border border-[#14201D]/15"
      style={{
        aspectRatio: formatSpec.aspectRatioCss,
        backgroundColor: cfg.backgroundTint || campaign.palette[0] || '#14201D',
        backgroundImage: styleDef.previewGradient,
      }}
    >
      {/* Ambient studio lighting aura based on style intensity */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: (campaign.styleIntensity || 75) / 100,
          background: `radial-gradient(circle at 50% 38%, ${cfg.accentColor}38 0%, transparent 72%)`,
        }}
      />

      {/* Product / Generated Scene Image Layer */}
      {activeImageSrc && !imgError ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img
            src={activeImageSrc}
            alt={campaign.productName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-150"
            style={{
              transform: `scale(${
                (cfg.cropZoom || 1) * (cfg.productScale || 1)
              }) translate(${cfg.productOffsetX || 0}%, ${
                cfg.productOffsetY || 0
              }%)`,
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#14201D] via-[#1F312C] to-[#2C3E35] text-[#F5F1E8]">
          <div className="w-14 h-14 border border-[#B39464]/50 flex items-center justify-center mb-3 font-serif-editorial text-xl text-[#B39464]">
            FA
          </div>
          <p className="text-sm font-medium tracking-wide">
            {campaign.productName}
          </p>
        </div>
      )}

      {/* Measured Scrim Overlay for guaranteed WCAG contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: scrimGradient }}
      />

      {/* Optional Editorial Keyline Frame */}
      {cfg.frameBorder && (
        <div
          className="absolute pointer-events-none border"
          style={{
            inset: compact ? '10px' : '18px',
            borderColor: `${cfg.accentColor}75`,
          }}
        />
      )}

      {/* Platform Safe-Area Guides Overlay */}
      {showSafeAreas && !compact && (
        <div
          data-testid="safe-area-overlay"
          className="absolute pointer-events-none border border-dashed border-[#B39464] bg-[#B39464]/5 z-20 flex flex-col justify-between p-2"
          style={{
            top: `${formatSpec.safeMarginTopPct}%`,
            bottom: `${formatSpec.safeMarginBottomPct}%`,
            left: `${formatSpec.safeMarginSidePct}%`,
            right: `${formatSpec.safeMarginSidePct}%`,
          }}
        >
          <div className="flex items-center justify-between text-[10px] font-mono-tabular uppercase tracking-wider text-[#F5F1E8] bg-[#14201D]/80 px-2 py-0.5 self-start">
            <span>
              SAFE ZONE · {campaign.format} ({formatSpec.widthPx}×
              {formatSpec.heightPx})
            </span>
          </div>
          <div className="text-[10px] font-mono-tabular text-[#F5F1E8] bg-[#14201D]/80 px-2 py-0.5 self-end">
            {formatSpec.platformHint.en}
          </div>
        </div>
      )}

      {/* Editable Typography Overlay Container */}
      <div
        className={`relative z-10 w-full h-full flex flex-col ${justifyContentClass} ${textAlignClass}`}
        style={{
          paddingTop: `${formatSpec.safeMarginTopPct}%`,
          paddingBottom: `${formatSpec.safeMarginBottomPct}%`,
          paddingLeft: `${formatSpec.safeMarginSidePct}%`,
          paddingRight: `${formatSpec.safeMarginSidePct}%`,
        }}
      >
        {/* Top Price / Edition Tag pinned to top corner of safe area */}
        {cfg.showPriceBadge && cfg.priceBadgeText && (
          <div
            style={{
              unicodeBidi: 'plaintext',
              color: cfg.textColor,
              borderColor: `${cfg.accentColor}99`,
              backgroundColor: 'rgba(20, 32, 29, 0.78)',
              top: `${formatSpec.safeMarginTopPct}%`,
            }}
            className={`absolute ${
              cfg.textAlign === 'right' ? 'right-[7%]' : 'left-[7%]'
            } ${
              compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
            } font-mono-tabular tracking-wider rtl:tracking-normal uppercase border backdrop-blur-xs`}
          >
            {cfg.priceBadgeText}
          </div>
        )}

        {/* Editorial Text Block with measured contrast backing */}
        <div
          className={`w-full flex flex-col ${textAlignClass} ${
            compact ? 'p-2.5' : 'p-4 sm:p-5'
          } transition-colors`}
          style={{
            backgroundColor: `rgba(20, 32, 29, ${Math.min(
              0.82,
              (cfg.scrimOpacity || 0.6) * 0.85
            )})`,
            backdropFilter: 'blur(3px)',
            borderTop: `1px solid ${cfg.accentColor}55`,
          }}
        >
          {/* Headline Layer */}
          <h3
            className={`font-serif-editorial font-semibold leading-[1.16] tracking-tight break-words ${
              compact
                ? 'text-sm sm:text-base mb-1'
                : 'text-xl sm:text-2xl mb-2.5'
            }`}
            style={{
              color: cfg.textColor,
              unicodeBidi: 'plaintext',
              fontSize: compact
                ? undefined
                : `calc(1.5rem * ${cfg.fontSizeScale || 1})`,
              textWrap: 'balance',
            }}
          >
            {displayHeadline}
          </h3>

          {/* Supporting Deck / Subtitle Layer */}
          {cfg.subtitleText && (
            <p
              className={`leading-relaxed max-w-[96%] ${
                compact
                  ? 'text-[10px] line-clamp-2 mb-2'
                  : 'text-xs sm:text-sm mb-4'
              }`}
              style={{
                color: `${cfg.textColor}EE`,
                unicodeBidi: 'plaintext',
                fontSize: compact
                  ? undefined
                  : `calc(0.84rem * ${cfg.fontSizeScale || 1})`,
              }}
            >
              {cfg.subtitleText}
            </p>
          )}

          {/* Call to Action Layer */}
          {cfg.ctaText && (
            <div
              className={`inline-flex items-center justify-center font-semibold tracking-wide rtl:tracking-normal transition-transform ${
                compact
                  ? 'px-2.5 py-1 text-[10px]'
                  : 'px-5 py-2 text-xs sm:text-sm'
              }`}
              style={{
                backgroundColor: cfg.accentColor,
                color: '#14201D',
                unicodeBidi: 'plaintext',
              }}
            >
              {cfg.ctaText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
