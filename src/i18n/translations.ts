import { InterfaceLanguage } from '../types/studio';

export interface TranslationDictionary {
  // Brand & Top / Side Nav
  brandName: string;
  brandSubtitle: string;
  navDashboard: string;
  navCreate: string;
  navEditor: string;
  navLibrary: string;
  navBrands: string;
  navSettings: string;
  createCampaignCta: string;
  languageLabel: string;

  // Dashboard
  welcomeKicker: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  sampleDataNotice: string;
  removeSampleDataBtn: string;
  restoreSampleDataBtn: string;
  recentCampaignsTitle: string;
  recentCampaignsEmpty: string;
  savedProductsTitle: string;
  useProductInCampaign: string;
  styleGallerySpotlightTitle: string;
  openInEditorBtn: string;
  exploreStylesBtn: string;

  // Campaign Creation Flow
  wizardTitle: string;
  wizardStep1: string;
  wizardStep2: string;
  wizardStep3: string;
  wizardStep4: string;
  backBtn: string;
  nextStepBtn: string;
  generateWithArgonBtn: string;
  generatingCampaignStatus: string;
  applyBrandProfileLabel: string;
  selectSavedProductLabel: string;
  uploadProductPhotosLabel: string;
  uploadPhotoHint: string;
  preserveProductPhotoLabel: string;
  preserveProductPhotoDesc: string;
  productNameLabel: string;
  productDescriptionLabel: string;
  productPriceLabel: string;
  verifiedFeaturesLabel: string;
  verifiedFeaturesHint: string;
  addFeatureBtn: string;
  targetAudienceLabel: string;
  targetMarketLabel: string;
  adLanguageLabel: string;
  arabicDialectLabel: string;
  platformFormatLabel: string;
  campaignGoalLabel: string;
  styleGalleryTitle: string;
  styleGallerySubtitle: string;
  styleIntensityLabel: string;
  paletteCustomizationLabel: string;
  desiredCtaLabel: string;
  wordsToIncludeLabel: string;
  wordsToAvoidLabel: string;
  missingPromoClaimWarning: string;
  validationErrorBanner: string;

  // Goals
  goalLaunch: string;
  goalPromotion: string;
  goalAwareness: string;
  goalVisits: string;
  goalLeads: string;

  // Dialects
  dialectMsa: string;
  dialectGulf: string;
  dialectLevantine: string;
  dialectEgyptian: string;
  dialectMaghrebi: string;

  // Tones
  toneRefined: string;
  toneFriendly: string;
  toneBold: string;

  // Ad Editor
  editorTitle: string;
  formatPreviewLabel: string;
  safeAreaToggle: string;
  backdropLight: string;
  backdropDark: string;
  preservePhotoBadge: string;
  copyVariantsTab: string;
  typographyLayoutTab: string;
  backdropPaletteTab: string;
  argonReasoningTab: string;
  headlineInputLabel: string;
  useAlternateHeadlineToggle: string;
  subtitleInputLabel: string;
  ctaInputLabel: string;
  priceBadgeInputLabel: string;
  showPriceBadgeToggle: string;
  fontSizeScaleLabel: string;
  textAlignLabel: string;
  verticalPositionLabel: string;
  scrimOpacityLabel: string;
  productScaleLabel: string;
  cropZoomLabel: string;
  frameBorderToggle: string;
  replaceProductImageBtn: string;
  regenerateBackgroundBtn: string;
  refreshCopyWithArgonBtn: string;
  saveCampaignBtn: string;
  duplicateCampaignBtn: string;
  exportPngBtn: string;
  exportJpgBtn: string;
  copyAdTextBtn: string;
  copiedConfirmation: string;
  savedConfirmation: string;
  argonAccessNoticeTitle: string;
  retryArgonBtn: string;

  // Campaign Library
  libraryTitle: string;
  librarySubtitle: string;
  searchCampaignsPlaceholder: string;
  filterAllFormats: string;
  duplicateBtn: string;
  deleteBtn: string;
  libraryEmptyState: string;

  // Brand Profiles
  brandsTitle: string;
  brandsSubtitle: string;
  newBrandProfileBtn: string;
  brandNameInput: string;
  brandTaglineInput: string;
  brandMonogramInput: string;
  defaultToneInput: string;
  defaultMarketInput: string;
  saveBrandBtn: string;
  useBrandForCampaignBtn: string;
  deleteBrandBtn: string;
  addSavedProductTitle: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  interfaceLanguageSetting: string;
  studioDefaultsSection: string;
  aiModelArchitectureSection: string;
  coreReasoningModelLabel: string;
  visualGenerationModelLabel: string;
  testArgonConnectionBtn: string;
  dataManagementSection: string;
  clearAllLocalDataBtn: string;
}

export const TRANSLATIONS: Record<InterfaceLanguage, TranslationDictionary> = {
  en: {
    brandName: 'Forma Atelier',
    brandSubtitle: 'Creative Campaign & Visual Studio',
    navDashboard: 'Studio',
    navCreate: 'New Campaign',
    navEditor: 'Ad Editor',
    navLibrary: 'Archive',
    navBrands: 'Brand Profiles',
    navSettings: 'Settings',
    createCampaignCta: 'Create campaign',
    languageLabel: 'Interface',

    welcomeKicker: 'CREATIVE DIRECTION & MULTILINGUAL CAMPAIGN ATELIER',
    welcomeTitle: 'Turn product photography into finished advertising campaigns.',
    welcomeSubtitle:
      'Plan regional positioning, preserve original product packaging, compose editorial backdrops, and refine multilingual typography for Arabic, French, and English markets.',
    sampleDataNotice:
      'Viewing curated studio sample campaigns and products so you can explore the workspace immediately.',
    removeSampleDataBtn: 'Remove sample data',
    restoreSampleDataBtn: 'Restore sample data',
    recentCampaignsTitle: 'Recent Campaigns',
    recentCampaignsEmpty:
      'No campaigns in your workspace yet. Start a new campaign to compose your first visual and copy deck.',
    savedProductsTitle: 'Saved Products Catalog',
    useProductInCampaign: 'Launch Campaign',
    styleGallerySpotlightTitle: 'International Visual Movements',
    openInEditorBtn: 'Open in Editor',
    exploreStylesBtn: 'Configure in Campaign Flow',

    wizardTitle: 'Campaign Creation Studio',
    wizardStep1: '01. Product & Assets',
    wizardStep2: '02. Market & Format',
    wizardStep3: '03. Visual Direction',
    wizardStep4: '04. Palette & Brief',
    backBtn: 'Back',
    nextStepBtn: 'Continue',
    generateWithArgonBtn: 'Compose Campaign with Gemini 4 Argon',
    generatingCampaignStatus: 'Running Gemini 4 Argon creative reasoning & visual composition...',
    applyBrandProfileLabel: 'Pre-fill from Brand Profile',
    selectSavedProductLabel: 'Or load from Saved Products',
    uploadProductPhotosLabel: 'Product Photography',
    uploadPhotoHint: 'Upload PNG/JPG product photo or select from studio catalog',
    preserveProductPhotoLabel: 'Preserve the product photo',
    preserveProductPhotoDesc:
      'Default ON — Keeps packaging, typography, and product geometry intact while styling the surrounding studio backdrop.',
    productNameLabel: 'Product Name',
    productDescriptionLabel: 'Factual Product Description',
    productPriceLabel: 'Price / Edition (Optional)',
    verifiedFeaturesLabel: 'Verified Features & Claims',
    verifiedFeaturesHint:
      'Forma Atelier strictly uses these verified facts and never invents unverified benefits, testimonials, or discounts.',
    addFeatureBtn: 'Add Verified Fact',
    targetAudienceLabel: 'Target Audience',
    targetMarketLabel: 'Target Country or Market',
    adLanguageLabel: 'Campaign Copy Language',
    arabicDialectLabel: 'Arabic Cultural Register / Dialect',
    platformFormatLabel: 'Platform & Aspect Format',
    campaignGoalLabel: 'Primary Campaign Objective',
    styleGalleryTitle: 'International Visual Style Gallery',
    styleGallerySubtitle:
      'Original art directions inspired by global design movements. Adjust palette and intensity without imitating third-party brands.',
    styleIntensityLabel: 'Atmosphere & Shadow Intensity',
    paletteCustomizationLabel: 'Campaign Color Palette (Background · Typography · Accent)',
    desiredCtaLabel: 'Call to Action Text',
    wordsToIncludeLabel: 'Mandatory Words or Phrases to Include',
    wordsToAvoidLabel: 'Words or Angles to Strictly Avoid',
    missingPromoClaimWarning:
      'You selected "Promotion" as the campaign goal, but no specific discount or offer is listed in Verified Features. Add the verified offer above, or Argon will keep the copy focused on value without inventing a discount.',
    validationErrorBanner: 'Please complete the highlighted product or market fields before proceeding.',

    goalLaunch: 'Product Launch',
    goalPromotion: 'Seasonal Promotion',
    goalAwareness: 'Brand Awareness',
    goalVisits: 'Boutique & Store Visits',
    goalLeads: 'Clientele & Lead Generation',

    dialectMsa: 'Modern Standard Editorial (فصحى العصر)',
    dialectGulf: 'Gulf / Khaliji (خليجي)',
    dialectLevantine: 'Levantine / Shami (شامي)',
    dialectEgyptian: 'Egyptian (مصري)',
    dialectMaghrebi: 'Maghrebi / North African (مغاربي)',

    toneRefined: 'Refined',
    toneFriendly: 'Friendly',
    toneBold: 'Bold',

    editorTitle: 'Ad Composition & Typography Editor',
    formatPreviewLabel: 'Format & Safe Area',
    safeAreaToggle: 'Safe Areas',
    backdropLight: 'Daylight Paper',
    backdropDark: 'Darkroom Slate',
    preservePhotoBadge: 'Product Photo Preserved',
    copyVariantsTab: 'Copy & Tones',
    typographyLayoutTab: 'Layout & Crop',
    backdropPaletteTab: 'Palette & Scene',
    argonReasoningTab: 'Argon Brief',
    headlineInputLabel: 'Primary Headline Layer',
    useAlternateHeadlineToggle: 'Switch to Alternate Headline',
    subtitleInputLabel: 'Supporting Deck / Description Layer',
    ctaInputLabel: 'Call to Action Button Layer',
    priceBadgeInputLabel: 'Price / Edition Tag',
    showPriceBadgeToggle: 'Show Price Tag on Canvas',
    fontSizeScaleLabel: 'Typography Scale',
    textAlignLabel: 'Text Alignment',
    verticalPositionLabel: 'Text Block Anchor',
    scrimOpacityLabel: 'Contrast Scrim Intensity',
    productScaleLabel: 'Product Subject Scale',
    cropZoomLabel: 'Frame Crop & Zoom',
    frameBorderToggle: 'Editorial Keyline Border',
    replaceProductImageBtn: 'Replace Product Photo',
    regenerateBackgroundBtn: 'Regenerate Background Only',
    refreshCopyWithArgonBtn: 'Request New Copy Ideas (Argon)',
    saveCampaignBtn: 'Save Campaign',
    duplicateCampaignBtn: 'Duplicate',
    exportPngBtn: 'Export PNG',
    exportJpgBtn: 'Export JPG',
    copyAdTextBtn: 'Copy Platform Copy',
    copiedConfirmation: 'Ad copy copied to clipboard',
    savedConfirmation: 'Campaign saved to archive',
    argonAccessNoticeTitle: 'Gemini 4 Argon (gemini-4-argon) Setup Notice',
    retryArgonBtn: 'Retry Gemini 4 Argon',

    libraryTitle: 'Campaign Archive & Library',
    librarySubtitle: 'Review, duplicate, reopen, or export your saved multi-format campaigns.',
    searchCampaignsPlaceholder: 'Search by product, market, or headline...',
    filterAllFormats: 'All Formats',
    duplicateBtn: 'Duplicate',
    deleteBtn: 'Delete',
    libraryEmptyState: 'No campaigns match your current filter.',

    brandsTitle: 'Brand Profiles & Product Catalog',
    brandsSubtitle: 'Store your house identity, palette, writing tone, and verified products for one-click campaign setup.',
    newBrandProfileBtn: 'New Brand Profile',
    brandNameInput: 'Business / Maison Name',
    brandTaglineInput: 'Brand Positioning / Ethos',
    brandMonogramInput: 'Monogram (2–3 chars)',
    defaultToneInput: 'Default Writing Tone',
    defaultMarketInput: 'Primary Market',
    saveBrandBtn: 'Save Brand Profile',
    useBrandForCampaignBtn: 'Start Campaign with Brand',
    deleteBrandBtn: 'Delete Profile',
    addSavedProductTitle: 'Add Product to Studio Catalog',

    settingsTitle: 'Studio Settings & Configuration',
    settingsSubtitle: 'Configure interface language, RTL workspace behavior, default editor rules, and local archive storage.',
    interfaceLanguageSetting: 'Workspace Interface Language',
    studioDefaultsSection: 'Default Editor & Preservation Preferences',
    aiModelArchitectureSection: 'Mandatory Model Routing & Verification',
    coreReasoningModelLabel: 'Campaign Reasoning & Multilingual Copy Model',
    visualGenerationModelLabel: 'Studio Image Generation Model',
    testArgonConnectionBtn: 'Verify gemini-4-argon Access',
    dataManagementSection: 'Workspace Data & Sample Archive',
    clearAllLocalDataBtn: 'Reset All Local Studio Data',
  },

  fr: {
    brandName: 'Forma Atelier',
    brandSubtitle: 'Studio Créatif & Campagnes Publicitaires',
    navDashboard: 'Atelier',
    navCreate: 'Nouvelle Campagne',
    navEditor: 'Éditeur Visuel',
    navLibrary: 'Archives',
    navBrands: 'Profils de Marque',
    navSettings: 'Paramètres',
    createCampaignCta: 'Créer une campagne',
    languageLabel: 'Langue',

    welcomeKicker: 'DIRECTION ARTISTIQUE & STUDIO PUBLICITAIRE MULTILINGUE',
    welcomeTitle: 'Transformez vos photos produits en campagnes publicitaires abouties.',
    welcomeSubtitle:
      'Concevez votre stratégie par marché, préservez l’intégrité du produit original, composez des décors de studio et ajustez la typographie en arabe, français et anglais.',
    sampleDataNotice:
      'Vous consultez les campagnes et produits de démonstration de l’atelier pour explorer les outils immédiatement.',
    removeSampleDataBtn: 'Masquer les exemples',
    restoreSampleDataBtn: 'Restaurer les exemples',
    recentCampaignsTitle: 'Campagnes Récentes',
    recentCampaignsEmpty:
      'Aucune campagne enregistrée. Lancez une création pour composer votre premier visuel et ses textes.',
    savedProductsTitle: 'Catalogue de Produits Enregistrés',
    useProductInCampaign: 'Créer une campagne',
    styleGallerySpotlightTitle: 'Mouvements Esthétiques Internationaux',
    openInEditorBtn: 'Ouvrir dans l’éditeur',
    exploreStylesBtn: 'Choisir dans le flux créatif',

    wizardTitle: 'Création de Campagne Structurée',
    wizardStep1: '01. Produit & Photo',
    wizardStep2: '02. Marché & Format',
    wizardStep3: '03. Direction Visuelle',
    wizardStep4: '04. Palette & Brief',
    backBtn: 'Retour',
    nextStepBtn: 'Continuer',
    generateWithArgonBtn: 'Composer la campagne avec Gemini 4 Argon',
    generatingCampaignStatus: 'Conception créative Gemini 4 Argon et composition du décor...',
    applyBrandProfileLabel: 'Pré-remplir avec un profil de marque',
    selectSavedProductLabel: 'Ou sélectionner un produit du catalogue',
    uploadProductPhotosLabel: 'Photographie du Produit',
    uploadPhotoHint: 'Importez une photo PNG/JPG ou choisissez un produit du catalogue',
    preserveProductPhotoLabel: 'Préserver la photo du produit',
    preserveProductPhotoDesc:
      'Activé par défaut — Conserve le flacon, l’étiquette et les détails intacts tout en générant l’environnement autour du produit.',
    productNameLabel: 'Nom du Produit',
    productDescriptionLabel: 'Description Factuelle du Produit',
    productPriceLabel: 'Prix / Édition (Optionnel)',
    verifiedFeaturesLabel: 'Caractéristiques Vérifiées',
    verifiedFeaturesHint:
      'Forma Atelier utilise uniquement ces faits vérifiés sans jamais inventer de promesses, d’avis ou de remises.',
    addFeatureBtn: 'Ajouter un argument vérifié',
    targetAudienceLabel: 'Audience Cible',
    targetMarketLabel: 'Pays ou Marché Cible',
    adLanguageLabel: 'Langue de la Campagne',
    arabicDialectLabel: 'Registre ou Dialecte Arabe',
    platformFormatLabel: 'Plateforme & Format',
    campaignGoalLabel: 'Objectif de la Campagne',
    styleGalleryTitle: 'Galerie de Styles Visuels Internationaux',
    styleGallerySubtitle:
      'Directions artistiques originales inspirées des grands courants du design mondial. Ajustez la palette et l’intensité.',
    styleIntensityLabel: 'Intensité de l’Atmosphère & des Ombres',
    paletteCustomizationLabel: 'Palette de Couleurs (Fond · Typographie · Accent)',
    desiredCtaLabel: 'Appel à l’Action (CTA)',
    wordsToIncludeLabel: 'Mots ou Détails à Inclure',
    wordsToAvoidLabel: 'Mots ou Angles à Éviter',
    missingPromoClaimWarning:
      'Vous avez choisi l’objectif « Promotion », mais aucune remise précise ne figure dans les caractéristiques vérifiées. Ajoutez l’offre vérifiée ci-dessus, sinon Argon rédigera sans inventer de réduction.',
    validationErrorBanner: 'Veuillez renseigner les champs obligatoires avant de continuer.',

    goalLaunch: 'Lancement de produit',
    goalPromotion: 'Promotion commerciale',
    goalAwareness: 'Notoriété de marque',
    goalVisits: 'Trafic & Visites en boutique',
    goalLeads: 'Génération de prospects',

    dialectMsa: 'Arabe Standard Moderne (فصحى العصر)',
    dialectGulf: 'Arabe du Golfe / Khaliji (خليجي)',
    dialectLevantine: 'Arabe Levantin / Shami (شامي)',
    dialectEgyptian: 'Arabe Égyptien (مصري)',
    dialectMaghrebi: 'Arabe Maghrébin (مغاربي)',

    toneRefined: 'Raffiné',
    toneFriendly: 'Chaleureux',
    toneBold: 'Audacieux',

    editorTitle: 'Éditeur Visuel & Typographique',
    formatPreviewLabel: 'Format & Zones de Sécurité',
    safeAreaToggle: 'Zones Sûres',
    backdropLight: 'Fond Ivoire',
    backdropDark: 'Fond Chambre Noire',
    preservePhotoBadge: 'Photo Produit Préservée',
    copyVariantsTab: 'Textes & Tons',
    typographyLayoutTab: 'Mise en Page',
    backdropPaletteTab: 'Décor & Palette',
    argonReasoningTab: 'Note Argon',
    headlineInputLabel: 'Titre Principal (Calque Éditable)',
    useAlternateHeadlineToggle: 'Utiliser le titre alternatif',
    subtitleInputLabel: 'Sous-titre / Description Courte',
    ctaInputLabel: 'Bouton d’Appel à l’Action',
    priceBadgeInputLabel: 'Étiquette de Prix / Édition',
    showPriceBadgeToggle: 'Afficher le prix sur le visuel',
    fontSizeScaleLabel: 'Échelle Typographique',
    textAlignLabel: 'Alignement du Texte',
    verticalPositionLabel: 'Ancrage Vertical',
    scrimOpacityLabel: 'Voile de Contraste',
    productScaleLabel: 'Échelle du Produit',
    cropZoomLabel: 'Recadrage & Zoom',
    frameBorderToggle: 'Filet d’Encadrement Éditorial',
    replaceProductImageBtn: 'Remplacer la photo produit',
    regenerateBackgroundBtn: 'Régénérer uniquement le décor',
    refreshCopyWithArgonBtn: 'Nouvelles idées de textes (Argon)',
    saveCampaignBtn: 'Enregistrer',
    duplicateCampaignBtn: 'Dupliquer',
    exportPngBtn: 'Exporter PNG',
    exportJpgBtn: 'Exporter JPG',
    copyAdTextBtn: 'Copier le texte social',
    copiedConfirmation: 'Texte publicitaire copié',
    savedConfirmation: 'Campagne enregistrée dans les archives',
    argonAccessNoticeTitle: 'Information d’accès Gemini 4 Argon (gemini-4-argon)',
    retryArgonBtn: 'Réessayer avec Gemini 4 Argon',

    libraryTitle: 'Bibliothèque de Campagnes',
    librarySubtitle: 'Consultez, dupliquez, rouvrez ou supprimez vos créations publicitaires.',
    searchCampaignsPlaceholder: 'Rechercher par produit, marché ou titre...',
    filterAllFormats: 'Tous les formats',
    duplicateBtn: 'Dupliquer',
    deleteBtn: 'Supprimer',
    libraryEmptyState: 'Aucune campagne ne correspond à votre recherche.',

    brandsTitle: 'Profils de Marque & Catalogue',
    brandsSubtitle: 'Enregistrez votre nom, monogramme, palette, ton éditorial et produits pour vos futures campagnes.',
    newBrandProfileBtn: 'Nouveau Profil de Marque',
    brandNameInput: 'Nom de l’Entreprise / Maison',
    brandTaglineInput: 'Signature / Positionnement',
    brandMonogramInput: 'Monogramme (2–3 lettres)',
    defaultToneInput: 'Ton Éditorial par Défaut',
    defaultMarketInput: 'Marché Principal',
    saveBrandBtn: 'Enregistrer le profil',
    useBrandForCampaignBtn: 'Créer une campagne avec ce profil',
    deleteBrandBtn: 'Supprimer',
    addSavedProductTitle: 'Ajouter un produit au catalogue',

    settingsTitle: 'Paramètres de l’Atelier',
    settingsSubtitle: 'Gérez la langue de l’interface, les préférences d’édition et les données locales.',
    interfaceLanguageSetting: 'Langue de l’Interface',
    studioDefaultsSection: 'Préférences par Défaut de l’Éditeur',
    aiModelArchitectureSection: 'Configuration Obligatoire des Modèles IA',
    coreReasoningModelLabel: 'Modèle de Raisonnement & Rédaction Multilingue',
    visualGenerationModelLabel: 'Modèle de Génération d’Image',
    testArgonConnectionBtn: 'Vérifier la connexion gemini-4-argon',
    dataManagementSection: 'Données Locales & Exemples',
    clearAllLocalDataBtn: 'Réinitialiser toutes les données locales',
  },

  ar: {
    brandName: 'فورما أتيليه',
    brandSubtitle: 'استوديو الإعلانات والإخراج الإبداعي',
    navDashboard: 'الاستوديو',
    navCreate: 'حملة جديدة',
    navEditor: 'محرر الإعلان',
    navLibrary: 'مكتبة الحملات',
    navBrands: 'هويات العلامات',
    navSettings: 'الإعدادات',
    createCampaignCta: 'إنشاء حملة إعلانية',
    languageLabel: 'واجهة الاستوديو',

    welcomeKicker: 'استوديو التخطيط الإعلاني والتصميم التحريري متعدد اللغات',
    welcomeTitle: 'حوّل صور منتجاتك إلى حملات إعلانية متكاملة وجاهزة للنشر.',
    welcomeSubtitle:
      'خطّط لحملتك التسويقية، وحافظ على تفاصيل المنتج الأصلي، وابتكر خلفيات استوديو راقية مع نصوص إعلانية متقنة ومكيّفة ثقافياً بالعربية والفرنسية والإنجليزية.',
    sampleDataNotice:
      'يتم حالياً عرض نماذج أولية من الحملات والمنتجات لتجربة أدوات الاستوديو فوراً.',
    removeSampleDataBtn: 'إزالة البيانات النموذجية',
    restoreSampleDataBtn: 'استعادة البيانات النموذجية',
    recentCampaignsTitle: 'أحدث الحملات الإعلانية',
    recentCampaignsEmpty:
      'لا توجد حملات محفوظة حالياً. ابدأ حملة جديدة لتصميم إعلانك الأول.',
    savedProductsTitle: 'كتالوج المنتجات المحفوظة',
    useProductInCampaign: 'إنشاء حملة للمنتج',
    styleGallerySpotlightTitle: 'اتجاهات التصميم العالمية',
    openInEditorBtn: 'فتح في المحرر',
    exploreStylesBtn: 'استخدام في حملة جديدة',

    wizardTitle: 'خطوات تصميم الحملة الإعلانية',
    wizardStep1: '01. المنتج والصور',
    wizardStep2: '02. السوق والمقاس',
    wizardStep3: '03. الطابع البصري',
    wizardStep4: '04. الألوان والتوجيه',
    backBtn: 'السابق',
    nextStepBtn: 'الخطوة التالية',
    generateWithArgonBtn: 'توليد الحملة عبر Gemini 4 Argon',
    generatingCampaignStatus: 'جاري صياغة الفكرة الإعلانية وتصميم المشهد عبر Gemini 4 Argon...',
    applyBrandProfileLabel: 'تعبئة تلقائية من هوية علامة تجارية',
    selectSavedProductLabel: 'أو اختيار منتج محفوظ من الكتالوج',
    uploadProductPhotosLabel: 'صور المنتج',
    uploadPhotoHint: 'ارفع صورة المنتج بصيغة PNG/JPG أو اختر من الكتالوج',
    preserveProductPhotoLabel: 'الحفاظ على صورة المنتج الأصلية',
    preserveProductPhotoDesc:
      'مفعّل افتراضياً — يحافظ على العبوة والشعار وتفاصيل المنتج دون تغيير مع تصميم الخلفية والإضاءة المحيطة.',
    productNameLabel: 'اسم المنتج',
    productDescriptionLabel: 'وصف المنتج الفعلي',
    productPriceLabel: 'السعر / الإصدار (اختياري)',
    verifiedFeaturesLabel: 'المميزات والمواصفات الموثّقة',
    verifiedFeaturesHint:
      'يلتزم الاستوديو بهذه الحقائق الموثّقة فقط ولا يختلق أي فوائد أو خصومات أو شهادات غير موجودة.',
    addFeatureBtn: 'إضافة ميزة موثّقة',
    targetAudienceLabel: 'الجمهور المستهدف',
    targetMarketLabel: 'الدولة أو السوق المستهدف',
    adLanguageLabel: 'لغة الإعلان',
    arabicDialectLabel: 'اللهجة العربية أو المستوى اللغوي',
    platformFormatLabel: 'المنصة ومقاس التصميم',
    campaignGoalLabel: 'هدف الحملة الإعلانية',
    styleGalleryTitle: 'معرض الأساليب البصرية العالمية',
    styleGallerySubtitle:
      'اتجاهات فنية أصيلة مستوحاة من مدارس التصميم العالمية مع إمكانية تعديل لوحة الألوان ودرجة التباين.',
    styleIntensityLabel: 'قوة الإضاءة والظلال الفنية',
    paletteCustomizationLabel: 'لوحة ألوان الحملة (الخلفية · النص · اللون المميز)',
    desiredCtaLabel: 'عبارة الحث على اتخاذ إجراء (CTA)',
    wordsToIncludeLabel: 'كلمات أو تفاصيل يُراد تضمينها',
    wordsToAvoidLabel: 'كلمات أو عبارات يُراد تجنبها',
    missingPromoClaimWarning:
      'لقد اخترت هدف "عرض ترويجي" دون ذكر نسبة خصم أو عرض محدد في المميزات الموثّقة. أضف تفاصيل العرض أعلاه، أو سيكتفي Argon بإبراز قيمة المنتج دون اختلاق أي خصم.',
    validationErrorBanner: 'يرجى استكمال الحقول المطلوبة للمنتج أو السوق قبل المتابعة.',

    goalLaunch: 'إطلاق منتج جديد',
    goalPromotion: 'عرض ترويجي',
    goalAwareness: 'الوعي بالعلامة التجارية',
    goalVisits: 'زيادة الزيارات للمتجر أو الموقع',
    goalLeads: 'جذب عملاء محتملين',

    dialectMsa: 'فصحى العصر الراقية',
    dialectGulf: 'لهجة خليجية',
    dialectLevantine: 'لهجة شامية',
    dialectEgyptian: 'لهجة مصرية',
    dialectMaghrebi: 'لهجة مغاربية',

    toneRefined: 'راقية وفخمة',
    toneFriendly: 'ودّية وقريبة',
    toneBold: 'قوية وجريئة',

    editorTitle: 'محرر الإعلان والنصوص البصرية',
    formatPreviewLabel: 'المقاس والمناطق الآمنة',
    safeAreaToggle: 'إظهار المناطق الآمنة',
    backdropLight: 'خلفية عرض فاتحة',
    backdropDark: 'خلفية عرض داكنة',
    preservePhotoBadge: 'تم الحفاظ على صورة المنتج',
    copyVariantsTab: 'النصوص والنبرات',
    typographyLayoutTab: 'التخطيط والقص',
    backdropPaletteTab: 'الخلفية والألوان',
    argonReasoningTab: 'توجيه Argon',
    headlineInputLabel: 'العنوان الرئيسي للإعلان',
    useAlternateHeadlineToggle: 'التبديل إلى العنوان البديل',
    subtitleInputLabel: 'الوصف المختصر على التصميم',
    ctaInputLabel: 'زر الدعوة لاتخاذ إجراء (CTA)',
    priceBadgeInputLabel: 'بطاقة السعر / الإصدار',
    showPriceBadgeToggle: 'إظهار السعر على التصميم',
    fontSizeScaleLabel: 'حجم الخطوط',
    textAlignLabel: 'محاذاة النص',
    verticalPositionLabel: 'موضع كتلة النص',
    scrimOpacityLabel: 'تعتيم الخلفية لوضوح النص',
    productScaleLabel: 'حجم صورة المنتج',
    cropZoomLabel: 'التكبير والقص',
    frameBorderToggle: 'إطار تحريري رفيع',
    replaceProductImageBtn: 'استبدال صورة المنتج',
    regenerateBackgroundBtn: 'إعادة توليد الخلفية فقط',
    refreshCopyWithArgonBtn: 'طلب أفكار نصوص جديدة (Argon)',
    saveCampaignBtn: 'حفظ التصميم',
    duplicateCampaignBtn: 'تكرار',
    exportPngBtn: 'تحميل PNG',
    exportJpgBtn: 'تحميل JPG',
    copyAdTextBtn: 'نسخ نص المنصة',
    copiedConfirmation: 'تم نسخ النص الإعلاني إلى الحافظة',
    savedConfirmation: 'تم حفظ الحملة في المكتبة',
    argonAccessNoticeTitle: 'تنبيه إعداد نموذج Gemini 4 Argon (gemini-4-argon)',
    retryArgonBtn: 'إعادة المحاولة عبر Gemini 4 Argon',

    libraryTitle: 'مكتبة الحملات والتصاميم',
    librarySubtitle: 'احفظ تصاميمك، أو أعد فتحها للتعديل، أو كررها لمقاسات أخرى.',
    searchCampaignsPlaceholder: 'ابحث باسم المنتج أو السوق أو العنوان...',
    filterAllFormats: 'جميع المقاسات',
    duplicateBtn: 'تكرار',
    deleteBtn: 'حذف',
    libraryEmptyState: 'لا توجد حملات مطابقة لبحثك الحالي.',

    brandsTitle: 'ملفات العلامات التجارية والمنتجات',
    brandsSubtitle: 'احفظ اسم النشاط التجاري والشعار والألوان ونبرة الكتابة والمنتجات لإعادة استخدامها بسرعة.',
    newBrandProfileBtn: 'إضافة علامة تجارية',
    brandNameInput: 'اسم العلامة أو النشاط التجاري',
    brandTaglineInput: 'الشعار اللفظي / الرؤية',
    brandMonogramInput: 'الأحرف المختصرة للشعار',
    defaultToneInput: 'نبرة الكتابة المفضلة',
    defaultMarketInput: 'السوق الرئيسي',
    saveBrandBtn: 'حفظ ملف العلامة',
    useBrandForCampaignBtn: 'بدء حملة بهذه العلامة',
    deleteBrandBtn: 'حذف الملف',
    addSavedProductTitle: 'إضافة منتج إلى كتالوج الاستوديو',

    settingsTitle: 'إعدادات الاستوديو وتفضيلات التصميم',
    settingsSubtitle: 'تحكّم في لغة الواجهة، واتجاه العرض، وإعدادات الحفظ المحلي ونموذج Gemini 4 Argon.',
    interfaceLanguageSetting: 'لغة واجهة المستخدم',
    studioDefaultsSection: 'التفضيلات الافتراضية للمحرر',
    aiModelArchitectureSection: 'إعدادات نموذج Gemini 4 Argon والتوليد البصري',
    coreReasoningModelLabel: 'النموذج الأساسي للتخطيط وكتابة النصوص',
    visualGenerationModelLabel: 'نموذج توليد الصور الإعلانية',
    testArgonConnectionBtn: 'فحص الاتصال بنموذج gemini-4-argon',
    dataManagementSection: 'إدارة البيانات المحلية والنماذج',
    clearAllLocalDataBtn: 'مسح جميع البيانات المحفوظة محلياً',
  },
};
