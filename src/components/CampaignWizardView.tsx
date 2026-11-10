import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AdFormatId,
  ArabicDialect,
  BrandProfile,
  CampaignGoalId,
  CampaignProject,
  CopyToneId,
  InterfaceLanguage,
  SavedProduct,
  VisualStyleId,
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { VISUAL_STYLES } from '../data/sampleData';
import {
  AD_FORMATS,
  checkMissingPromotionClaim,
  validateCampaignStep,
} from '../utils/campaignLogic';

export interface WizardDraftState {
  brandProfileId: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  verifiedFeatures: string[];
  productImages: string[];
  activeProductImageIndex: number;
  preserveProductPhoto: boolean;
  targetAudience: string;
  targetMarket: string;
  adLanguage: InterfaceLanguage;
  arabicDialect: ArabicDialect;
  format: AdFormatId;
  goal: CampaignGoalId;
  styleId: VisualStyleId;
  styleIntensity: number;
  palette: [string, string, string];
  defaultTone: CopyToneId;
  desiredCta: string;
  wordsToInclude: string;
  wordsToAvoid: string;
}

interface CampaignWizardViewProps {
  lang: InterfaceLanguage;
  draft: WizardDraftState;
  step: number;
  brands: BrandProfile[];
  products: SavedProduct[];
  isGenerating: boolean;
  onUpdateDraft: (patch: Partial<WizardDraftState>) => void;
  onChangeStep: (newStep: number) => void;
  onGenerateCampaign: () => void;
}

export const CampaignWizardView: React.FC<CampaignWizardViewProps> = ({
  lang,
  draft,
  step,
  brands,
  products,
  isGenerating,
  onUpdateDraft,
  onChangeStep,
  onGenerateCampaign,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [validationError, setValidationError] = useState(false);

  const steps = [
    { num: 1, label: t.wizardStep1 },
    { num: 2, label: t.wizardStep2 },
    { num: 3, label: t.wizardStep3 },
    { num: 4, label: t.wizardStep4 },
  ];

  const handleNext = () => {
    const check = validateCampaignStep(step, draft as Partial<CampaignProject>);
    if (!check.valid) {
      setValidationError(true);
      return;
    }
    setValidationError(false);
    onChangeStep(Math.min(4, step + 1));
  };

  const handleBack = () => {
    setValidationError(false);
    onChangeStep(Math.max(1, step - 1));
  };

  const handleApplyBrand = (brandId: string) => {
    const found = brands.find((b) => b.id === brandId);
    if (!found) {
      onUpdateDraft({ brandProfileId: '' });
      return;
    }
    onUpdateDraft({
      brandProfileId: found.id,
      palette: [found.primaryColor, found.secondaryColor, found.accentColor],
      defaultTone: found.defaultTone,
      targetMarket: found.defaultMarket,
      adLanguage: found.defaultLanguage,
    });
  };

  const handleSelectProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    onUpdateDraft({
      productName: prod.name,
      productDescription: prod.description,
      productPrice: prod.price,
      verifiedFeatures: [...prod.verifiedFeatures],
      productImages: [prod.imageUrl],
      activeProductImageIndex: 0,
    });
    setValidationError(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateDraft({
            productImages: [...draft.productImages, reader.result],
            activeProductImageIndex: draft.productImages.length,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    onUpdateDraft({
      verifiedFeatures: [...draft.verifiedFeatures, newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    onUpdateDraft({
      verifiedFeatures: draft.verifiedFeatures.filter((_, i) => i !== idx),
    });
  };

  const handleSelectStyle = (styleId: VisualStyleId) => {
    const styleObj = VISUAL_STYLES.find((s) => s.id === styleId);
    if (!styleObj) return;
    onUpdateDraft({
      styleId,
      styleIntensity: styleObj.defaultIntensity,
      palette: [...styleObj.defaultPalette] as [string, string, string],
    });
  };

  const showPromoWarning = checkMissingPromotionClaim(
    draft.goal,
    draft.verifiedFeatures,
    draft.wordsToInclude
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header & Progress Bar */}
      <div className="space-y-6 border-b border-[#14201D]/15 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-serif-editorial font-semibold text-[#14201D]">
            {t.wizardTitle}
          </h1>
          <span className="text-xs font-mono-tabular text-[#8C7044] uppercase tracking-widest">
            MODEL: GEMINI-4-ARGON · STEP 0{step} / 04
          </span>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((s) => {
            const isActive = s.num === step;
            const isDone = s.num < step;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < step) {
                    setValidationError(false);
                    onChangeStep(s.num);
                  } else if (s.num > step) {
                    const check = validateCampaignStep(
                      step,
                      draft as Partial<CampaignProject>
                    );
                    if (check.valid) {
                      setValidationError(false);
                      onChangeStep(s.num);
                    } else {
                      setValidationError(true);
                    }
                  }
                }}
                className={`text-left rtl:text-right px-4 py-3 border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                    : isDone
                    ? 'bg-[#EFEAE0] text-[#14201D] border-[#14201D]/30'
                    : 'bg-[#FAF7F0] text-[#5A6561] border-[#14201D]/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="truncate">{s.label}</span>
                  {isDone && <Check className="w-3.5 h-3.5 text-[#8C7044] shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {validationError && (
        <div
          role="alert"
          className="p-4 bg-[#9A3412]/10 border border-[#9A3412] text-[#9A3412] text-xs font-medium flex items-center gap-3"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{t.validationErrorBanner}</span>
        </div>
      )}

      {/* STEP 1: PRODUCT DETAILS & PRESERVE PRODUCT PHOTO */}
      {step === 1 && (
        <div className="space-y-8 bg-[#FAF7F0] border border-[#14201D]/15 p-6 sm:p-8">
          {/* Quick Loaders: Brand Profile & Saved Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#14201D]/10">
            <div className="space-y-2">
              <label
                htmlFor="wizard-brand-select"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5A6561]"
              >
                {t.applyBrandProfileLabel}
              </label>
              <select
                id="wizard-brand-select"
                value={draft.brandProfileId}
                onChange={(e) => handleApplyBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              >
                <option value="">—</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.defaultMarket})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="wizard-product-select"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5A6561]"
              >
                {t.selectSavedProductLabel}
              </label>
              <select
                id="wizard-product-select"
                value=""
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              >
                <option value="">—</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Images & Preserve Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]">
                {t.uploadProductPhotosLabel} *
              </label>

              <div className="grid grid-cols-3 gap-3">
                {draft.productImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => onUpdateDraft({ activeProductImageIndex: idx })}
                    className={`relative aspect-square overflow-hidden border cursor-pointer ${
                      draft.activeProductImageIndex === idx
                        ? 'border-2 border-[#14201D] ring-2 ring-[#B39464]/50'
                        : 'border-[#14201D]/20 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Product ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {draft.productImages.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove product photo ${idx + 1}`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          const next = draft.productImages.filter((_, i) => i !== idx);
                          onUpdateDraft({
                            productImages: next,
                            activeProductImageIndex: 0,
                          });
                        }}
                        className="absolute top-1 right-1 bg-[#14201D]/85 text-[#F5F1E8] p-1 hover:bg-[#9A3412]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border border-dashed border-[#14201D]/35 bg-[#F5F1E8] hover:bg-[#EFEAE0] flex flex-col items-center justify-center p-3 text-center transition-colors cursor-pointer"
                >
                  <ImagePlus className="w-5 h-5 text-[#8C7044] mb-1.5" />
                  <span className="text-[11px] font-medium text-[#14201D]">
                    + Photo
                  </span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-xs text-[#5A6561]">{t.uploadPhotoHint}</p>

              {/* Preserve Product Photo Toggle (Default ON) */}
              <div className="p-4 bg-[#EFEAE0] border border-[#14201D]/20 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#14201D]" />
                    <label
                      htmlFor="preserve-product-toggle"
                      className="text-xs font-semibold text-[#14201D] cursor-pointer"
                    >
                      {t.preserveProductPhotoLabel}
                    </label>
                  </div>
                  <input
                    id="preserve-product-toggle"
                    type="checkbox"
                    checked={draft.preserveProductPhoto}
                    onChange={(e) =>
                      onUpdateDraft({ preserveProductPhoto: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#14201D] cursor-pointer"
                  />
                </div>
                <p className="text-xs text-[#5A6561] leading-relaxed">
                  {t.preserveProductPhotoDesc}
                </p>
              </div>
            </div>

            {/* Product Text Details & Verified Claims */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="product-name-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                  >
                    {t.productNameLabel} *
                  </label>
                  <input
                    id="product-name-input"
                    type="text"
                    value={draft.productName}
                    onChange={(e) => onUpdateDraft({ productName: e.target.value })}
                    placeholder="e.g., Maison Dorée · Le Soir Oud"
                    className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="product-price-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                  >
                    {t.productPriceLabel}
                  </label>
                  <input
                    id="product-price-input"
                    type="text"
                    value={draft.productPrice}
                    onChange={(e) => onUpdateDraft({ productPrice: e.target.value })}
                    placeholder="680 SAR / €175"
                    className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] font-mono-tabular focus:outline-none focus:border-[#14201D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="product-desc-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                >
                  {t.productDescriptionLabel} *
                </label>
                <textarea
                  id="product-desc-input"
                  rows={3}
                  value={draft.productDescription}
                  onChange={(e) =>
                    onUpdateDraft({ productDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
                />
              </div>

              {/* Verified Features List */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="new-feature-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                  >
                    {t.verifiedFeaturesLabel}
                  </label>
                  <p className="text-xs text-[#5A6561]">{t.verifiedFeaturesHint}</p>
                </div>

                <div className="flex gap-2">
                  <input
                    id="new-feature-input"
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g., 32% pure parfum oil concentration"
                    className="flex-1 px-3.5 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addFeatureBtn}</span>
                  </button>
                </div>

                <ul className="space-y-2">
                  {draft.verifiedFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-3 px-3.5 py-2 bg-[#EFEAE0] border border-[#14201D]/15 text-xs text-[#14201D]"
                    >
                      <span>
                        <strong className="font-mono-tabular mr-2">
                          0{idx + 1}.
                        </strong>
                        {feat}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove verified fact ${feat}`}
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-[#5A6561] hover:text-[#9A3412] p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AUDIENCE, MARKET, LANGUAGE/DIALECT, FORMAT & GOAL */}
      {step === 2 && (
        <div className="space-y-8 bg-[#FAF7F0] border border-[#14201D]/15 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="target-audience-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
              >
                {t.targetAudienceLabel} *
              </label>
              <input
                id="target-audience-input"
                type="text"
                value={draft.targetAudience}
                onChange={(e) => onUpdateDraft({ targetAudience: e.target.value })}
                placeholder="e.g., Fine fragrance collectors and design patrons"
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="target-market-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
              >
                {t.targetMarketLabel} *
              </label>
              <input
                id="target-market-input"
                type="text"
                value={draft.targetMarket}
                onChange={(e) => onUpdateDraft({ targetMarket: e.target.value })}
                placeholder="e.g., Riyadh & Dubai / Paris / London"
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              />
            </div>
          </div>

          {/* Ad Language & Optional Arabic Dialect */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#14201D]/10">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]">
                {t.adLanguageLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'ar', label: 'العربية (Arabic)' },
                    { id: 'fr', label: 'Français (French)' },
                    { id: 'en', label: 'English' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateDraft({ adLanguage: item.id })}
                    className={`py-2.5 px-3 text-xs font-medium border transition-colors cursor-pointer ${
                      draft.adLanguage === item.id
                        ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                        : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20 hover:border-[#14201D]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {draft.adLanguage === 'ar' && (
              <div className="space-y-2">
                <label
                  htmlFor="arabic-dialect-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
                >
                  {t.arabicDialectLabel}
                </label>
                <select
                  id="arabic-dialect-select"
                  value={draft.arabicDialect}
                  onChange={(e) =>
                    onUpdateDraft({
                      arabicDialect: e.target.value as ArabicDialect,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
                >
                  <option value="msa">{t.dialectMsa}</option>
                  <option value="gulf">{t.dialectGulf}</option>
                  <option value="levantine">{t.dialectLevantine}</option>
                  <option value="egyptian">{t.dialectEgyptian}</option>
                  <option value="maghrebi">{t.dialectMaghrebi}</option>
                </select>
              </div>
            )}
          </div>

          {/* Platform Format Selector */}
          <div className="space-y-3 pt-4 border-t border-[#14201D]/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]">
              {t.platformFormatLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['4:5', '9:16', '1:1', '16:9'] as AdFormatId[]).map((fmtId) => {
                const spec = AD_FORMATS[fmtId];
                const active = draft.format === fmtId;
                return (
                  <button
                    key={fmtId}
                    type="button"
                    onClick={() => onUpdateDraft({ format: fmtId })}
                    className={`p-4 text-left rtl:text-right border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                        : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20 hover:border-[#14201D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono-tabular text-xs font-semibold text-[#B39464]">
                        {fmtId}
                      </span>
                      <span className="text-[11px] font-mono-tabular opacity-75">
                        {spec.widthPx}×{spec.heightPx}
                      </span>
                    </div>
                    <p className="text-xs font-semibold mb-1">{spec.label[lang]}</p>
                    <p className="text-[11px] opacity-75 line-clamp-1">
                      {spec.platformHint[lang]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campaign Goal Selector */}
          <div className="space-y-3 pt-4 border-t border-[#14201D]/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]">
              {t.campaignGoalLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(
                [
                  { id: 'launch', label: t.goalLaunch },
                  { id: 'promotion', label: t.goalPromotion },
                  { id: 'awareness', label: t.goalAwareness },
                  { id: 'visits', label: t.goalVisits },
                  { id: 'leads', label: t.goalLeads },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onUpdateDraft({ goal: g.id })}
                  className={`py-2.5 px-3 text-xs font-medium border transition-colors cursor-pointer ${
                    draft.goal === g.id
                      ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                      : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20 hover:border-[#14201D]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: INTERNATIONAL VISUAL STYLE GALLERY */}
      {step === 3 && (
        <div className="space-y-6 bg-[#FAF7F0] border border-[#14201D]/15 p-6 sm:p-8">
          <div className="space-y-1">
            <h2 className="text-xl font-serif-editorial font-semibold text-[#14201D]">
              {t.styleGalleryTitle}
            </h2>
            <p className="text-xs text-[#5A6561]">{t.styleGallerySubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {VISUAL_STYLES.map((style) => {
              const selected = draft.styleId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectStyle(style.id)}
                  className={`text-left rtl:text-right p-4 border flex flex-col justify-between transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D] ring-2 ring-[#B39464]'
                      : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20 hover:border-[#14201D]'
                  }`}
                >
                  <div className="space-y-3 w-full">
                    <div
                      className="h-20 w-full border border-white/15 flex items-end p-2"
                      style={{ background: style.previewGradient }}
                    >
                      <div className="flex items-center gap-1">
                        {style.defaultPalette.map((hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 border border-white/40 block"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-[10px] font-mono-tabular uppercase tracking-wider ${
                          selected ? 'text-[#B39464]' : 'text-[#8C7044]'
                        }`}
                      >
                        {style.movement[lang]}
                      </p>
                      <h3 className="text-sm font-serif-editorial font-semibold">
                        {style.name[lang]}
                      </h3>
                      <p
                        className={`text-[11px] leading-relaxed ${
                          selected ? 'text-[#F5F1E8]/80' : 'text-[#5A6561]'
                        }`}
                      >
                        {style.description[lang]}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Style Intensity & Palette Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#14201D]/15">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#14201D]">
                <label htmlFor="style-intensity-range">
                  {t.styleIntensityLabel}
                </label>
                <span className="font-mono-tabular">{draft.styleIntensity}%</span>
              </div>
              <input
                id="style-intensity-range"
                type="range"
                min={20}
                max={100}
                value={draft.styleIntensity}
                onChange={(e) =>
                  onUpdateDraft({ styleIntensity: Number(e.target.value) })
                }
                className="w-full accent-[#14201D] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#14201D]">
                {t.paletteCustomizationLabel}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {(['Background', 'Text', 'Accent'] as const).map((role, idx) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 p-2 bg-[#F5F1E8] border border-[#14201D]/20 text-xs cursor-pointer"
                  >
                    <input
                      type="color"
                      aria-label={`${role} color`}
                      value={draft.palette[idx]}
                      onChange={(e) => {
                        const next = [...draft.palette] as [
                          string,
                          string,
                          string,
                        ];
                        next[idx] = e.target.value;
                        onUpdateDraft({ palette: next });
                      }}
                      className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono-tabular text-[11px] truncate">
                      {draft.palette[idx]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: CALL TO ACTION, INCLUDE/AVOID CONSTRAINTS & ARGON LAUNCH */}
      {step === 4 && (
        <div className="space-y-6 bg-[#FAF7F0] border border-[#14201D]/15 p-6 sm:p-8">
          {showPromoWarning && (
            <div className="p-4 bg-[#B39464]/20 border border-[#8C7044] text-[#14201D] text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#8C7044] shrink-0 mt-0.5" />
              <span>{t.missingPromoClaimWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="desired-cta-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
              >
                {t.desiredCtaLabel}
              </label>
              <input
                id="desired-cta-input"
                type="text"
                value={draft.desiredCta}
                onChange={(e) => onUpdateDraft({ desiredCta: e.target.value })}
                placeholder="e.g., Explore the Collection / اكتشف الإصدار"
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]">
                {t.defaultToneInput}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'refined', label: t.toneRefined },
                    { id: 'friendly', label: t.toneFriendly },
                    { id: 'bold', label: t.toneBold },
                  ] as const
                ).map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => onUpdateDraft({ defaultTone: tone.id })}
                    className={`py-2.5 px-3 text-xs font-medium border transition-colors cursor-pointer ${
                      draft.defaultTone === tone.id
                        ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                        : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="words-include-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
              >
                {t.wordsToIncludeLabel}
              </label>
              <textarea
                id="words-include-input"
                rows={2}
                value={draft.wordsToInclude}
                onChange={(e) => onUpdateDraft({ wordsToInclude: e.target.value })}
                placeholder="Specific batch numbers, origin, heritage notes..."
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="words-avoid-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#14201D]"
              >
                {t.wordsToAvoidLabel}
              </label>
              <textarea
                id="words-avoid-input"
                rows={2}
                value={draft.wordsToAvoid}
                onChange={(e) => onUpdateDraft({ wordsToAvoid: e.target.value })}
                placeholder="Clichés, unverified superlatives, discount slang..."
                className="w-full px-3.5 py-2.5 bg-[#F5F1E8] border border-[#14201D]/25 text-sm text-[#14201D] focus:outline-none focus:border-[#14201D]"
              />
            </div>
          </div>

          {/* Summary Dossier Box */}
          <div className="p-5 bg-[#EFEAE0] border border-[#14201D]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="block text-[#5A6561] uppercase text-[10px] font-mono-tabular">
                PRODUCT
              </span>
              <strong className="text-[#14201D] truncate block">
                {draft.productName}
              </strong>
            </div>
            <div>
              <span className="block text-[#5A6561] uppercase text-[10px] font-mono-tabular">
                MARKET & LANGUAGE
              </span>
              <strong className="text-[#14201D] truncate block">
                {draft.targetMarket} ({draft.adLanguage.toUpperCase()})
              </strong>
            </div>
            <div>
              <span className="block text-[#5A6561] uppercase text-[10px] font-mono-tabular">
                FORMAT & PHOTO MODE
              </span>
              <strong className="text-[#14201D] block">
                {draft.format} ·{' '}
                {draft.preserveProductPhoto ? 'Preserved' : 'Full Scene'}
              </strong>
            </div>
            <div>
              <span className="block text-[#5A6561] uppercase text-[10px] font-mono-tabular">
                CORE ENGINE
              </span>
              <strong className="text-[#14201D] font-mono-tabular block">
                gemini-4-argon
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#14201D]/15">
        {step > 1 ? (
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#14201D]/30 text-xs font-semibold text-[#14201D] hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t.backBtn}</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14201D] text-[#F5F1E8] text-xs font-semibold hover:bg-[#233630] transition-colors cursor-pointer"
          >
            <span>{t.nextStepBtn}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isGenerating}
            onClick={onGenerateCampaign}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#B39464] text-[#14201D] text-sm font-semibold hover:bg-[#c5a676] transition-colors cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.generatingCampaignStatus}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateWithArgonBtn}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
