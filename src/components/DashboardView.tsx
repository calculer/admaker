import React from 'react';
import {
  ArrowRight,
  Layers,
  Plus,
  Sparkles,
  Trash2,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import {
  BrandProfile,
  CampaignProject,
  InterfaceLanguage,
  SavedProduct,
  VisualStyleId,
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { VISUAL_STYLES } from '../data/sampleData';
import { StudioCanvasPreview } from './StudioCanvasPreview';

interface DashboardViewProps {
  lang: InterfaceLanguage;
  campaigns: CampaignProject[];
  products: SavedProduct[];
  brands: BrandProfile[];
  sampleDataDismissed: boolean;
  onStartNewCampaign: (preset?: {
    product?: SavedProduct;
    styleId?: VisualStyleId;
    brand?: BrandProfile;
  }) => void;
  onOpenCampaignInEditor: (campaignId: string) => void;
  onRemoveSampleData: () => void;
  onRestoreSampleData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  campaigns,
  products,
  sampleDataDismissed,
  onStartNewCampaign,
  onOpenCampaignInEditor,
  onRemoveSampleData,
  onRestoreSampleData,
}) => {
  const t = TRANSLATIONS[lang];
  const hasSampleItems =
    campaigns.some((c) => c.isSample) || products.some((p) => p.isSample);

  return (
    <div className="space-y-12 pb-16">
      {/* Sample Data Banner */}
      {hasSampleItems && !sampleDataDismissed ? (
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-[#EFEAE0] border border-[#14201D]/15 text-sm">
          <div className="flex items-center gap-3 text-[#14201D]/85">
            <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#8C7044]">
              ATELIER DEMO
            </span>
            <span>·</span>
            <span>{t.sampleDataNotice}</span>
          </div>
          <button
            type="button"
            onClick={onRemoveSampleData}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#14201D] border border-[#14201D]/25 hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.removeSampleDataBtn}</span>
          </button>
        </div>
      ) : sampleDataDismissed && campaigns.length === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-[#EFEAE0] border border-[#14201D]/15 text-sm">
          <span className="text-[#14201D]/80">{t.recentCampaignsEmpty}</span>
          <button
            type="button"
            onClick={onRestoreSampleData}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#14201D] border border-[#14201D]/25 hover:bg-[#14201D] hover:text-[#F5F1E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.restoreSampleDataBtn}</span>
          </button>
        </div>
      ) : null}

      {/* Editorial Studio Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#14201D] text-[#F5F1E8] p-8 lg:p-12 border border-[#14201D]">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-mono-tabular uppercase tracking-[0.2em] rtl:tracking-normal text-[#B39464]">
              {t.welcomeKicker}
            </p>
            <h1
              className="text-3xl sm:text-5xl font-serif-editorial font-normal leading-[1.1] tracking-tight text-[#F5F1E8]"
              style={{ textWrap: 'balance' }}
            >
              {t.welcomeTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#F5F1E8]/80 leading-relaxed max-w-2xl">
              {t.welcomeSubtitle}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[#F5F1E8]/15">
            <button
              type="button"
              onClick={() => onStartNewCampaign()}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#B39464] text-[#14201D] text-sm font-semibold tracking-wide hover:bg-[#c4a574] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createCampaignCta}</span>
            </button>
            <div className="text-xs text-[#F5F1E8]/70 flex items-center gap-2 font-mono-tabular">
              <span>GEMINI 4 ARGON</span>
              <span>·</span>
              <span>AR / FR / EN</span>
              <span>·</span>
              <span>4:5 · 9:16 · 1:1 · 16:9</span>
            </div>
          </div>
        </div>

        {/* Featured Campaign Visual Showcase in Hero */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#1B2A26] p-5 border border-[#F5F1E8]/10">
          {campaigns[0] ? (
            <div className="space-y-4">
              <div className="max-w-[260px] mx-auto">
                <StudioCanvasPreview
                  campaign={campaigns[0]}
                  compact={true}
                  interfaceLanguage={lang}
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#F5F1E8]/10 text-xs">
                <div className="truncate pr-3">
                  <p className="font-medium text-[#F5F1E8] truncate">
                    {campaigns[0].title}
                  </p>
                  <p className="text-[#F5F1E8]/60 font-mono-tabular">
                    {campaigns[0].format} · {campaigns[0].targetMarket}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenCampaignInEditor(campaigns[0].id)}
                  className="px-3 py-1.5 border border-[#B39464]/60 text-[#B39464] hover:bg-[#B39464] hover:text-[#14201D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.openInEditorBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Layers className="w-8 h-8 text-[#B39464]" />
              <p className="text-sm text-[#F5F1E8]/80">{t.recentCampaignsEmpty}</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 1: Recent Campaigns */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#14201D]/15 pb-3">
          <h2 className="text-2xl font-serif-editorial font-semibold text-[#14201D]">
            {t.recentCampaignsTitle}
          </h2>
          <span className="text-xs font-mono-tabular text-[#5A6561]">
            {campaigns.length} {lang === 'ar' ? 'حملات' : 'CAMPAIGNS'}
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 border border-[#14201D]/15 bg-[#EFEAE0]/60 text-center space-y-4">
            <p className="text-sm text-[#5A6561] max-w-md mx-auto">
              {t.recentCampaignsEmpty}
            </p>
            <button
              type="button"
              onClick={() => onStartNewCampaign()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#233530] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createCampaignCta}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.slice(0, 3).map((camp) => (
              <article
                key={camp.id}
                className="group bg-[#FAF7F0] border border-[#14201D]/15 flex flex-col justify-between p-5 hover:border-[#14201D]/45 transition-colors"
              >
                <div className="space-y-4">
                  <div className="w-full max-w-[240px] mx-auto">
                    <StudioCanvasPreview
                      campaign={camp}
                      compact={true}
                      interfaceLanguage={lang}
                    />
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#5A6561]">
                      <span>{camp.format}</span>
                      <span>·</span>
                      <span>{camp.adLanguage.toUpperCase()}</span>
                      <span>·</span>
                      <span className="truncate">{camp.targetMarket}</span>
                    </div>
                    <h3 className="text-lg font-serif-editorial font-semibold text-[#14201D] line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-[#5A6561] line-clamp-2">
                      {camp.copyVariants[camp.activeTone]?.platformCopy}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#14201D]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono-tabular text-[#5A6561]">
                    {camp.preserveProductPhoto ? t.preservePhotoBadge : camp.styleId}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCampaignInEditor(camp.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14201D] hover:text-[#8C7044] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.openInEditorBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Saved Products Catalog */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#14201D]/15 pb-3">
          <h2 className="text-2xl font-serif-editorial font-semibold text-[#14201D]">
            {t.savedProductsTitle}
          </h2>
          <span className="text-xs font-mono-tabular text-[#5A6561]">
            {products.length} {lang === 'ar' ? 'منتجات' : 'ITEMS'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#FAF7F0] border border-[#14201D]/15 flex flex-col justify-between p-4"
            >
              <div className="space-y-3">
                <div className="aspect-square w-full overflow-hidden bg-[#14201D]/5 border border-[#14201D]/10">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[#5A6561]">
                    <span>{product.category}</span>
                    <span>{product.price}</span>
                  </div>
                  <h3 className="text-base font-serif-editorial font-semibold text-[#14201D]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#5A6561] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#14201D]/10">
                <button
                  type="button"
                  onClick={() => onStartNewCampaign({ product })}
                  className="w-full py-2 px-3 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B39464]" />
                  <span>{t.useProductInCampaign}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: International Visual Style Library Preview */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#14201D]/15 pb-3">
          <h2 className="text-2xl font-serif-editorial font-semibold text-[#14201D]">
            {t.styleGallerySpotlightTitle}
          </h2>
          <span className="text-xs font-mono-tabular text-[#5A6561]">
            10 CURATED DIRECTIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {VISUAL_STYLES.map((style) => (
            <div
              key={style.id}
              className="bg-[#FAF7F0] border border-[#14201D]/15 p-4 flex flex-col justify-between hover:border-[#14201D]/45 transition-colors"
            >
              <div className="space-y-3">
                <div
                  className="h-24 w-full border border-[#14201D]/10 flex items-end p-2.5 relative overflow-hidden"
                  style={{ background: style.previewGradient }}
                >
                  <div className="flex items-center gap-1.5 z-10">
                    {style.defaultPalette.map((hex, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 border border-white/40 block"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-mono-tabular text-[#8C7044] uppercase tracking-wider">
                    {style.movement[lang]}
                  </p>
                  <h3 className="text-base font-serif-editorial font-semibold text-[#14201D]">
                    {style.name[lang]}
                  </h3>
                  <p className="text-xs text-[#5A6561] leading-relaxed line-clamp-3">
                    {style.description[lang]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartNewCampaign({ styleId: style.id })}
                className="mt-4 pt-2.5 border-t border-[#14201D]/10 text-xs font-medium text-[#14201D] hover:text-[#8C7044] flex items-center justify-between w-full cursor-pointer"
              >
                <span>{t.exploreStylesBtn}</span>
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
