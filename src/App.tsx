/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  ActiveSection,
  BrandProfile,
  CampaignProject,
  InterfaceLanguage,
  SavedProduct,
  StudioSettings,
  VisualStyleId,
} from './types/studio';
import { TRANSLATIONS } from './i18n/translations';
import {
  IMG_OUD_PARFUM,
  SAMPLE_BRAND_PROFILES,
  SAMPLE_CAMPAIGNS,
  SAMPLE_PRODUCTS,
  VISUAL_STYLES,
} from './data/sampleData';
import {
  AD_FORMATS,
  buildArgonCampaignPrompt,
  buildFactualDraftCopyVariants,
  getLayoutDirection,
} from './utils/campaignLogic';
import { DashboardView } from './components/DashboardView';
import {
  CampaignWizardView,
  WizardDraftState,
} from './components/CampaignWizardView';
import { AdEditorView } from './components/AdEditorView';
import { LibraryView } from './components/LibraryView';
import { BrandProfilesView } from './components/BrandProfilesView';
import { SettingsView } from './components/SettingsView';

const STORAGE_KEYS = {
  SETTINGS: 'forma_atelier_settings_v1',
  CAMPAIGNS: 'forma_atelier_campaigns_v1',
  PRODUCTS: 'forma_atelier_products_v1',
  BRANDS: 'forma_atelier_brands_v1',
  WIZARD_DRAFT: 'forma_atelier_wizard_draft_v1',
};

const DEFAULT_SETTINGS: StudioSettings = {
  interfaceLanguage: 'en',
  defaultPreserveProduct: true,
  showSafeAreasByDefault: false,
  defaultExportFormat: 'png',
  defaultPreviewBackdrop: 'light',
  sampleDataDismissed: false,
};

const INITIAL_WIZARD_DRAFT: WizardDraftState = {
  brandProfileId: 'brand-maison-doree',
  productName: 'Maison Dorée · Le Soir Oud Extrait',
  productDescription:
    'Artisanal extrait de parfum crafted with aged Trat agarwood, Calabrian bergamot, and smoked amber resin in a heavy faceted flacon.',
  productPrice: '680 SAR / €175',
  verifiedFeatures: [
    '32% pure parfum oil concentration',
    'Hand-polished faceted glass flacon with brushed brass cap',
    'Macerated for 18 weeks in small batches',
  ],
  productImages: [IMG_OUD_PARFUM],
  activeProductImageIndex: 0,
  preserveProductPhoto: true,
  targetAudience: 'Fine fragrance collectors and luxury gift buyers',
  targetMarket: 'Riyadh & Dubai (GCC)',
  adLanguage: 'ar',
  arabicDialect: 'gulf',
  format: '4:5',
  goal: 'launch',
  styleId: 'french-luxury',
  styleIntensity: 82,
  palette: ['#14201D', '#F5F1E8', '#B39464'],
  defaultTone: 'refined',
  desiredCta: 'اكتشف إصدار المساء',
  wordsToInclude: 'تعتيق 18 أسبوعاً',
  wordsToAvoid: 'خصم، تقليد',
};

export default function App() {
  const [settings, setSettings] = useState<StudioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [campaigns, setCampaigns] = useState<CampaignProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return saved ? JSON.parse(saved) : SAMPLE_CAMPAIGNS;
    } catch {
      return SAMPLE_CAMPAIGNS;
    }
  });

  const [products, setProducts] = useState<SavedProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
    } catch {
      return SAMPLE_PRODUCTS;
    }
  });

  const [brands, setBrands] = useState<BrandProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
      return saved ? JSON.parse(saved) : SAMPLE_BRAND_PROFILES;
    } catch {
      return SAMPLE_BRAND_PROFILES;
    }
  });

  const [wizardDraft, setWizardDraft] = useState<WizardDraftState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WIZARD_DRAFT);
      return saved
        ? { ...INITIAL_WIZARD_DRAFT, ...JSON.parse(saved) }
        : INITIAL_WIZARD_DRAFT;
    } catch {
      return INITIAL_WIZARD_DRAFT;
    }
  });

  const [wizardStep, setWizardStep] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [activeCampaignId, setActiveCampaignId] = useState<string>(
    () => SAMPLE_CAMPAIGNS[0]?.id || ''
  );
  const [isGeneratingArgon, setIsGeneratingArgon] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const lang = settings.interfaceLanguage;
  const dir = getLayoutDirection(lang);
  const t = TRANSLATIONS[lang];

  // Sync HTML lang and dir attributes dynamically for Arabic RTL / French / English
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    } catch {
      // ignore quota errors
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore quota errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    } catch {
      // ignore quota errors
    }
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.WIZARD_DRAFT,
        JSON.stringify(wizardDraft)
      );
    } catch {
      // ignore quota errors
    }
  }, [wizardDraft]);

  const activeCampaign =
    campaigns.find((c) => c.id === activeCampaignId) ||
    campaigns[0] ||
    SAMPLE_CAMPAIGNS[0];

  const handleUpdateSettings = (patch: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleStartNewCampaign = (preset?: {
    product?: SavedProduct;
    styleId?: VisualStyleId;
    brand?: BrandProfile;
  }) => {
    setWizardDraft((prev) => {
      const next = {
        ...prev,
        preserveProductPhoto: settings.defaultPreserveProduct,
      };
      if (preset?.product) {
        next.productName = preset.product.name;
        next.productDescription = preset.product.description;
        next.productPrice = preset.product.price;
        next.verifiedFeatures = [...preset.product.verifiedFeatures];
        next.productImages = [preset.product.imageUrl];
        next.activeProductImageIndex = 0;
      }
      if (preset?.styleId) {
        const st = VISUAL_STYLES.find((s) => s.id === preset.styleId);
        if (st) {
          next.styleId = st.id;
          next.styleIntensity = st.defaultIntensity;
          next.palette = [...st.defaultPalette] as [string, string, string];
        }
      }
      if (preset?.brand) {
        next.brandProfileId = preset.brand.id;
        next.palette = [
          preset.brand.primaryColor,
          preset.brand.secondaryColor,
          preset.brand.accentColor,
        ];
        next.defaultTone = preset.brand.defaultTone;
        next.targetMarket = preset.brand.defaultMarket;
        next.adLanguage = preset.brand.defaultLanguage;
      }
      return next;
    });
    setWizardStep(1);
    setActiveSection('create');
  };

  const handleGenerateCampaignFromWizard = async () => {
    setIsGeneratingArgon(true);
    const styleDef =
      VISUAL_STYLES.find((s) => s.id === wizardDraft.styleId) ||
      VISUAL_STYLES[0];

    const prompt = buildArgonCampaignPrompt({
      productName: wizardDraft.productName,
      productDescription: wizardDraft.productDescription,
      productPrice: wizardDraft.productPrice,
      verifiedFeatures: wizardDraft.verifiedFeatures,
      targetAudience: wizardDraft.targetAudience,
      targetMarket: wizardDraft.targetMarket,
      adLanguage: wizardDraft.adLanguage,
      arabicDialect: wizardDraft.arabicDialect,
      format: wizardDraft.format,
      goal: wizardDraft.goal,
      style: styleDef,
      styleIntensity: wizardDraft.styleIntensity,
      palette: wizardDraft.palette,
      preserveProductPhoto: wizardDraft.preserveProductPhoto,
      desiredCta: wizardDraft.desiredCta,
      wordsToInclude: wizardDraft.wordsToInclude,
      wordsToAvoid: wizardDraft.wordsToAvoid,
    });

    let copyVariants = buildFactualDraftCopyVariants({
      productName: wizardDraft.productName,
      productDescription: wizardDraft.productDescription,
      productPrice: wizardDraft.productPrice,
      verifiedFeatures: wizardDraft.verifiedFeatures,
      targetMarket: wizardDraft.targetMarket,
      adLanguage: wizardDraft.adLanguage,
      arabicDialect: wizardDraft.arabicDialect,
      desiredCta: wizardDraft.desiredCta,
    });

    let argonCreativeDirection = `${styleDef.name.en}: ${styleDef.lightingDirective}. ${styleDef.compositionDirective}.`;
    let argonImagePrompt = `Studio commercial advertising photography of ${wizardDraft.productName}, ${styleDef.lightingDirective}, ${styleDef.compositionDirective}, color palette ${wizardDraft.palette.join(', ')}, zero overlaid text.`;
    let argonStatus: 'verified' | 'setup_required' = 'setup_required';
    let argonStatusMessage: string | undefined;

    try {
      const argonRes = await fetch('/api/campaign/argon-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const argonData = await argonRes.json();

      if (argonData.argonAvailable && argonData.plan) {
        argonStatus = 'verified';
        argonCreativeDirection = argonData.plan.creativeDirection;
        argonImagePrompt = argonData.plan.imagePrompt;
        copyVariants = {
          refined: { tone: 'refined', ...argonData.plan.refined },
          friendly: { tone: 'friendly', ...argonData.plan.friendly },
          bold: { tone: 'bold', ...argonData.plan.bold },
        };
      } else {
        argonStatus = 'setup_required';
        argonStatusMessage = argonData.setupMessage;
      }
    } catch {
      argonStatus = 'setup_required';
      argonStatusMessage =
        'Could not reach Gemini 4 Argon (gemini-4-argon) endpoint. Check Settings > Secrets to configure your API key.';
    }

    // Attempt image generation only if Preserve Product Photo is false OR to generate scene
    let generatedSceneImageUrl: string | undefined;
    let imageGenerationStatus:
      | 'generated'
      | 'preserved_composite'
      | 'unavailable' = wizardDraft.preserveProductPhoto
      ? 'preserved_composite'
      : 'unavailable';
    let imageStatusMessage: string | undefined;

    if (!wizardDraft.preserveProductPhoto) {
      try {
        const imgRes = await fetch('/api/campaign/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imagePrompt: argonImagePrompt,
            aspectRatio: AD_FORMATS[wizardDraft.format].geminiAspectRatio,
            preserveProductPhoto: false,
          }),
        });
        const imgData = await imgRes.json();
        if (imgData.imageAvailable && imgData.imageDataUrl) {
          generatedSceneImageUrl = imgData.imageDataUrl;
          imageGenerationStatus = 'generated';
        } else {
          imageGenerationStatus = 'unavailable';
          imageStatusMessage = imgData.setupMessage;
        }
      } catch {
        imageGenerationStatus = 'unavailable';
      }
    }

    const activeTone = wizardDraft.defaultTone;
    const selectedVariant = copyVariants[activeTone];

    const newCampaign: CampaignProject = {
      id: `camp-${Date.now()}`,
      title: `${wizardDraft.productName} — ${wizardDraft.targetMarket}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brandProfileId: wizardDraft.brandProfileId || undefined,
      productName: wizardDraft.productName,
      productDescription: wizardDraft.productDescription,
      productPrice: wizardDraft.productPrice,
      verifiedFeatures: [...wizardDraft.verifiedFeatures],
      productImages: [...wizardDraft.productImages],
      activeProductImageIndex: wizardDraft.activeProductImageIndex,
      preserveProductPhoto: wizardDraft.preserveProductPhoto,
      targetAudience: wizardDraft.targetAudience,
      targetMarket: wizardDraft.targetMarket,
      adLanguage: wizardDraft.adLanguage,
      arabicDialect: wizardDraft.arabicDialect,
      format: wizardDraft.format,
      goal: wizardDraft.goal,
      styleId: wizardDraft.styleId,
      styleIntensity: wizardDraft.styleIntensity,
      palette: [...wizardDraft.palette] as [string, string, string],
      desiredCta: wizardDraft.desiredCta,
      wordsToInclude: wizardDraft.wordsToInclude,
      wordsToAvoid: wizardDraft.wordsToAvoid,
      activeTone,
      copyVariants,
      argonCreativeDirection,
      argonImagePrompt,
      argonModelUsed: 'gemini-4-argon',
      argonStatus,
      argonStatusMessage,
      generatedSceneImageUrl,
      imageModelUsed: 'gemini-3.1-flash-lite-image',
      imageGenerationStatus,
      imageStatusMessage,
      editorConfig: {
        headlineText: selectedVariant.headline,
        useAlternateHeadline: false,
        subtitleText: selectedVariant.shortDescription,
        ctaText: selectedVariant.callToAction,
        priceBadgeText: wizardDraft.productPrice,
        showPriceBadge: Boolean(wizardDraft.productPrice),
        fontSizeScale: 1,
        textAlign: wizardDraft.adLanguage === 'ar' ? 'right' : 'left',
        verticalPosition: 'bottom',
        textColor: wizardDraft.palette[1],
        accentColor: wizardDraft.palette[2],
        backgroundTint: wizardDraft.palette[0],
        scrimOpacity: 0.65,
        productScale: 1,
        productOffsetX: 0,
        productOffsetY: 0,
        cropZoom: 1,
        frameBorder: true,
      },
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setActiveCampaignId(newCampaign.id);
    setIsGeneratingArgon(false);
    setActiveSection('editor');
  };

  const handleRefreshCopyWithArgon = async () => {
    if (!activeCampaign) return;
    setIsGeneratingArgon(true);
    const styleDef =
      VISUAL_STYLES.find((s) => s.id === activeCampaign.styleId) ||
      VISUAL_STYLES[0];

    const prompt = buildArgonCampaignPrompt({
      productName: activeCampaign.productName,
      productDescription: activeCampaign.productDescription,
      productPrice: activeCampaign.productPrice,
      verifiedFeatures: activeCampaign.verifiedFeatures,
      targetAudience: activeCampaign.targetAudience,
      targetMarket: activeCampaign.targetMarket,
      adLanguage: activeCampaign.adLanguage,
      arabicDialect: activeCampaign.arabicDialect,
      format: activeCampaign.format,
      goal: activeCampaign.goal,
      style: styleDef,
      styleIntensity: activeCampaign.styleIntensity,
      palette: activeCampaign.palette,
      preserveProductPhoto: activeCampaign.preserveProductPhoto,
      desiredCta: activeCampaign.desiredCta,
      wordsToInclude: activeCampaign.wordsToInclude,
      wordsToAvoid: activeCampaign.wordsToAvoid,
    });

    try {
      const res = await fetch('/api/campaign/argon-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.argonAvailable && data.plan) {
        const nextVariants = {
          refined: { tone: 'refined' as const, ...data.plan.refined },
          friendly: { tone: 'friendly' as const, ...data.plan.friendly },
          bold: { tone: 'bold' as const, ...data.plan.bold },
        };
        const currentToneVar = nextVariants[activeCampaign.activeTone];
        handleUpdateActiveCampaign({
          ...activeCampaign,
          copyVariants: nextVariants,
          argonCreativeDirection: data.plan.creativeDirection,
          argonImagePrompt: data.plan.imagePrompt,
          argonStatus: 'verified',
          argonStatusMessage: undefined,
          editorConfig: {
            ...activeCampaign.editorConfig,
            headlineText: currentToneVar.headline,
            subtitleText: currentToneVar.shortDescription,
            ctaText: currentToneVar.callToAction,
          },
        });
      } else {
        handleUpdateActiveCampaign({
          ...activeCampaign,
          argonStatus: 'setup_required',
          argonStatusMessage: data.setupMessage,
        });
      }
    } catch {
      handleUpdateActiveCampaign({
        ...activeCampaign,
        argonStatus: 'setup_required',
        argonStatusMessage:
          'Could not connect to Gemini 4 Argon (gemini-4-argon). Verify your API key in Settings > Secrets.',
      });
    } finally {
      setIsGeneratingArgon(false);
    }
  };

  const handleRegenerateBackground = async () => {
    if (!activeCampaign) return;
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/campaign/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePrompt: activeCampaign.argonImagePrompt,
          aspectRatio: AD_FORMATS[activeCampaign.format].geminiAspectRatio,
          preserveProductPhoto: activeCampaign.preserveProductPhoto,
        }),
      });
      const data = await res.json();
      if (data.imageAvailable && data.imageDataUrl) {
        handleUpdateActiveCampaign({
          ...activeCampaign,
          generatedSceneImageUrl: data.imageDataUrl,
          imageGenerationStatus: 'generated',
          imageStatusMessage: undefined,
        });
      } else {
        handleUpdateActiveCampaign({
          ...activeCampaign,
          imageGenerationStatus: 'unavailable',
          imageStatusMessage: data.setupMessage,
        });
      }
    } catch {
      handleUpdateActiveCampaign({
        ...activeCampaign,
        imageGenerationStatus: 'unavailable',
        imageStatusMessage:
          'Image generation model is unavailable without a billing-enabled API key in Settings > Secrets.',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUpdateActiveCampaign = (updated: CampaignProject) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDuplicateCampaign = (id: string) => {
    const source = campaigns.find((c) => c.id === id);
    if (!source) return;
    const copy: CampaignProject = {
      ...source,
      id: `camp-${Date.now()}`,
      title: `${source.title} (Copy)`,
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [copy, ...prev]);
    setActiveCampaignId(copy.id);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeCampaignId === id && remaining[0]) {
        setActiveCampaignId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleRemoveSampleData = () => {
    setCampaigns((prev) => prev.filter((c) => !c.isSample));
    setProducts((prev) => prev.filter((p) => !p.isSample));
    setBrands((prev) => prev.filter((b) => !b.isSample));
    handleUpdateSettings({ sampleDataDismissed: true });
  };

  const handleRestoreSampleData = () => {
    setCampaigns((prev) => {
      const nonSample = prev.filter((c) => !c.isSample);
      return [...SAMPLE_CAMPAIGNS, ...nonSample];
    });
    setProducts((prev) => {
      const nonSample = prev.filter((p) => !p.isSample);
      return [...SAMPLE_PRODUCTS, ...nonSample];
    });
    setBrands((prev) => {
      const nonSample = prev.filter((b) => !b.isSample);
      return [...SAMPLE_BRAND_PROFILES, ...nonSample];
    });
    handleUpdateSettings({ sampleDataDismissed: false });
  };

  const handleResetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.BRANDS);
    localStorage.removeItem(STORAGE_KEYS.WIZARD_DRAFT);
    setSettings(DEFAULT_SETTINGS);
    setCampaigns(SAMPLE_CAMPAIGNS);
    setProducts(SAMPLE_PRODUCTS);
    setBrands(SAMPLE_BRAND_PROFILES);
    setWizardDraft(INITIAL_WIZARD_DRAFT);
    setActiveCampaignId(SAMPLE_CAMPAIGNS[0].id);
    setActiveSection('dashboard');
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col bg-[#F5F1E8] text-[#14201D]"
    >
      {/* Top Bar Contract: 3 Zones (Brand Wordmark — 5 Single-Line Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-30 bg-[#F5F1E8]/95 backdrop-blur-xs border-b border-[#14201D]/15 px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('dashboard');
          }}
          className="text-2xl font-serif-editorial font-semibold tracking-tight text-[#14201D] whitespace-nowrap shrink-0"
        >
          {t.brandName}
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-xs font-medium text-[#14201D]/80"
        >
          {(
            [
              { id: 'dashboard', label: t.navDashboard },
              { id: 'create', label: t.navCreate },
              { id: 'editor', label: t.navEditor },
              { id: 'library', label: t.navLibrary },
              { id: 'brands', label: t.navBrands },
              { id: 'settings', label: t.navSettings },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeSection === item.id
                  ? 'border-[#14201D] text-[#14201D] font-semibold'
                  : 'border-transparent hover:text-[#14201D] hover:border-[#14201D]/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleStartNewCampaign()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#B39464]" />
            <span>{t.createCampaignCta}</span>
          </button>
        </div>
      </header>

      {/* Secondary Studio Utility Bar: Mobile Navigation + Clear Language Switcher (AR / FR / EN) */}
      <div className="bg-[#EFEAE0] border-b border-[#14201D]/10 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Mobile Nav Links */}
        <div className="flex md:hidden items-center gap-3 overflow-x-auto py-0.5">
          {(
            [
              { id: 'dashboard', label: t.navDashboard },
              { id: 'create', label: t.navCreate },
              { id: 'editor', label: t.navEditor },
              { id: 'library', label: t.navLibrary },
              { id: 'brands', label: t.navBrands },
              { id: 'settings', label: t.navSettings },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={` whitespace-nowrap shrink-0 px-2 py-1 ${
                activeSection === item.id
                  ? 'bg-[#14201D] text-[#F5F1E8] font-semibold'
                  : 'text-[#14201D]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 text-[#5A6561] font-mono-tabular text-[11px]">
          <span>{t.brandSubtitle}</span>
          <span>·</span>
          <span>CORE: GEMINI-4-ARGON</span>
        </div>

        {/* Language Switcher: English / Français / العربية */}
        <div
          role="group"
          aria-label="Interface Language Switcher"
          className="flex items-center gap-1 ml-auto rtl:ml-0 rtl:mr-auto"
        >
          <span className="text-[11px] text-[#5A6561] mr-1.5 rtl:mr-0 rtl:ml-1.5">
            {t.languageLabel}:
          </span>
          {(
            [
              { id: 'en', label: 'EN' },
              { id: 'fr', label: 'FR' },
              { id: 'ar', label: 'العربية' },
            ] as const
          ).map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() =>
                handleUpdateSettings({
                  interfaceLanguage: l.id as InterfaceLanguage,
                })
              }
              className={`px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lang === l.id
                  ? 'bg-[#14201D] text-[#F5F1E8]'
                  : 'text-[#14201D] hover:bg-[#E2DBCD]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-8">
        {activeSection === 'dashboard' && (
          <DashboardView
            lang={lang}
            campaigns={campaigns}
            products={products}
            brands={brands}
            sampleDataDismissed={settings.sampleDataDismissed}
            onStartNewCampaign={handleStartNewCampaign}
            onOpenCampaignInEditor={(id) => {
              setActiveCampaignId(id);
              setActiveSection('editor');
            }}
            onRemoveSampleData={handleRemoveSampleData}
            onRestoreSampleData={handleRestoreSampleData}
          />
        )}

        {activeSection === 'create' && (
          <CampaignWizardView
            lang={lang}
            draft={wizardDraft}
            step={wizardStep}
            brands={brands}
            products={products}
            isGenerating={isGeneratingArgon}
            onUpdateDraft={(patch) =>
              setWizardDraft((prev) => ({ ...prev, ...patch }))
            }
            onChangeStep={setWizardStep}
            onGenerateCampaign={handleGenerateCampaignFromWizard}
          />
        )}

        {activeSection === 'editor' && activeCampaign && (
          <AdEditorView
            lang={lang}
            campaign={activeCampaign}
            defaultShowSafeAreas={settings.showSafeAreasByDefault}
            defaultBackdrop={settings.defaultPreviewBackdrop}
            isBusyArgon={isGeneratingArgon}
            isBusyImage={isGeneratingImage}
            onUpdateCampaign={handleUpdateActiveCampaign}
            onSaveCampaign={() => {
              handleUpdateActiveCampaign({
                ...activeCampaign,
                updatedAt: new Date().toISOString(),
              });
            }}
            onDuplicateCampaign={() =>
              handleDuplicateCampaign(activeCampaign.id)
            }
            onRegenerateBackground={handleRegenerateBackground}
            onRefreshCopyWithArgon={handleRefreshCopyWithArgon}
          />
        )}

        {activeSection === 'library' && (
          <LibraryView
            lang={lang}
            campaigns={campaigns}
            onOpenCampaign={(id) => {
              setActiveCampaignId(id);
              setActiveSection('editor');
            }}
            onDuplicateCampaign={handleDuplicateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        )}

        {activeSection === 'brands' && (
          <BrandProfilesView
            lang={lang}
            brands={brands}
            products={products}
            onSaveBrand={(newBrand) =>
              setBrands((prev) => [newBrand, ...prev])
            }
            onDeleteBrand={(id) =>
              setBrands((prev) => prev.filter((b) => b.id !== id))
            }
            onStartCampaignWithBrand={(brand) =>
              handleStartNewCampaign({ brand })
            }
            onAddSavedProduct={(prod) =>
              setProducts((prev) => [prod, ...prev])
            }
            onDeleteSavedProduct={(id) =>
              setProducts((prev) => prev.filter((p) => p.id !== id))
            }
          />
        )}

        {activeSection === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRemoveSampleData={handleRemoveSampleData}
            onRestoreSampleData={handleRestoreSampleData}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#14201D]/15 bg-[#EFEAE0] px-6 py-5 text-xs text-[#5A6561] flex flex-wrap items-center justify-between gap-4">
        <span>{t.brandName} — {t.brandSubtitle}</span>
        <span className="font-mono-tabular">
          AR · FR · EN
        </span>
      </footer>
    </div>
  );
}
