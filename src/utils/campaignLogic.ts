import {
  AdFormatId,
  ArabicDialect,
  CampaignGoalId,
  CampaignProject,
  CopyToneId,
  InterfaceLanguage,
  ToneCopyVariant,
  VisualStyleDefinition,
} from '../types/studio';

export interface FormatDimensions {
  id: AdFormatId;
  label: Record<InterfaceLanguage, string>;
  aspectRatioCss: string;
  widthPx: number;
  heightPx: number;
  geminiAspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  safeMarginTopPct: number;
  safeMarginBottomPct: number;
  safeMarginSidePct: number;
  platformHint: Record<InterfaceLanguage, string>;
}

export const AD_FORMATS: Record<AdFormatId, FormatDimensions> = {
  '4:5': {
    id: '4:5',
    label: {
      en: 'Portrait Post (4:5)',
      fr: 'Publication Portrait (4:5)',
      ar: 'منشور طولي (4:5)',
    },
    aspectRatioCss: '4 / 5',
    widthPx: 1080,
    heightPx: 1350,
    geminiAspectRatio: '3:4',
    safeMarginTopPct: 8,
    safeMarginBottomPct: 10,
    safeMarginSidePct: 7,
    platformHint: {
      en: 'Instagram & Facebook Feed Portrait',
      fr: 'Fil Instagram & Facebook Portrait',
      ar: 'خلاصة إنستغرام وفيسبوك الطولية',
    },
  },
  '9:16': {
    id: '9:16',
    label: {
      en: 'Story & Vertical Reel (9:16)',
      fr: 'Story & Vidéo Verticale (9:16)',
      ar: 'ستوري وفيديو عمودي (9:16)',
    },
    aspectRatioCss: '9 / 16',
    widthPx: 1080,
    heightPx: 1920,
    geminiAspectRatio: '9:16',
    safeMarginTopPct: 14,
    safeMarginBottomPct: 18,
    safeMarginSidePct: 8,
    platformHint: {
      en: 'Stories, Reels, TikTok & Snapchat Safe Zones',
      fr: 'Zones sûres Stories, Reels, TikTok & Snapchat',
      ar: 'المناطق الآمنة للستوري والريلز وتيك توك وسناب شات',
    },
  },
  '1:1': {
    id: '1:1',
    label: {
      en: 'Square Editorial (1:1)',
      fr: 'Carré Éditorial (1:1)',
      ar: 'مربع تحريري (1:1)',
    },
    aspectRatioCss: '1 / 1',
    widthPx: 1080,
    heightPx: 1080,
    geminiAspectRatio: '1:1',
    safeMarginTopPct: 8,
    safeMarginBottomPct: 8,
    safeMarginSidePct: 8,
    platformHint: {
      en: 'Universal Social Grid & Carousel Card',
      fr: 'Grille Sociale Universelle & Carrousel',
      ar: 'شبكة التواصل الموحدة وبطاقات الكاروسيل',
    },
  },
  '16:9': {
    id: '16:9',
    label: {
      en: 'Landscape Banner (16:9)',
      fr: 'Bannière Paysage (16:9)',
      ar: 'بانر أفقي عريض (16:9)',
    },
    aspectRatioCss: '16 / 9',
    widthPx: 1920,
    heightPx: 1080,
    geminiAspectRatio: '16:9',
    safeMarginTopPct: 10,
    safeMarginBottomPct: 12,
    safeMarginSidePct: 8,
    platformHint: {
      en: 'Web Hero, Display Banner & Editorial Header',
      fr: 'Bannière Web, Display & En-tête Éditorial',
      ar: 'واجهة الويب وبانرات العرض الإعلانية',
    },
  },
};

export function getLayoutDirection(lang: InterfaceLanguage): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function validateCampaignStep(
  step: number,
  draft: Partial<CampaignProject>
): { valid: boolean; missingFields: string[] } {
  const missing: string[] = [];
  if (step === 1) {
    if (!draft.productName || draft.productName.trim().length < 2) {
      missing.push('productName');
    }
    if (!draft.productDescription || draft.productDescription.trim().length < 5) {
      missing.push('productDescription');
    }
    if (!draft.productImages || draft.productImages.length === 0) {
      missing.push('productImages');
    }
  } else if (step === 2) {
    if (!draft.targetAudience || draft.targetAudience.trim().length < 2) {
      missing.push('targetAudience');
    }
    if (!draft.targetMarket || draft.targetMarket.trim().length < 2) {
      missing.push('targetMarket');
    }
  } else if (step === 3) {
    if (!draft.styleId) {
      missing.push('styleId');
    }
  }
  return {
    valid: missing.length === 0,
    missingFields: missing,
  };
}

/**
 * Checks whether a promotion campaign has an explicit discount/offer in verified features or price.
 * Never invent discounts or claims that the user did not provide.
 */
export function checkMissingPromotionClaim(
  goal: CampaignGoalId,
  verifiedFeatures: string[],
  wordsToInclude: string
): boolean {
  if (goal !== 'promotion') return false;
  const combined = [...verifiedFeatures, wordsToInclude].join(' ').toLowerCase();
  const hasPromoDetail =
    /%|off|discount|sale|offer|bundle|gift|free|خصم|عرض|تخفيض|هدية|مجان|remise|offre|promo|réduction/.test(
      combined
    );
  return !hasPromoDetail;
}

/**
 * Builds the strict prompt for Gemini 4 Argon (`gemini-4-argon`) to generate
 * culturally adapted ad copy and an image generation prompt without fabricating claims.
 */
export function buildArgonCampaignPrompt(params: {
  productName: string;
  productDescription: string;
  productPrice: string;
  verifiedFeatures: string[];
  targetAudience: string;
  targetMarket: string;
  adLanguage: InterfaceLanguage;
  arabicDialect?: ArabicDialect;
  format: AdFormatId;
  goal: CampaignGoalId;
  style: VisualStyleDefinition;
  styleIntensity: number;
  palette: [string, string, string];
  preserveProductPhoto: boolean;
  desiredCta: string;
  wordsToInclude: string;
  wordsToAvoid: string;
}): string {
  const languageNames: Record<InterfaceLanguage, string> = {
    en: 'English',
    fr: 'French (Français)',
    ar: 'Arabic (العربية)',
  };

  const dialectNames: Record<ArabicDialect, string> = {
    msa: 'Modern Standard Arabic (فصحى العصر الراقية)',
    gulf: 'Gulf Arabic / Khaliji (لهجة خليجية راقية)',
    levantine: 'Levantine Arabic / Shami (لهجة شامية)',
    egyptian: 'Egyptian Arabic (لهجة مصرية)',
    maghrebi: 'Maghrebi Arabic (لهجة مغاربية)',
  };

  const dialectInstruction =
    params.adLanguage === 'ar'
      ? `Arabic Dialect / Register: ${dialectNames[params.arabicDialect || 'msa']}. Adapt idioms, rhythm, and hospitality nuances naturally to ${params.targetMarket}.`
      : `Adapt cultural phrasing, register, and market references authentically for ${params.targetMarket} in ${languageNames[params.adLanguage]}. Never translate word-for-word.`;

  const verifiedList =
    params.verifiedFeatures.length > 0
      ? params.verifiedFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')
      : 'None provided — rely strictly on the product description.';

  const preserveInstruction = params.preserveProductPhoto
    ? 'PRESERVE PRODUCT PHOTO MODE IS ON: The image prompt must describe the surrounding studio environment, architectural surface, lighting, and atmosphere around the existing product without altering the product packaging, label, or geometry.'
    : 'Generate a complete commercial studio composition featuring the product described.';

  return `You are the Executive Creative Director at Forma Atelier, a luxury international advertising studio.
Create a complete advertising campaign concept, culturally adapted copywriting in 3 tones (refined, friendly, bold), and a detailed commercial photography prompt.

PRODUCT BRIEF:
- Product Name: ${params.productName}
- Description: ${params.productDescription}
- Price: ${params.productPrice || 'Not specified (do not invent a price)'}
- Verified Features (ONLY use these factual claims):
${verifiedList}

CAMPAIGN STRATEGY:
- Target Audience: ${params.targetAudience}
- Target Market / Country: ${params.targetMarket}
- Ad Language: ${languageNames[params.adLanguage]}
- ${dialectInstruction}
- Platform Format: ${params.format} (${AD_FORMATS[params.format].label.en})
- Campaign Goal: ${params.goal}
- Visual Style Direction: ${params.style.name.en} — ${params.style.description.en}
- Lighting & Composition: ${params.style.lightingDirective} | ${params.style.compositionDirective}
- Style Intensity: ${params.styleIntensity}%
- Brand Palette Hex Codes: Background ${params.palette[0]}, Primary Text ${params.palette[1]}, Accent ${params.palette[2]}
- Preferred Call to Action: ${params.desiredCta || 'Adapt naturally to goal'}
- Mandatory Words/Details to Include: ${params.wordsToInclude || 'None'}
- Words/Claims to Strictly Avoid: ${params.wordsToAvoid || 'None'}

STRICT ETHICAL & FACTUAL GUARDRAILS:
1. NEVER invent product benefits, clinical results, awards, testimonials, or percentage discounts that are not explicitly listed in Verified Features or Description.
2. DO NOT bake typography, words, logos, or ad copy into the image-generation prompt. The image prompt must produce a pure visual scene without overlaid text so editable text layers can be placed on top in the studio editor.
3. ${preserveInstruction}`;
}

/**
 * Deterministic fallback draft builder used ONLY when the user chooses to edit locally
 * while Gemini 4 Argon is unconfigured, strictly using user-supplied facts without inventing claims.
 */
export function buildFactualDraftCopyVariants(params: {
  productName: string;
  productDescription: string;
  productPrice: string;
  verifiedFeatures: string[];
  targetMarket: string;
  adLanguage: InterfaceLanguage;
  arabicDialect?: ArabicDialect;
  desiredCta: string;
}): Record<CopyToneId, ToneCopyVariant> {
  const feature1 = params.verifiedFeatures[0] || params.productDescription;
  const feature2 = params.verifiedFeatures[1] || '';
  const featureSummary = [feature1, feature2].filter(Boolean).join(' · ');

  if (params.adLanguage === 'ar') {
    const cta = params.desiredCta?.trim() || 'اكتشف المجموعة';
    const dialectLabel =
      params.arabicDialect === 'gulf'
        ? 'صياغة خليجية مخصصة للسوق المحلي'
        : params.arabicDialect === 'levantine'
        ? 'صياغة شامية قريبة وراقية'
        : params.arabicDialect === 'egyptian'
        ? 'صياغة مصرية جذابة ومباشرة'
        : params.arabicDialect === 'maghrebi'
        ? 'صياغة مغاربية أصيلة'
        : 'فصحى معاصرة مصممة للجمهور العربي';

    return {
      refined: {
        tone: 'refined',
        headline: `${params.productName} — تفاصيل صُممت بعناية`,
        alternateHeadline: `حضور متفرّد مع ${params.productName}`,
        shortDescription: featureSummary,
        platformCopy: `${params.productName}. ${params.productDescription}${feature2 ? ` — ${feature2}.` : ''}`,
        callToAction: cta,
        culturalAdaptationNote: `${dialectLabel} (${params.targetMarket}) مع الالتزام التام بالمواصفات الموثّقة.`,
      },
      friendly: {
        tone: 'friendly',
        headline: `تعرّف على ${params.productName} في يومك`,
        alternateHeadline: `اختيارك الأقرب: ${params.productName}`,
        shortDescription: featureSummary,
        platformCopy: `لأن التفاصيل تصنع الفرق: ${params.productName}. ${params.productDescription}`,
        callToAction: cta,
        culturalAdaptationNote: `نبرة دافئة تناسب جمهور ${params.targetMarket} بدون أي ادعاءات غير موثقة.`,
      },
      bold: {
        tone: 'bold',
        headline: `${params.productName}. بلا مساومة.`,
        alternateHeadline: `التركيز الكامل على الجودة: ${params.productName}`,
        shortDescription: featureSummary,
        platformCopy: `${params.productName} — ${feature1}. ${params.productDescription}`,
        callToAction: cta,
        culturalAdaptationNote: `إيقاع مباشر وقوي مناسب لمنصات التواصل في ${params.targetMarket}.`,
      },
    };
  }

  if (params.adLanguage === 'fr') {
    const cta = params.desiredCta?.trim() || 'Découvrir la pièce';
    return {
      refined: {
        tone: 'refined',
        headline: `${params.productName} — L'exigence du détail`,
        alternateHeadline: `La signature ${params.productName}`,
        shortDescription: featureSummary,
        platformCopy: `${params.productName}. ${params.productDescription}${feature2 ? ` · ${feature2}.` : ''}`,
        callToAction: cta,
        culturalAdaptationNote: `Registre éditorial adapté au marché (${params.targetMarket}), fidèle aux caractéristiques vérifiées.`,
      },
      friendly: {
        tone: 'friendly',
        headline: `Pensé pour votre quotidien : ${params.productName}`,
        alternateHeadline: `Rencontrez ${params.productName}`,
        shortDescription: featureSummary,
        platformCopy: `${params.productName} accompagne chaque instant. ${params.productDescription}`,
        callToAction: cta,
        culturalAdaptationNote: `Ton chaleureux et accessible pour ${params.targetMarket}, sans promesse inventée.`,
      },
      bold: {
        tone: 'bold',
        headline: `${params.productName}. L'essentiel, sans compromis.`,
        alternateHeadline: `Exigez ${params.productName}`,
        shortDescription: featureSummary,
        platformCopy: `${params.productName} — ${feature1}. ${params.productDescription}`,
        callToAction: cta,
        culturalAdaptationNote: `Accroche directe et rythmée pour ${params.targetMarket}.`,
      },
    };
  }

  const cta = params.desiredCta?.trim() || 'Explore the Collection';
  return {
    refined: {
      tone: 'refined',
      headline: `${params.productName} — Crafted in Quiet Detail`,
      alternateHeadline: `The Architecture of ${params.productName}`,
      shortDescription: featureSummary,
      platformCopy: `${params.productName}. ${params.productDescription}${feature2 ? ` · ${feature2}.` : ''}`,
      callToAction: cta,
      culturalAdaptationNote: `Editorial register tailored for ${params.targetMarket}, strictly grounded in verified product attributes.`,
    },
    friendly: {
      tone: 'friendly',
      headline: `Meet ${params.productName}, Made for Everyday Rituals`,
      alternateHeadline: `Your New Essential: ${params.productName}`,
      shortDescription: featureSummary,
      platformCopy: `Thoughtfully made around what matters: ${params.productName}. ${params.productDescription}`,
      callToAction: cta,
      culturalAdaptationNote: `Warm, approachable cadence for ${params.targetMarket} with zero fabricated claims.`,
    },
    bold: {
      tone: 'bold',
      headline: `${params.productName}. Uncompromising by Design.`,
      alternateHeadline: `Set the Standard with ${params.productName}`,
      shortDescription: featureSummary,
      platformCopy: `${params.productName} — ${feature1}. ${params.productDescription}`,
      callToAction: cta,
      culturalAdaptationNote: `High-impact, concise structure optimized for ${params.targetMarket} feeds.`,
    },
  };
}
