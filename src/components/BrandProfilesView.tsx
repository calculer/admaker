import React, { useState } from 'react';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import {
  BrandProfile,
  CopyToneId,
  InterfaceLanguage,
  SavedProduct,
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { IMG_BOTANICAL_SERUM } from '../data/sampleData';

interface BrandProfilesViewProps {
  lang: InterfaceLanguage;
  brands: BrandProfile[];
  products: SavedProduct[];
  onSaveBrand: (brand: BrandProfile) => void;
  onDeleteBrand: (id: string) => void;
  onStartCampaignWithBrand: (brand: BrandProfile) => void;
  onAddSavedProduct: (product: SavedProduct) => void;
  onDeleteSavedProduct: (id: string) => void;
}

export const BrandProfilesView: React.FC<BrandProfilesViewProps> = ({
  lang,
  brands,
  products,
  onSaveBrand,
  onDeleteBrand,
  onStartCampaignWithBrand,
  onAddSavedProduct,
  onDeleteSavedProduct,
}) => {
  const t = TRANSLATIONS[lang];

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [monogram, setMonogram] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#14201D');
  const [secondaryColor, setSecondaryColor] = useState('#F5F1E8');
  const [accentColor, setAccentColor] = useState('#B39464');
  const [defaultTone, setDefaultTone] = useState<CopyToneId>('refined');
  const [defaultMarket, setDefaultMarket] = useState('Riyadh & Dubai');
  const [defaultLanguage, setDefaultLanguage] = useState<InterfaceLanguage>(lang);

  // New Product state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Skincare & Apothecary');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodFeature, setProdFeature] = useState('');

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newBrand: BrandProfile = {
      id: `brand-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'Contemporary Creative Maison',
      logoMonogram:
        monogram.trim().toUpperCase() ||
        name
          .trim()
          .slice(0, 2)
          .toUpperCase(),
      primaryColor,
      secondaryColor,
      accentColor,
      defaultTone,
      defaultMarket: defaultMarket.trim() || 'Global',
      defaultLanguage,
      savedProductIds: [],
    };
    onSaveBrand(newBrand);
    setName('');
    setTagline('');
    setMonogram('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodDesc.trim()) return;
    const newProd: SavedProduct = {
      id: `prod-${Date.now()}`,
      name: prodName.trim(),
      category: prodCategory.trim() || 'Edition',
      price: prodPrice.trim() || 'Upon Request',
      description: prodDesc.trim(),
      verifiedFeatures: prodFeature.trim()
        ? prodFeature
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [prodDesc.trim()],
      imageUrl: IMG_BOTANICAL_SERUM,
    };
    onAddSavedProduct(newProd);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdFeature('');
  };

  return (
    <div className="space-y-12 pb-16">
      <div className="border-b border-[#14201D]/15 pb-5 space-y-1">
        <h1 className="text-3xl font-serif-editorial font-semibold text-[#14201D]">
          {t.brandsTitle}
        </h1>
        <p className="text-xs text-[#5A6561]">{t.brandsSubtitle}</p>
      </div>

      {/* Existing Brand Profiles Grid + Create Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          {brands.map((b) => (
            <div
              key={b.id}
              className="p-6 bg-[#FAF7F0] border border-[#14201D]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 shrink-0 flex items-center justify-center font-serif-editorial text-xl font-semibold border"
                  style={{
                    backgroundColor: b.primaryColor,
                    color: b.secondaryColor,
                    borderColor: b.accentColor,
                  }}
                >
                  {b.logoMonogram}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#5A6561]">
                    <span>{b.defaultMarket}</span>
                    <span>·</span>
                    <span>{b.defaultLanguage.toUpperCase()}</span>
                    <span>·</span>
                    <span>{b.defaultTone}</span>
                  </div>
                  <h2 className="text-xl font-serif-editorial font-semibold text-[#14201D]">
                    {b.name}
                  </h2>
                  <p className="text-xs text-[#5A6561]">{b.tagline}</p>
                  <div className="flex items-center gap-2 pt-1.5">
                    {[b.primaryColor, b.secondaryColor, b.accentColor].map(
                      (hex, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-mono-tabular text-[#5A6561]"
                        >
                          <span
                            className="w-3.5 h-3.5 border border-[#14201D]/25 inline-block"
                            style={{ backgroundColor: hex }}
                          />
                          {hex}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onStartCampaignWithBrand(b)}
                  className="px-4 py-2 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#233630] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B39464]" />
                  <span>{t.useBrandForCampaignBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteBrand(b.id)}
                  className="px-3 py-1.5 border border-[#9A3412]/30 text-xs text-[#9A3412] hover:bg-[#9A3412] hover:text-[#F5F1E8] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.deleteBrandBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* New Brand Form */}
        <form
          onSubmit={handleCreateBrand}
          className="lg:col-span-5 bg-[#FAF7F0] border border-[#14201D]/15 p-6 space-y-4"
        >
          <h2 className="text-lg font-serif-editorial font-semibold text-[#14201D] border-b border-[#14201D]/10 pb-2">
            {t.newBrandProfileBtn}
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label
                htmlFor="brand-name-field"
                className="block text-xs font-semibold text-[#14201D]"
              >
                {t.brandNameInput} *
              </label>
              <input
                id="brand-name-field"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maison Al-Noor"
                className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="brand-monogram-field"
                className="block text-xs font-semibold text-[#14201D]"
              >
                {t.brandMonogramInput}
              </label>
              <input
                id="brand-monogram-field"
                type="text"
                maxLength={3}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value)}
                placeholder="MN"
                className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs font-mono-tabular uppercase text-[#14201D]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="brand-tagline-field"
              className="block text-xs font-semibold text-[#14201D]"
            >
              {t.brandTaglineInput}
            </label>
            <input
              id="brand-tagline-field"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Botanical Craft & Architectural Form"
              className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="brand-market-field"
                className="block text-xs font-semibold text-[#14201D]"
              >
                {t.defaultMarketInput}
              </label>
              <input
                id="brand-market-field"
                type="text"
                value={defaultMarket}
                onChange={(e) => setDefaultMarket(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="brand-tone-field"
                className="block text-xs font-semibold text-[#14201D]"
              >
                {t.defaultToneInput}
              </label>
              <select
                id="brand-tone-field"
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value as CopyToneId)}
                className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
              >
                <option value="refined">{t.toneRefined}</option>
                <option value="friendly">{t.toneFriendly}</option>
                <option value="bold">{t.toneBold}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="p-2 bg-[#F5F1E8] border border-[#14201D]/20 text-[11px] flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-5 h-5 border-0"
              />
              <span className="font-mono-tabular">{primaryColor}</span>
            </label>
            <label className="p-2 bg-[#F5F1E8] border border-[#14201D]/20 text-[11px] flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-5 h-5 border-0"
              />
              <span className="font-mono-tabular">{secondaryColor}</span>
            </label>
            <label className="p-2 bg-[#F5F1E8] border border-[#14201D]/20 text-[11px] flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-5 h-5 border-0"
              />
              <span className="font-mono-tabular">{accentColor}</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#14201D] text-[#F5F1E8] text-xs font-semibold hover:bg-[#243832] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#B39464]" />
            <span>{t.saveBrandBtn}</span>
          </button>
        </form>
      </div>

      {/* Add Saved Product to Catalog Section */}
      <div className="pt-8 border-t border-[#14201D]/15 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-serif-editorial font-semibold text-[#14201D]">
            {t.savedProductsTitle} ({products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 bg-[#FAF7F0] border border-[#14201D]/15 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-tabular text-[#8C7044] uppercase">
                    {prod.category} · {prod.price}
                  </span>
                  <h3 className="text-sm font-serif-editorial font-semibold text-[#14201D]">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#5A6561] line-clamp-2">
                    {prod.description}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete product ${prod.name}`}
                  onClick={() => onDeleteSavedProduct(prod.id)}
                  className="text-[#5A6561] hover:text-[#9A3412] p-1 shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleCreateProduct}
          className="lg:col-span-5 bg-[#FAF7F0] border border-[#14201D]/15 p-6 space-y-4"
        >
          <h3 className="text-lg font-serif-editorial font-semibold text-[#14201D] border-b border-[#14201D]/10 pb-2">
            {t.addSavedProductTitle}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="new-prod-name"
                className="block text-xs font-semibold text-[#14201D]"
              >
                {t.productNameLabel} *
              </label>
              <input
                id="new-prod-name"
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="new-prod-price"
                className="block text-xs font-semibold text-[#14201D]"
              >
                {t.productPriceLabel}
              </label>
              <input
                id="new-prod-price"
                type="text"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                placeholder="420 SAR / €95"
                className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs font-mono-tabular text-[#14201D]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="new-prod-desc"
              className="block text-xs font-semibold text-[#14201D]"
            >
              {t.productDescriptionLabel} *
            </label>
            <textarea
              id="new-prod-desc"
              rows={2}
              required
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="new-prod-features"
              className="block text-xs font-semibold text-[#14201D]"
            >
              {t.verifiedFeaturesLabel} (comma-separated)
            </label>
            <input
              id="new-prod-features"
              type="text"
              value={prodFeature}
              onChange={(e) => setProdFeature(e.target.value)}
              placeholder="100% organic, 50ml amber glass, Small batch"
              className="w-full px-3 py-2 bg-[#F5F1E8] border border-[#14201D]/25 text-xs text-[#14201D]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#B39464] text-[#14201D] text-xs font-semibold hover:bg-[#c4a574] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addSavedProductTitle}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
