import React, { useState } from 'react';
import { Copy, ExternalLink, Search, Trash2 } from 'lucide-react';
import {
  AdFormatId,
  CampaignProject,
  InterfaceLanguage,
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { StudioCanvasPreview } from './StudioCanvasPreview';

interface LibraryViewProps {
  lang: InterfaceLanguage;
  campaigns: CampaignProject[];
  onOpenCampaign: (id: string) => void;
  onDuplicateCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  lang,
  campaigns,
  onOpenCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | AdFormatId>('all');

  const filtered = campaigns.filter((c) => {
    const matchesFormat = formatFilter === 'all' || c.format === formatFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.targetMarket.toLowerCase().includes(q) ||
      c.editorConfig.headlineText.toLowerCase().includes(q);
    return matchesFormat && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#14201D]/15 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif-editorial font-semibold text-[#14201D]">
            {t.libraryTitle}
          </h1>
          <p className="text-xs text-[#5A6561]">{t.librarySubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5A6561] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchCampaignsPlaceholder}
              className="pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 bg-[#FAF7F0] border border-[#14201D]/25 text-xs text-[#14201D] w-64 focus:outline-none focus:border-[#14201D]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EFEAE0] border border-[#14201D]/15">
            {(['all', '4:5', '9:16', '1:1', '16:9'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1 text-xs font-mono-tabular transition-colors cursor-pointer ${
                  formatFilter === fmt
                    ? 'bg-[#14201D] text-[#F5F1E8]'
                    : 'text-[#14201D] hover:bg-[#E2DBCD]'
                }`}
              >
                {fmt === 'all' ? t.filterAllFormats : fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-[#FAF7F0] border border-[#14201D]/15 text-center">
          <p className="text-sm text-[#5A6561]">{t.libraryEmptyState}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((camp) => (
            <article
              key={camp.id}
              className="bg-[#FAF7F0] border border-[#14201D]/15 p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="max-w-[240px] mx-auto">
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
                  <h2 className="text-lg font-serif-editorial font-semibold text-[#14201D]">
                    {camp.title}
                  </h2>
                  <p className="text-xs text-[#5A6561] line-clamp-2">
                    {camp.copyVariants[camp.activeTone]?.platformCopy}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#14201D]/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCampaign(camp.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#233630] transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B39464]" />
                  <span>{t.openInEditorBtn}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`${t.duplicateBtn} ${camp.title}`}
                    onClick={() => onDuplicateCampaign(camp.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#14201D]/20 text-xs text-[#14201D] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.duplicateBtn}</span>
                  </button>

                  <button
                    type="button"
                    aria-label={`${t.deleteBtn} ${camp.title}`}
                    onClick={() => onDeleteCampaign(camp.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#9A3412]/30 text-xs text-[#9A3412] hover:bg-[#9A3412] hover:text-[#F5F1E8] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.deleteBtn}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
