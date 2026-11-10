import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Eye,
  ImagePlus,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import {
  AdFormatId,
  CampaignProject,
  CopyToneId,
  InterfaceLanguage,
  TextLayerConfig,
  VisualStyleId,
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { AD_FORMATS } from '../utils/campaignLogic';
import { VISUAL_STYLES } from '../data/sampleData';
import { StudioCanvasPreview } from './StudioCanvasPreview';
import { exportCampaignCanvas } from '../utils/canvasExport';

interface AdEditorViewProps {
  lang: InterfaceLanguage;
  campaign: CampaignProject;
  defaultShowSafeAreas: boolean;
  defaultBackdrop: 'light' | 'dark';
  isBusyArgon: boolean;
  isBusyImage: boolean;
  onUpdateCampaign: (updated: CampaignProject) => void;
  onSaveCampaign: () => void;
  onDuplicateCampaign: () => void;
  onRegenerateBackground: () => void;
  onRefreshCopyWithArgon: () => void;
}

export const AdEditorView: React.FC<AdEditorViewProps> = ({
  lang,
  campaign,
  defaultShowSafeAreas,
  defaultBackdrop,
  isBusyArgon,
  isBusyImage,
  onUpdateCampaign,
  onSaveCampaign,
  onDuplicateCampaign,
  onRegenerateBackground,
  onRefreshCopyWithArgon,
}) => {
  const t = TRANSLATIONS[lang];
  const fileReplaceRef = useRef<HTMLInputElement>(null);

  const [showSafeAreas, setShowSafeAreas] = useState(defaultShowSafeAreas);
  const [studioRoomBackdrop, setStudioRoomBackdrop] = useState<'light' | 'dark'>(
    defaultBackdrop
  );
  const [activeTab, setActiveTab] = useState<
    'copy' | 'layout' | 'palette' | 'argon'
  >('copy');
  const [copiedToast, setCopiedToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const cfg = campaign.editorConfig;
  const activeVariant = campaign.copyVariants[campaign.activeTone];

  const updateEditorConfig = (patch: Partial<TextLayerConfig>) => {
    onUpdateCampaign({
      ...campaign,
      updatedAt: new Date().toISOString(),
      editorConfig: {
        ...campaign.editorConfig,
        ...patch,
      },
    });
  };

  const handleToneSwitch = (tone: CopyToneId) => {
    const variant = campaign.copyVariants[tone];
    onUpdateCampaign({
      ...campaign,
      activeTone: tone,
      updatedAt: new Date().toISOString(),
      editorConfig: {
        ...campaign.editorConfig,
        headlineText: variant.headline,
        subtitleText: variant.shortDescription,
        ctaText: variant.callToAction,
      },
    });
  };

  const handleFormatSwitch = (format: AdFormatId) => {
    onUpdateCampaign({
      ...campaign,
      format,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const nextImages = [...campaign.productImages, reader.result];
        onUpdateCampaign({
          ...campaign,
          productImages: nextImages,
          activeProductImageIndex: nextImages.length - 1,
          generatedSceneImageUrl: undefined,
          imageGenerationStatus: 'preserved_composite',
          updatedAt: new Date().toISOString(),
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPlatformText = async () => {
    const textToCopy = `${
      cfg.useAlternateHeadline ? activeVariant.alternateHeadline : cfg.headlineText
    }\n\n${activeVariant.platformCopy}\n\n${cfg.ctaText}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleTriggerSave = () => {
    onSaveCampaign();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Transparent Gemini 4 Argon / Image Model Access Notice if unavailable */}
      {(campaign.argonStatus === 'setup_required' ||
        campaign.imageGenerationStatus === 'unavailable') && (
        <div
          role="status"
          className="p-4 bg-[#EFEAE0] border border-[#8C7044] text-[#14201D] flex flex-wrap items-center justify-between gap-4 text-xs"
        >
          <div className="flex items-start gap-3 max-w-3xl">
            <AlertCircle className="w-4 h-4 text-[#8C7044] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[#14201D]">
                {t.argonAccessNoticeTitle}
              </p>
              <p className="text-[#5A6561] leading-relaxed">
                {campaign.argonStatusMessage ||
                  campaign.imageStatusMessage ||
                  'Gemini 4 Argon (gemini-4-argon) or live image generation requires a billing-enabled API key in Settings > Secrets. Your uploaded product photo and factual studio copy remain fully editable below.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isBusyArgon}
            onClick={onRefreshCopyWithArgon}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#233630] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isBusyArgon ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{t.retryArgonBtn}</span>
          </button>
        </div>
      )}

      {/* Top Studio Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#14201D]/15">
        <div>
          <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#8C7044] block">
            {campaign.productName} · {campaign.targetMarket}
          </span>
          <h1 className="text-2xl font-serif-editorial font-semibold text-[#14201D]">
            {t.editorTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleTriggerSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#14201D]/25 bg-[#FAF7F0] text-xs font-medium text-[#14201D] hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {savedToast ? (
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{savedToast ? t.savedConfirmation : t.saveCampaignBtn}</span>
          </button>

          <button
            type="button"
            onClick={onDuplicateCampaign}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#14201D]/25 bg-[#FAF7F0] text-xs font-medium text-[#14201D] hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t.duplicateCampaignBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPlatformText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#14201D]/25 bg-[#FAF7F0] text-xs font-medium text-[#14201D] hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedToast ? (
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedToast ? t.copiedConfirmation : t.copyAdTextBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => exportCampaignCanvas(campaign, 'png')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B39464]" />
            <span>{t.exportPngBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => exportCampaignCanvas(campaign, 'jpg')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B39464] text-[#14201D] text-xs font-semibold hover:bg-[#c4a574] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportJpgBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Split Studio Workspace: Canvas Stage (Left 7 cols) + Inspector (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Large Design Preview & Format Bar */}
        <div className="lg:col-span-7 space-y-4">
          {/* Format Switcher + Safe Area Toggle + Light/Dark Backdrop Switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAF7F0] border border-[#14201D]/15">
            <div className="flex items-center gap-1">
              {(['4:5', '9:16', '1:1', '16:9'] as AdFormatId[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleFormatSwitch(fmt)}
                  className={`px-3 py-1.5 text-xs font-mono-tabular font-medium transition-colors cursor-pointer ${
                    campaign.format === fmt
                      ? 'bg-[#14201D] text-[#F5F1E8]'
                      : 'text-[#14201D] hover:bg-[#EFEAE0]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSafeAreas((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  showSafeAreas
                    ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                    : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.safeAreaToggle}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setStudioRoomBackdrop((prev) =>
                    prev === 'light' ? 'dark' : 'light'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#14201D]/20 bg-[#F5F1E8] text-[#14201D] hover:border-[#14201D] transition-colors cursor-pointer"
              >
                {studioRoomBackdrop === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>{t.backdropDark}</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#B39464]" />
                    <span>{t.backdropLight}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Canvas Preview Stage on Light or Dark Room Backdrop */}
          <div
            data-testid="editor-backdrop-stage"
            className={`p-6 sm:p-10 border transition-colors flex flex-col items-center justify-center min-h-[540px] ${
              studioRoomBackdrop === 'dark'
                ? 'bg-[#0E1614] border-[#14201D] text-[#F5F1E8]'
                : 'bg-[#EBE5D8] border-[#14201D]/15 text-[#14201D]'
            }`}
          >
            <div
              className={`w-full mx-auto transition-all ${
                campaign.format === '9:16'
                  ? 'max-w-[330px]'
                  : campaign.format === '4:5'
                  ? 'max-w-[420px]'
                  : campaign.format === '1:1'
                  ? 'max-w-[460px]'
                  : 'max-w-[620px]'
              }`}
            >
              <StudioCanvasPreview
                campaign={campaign}
                showSafeAreas={showSafeAreas}
                interfaceLanguage={lang}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between w-full text-[11px] font-mono-tabular opacity-75 pt-3 border-t border-current/10">
              <span>
                {AD_FORMATS[campaign.format].label[lang]} ·{' '}
                {AD_FORMATS[campaign.format].widthPx}×
                {AD_FORMATS[campaign.format].heightPx}px
              </span>
              <span>
                {campaign.preserveProductPhoto
                  ? t.preservePhotoBadge
                  : campaign.styleId}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Organized Editing Tools & Inspector */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#14201D]/15 p-5 sm:p-6 space-y-6">
          {/* Inspector Section Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#EFEAE0] border border-[#14201D]/10">
            {(
              [
                { id: 'copy', label: t.copyVariantsTab },
                { id: 'layout', label: t.typographyLayoutTab },
                { id: 'palette', label: t.backdropPaletteTab },
                { id: 'argon', label: t.argonReasoningTab },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1.5 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#14201D] text-[#F5F1E8]'
                    : 'text-[#14201D] hover:bg-[#E2DBCD]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: COPY & TONES */}
          {activeTab === 'copy' && (
            <div className="space-y-5">
              {/* 3 Tone Selector (Refined, Friendly, Bold) */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#5A6561]">
                  {t.defaultToneInput}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'refined', label: t.toneRefined },
                      { id: 'friendly', label: t.toneFriendly },
                      { id: 'bold', label: t.toneBold },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToneSwitch(item.id)}
                      className={`py-2 px-3 text-xs font-semibold border transition-colors cursor-pointer ${
                        campaign.activeTone === item.id
                          ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                          : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20 hover:border-[#14201D]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline Input & Alternate Headline Switch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="editor-headline-input"
                    className="text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                  >
                    {t.headlineInputLabel}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#8C7044] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfg.useAlternateHeadline}
                      onChange={(e) =>
                        updateEditorConfig({
                          useAlternateHeadline: e.target.checked,
                        })
                      }
                      className="accent-[#14201D]"
                    />
                    <span>{t.useAlternateHeadlineToggle}</span>
                  </label>
                </div>
                <textarea
                  id="editor-headline-input"
                  rows={2}
                  value={
                    cfg.useAlternateHeadline
                      ? activeVariant.alternateHeadline
                      : cfg.headlineText
                  }
                  onChange={(e) => {
                    if (cfg.useAlternateHeadline) {
                      onUpdateCampaign({
                        ...campaign,
                        copyVariants: {
                          ...campaign.copyVariants,
                          [campaign.activeTone]: {
                            ...activeVariant,
                            alternateHeadline: e.target.value,
                          },
                        },
                      });
                    } else {
                      updateEditorConfig({ headlineText: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
                />
              </div>

              {/* Subtitle / Short Description Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editor-subtitle-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                >
                  {t.subtitleInputLabel}
                </label>
                <textarea
                  id="editor-subtitle-input"
                  rows={2}
                  value={cfg.subtitleText}
                  onChange={(e) =>
                    updateEditorConfig({ subtitleText: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D] focus:outline-none focus:border-[#14201D]"
                />
              </div>

              {/* Call to Action & Price Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="editor-cta-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                  >
                    {t.ctaInputLabel}
                  </label>
                  <input
                    id="editor-cta-input"
                    type="text"
                    value={cfg.ctaText}
                    onChange={(e) =>
                      updateEditorConfig({ ctaText: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D] focus:outline-none focus:border-[#14201D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="editor-price-input"
                      className="text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                    >
                      {t.priceBadgeInputLabel}
                    </label>
                    <input
                      type="checkbox"
                      aria-label={t.showPriceBadgeToggle}
                      checked={cfg.showPriceBadge}
                      onChange={(e) =>
                        updateEditorConfig({ showPriceBadge: e.target.checked })
                      }
                      className="accent-[#14201D]"
                    />
                  </div>
                  <input
                    id="editor-price-input"
                    type="text"
                    value={cfg.priceBadgeText}
                    onChange={(e) =>
                      updateEditorConfig({ priceBadgeText: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs font-mono-tabular text-[#14201D] focus:outline-none focus:border-[#14201D]"
                  />
                </div>
              </div>

              {/* Platform-Ready Social Caption */}
              <div className="space-y-1.5 pt-2 border-t border-[#14201D]/10">
                <label
                  htmlFor="editor-platform-copy"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#5A6561]"
                >
                  Platform Caption ({campaign.adLanguage.toUpperCase()})
                </label>
                <textarea
                  id="editor-platform-copy"
                  rows={3}
                  value={activeVariant.platformCopy}
                  onChange={(e) =>
                    onUpdateCampaign({
                      ...campaign,
                      copyVariants: {
                        ...campaign.copyVariants,
                        [campaign.activeTone]: {
                          ...activeVariant,
                          platformCopy: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D] leading-relaxed focus:outline-none focus:border-[#14201D]"
                />
                <p className="text-[11px] text-[#5A6561]">
                  {activeVariant.culturalAdaptationNote}
                </p>
              </div>

              <button
                type="button"
                disabled={isBusyArgon}
                onClick={onRefreshCopyWithArgon}
                className="w-full py-2.5 px-4 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isBusyArgon ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#B39464]" />
                )}
                <span>{t.refreshCopyWithArgonBtn}</span>
              </button>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY LAYOUT & CROP */}
          {activeTab === 'layout' && (
            <div className="space-y-5">
              {/* Font Size Scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-[#14201D]">
                  <label htmlFor="font-scale-slider">{t.fontSizeScaleLabel}</label>
                  <span className="font-mono-tabular">
                    {Math.round(cfg.fontSizeScale * 100)}%
                  </span>
                </div>
                <input
                  id="font-scale-slider"
                  type="range"
                  min={0.75}
                  max={1.35}
                  step={0.05}
                  value={cfg.fontSizeScale}
                  onChange={(e) =>
                    updateEditorConfig({ fontSizeScale: Number(e.target.value) })
                  }
                  className="w-full accent-[#14201D] cursor-pointer"
                />
              </div>

              {/* Alignment & Vertical Anchor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-[#14201D]">
                    {t.textAlignLabel}
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => updateEditorConfig({ textAlign: align })}
                        className={`py-1.5 text-xs font-mono-tabular uppercase border cursor-pointer ${
                          cfg.textAlign === align
                            ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                            : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-[#14201D]">
                    {t.verticalPositionLabel}
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() =>
                          updateEditorConfig({ verticalPosition: pos })
                        }
                        className={`py-1.5 text-xs font-mono-tabular uppercase border cursor-pointer ${
                          cfg.verticalPosition === pos
                            ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                            : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Scale & Crop Zoom */}
              <div className="space-y-4 pt-3 border-t border-[#14201D]/10">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-[#14201D]">
                    <label htmlFor="product-scale-slider">
                      {t.productScaleLabel}
                    </label>
                    <span className="font-mono-tabular">
                      {Math.round(cfg.productScale * 100)}%
                    </span>
                  </div>
                  <input
                    id="product-scale-slider"
                    type="range"
                    min={0.7}
                    max={1.35}
                    step={0.05}
                    value={cfg.productScale}
                    onChange={(e) =>
                      updateEditorConfig({ productScale: Number(e.target.value) })
                    }
                    className="w-full accent-[#14201D] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-[#14201D]">
                    <label htmlFor="crop-zoom-slider">{t.cropZoomLabel}</label>
                    <span className="font-mono-tabular">
                      {cfg.cropZoom.toFixed(2)}×
                    </span>
                  </div>
                  <input
                    id="crop-zoom-slider"
                    type="range"
                    min={1}
                    max={1.5}
                    step={0.05}
                    value={cfg.cropZoom}
                    onChange={(e) =>
                      updateEditorConfig({ cropZoom: Number(e.target.value) })
                    }
                    className="w-full accent-[#14201D] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="offset-x-slider"
                      className="block text-[11px] font-mono-tabular text-[#5A6561]"
                    >
                      PAN X ({cfg.productOffsetX}%)
                    </label>
                    <input
                      id="offset-x-slider"
                      type="range"
                      min={-25}
                      max={25}
                      value={cfg.productOffsetX}
                      onChange={(e) =>
                        updateEditorConfig({
                          productOffsetX: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#14201D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="offset-y-slider"
                      className="block text-[11px] font-mono-tabular text-[#5A6561]"
                    >
                      PAN Y ({cfg.productOffsetY}%)
                    </label>
                    <input
                      id="offset-y-slider"
                      type="range"
                      min={-25}
                      max={25}
                      value={cfg.productOffsetY}
                      onChange={(e) =>
                        updateEditorConfig({
                          productOffsetY: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#14201D]"
                    />
                  </div>
                </div>
              </div>

              {/* Frame Border & Replace Product Image */}
              <div className="pt-3 border-t border-[#14201D]/10 space-y-3">
                <label className="flex items-center justify-between text-xs font-medium text-[#14201D] cursor-pointer">
                  <span>{t.frameBorderToggle}</span>
                  <input
                    type="checkbox"
                    checked={cfg.frameBorder}
                    onChange={(e) =>
                      updateEditorConfig({ frameBorder: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#14201D]"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => fileReplaceRef.current?.click()}
                  className="w-full py-2.5 px-4 border border-[#14201D]/30 bg-[#F5F1E8] text-xs font-medium text-[#14201D] hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>{t.replaceProductImageBtn}</span>
                </button>
                <input
                  ref={fileReplaceRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReplaceImage}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PALETTE & SCENE BACKDROP */}
          {activeTab === 'palette' && (
            <div className="space-y-5">
              {/* Visual Style Switcher */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editor-style-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                >
                  {t.styleGalleryTitle}
                </label>
                <select
                  id="editor-style-select"
                  value={campaign.styleId}
                  onChange={(e) => {
                    const nextStyle = VISUAL_STYLES.find(
                      (s) => s.id === (e.target.value as VisualStyleId)
                    );
                    if (!nextStyle) return;
                    onUpdateCampaign({
                      ...campaign,
                      styleId: nextStyle.id,
                      palette: [...nextStyle.defaultPalette] as [
                        string,
                        string,
                        string,
                      ],
                      editorConfig: {
                        ...cfg,
                        backgroundTint: nextStyle.defaultPalette[0],
                        textColor: nextStyle.defaultPalette[1],
                        accentColor: nextStyle.defaultPalette[2],
                      },
                    });
                  }}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
                >
                  {VISUAL_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name[lang]} — {s.movement[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Swatches */}
              <div className="grid grid-cols-3 gap-3">
                <label className="p-2.5 bg-[#F5F1E8] border border-[#14201D]/20 text-xs space-y-1 cursor-pointer">
                  <span className="block text-[10px] font-mono-tabular text-[#5A6561]">
                    BACKDROP
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cfg.backgroundTint}
                      onChange={(e) =>
                        updateEditorConfig({ backgroundTint: e.target.value })
                      }
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono-tabular text-[11px]">
                      {cfg.backgroundTint}
                    </span>
                  </div>
                </label>

                <label className="p-2.5 bg-[#F5F1E8] border border-[#14201D]/20 text-xs space-y-1 cursor-pointer">
                  <span className="block text-[10px] font-mono-tabular text-[#5A6561]">
                    TEXT
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cfg.textColor}
                      onChange={(e) =>
                        updateEditorConfig({ textColor: e.target.value })
                      }
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono-tabular text-[11px]">
                      {cfg.textColor}
                    </span>
                  </div>
                </label>

                <label className="p-2.5 bg-[#F5F1E8] border border-[#14201D]/20 text-xs space-y-1 cursor-pointer">
                  <span className="block text-[10px] font-mono-tabular text-[#5A6561]">
                    ACCENT
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cfg.accentColor}
                      onChange={(e) =>
                        updateEditorConfig({ accentColor: e.target.value })
                      }
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono-tabular text-[11px]">
                      {cfg.accentColor}
                    </span>
                  </div>
                </label>
              </div>

              {/* Scrim Contrast Opacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-[#14201D]">
                  <label htmlFor="scrim-opacity-slider">
                    {t.scrimOpacityLabel}
                  </label>
                  <span className="font-mono-tabular">
                    {Math.round(cfg.scrimOpacity * 100)}%
                  </span>
                </div>
                <input
                  id="scrim-opacity-slider"
                  type="range"
                  min={0.15}
                  max={0.85}
                  step={0.05}
                  value={cfg.scrimOpacity}
                  onChange={(e) =>
                    updateEditorConfig({ scrimOpacity: Number(e.target.value) })
                  }
                  className="w-full accent-[#14201D] cursor-pointer"
                />
              </div>

              {/* Regenerate Background Only via Image Model */}
              <div className="pt-3 border-t border-[#14201D]/10 space-y-2">
                <button
                  type="button"
                  disabled={isBusyImage}
                  onClick={onRegenerateBackground}
                  className="w-full py-2.5 px-4 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isBusyImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-[#B39464]" />
                  )}
                  <span>{t.regenerateBackgroundBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: GEMINI 4 ARGON CREATIVE DIRECTION & IMAGE PROMPT */}
          {activeTab === 'argon' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#EFEAE0] border border-[#14201D]/15 space-y-1">
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#8C7044] block">
                  CONFIGURED REASONING MODEL
                </span>
                <p className="font-mono-tabular font-semibold text-[#14201D]">
                  {campaign.argonModelUsed} ({campaign.argonStatus})
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="block font-semibold uppercase tracking-wider text-[#14201D]">
                  Creative Direction (Argon)
                </span>
                <p className="p-3 bg-[#F5F1E8] border border-[#14201D]/15 text-[#14201D]/90 leading-relaxed">
                  {campaign.argonCreativeDirection}
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="argon-image-prompt-textarea"
                  className="block font-semibold uppercase tracking-wider text-[#14201D]"
                >
                  Image Generation Prompt (Editable)
                </label>
                <textarea
                  id="argon-image-prompt-textarea"
                  rows={4}
                  value={campaign.argonImagePrompt}
                  onChange={(e) =>
                    onUpdateCampaign({
                      ...campaign,
                      argonImagePrompt: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[#F5F1E8] border border-[#14201D]/20 text-xs text-[#14201D] leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
