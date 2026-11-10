import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AD_FORMATS,
  buildArgonCampaignPrompt,
  buildFactualDraftCopyVariants,
  checkMissingPromotionClaim,
  getLayoutDirection,
  validateCampaignStep,
} from './campaignLogic';
import { VisualStyleDefinition } from '../types/studio';

const mockStyle: VisualStyleDefinition = {
  id: 'french-luxury',
  name: {
    en: 'French Luxury Editorial',
    fr: 'Éditorial Luxe Parisien',
    ar: 'تحرير فاخر على الطريقة الفرنسية',
  },
  movement: {
    en: 'Haute Parfumerie & Salon Monograph',
    fr: 'Haute Parfumerie & Monographie',
    ar: 'دار العطور والمونوغراف الفني',
  },
  description: {
    en: 'Chiaroscuro window light, travertine stone, and high-contrast serif poise.',
    fr: 'Clair-obscur naturel, pierre de travertin et élégance typographique.',
    ar: 'إضاءة نافذة درامية وحجر الترافرتين مع توازن بصري كلاسيكي.',
  },
  defaultPalette: ['#14201D', '#F5F1E8', '#B39464'],
  defaultIntensity: 80,
  lightingDirective: 'Warm directional afternoon sunlight across travertine plinth',
  compositionDirective: 'Centered architectural monumentality with generous negative space',
  previewGradient: 'linear-gradient(135deg, #14201D 0%, #2C3E37 100%)',
  previewImage: '/test.jpg',
};

test('getLayoutDirection returns rtl for Arabic and ltr for English and French', () => {
  assert.equal(getLayoutDirection('ar'), 'rtl');
  assert.equal(getLayoutDirection('en'), 'ltr');
  assert.equal(getLayoutDirection('fr'), 'ltr');
});

test('validateCampaignStep enforces required fields per step', () => {
  const step1Empty = validateCampaignStep(1, { productName: '', productDescription: '' });
  assert.equal(step1Empty.valid, false);
  assert.equal(step1Empty.missingFields.includes('productName'), true);
  assert.equal(step1Empty.missingFields.includes('productImages'), true);

  const step1Valid = validateCampaignStep(1, {
    productName: 'Sérum Botanique N°4',
    productDescription: 'Cold-pressed prickly pear seed oil in UV amber glass.',
    productImages: ['/img.jpg'],
  });
  assert.equal(step1Valid.valid, true);
  assert.equal(step1Valid.missingFields.length, 0);
});

test('checkMissingPromotionClaim detects promotion goal without explicit offer details', () => {
  assert.equal(
    checkMissingPromotionClaim('promotion', ['Cold-pressed oil', '30ml glass bottle'], ''),
    true
  );
  assert.equal(
    checkMissingPromotionClaim('promotion', ['Complimentary travel gift on launch orders'], ''),
    false
  );
  assert.equal(
    checkMissingPromotionClaim('launch', ['Cold-pressed oil'], ''),
    false
  );
});

test('buildArgonCampaignPrompt includes dialect, preserve product instruction, and factual guardrails', () => {
  const prompt = buildArgonCampaignPrompt({
    productName: 'Oud Al-Majlis',
    productDescription: 'Aged artisanal agarwood extract in hand-polished crystal.',
    productPrice: '680 SAR',
    verifiedFeatures: ['100% pure oil concentration', '50ml crystal flacon'],
    targetAudience: 'Fine fragrance collectors',
    targetMarket: 'Riyadh, Saudi Arabia',
    adLanguage: 'ar',
    arabicDialect: 'gulf',
    format: '4:5',
    goal: 'launch',
    style: mockStyle,
    styleIntensity: 85,
    palette: ['#14201D', '#F5F1E8', '#B39464'],
    preserveProductPhoto: true,
    desiredCta: 'اطلب العطر الآن',
    wordsToInclude: 'تراث',
    wordsToAvoid: 'رخيص',
  });

  assert.equal(prompt.includes('Gulf Arabic / Khaliji'), true);
  assert.equal(prompt.includes('PRESERVE PRODUCT PHOTO MODE IS ON'), true);
  assert.equal(prompt.includes('NEVER invent product benefits'), true);
  assert.equal(prompt.includes('DO NOT bake typography'), true);
});

test('buildFactualDraftCopyVariants generates 3 tones in target language without inventing claims', () => {
  const variants = buildFactualDraftCopyVariants({
    productName: 'Chronographe Verdigris',
    productDescription: 'Brushed bronze case with Swiss automatic movement.',
    productPrice: '€1,450',
    verifiedFeatures: ['Sapphire crystal exhibition back', '72-hour power reserve'],
    targetMarket: 'Paris, France',
    adLanguage: 'fr',
    desiredCta: 'Réserver en atelier',
  });

  assert.equal(Boolean(variants.refined.headline), true);
  assert.equal(Boolean(variants.friendly.headline), true);
  assert.equal(Boolean(variants.bold.headline), true);
  assert.equal(variants.refined.callToAction, 'Réserver en atelier');
  assert.equal(variants.refined.shortDescription.includes('72-hour power reserve'), true);
});

test('AD_FORMATS exposes all 4 required campaign formats with safe zone margins', () => {
  assert.equal(AD_FORMATS['4:5'].widthPx, 1080);
  assert.equal(AD_FORMATS['9:16'].heightPx, 1920);
  assert.equal(AD_FORMATS['1:1'].widthPx, 1080);
  assert.equal(AD_FORMATS['16:9'].widthPx, 1920);
});
