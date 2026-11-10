export type InterfaceLanguage = 'en' | 'fr' | 'ar';

export type ArabicDialect =
  | 'msa'          // Modern Standard Arabic (فصحى العصر)
  | 'gulf'         // Khaliji / Gulf (خليجي)
  | 'levantine'    // Levantine / Shami (شامي)
  | 'egyptian'     // Egyptian (مصري)
  | 'maghrebi';    // Maghrebi / North African (مغاربي)

export type AdFormatId = '4:5' | '9:16' | '1:1' | '16:9';

export type CampaignGoalId =
  | 'launch'
  | 'promotion'
  | 'awareness'
  | 'visits'
  | 'leads';

export type CopyToneId = 'refined' | 'friendly' | 'bold';

export type VisualStyleId =
  | 'french-luxury'
  | 'scandinavian-minimal'
  | 'swiss-grid'
  | 'art-deco'
  | 'japanese-minimal'
  | 'warm-mediterranean'
  | 'bold-youth'
  | 'cinematic-luxury'
  | 'natural-organic'
  | 'playful-colorful';

export interface VisualStyleDefinition {
  id: VisualStyleId;
  name: Record<InterfaceLanguage, string>;
  movement: Record<InterfaceLanguage, string>;
  description: Record<InterfaceLanguage, string>;
  defaultPalette: [string, string, string]; // [background, primaryText, accent]
  defaultIntensity: number; // 20 to 100
  lightingDirective: string;
  compositionDirective: string;
  previewGradient: string;
  previewImage: string;
}

export interface ToneCopyVariant {
  tone: CopyToneId;
  headline: string;
  alternateHeadline: string;
  shortDescription: string;
  platformCopy: string;
  callToAction: string;
  culturalAdaptationNote: string;
}

export interface TextLayerConfig {
  headlineText: string;
  useAlternateHeadline: boolean;
  subtitleText: string;
  ctaText: string;
  priceBadgeText: string;
  showPriceBadge: boolean;
  fontSizeScale: number; // 0.75 to 1.4
  textAlign: 'left' | 'center' | 'right';
  verticalPosition: 'top' | 'center' | 'bottom';
  textColor: string;
  accentColor: string;
  backgroundTint: string;
  scrimOpacity: number; // 0 to 0.85
  productScale: number; // 0.6 to 1.35
  productOffsetX: number; // -30 to 30 (%)
  productOffsetY: number; // -30 to 30 (%)
  cropZoom: number; // 1 to 1.5
  frameBorder: boolean;
}

export interface CampaignProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
  brandProfileId?: string;
  // Product details
  productName: string;
  productDescription: string;
  productPrice: string;
  verifiedFeatures: string[];
  productImages: string[];
  activeProductImageIndex: number;
  preserveProductPhoto: boolean;
  // Target & language
  targetAudience: string;
  targetMarket: string;
  adLanguage: InterfaceLanguage;
  arabicDialect?: ArabicDialect;
  // Format & goal
  format: AdFormatId;
  goal: CampaignGoalId;
  // Style & constraints
  styleId: VisualStyleId;
  styleIntensity: number;
  palette: [string, string, string]; // [bg, text, accent]
  desiredCta: string;
  wordsToInclude: string;
  wordsToAvoid: string;
  // Generated AI outputs
  activeTone: CopyToneId;
  copyVariants: Record<CopyToneId, ToneCopyVariant>;
  argonCreativeDirection: string;
  argonImagePrompt: string;
  argonModelUsed: string;
  argonStatus: 'verified' | 'setup_required' | 'draft';
  argonStatusMessage?: string;
  generatedSceneImageUrl?: string;
  imageModelUsed?: string;
  imageGenerationStatus: 'generated' | 'preserved_composite' | 'unavailable';
  imageStatusMessage?: string;
  // Editor state
  editorConfig: TextLayerConfig;
}

export interface SavedProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  verifiedFeatures: string[];
  imageUrl: string;
  isSample?: boolean;
}

export interface BrandProfile {
  id: string;
  name: string;
  tagline: string;
  logoMonogram: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultTone: CopyToneId;
  defaultMarket: string;
  defaultLanguage: InterfaceLanguage;
  savedProductIds: string[];
  isSample?: boolean;
}

export interface StudioSettings {
  interfaceLanguage: InterfaceLanguage;
  defaultPreserveProduct: boolean;
  showSafeAreasByDefault: boolean;
  defaultExportFormat: 'png' | 'jpg';
  defaultPreviewBackdrop: 'light' | 'dark';
  sampleDataDismissed: boolean;
}

export type ActiveSection =
  | 'dashboard'
  | 'create'
  | 'editor'
  | 'library'
  | 'brands'
  | 'settings';
