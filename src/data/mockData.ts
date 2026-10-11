import { EUCountryVAT, Currency, Product, StockAdjustment, GDPRPreferences, ConsentLog } from '../types';

export const EU_COUNTRIES: EUCountryVAT[] = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪', vatRate: 0.19, standardCurrency: 'EUR', language: 'Deutsch' },
  { code: 'FR', name: 'France', flag: '🇫🇷', vatRate: 0.20, standardCurrency: 'EUR', language: 'Français' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', vatRate: 0.22, standardCurrency: 'EUR', language: 'Italiano' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', vatRate: 0.21, standardCurrency: 'EUR', language: 'Español' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', vatRate: 0.21, standardCurrency: 'EUR', language: 'Nederlands' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', vatRate: 0.21, standardCurrency: 'EUR', language: 'Français / Nederlands' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', vatRate: 0.20, standardCurrency: 'EUR', language: 'Deutsch' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', vatRate: 0.25, standardCurrency: 'SEK', language: 'Svenska' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', vatRate: 0.25, standardCurrency: 'DKK', language: 'Dansk' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', vatRate: 0.255, standardCurrency: 'EUR', language: 'Suomi' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', vatRate: 0.23, standardCurrency: 'EUR', language: 'English' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', vatRate: 0.23, standardCurrency: 'PLN', language: 'Polski' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', vatRate: 0.23, standardCurrency: 'EUR', language: 'Português' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿', vatRate: 0.21, standardCurrency: 'CZK', language: 'Čeština' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', vatRate: 0.24, standardCurrency: 'EUR', language: 'Ελληνικά' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', vatRate: 0.081, standardCurrency: 'CHF', language: 'Deutsch / Français / Italiano' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', vatRate: 0.20, standardCurrency: 'GBP', language: 'English' },
];

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro (Base Transaction Currency)', rateToEUR: 1.0, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToEUR: 0.85, flag: '🇬🇧' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToEUR: 1.09, flag: '🇺🇸' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rateToEUR: 0.96, flag: '🇨🇭' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rateToEUR: 11.45, flag: '🇸🇪' },
  { code: 'DKK', symbol: 'kr.', name: 'Danish Krone', rateToEUR: 7.46, flag: '🇩🇰' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', rateToEUR: 4.28, flag: '🇵🇱' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rateToEUR: 11.72, flag: '🇳🇴' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'doc-001',
    slug: 'registered-bulgarian-drivers-license',
    buyerSubtitle: 'Where Can I Buy, How to Buy & How Much for a Bulgarian License in Netherlands & Europe',
    sku: 'BG-DRV-001',
    name: 'Registered Bulgarian Drivers License',
    category: 'Driver Licenses',
    description: 'Official registered Bulgarian driving license (EU Format). Registered in the Bulgarian Ministry of Transport & Executive Agency Road Transport Administration database with physical micro-text and UV security.',
    priceEUR: 427.50,
    originalPriceEUR: 450.00,
    originCountry: 'Bulgaria',
    originFlag: '🇧🇬',
    imageUrl: '/catalogue/doc-001.webp',
    galleryImages: [
      '/catalogue/doc-001.webp'
    ],
    totalStock: 42,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 25 },
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 17 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Sofia Bureau)',
    buyerGuide: {
      howToBuy: 'To buy bulgarian drivers license in Netherlands, Germany & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Ministry of Transport and Road Administration prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, Germany & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Ministry of Transport and Road Administration records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy bulgarian drivers license in Netherlands, Bulgaria, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Ministry of Transport and Road Administration prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy bulgarian drivers license with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for bulgarian drivers license in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Ministry of Transport and Road Administration, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this bulgarian drivers license registered in official government databases?',
        answer: 'Yes, full database registration is processed in Ministry of Transport and Road Administration with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Bulgaria', 'Driver License', 'EU Driving Permit', 'Registered'],
    searchAliases: ['how to buy bulgarian drivers license in netherlands', 'where can i buy bulgarian drivers license in netherlands', 'how much for bulgarian drivers license in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for bulgarian drivers license in uk', 'where can i buy bulgarian drivers license in germany'],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-002',
    slug: 'registered-austrian-drivers-license',
    buyerSubtitle: 'How to Buy & Where Can I Buy an Austrian License in Germany, Netherlands & Europe',
    sku: 'AT-DRV-002',
    name: 'Registered Austrian Drivers License',
    category: 'Driver Licenses',
    description: 'High-security Austrian credit-card format driving license (Führerschein). Full registration in the Austrian Transport Registry (Führerscheinregister) with tactile surface features.',
    priceEUR: 465.50,
    originalPriceEUR: 490.00,
    originCountry: 'Austria',
    originFlag: '🇦🇹',
    imageUrl: '/catalogue/doc-002.webp',
    galleryImages: [
      '/catalogue/doc-002.webp'
    ],
    totalStock: 30,
    lowStockThreshold: 8,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 20 },
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 10 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Vienna Bureau)',
    buyerGuide: {
      howToBuy: 'To buy austrian drivers license in Germany, Netherlands & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Austrian Führerscheinregister prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Germany, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Austrian Führerscheinregister records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy austrian drivers license in Netherlands, Austria, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Austrian Führerscheinregister prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy austrian drivers license with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for austrian drivers license in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Austrian Führerscheinregister, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this austrian drivers license registered in official government databases?',
        answer: 'Yes, full database registration is processed in Austrian Führerscheinregister with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Austria', 'Führerschein', 'Driver License', 'EU Format'],
    searchAliases: ['how to buy austrian drivers license in netherlands', 'where can i buy austrian drivers license in netherlands', 'how much for austrian drivers license in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for austrian drivers license in uk', 'where can i buy austrian drivers license in germany'],
    lastRestocked: '2026-08-09',
  },
  {
    id: 'doc-003',
    sku: 'US-DRV-003',
    name: 'Authentic US Driver\'s License (REAL ID Compliant)',
    category: 'Driver Licenses',
    description: 'State-issued REAL ID compliant American driving license with magnetic stripe encoding, barcode scanability, and high-definition holographic state seal.',
    priceEUR: 494.00,
    originalPriceEUR: 520.00,
    originCountry: 'United States',
    originFlag: '🇺🇸',
    imageUrl: '/catalogue/doc-003.jpg',
    galleryImages: [
      '/catalogue/doc-003.jpg'
    ],
    totalStock: 25,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 25 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (US Desk)',
    tags: ['United States', 'REAL ID', 'Driver License', 'USA'],
    lastRestocked: '2026-08-11',
  },
  {
    id: 'doc-004',
    slug: 'registered-belgian-id-card-eid',
    buyerSubtitle: 'How to Buy & Where to Buy a Belgian eID Card in Netherlands & Belgium',
    sku: 'BE-IDC-004',
    name: 'Registered Belgian ID Card (eID)',
    category: 'Identity Cards',
    description: 'Official Belgian Electronic Identity Card (eID) equipped with contactless microchip, biometric optical security, and federal population register entry.',
    priceEUR: 361.00,
    originalPriceEUR: 380.00,
    originCountry: 'Belgium',
    originFlag: '🇧🇪',
    imageUrl: '/catalogue/doc-004.jpg',
    galleryImages: [
      '/catalogue/doc-004.jpg'
    ],
    totalStock: 35,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 35 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Brussels Bureau)',
    buyerGuide: {
      howToBuy: 'To buy belgian id card in Netherlands, France & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Belgian National Register (Rijksregister) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, France & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Belgian National Register (Rijksregister) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy belgian id card in Netherlands, Belgium, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Belgian National Register (Rijksregister) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy belgian id card with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for belgian id card in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Belgian National Register (Rijksregister), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this belgian id card registered in official government databases?',
        answer: 'Yes, full database registration is processed in Belgian National Register (Rijksregister) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Belgium', 'eID', 'Identity Card', 'EU Identity'],
    searchAliases: ['how to buy belgian id card in netherlands', 'where can i buy belgian id card in netherlands', 'how much for belgian id card in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for belgian id card in uk', 'where can i buy belgian id card in germany'],
    lastRestocked: '2026-08-08',
  },
  {
    id: 'doc-005',
    slug: 'registered-danish-drivers-license-k-rekort',
    buyerSubtitle: 'Where Can I Buy & How Much for a Danish Driver\'s License in Netherlands & Europe',
    sku: 'DK-DRV-005',
    name: 'Registered Danish Drivers License (Kørekort)',
    category: 'Driver Licenses',
    description: 'Danish EU-format driving permit (Kørekort) registered in the national road safety database (Færdselsstyrelsen) featuring laser-etched photo security.',
    priceEUR: 451.25,
    originalPriceEUR: 475.00,
    originCountry: 'Denmark',
    originFlag: '🇩🇰',
    imageUrl: '/catalogue/doc-005.jpg',
    galleryImages: [
      '/catalogue/doc-005.jpg'
    ],
    totalStock: 18,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 18 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Copenhagen Bureau)',
    buyerGuide: {
      howToBuy: 'To buy danish drivers license in Netherlands, Germany & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Færdselsstyrelsen Driver Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, Germany & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Færdselsstyrelsen Driver Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy danish drivers license in Netherlands, Denmark, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Færdselsstyrelsen Driver Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy danish drivers license with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for danish drivers license in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Færdselsstyrelsen Driver Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this danish drivers license registered in official government databases?',
        answer: 'Yes, full database registration is processed in Færdselsstyrelsen Driver Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Denmark', 'Kørekort', 'Driver License', 'Nordic'],
    searchAliases: ['how to buy danish drivers license in netherlands', 'where can i buy danish drivers license in netherlands', 'how much for danish drivers license in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for danish drivers license in uk', 'where can i buy danish drivers license in germany'],
    lastRestocked: '2026-08-07',
  },
  {
    id: 'doc-006',
    sku: 'EU-DRV-006',
    name: 'Fast-Track EU Driver\'s License (Express 72-Hour Fulfillment)',
    category: 'Driver Licenses',
    description: 'Accelerated EU driving permit processing with priority registry insertion and 72-hour DHL Express insured delivery across all 27 EU member states.',
    priceEUR: 522.50,
    originalPriceEUR: 550.00,
    originCountry: 'Germany',
    originFlag: '🇩🇪',
    imageUrl: '/catalogue/doc-006.jpg',
    galleryImages: [
      '/catalogue/doc-006.jpg'
    ],
    totalStock: 50,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 30 },
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 20 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.08,
    supplierName: 'EU Document LLC (Express Desk)',
    tags: ['EU Driving License', '3-Day Express', 'Fast Track', 'Registered'],
    lastRestocked: '2026-08-12',
  },
  {
    id: 'doc-007',
    sku: 'HU-DRV-007',
    name: 'Registered Hungarian Driver\'s License (Vezetői Engedély)',
    category: 'Driver Licenses',
    description: 'Official Hungarian driving license card (Vezetői engedély) linked with the Central Data Processing Bureau database, crafted with optical laser elements.',
    priceEUR: 418.00,
    originalPriceEUR: 440.00,
    originCountry: 'Hungary',
    originFlag: '🇭🇺',
    imageUrl: '/catalogue/doc-007.jpg',
    galleryImages: [
      '/catalogue/doc-007.jpg'
    ],
    totalStock: 22,
    lowStockThreshold: 6,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 22 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Budapest Bureau)',
    tags: ['Hungary', 'Vezetői Engedély', 'Driver License', 'Central Europe'],
    lastRestocked: '2026-08-05',
  },
  {
    id: 'doc-008',
    sku: 'IT-IDC-008',
    name: 'Italian Electronic ID Card (Carta d\'Identità CIE)',
    category: 'Identity Cards',
    description: 'Italian Carta d\'Identità Elettronica (CIE 3.0) complete with NFC microchip, MRZ zone scanability, and official Ministry of Interior record registration.',
    priceEUR: 370.50,
    originalPriceEUR: 390.00,
    originCountry: 'Italy',
    originFlag: '🇮🇹',
    imageUrl: '/catalogue/doc-008.png',
    galleryImages: [
      '/catalogue/doc-008.png'
    ],
    totalStock: 28,
    lowStockThreshold: 8,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 18 },
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 10 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Rome Bureau)',
    tags: ['Italy', 'EEA ID', 'Ital Card', 'Carta d\'Identità', 'Carta d\'Identità Italiana', 'CIE 3.0', 'Electronic ID', 'Ministero dell\'Interno', 'EU Identity'],
    searchAliases: ['eea id', 'ital card', 'carta d identita', 'carta identita', 'carta d identità italiana', 'cie 3.0', 'cie', 'italian id card', 'electronic id card italy'],
    lastRestocked: '2026-08-09',
  },
  {
    id: 'doc-009',
    slug: 'registered-dutch-identity-card-nederlandse-identiteitskaart',
    buyerSubtitle: 'Where Can I Buy, How to Buy & How Much for a Dutch ID Card in Netherlands & UK',
    sku: 'NL-IDC-009',
    name: 'Registered Dutch Identity Card (Nederlandse Identiteitskaart)',
    category: 'Identity Cards',
    description: 'High-precision Dutch identity card featuring Kinegram optic security, RFID contactless chip, and complete BRP population registry indexing.',
    priceEUR: 389.50,
    originalPriceEUR: 410.00,
    originCountry: 'Netherlands',
    originFlag: '🇳🇱',
    imageUrl: '/catalogue/doc-009.jpg',
    galleryImages: [
      '/catalogue/doc-009.jpg'
    ],
    totalStock: 32,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 32 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Amsterdam Bureau)',
    buyerGuide: {
      howToBuy: 'To buy dutch identity card in Netherlands, UK & Europe, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Basisregistratie Personen (BRP) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK & Europe within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Basisregistratie Personen (BRP) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy dutch identity card in Netherlands, Netherlands, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Basisregistratie Personen (BRP) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy dutch identity card with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for dutch identity card in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Basisregistratie Personen (BRP), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this dutch identity card registered in official government databases?',
        answer: 'Yes, full database registration is processed in Basisregistratie Personen (BRP) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Netherlands', 'Nederlandse Identiteitskaart', 'Dutch ID', 'BRP Registered', 'ID-Kaart', 'Registratiekaart'],
    searchAliases: ['nederlandse identiteitskaart', 'dutch id card', 'registratiekaart', 'dutch id', 'netherlands id card', 'id card netherlands', 'brp registration card', 'how to buy dutch identity card in netherlands', 'where can i buy dutch identity card in netherlands', 'how much for dutch identity card in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for dutch identity card in uk', 'where can i buy dutch identity card in germany'],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-010',
    slug: 'italian-eu-residence-permit-permesso-di-soggiorno-ue',
    buyerSubtitle: 'How to Buy an Italian EU Residence Permit in Italy, Netherlands & Europe',
    sku: 'IT-RES-010',
    name: 'Italian EU Residence Permit (Permesso di Soggiorno UE)',
    category: 'Residence Permits',
    description: 'Official Italian biometric EU residence permit card granting work, residency, and unrestricted travel access across all 29 Schengen member states.',
    priceEUR: 617.50,
    originalPriceEUR: 650.00,
    originCountry: 'Italy',
    originFlag: '🇮🇹',
    imageUrl: '/catalogue/doc-010.jpg',
    galleryImages: [
      '/catalogue/doc-010.jpg'
    ],
    totalStock: 15,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 15 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Rome Bureau)',
    buyerGuide: {
      howToBuy: 'To buy italian eu residence permit in Italy, Netherlands & Germany, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Italian Immigration Registry (Questura) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Italy, Netherlands & Germany within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Italian Immigration Registry (Questura) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy italian eu residence permit in Netherlands, Italy, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Italian Immigration Registry (Questura) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy italian eu residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for italian eu residence permit in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Italian Immigration Registry (Questura), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this italian eu residence permit registered in official government databases?',
        answer: 'Yes, full database registration is processed in Italian Immigration Registry (Questura) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Italy', 'Permesso di Soggiorno', 'Residence Permit', 'Schengen'],
    searchAliases: ['how to buy italian eu residence permit in netherlands', 'where can i buy italian eu residence permit in netherlands', 'how much for italian eu residence permit in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for italian eu residence permit in uk', 'where can i buy italian eu residence permit in germany'],
    lastRestocked: '2026-08-06',
  },
  {
    id: 'doc-011',
    slug: 'swedish-eu-residence-permit-uppehallstillstandskort',
    buyerSubtitle: 'Where Can I Buy & How Much for a Swedish Residence Permit in Netherlands & Europe',
    sku: 'SE-RES-011',
    name: 'Swedish EU Residence Permit (Uppehållstillståndskort)',
    category: 'Residence Permits',
    description: 'Swedish Migrationsverket residence permit card with embedded biometrics, high-security microprint, and legal EU right of residency certification.',
    priceEUR: 646.00,
    originalPriceEUR: 680.00,
    originCountry: 'Sweden',
    originFlag: '🇸🇪',
    imageUrl: '/catalogue/doc-011.webp',
    galleryImages: [
      '/catalogue/doc-011.webp'
    ],
    totalStock: 14,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 14 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document LLC (Stockholm Bureau)',
    buyerGuide: {
      howToBuy: 'To buy swedish residence permit in Netherlands, Germany & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Migrationsverket Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, Germany & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Migrationsverket Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy swedish residence permit in Netherlands, Sweden, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Migrationsverket Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy swedish residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for swedish residence permit in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Migrationsverket Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this swedish residence permit registered in official government databases?',
        answer: 'Yes, full database registration is processed in Migrationsverket Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Sweden', 'Uppehållstillstånd', 'Residence Permit', 'Nordic'],
    searchAliases: ['uppehallstillstandskort', 'uppehållstillståndskort', 'eu opholdskort sverige', 'swedish residence permit', 'opholdskort', 'how to buy swedish residence permit in netherlands', 'where can i buy swedish residence permit in netherlands', 'how much for swedish residence permit in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for swedish residence permit in uk', 'where can i buy swedish residence permit in germany'],
    lastRestocked: '2026-08-04',
  },
  {
    id: 'doc-012',
    slug: 'authentic-biometric-eu-passport-full-citizen-registration',
    buyerSubtitle: 'How to Buy, Where to Buy & How Much for an Authentic EU Passport in Netherlands & UK',
    sku: 'EU-PAS-012',
    name: 'Authentic Biometric EU Passport (Full Citizen Registration)',
    category: 'Passports',
    description: 'Official burgundy EU passport book with ICAO 9303 compliant e-Passport smart chip, biometric photo, UV watermark pages, and national database insertion.',
    priceEUR: 807.50,
    originalPriceEUR: 850.00,
    originCountry: 'Germany',
    originFlag: '🇩🇪',
    imageUrl: '/catalogue/doc-012.png',
    galleryImages: [
      '/catalogue/doc-012.png',
      '/catalogue/doc-012-g1.jpg'
    ],
    totalStock: 12,
    lowStockThreshold: 4,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 12 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EU Document LLC (Berlin Bureau)',
    buyerGuide: {
      howToBuy: 'To buy biometric eu passport in Netherlands, UK, Germany & Italy, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in EU Citizen Central Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK, Germany & Italy within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official EU Citizen Central Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy biometric eu passport in Netherlands, European Union, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into EU Citizen Central Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy biometric eu passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for biometric eu passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in EU Citizen Central Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this biometric eu passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in EU Citizen Central Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['EU Passport', 'Biometric', 'ICAO 9303', 'Citizenship'],
    searchAliases: ['how to buy biometric eu passport in netherlands', 'where can i buy biometric eu passport in netherlands', 'how much for biometric eu passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for biometric eu passport in uk', 'where can i buy biometric eu passport in germany'],
    lastRestocked: '2026-08-11',
  },
  {
    id: 'doc-013',
    slug: 'authentic-us-passport-book-e-passport-chip-and-registration',
    buyerSubtitle: 'Where Can I Buy & How Much for a US Biometric Passport Book in Europe & UK',
    sku: 'US-PAS-013',
    name: 'Authentic US Passport Book (e-Passport Chip & Registration)',
    category: 'Passports',
    description: 'United States electronic passport booklet with high-security poly-carbonate data page, embedded microchip, and State Department verification.',
    priceEUR: 845.50,
    originalPriceEUR: 890.00,
    originCountry: 'United States',
    originFlag: '🇺🇸',
    imageUrl: '/catalogue/doc-013.png',
    galleryImages: [
      '/catalogue/doc-013.png',
      '/catalogue/doc-013-g1.png',
      '/catalogue/doc-013-g2.png'
    ],
    totalStock: 10,
    lowStockThreshold: 3,
    warehouses: [
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 10 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EU Document LLC (US Desk)',
    buyerGuide: {
      howToBuy: 'To buy us passport book in UK, Netherlands & Germany, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in U.S. Department of State Passport Database prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to UK, Netherlands & Germany within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official U.S. Department of State Passport Database records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy us passport book in Netherlands, United States, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into U.S. Department of State Passport Database prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy us passport book with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for us passport book in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in U.S. Department of State Passport Database, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this us passport book registered in official government databases?',
        answer: 'Yes, full database registration is processed in U.S. Department of State Passport Database with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['US Passport', 'USA', 'Biometric Passport', 'State Dept Registered'],
    searchAliases: ['how to buy us passport book in netherlands', 'where can i buy us passport book in netherlands', 'how much for us passport book in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for us passport book in uk', 'where can i buy us passport book in germany'],
    lastRestocked: '2026-08-08',
  },
  {
    id: 'doc-014',
    slug: 'registered-dutch-biometric-passport-nederlands-paspoort',
    buyerSubtitle: 'Where Can I Buy, How to Buy & How Much for a Dutch Passport in Netherlands & Europe',
    sku: 'NL-PAS-014',
    name: 'Registered Dutch Biometric Passport (Nederlands Paspoort)',
    category: 'Passports',
    description: 'Official Kingdom of the Netherlands passport featuring tactile laser technology, ICAO e-chip, and full entry in the BRP & Kingdom Passport registry.',
    priceEUR: 779.00,
    originalPriceEUR: 820.00,
    originCountry: 'Netherlands',
    originFlag: '🇳🇱',
    imageUrl: '/catalogue/doc-014.webp',
    galleryImages: [
      '/catalogue/doc-014.webp'
    ],
    totalStock: 16,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 16 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EU Document LLC (The Hague Bureau)',
    buyerGuide: {
      howToBuy: 'To buy dutch biometric passport in Netherlands, UK & Europe, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Kingdom of the Netherlands Passport Registry (BRP) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK & Europe within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Kingdom of the Netherlands Passport Registry (BRP) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy dutch biometric passport in Netherlands, Netherlands, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Kingdom of the Netherlands Passport Registry (BRP) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy dutch biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for dutch biometric passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Kingdom of the Netherlands Passport Registry (BRP), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this dutch biometric passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in Kingdom of the Netherlands Passport Registry (BRP) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Netherlands', 'Dutch Passport', 'Nederlands Paspoort', 'EU Citizen'],
    searchAliases: ['how to buy dutch biometric passport in netherlands', 'where can i buy dutch biometric passport in netherlands', 'how much for dutch biometric passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for dutch biometric passport in uk', 'where can i buy dutch biometric passport in germany'],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-015',
    slug: 'original-registered-uk-passport-hm-passport-office',
    buyerSubtitle: 'Where Can I Buy, How to Buy & How Much for a UK Passport in UK & Netherlands',
    sku: 'UK-PAS-015',
    name: 'Original Registered UK Passport (HM Passport Office)',
    category: 'Passports',
    description: 'Official British passport (dark blue cover) with encrypted biometrics, watermark security threads, and HM Passport Office database registration.',
    priceEUR: 750.50,
    originalPriceEUR: 790.00,
    originCountry: 'United Kingdom',
    originFlag: '🇬🇧',
    imageUrl: '/catalogue/doc-015.webp',
    galleryImages: [
      '/catalogue/doc-015.webp'
    ],
    totalStock: 15,
    lowStockThreshold: 4,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 15 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EU Document LLC (London Bureau)',
    buyerGuide: {
      howToBuy: 'To buy uk passport in UK, Netherlands & Europe, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in HM Passport Office (HMPO) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to UK, Netherlands & Europe within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official HM Passport Office (HMPO) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy uk passport in Netherlands, United Kingdom, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into HM Passport Office (HMPO) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy uk passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for uk passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in HM Passport Office (HMPO), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this uk passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in HM Passport Office (HMPO) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['United Kingdom', 'UK Passport', 'HMPO', 'British Citizen'],
    searchAliases: ['how to buy uk passport in netherlands', 'where can i buy uk passport in netherlands', 'how much for uk passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for uk passport in uk', 'where can i buy uk passport in germany'],
    lastRestocked: '2026-08-07',
  },
  {
    id: 'doc-016',
    slug: 'real-canadian-electronic-passport-passport-canada-registered',
    buyerSubtitle: 'How to Buy & Where Can I Buy a Canadian Electronic Passport in UK & Europe',
    sku: 'CA-PAS-016',
    name: 'Real Canadian Electronic Passport (Passport Canada Registered)',
    category: 'Passports',
    description: 'Official Canadian e-Passport featuring historic watermarks, UV optical shift elements, and full Passport Canada system indexing.',
    priceEUR: 788.50,
    originalPriceEUR: 830.00,
    originCountry: 'Canada',
    originFlag: '🇨🇦',
    imageUrl: '/catalogue/doc-016.jpg',
    galleryImages: [
      '/catalogue/doc-016.jpg'
    ],
    totalStock: 11,
    lowStockThreshold: 3,
    warehouses: [
      { warehouseId: 'wh-ams', warehouseName: 'Amsterdam Logistics (NL-02)', location: 'Amsterdam, Netherlands', quantity: 11 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EU Document LLC (Americas Desk)',
    buyerGuide: {
      howToBuy: 'To buy canadian passport in UK, Netherlands & Europe, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Passport Canada Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to UK, Netherlands & Europe within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Passport Canada Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy canadian passport in Netherlands, Canada, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Passport Canada Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy canadian passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for canadian passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Passport Canada Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this canadian passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in Passport Canada Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Canada', 'Canadian Passport', 'ePassport', 'Canada ePassport', 'Passport Canada', 'Ottawa Registered'],
    searchAliases: ['canada epassport', 'passport canada', 'canadian passport', 'canadian electronic passport', 'epassport canada', 'how to buy canadian passport in netherlands', 'where can i buy canadian passport in netherlands', 'how much for canadian passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for canadian passport in uk', 'where can i buy canadian passport in germany'],
    lastRestocked: '2026-08-06',
  },
  {
    id: 'doc-017',
    slug: 'multi-entry-schengen-eu-visa-processing-1-5-year-visa',
    buyerSubtitle: 'How Much for & How to Buy a Multi-Entry Schengen Visa in Netherlands & UK',
    sku: 'EU-VIS-017',
    name: 'Multi-Entry Schengen EU Visa Processing (1 - 5 Year Visa)',
    category: 'EU Visas',
    description: 'Guaranteed multi-entry Schengen Visa sticker issuance valid across all 29 Schengen area nations with full embassy database clearance.',
    priceEUR: 332.50,
    originalPriceEUR: 350.00,
    originCountry: 'France',
    originFlag: '🇫🇷',
    imageUrl: '/catalogue/doc-017.png',
    galleryImages: [
      '/catalogue/doc-017.png',
      '/catalogue/doc-017-g1.png'
    ],
    totalStock: 60,
    lowStockThreshold: 15,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 40 },
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 20 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.02,
    supplierName: 'EU Document LLC (Visa Desk)',
    buyerGuide: {
      howToBuy: 'To buy schengen eu visa in Netherlands, UK, Germany & France, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Schengen Visa Information System (VIS) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK, Germany & France within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Schengen Visa Information System (VIS) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy schengen eu visa in Netherlands, European Union, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Schengen Visa Information System (VIS) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy schengen eu visa with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for schengen eu visa in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Schengen Visa Information System (VIS), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this schengen eu visa registered in official government databases?',
        answer: 'Yes, full database registration is processed in Schengen Visa Information System (VIS) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Schengen Visa', 'EU Visa', 'Multi-Entry', 'Travel Permit'],
    searchAliases: ['how to buy schengen eu visa in netherlands', 'where can i buy schengen eu visa in netherlands', 'how much for schengen eu visa in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for schengen eu visa in uk', 'where can i buy schengen eu visa in germany'],
    lastRestocked: '2026-08-12',
  },
  {
    id: 'doc-018',
    sku: 'FR-DRV-018',
    name: 'Registered French Driver\'s License (Permis de Conduire)',
    category: 'Driver Licenses',
    description: 'Official credit-card format French driving permit (Permis de conduire) fully registered in the national ANTS (Agence Nationale des Titres Sécurisés) database with 12 points initial balance.',
    priceEUR: 456.00,
    originalPriceEUR: 480.00,
    originCountry: 'France',
    originFlag: '🇫🇷',
    imageUrl: '/catalogue/doc-018.jpg',
    galleryImages: [
      '/catalogue/doc-018.jpg',
      '/catalogue/doc-018-g1.png',
      '/catalogue/doc-018-g2.jpg'
    ],
    totalStock: 35,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 25 },
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 10 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EuroExpressDocs (Paris Bureau)',
    tags: ['France', 'Permis de Conduire', 'ANTS Registered', 'Driver License'],
    lastRestocked: '2026-08-12',
  },
  {
    id: 'doc-019',
    sku: 'DE-DRV-019',
    name: 'Registered German Driver\'s License (EU Führerschein)',
    category: 'Driver Licenses',
    description: 'Official German EU credit-card format driving license fully registered in the KBA (Kraftfahrt-Bundesamt Flensburg) central traffic register with laser-etched photo and optical variable ink.',
    priceEUR: 484.50,
    originalPriceEUR: 510.00,
    originCountry: 'Germany',
    originFlag: '🇩🇪',
    imageUrl: '/catalogue/doc-001-g1.jpg',
    galleryImages: [
      '/catalogue/doc-001-g1.jpg',
      '/catalogue/doc-019-g1.png',
      '/catalogue/doc-019-g2.jpg',
      '/catalogue/doc-019-g3.jpg'
    ],
    totalStock: 40,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 40 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document Pro (Berlin Bureau)',
    tags: ['Germany', 'Führerschein', 'KBA Flensburg', 'Driver License'],
    lastRestocked: '2026-08-11',
  },
  {
    id: 'doc-020',
    sku: 'ES-DRV-020',
    name: 'Registered Spanish Driver\'s License (Carné de Conducir)',
    category: 'Driver Licenses',
    description: 'Official Spanish driving permit issued and registered with the DGT (Dirección General de Tráfico) portal, featuring tactile raised text and UV watermark seal.',
    priceEUR: 441.75,
    originalPriceEUR: 465.00,
    originCountry: 'Spain',
    originFlag: '🇪🇸',
    imageUrl: '/catalogue/doc-020.png',
    galleryImages: [
      '/catalogue/doc-020.png',
      '/catalogue/doc-020-g1.png'
    ],
    totalStock: 28,
    lowStockThreshold: 8,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 18 },
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 10 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'European Docs Express (Madrid Bureau)',
    tags: ['Spain', 'Carné de Conducir', 'DGT Registered', 'Driver License'],
    lastRestocked: '2026-08-09',
  },
  {
    id: 'doc-021',
    slug: 'registered-french-biometric-passport-passeport-biometrique',
    buyerSubtitle: 'How to Buy, Where to Buy & How Much for a French Passport in France, Netherlands & UK',
    sku: 'FR-PAS-021',
    name: 'Registered French Biometric Passport (Passeport Biométrique)',
    category: 'Passports',
    description: 'French biometric passport booklet registered with ANTS and Ministry of Foreign Affairs, featuring 36 security-printed pages, e-Passport RFID microchip, and UV Republic artwork.',
    priceEUR: 798.00,
    originalPriceEUR: 840.00,
    originCountry: 'France',
    originFlag: '🇫🇷',
    imageUrl: '/catalogue/doc-021.jpg',
    galleryImages: [
      '/catalogue/doc-021.jpg',
      '/catalogue/doc-021-g1.png'
    ],
    totalStock: 18,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 18 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EuroExpressDocs (Paris Bureau)',
    buyerGuide: {
      howToBuy: 'To buy french biometric passport in France, Netherlands & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in ANTS French Passport Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to France, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official ANTS French Passport Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy french biometric passport in Netherlands, France, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into ANTS French Passport Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy french biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for french biometric passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in ANTS French Passport Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this french biometric passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in ANTS French Passport Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['France', 'Passeport Biométrique', 'Passeport Biometrique', 'Biometric Passport', 'ANTS Registered', 'EU Citizen'],
    searchAliases: ['passeport biométrique', 'passeport biometrique', 'biométrique passeport', 'biometrique passeport', 'biometrics in french', 'french passport', 'french biometric passport', 'how to buy french biometric passport in netherlands', 'where can i buy french biometric passport in netherlands', 'how much for french biometric passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for french biometric passport in uk', 'where can i buy french biometric passport in germany'],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-022',
    slug: 'registered-spanish-biometric-passport-pasaporte-espanol',
    buyerSubtitle: 'Where Can I Buy & How to Buy a Spanish Biometric Passport in Spain & Netherlands',
    sku: 'ES-PAS-022',
    name: 'Registered Spanish Biometric Passport (Pasaporte Español)',
    category: 'Passports',
    description: 'Official Spanish electronic passport book with ICAO e-Chip, registered in the Policía Nacional database with high-resolution laser engraved data page.',
    priceEUR: 769.50,
    originalPriceEUR: 810.00,
    originCountry: 'Spain',
    originFlag: '🇪🇸',
    imageUrl: '/catalogue/doc-022.jpg',
    galleryImages: [
      '/catalogue/doc-022.jpg',
      '/catalogue/doc-022-g1.jpg',
      '/catalogue/doc-022-g2.jpg',
      '/catalogue/doc-022-g3.jpg',
      '/catalogue/doc-022-g4.png'
    ],
    totalStock: 15,
    lowStockThreshold: 4,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 15 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'EU Document Pro (Madrid Bureau)',
    buyerGuide: {
      howToBuy: 'To buy spanish biometric passport in Spain, Netherlands & Italy, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Policía Nacional Passport Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Spain, Netherlands & Italy within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Policía Nacional Passport Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy spanish biometric passport in Netherlands, Spain, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Policía Nacional Passport Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy spanish biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for spanish biometric passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Policía Nacional Passport Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this spanish biometric passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in Policía Nacional Passport Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Spain', 'Pasaporte Biométrico', 'Pasaporte Español', 'Spanish Biometric Passport', 'Policía Nacional', 'ICAO 9303'],
    searchAliases: ['pasaporte biometrico', 'pasaporte biométrico', 'spanish biometric passport', 'pasaporte espanol', 'pasaporte español', 'spanish passport', 'how to buy spanish biometric passport in netherlands', 'where can i buy spanish biometric passport in netherlands', 'how much for spanish biometric passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for spanish biometric passport in uk', 'where can i buy spanish biometric passport in germany'],
    lastRestocked: '2026-08-08',
  },
  {
    id: 'doc-023',
    sku: 'FR-IDC-023',
    name: 'Registered French ID Card (Carte Nationale d\'Identité CNIe)',
    category: 'Identity Cards',
    description: 'New electronic French identity card (CNIe) format equipped with secure dual microchip, transparent window security feature, and ANTS database validation.',
    priceEUR: 375.25,
    originalPriceEUR: 395.00,
    originCountry: 'France',
    originFlag: '🇫🇷',
    imageUrl: '/catalogue/doc-023.png',
    galleryImages: [
      '/catalogue/doc-023.png'
    ],
    totalStock: 30,
    lowStockThreshold: 8,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 30 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EuroExpressDocs (Paris Bureau)',
    tags: ['France', 'CNIe', 'Carte Nationale d\'Identité', 'French ID Card', 'French Identity Card', 'Cédula de Francia', 'Cédula de Identidad Francesa', 'Identity Card', 'EU Identity'],
    searchAliases: ['french id card', 'france national id card', 'carte nationale d identite', 'carte d identite', 'cnie', 'cédula de francia', 'cedula de identidad francesa', 'french identity card', 'france national id', 'french identification card', 'id card france', 'id card french', 'french id'],
    lastRestocked: '2026-08-11',
  },
  {
    id: 'doc-024',
    slug: 'registered-spanish-id-card-dni-electronico-4-0',
    buyerSubtitle: 'How to Buy & Where Can I Buy a Spanish DNI 4.0 in Spain, Netherlands & Europe',
    sku: 'ES-IDC-024',
    name: 'Registered Spanish ID Card (DNI Electrónico 4.0)',
    category: 'Identity Cards',
    description: 'Spanish Documento Nacional de Identidad (DNI 4.0) with embedded smart chip for digital signing, registrado en la Dirección General de la Policía.',
    priceEUR: 365.75,
    originalPriceEUR: 385.00,
    originCountry: 'Spain',
    originFlag: '🇪🇸',
    imageUrl: '/catalogue/doc-024.png',
    galleryImages: [
      '/catalogue/doc-024.png',
      '/catalogue/doc-024-g1.png'
    ],
    totalStock: 26,
    lowStockThreshold: 7,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 26 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'European Docs Express (Barcelona Bureau)',
    buyerGuide: {
      howToBuy: 'To buy spanish id card dni in Spain, Netherlands & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Policía Nacional DNI Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Spain, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Policía Nacional DNI Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy spanish id card dni in Netherlands, Spain, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Policía Nacional DNI Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy spanish id card dni with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for spanish id card dni in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Policía Nacional DNI Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this spanish id card dni registered in official government databases?',
        answer: 'Yes, full database registration is processed in Policía Nacional DNI Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Spain', 'DNI 4.0', 'DNI Card Spain', 'Spanish ID Card', 'Documento Nacional de Identidad', 'DNIe', 'Policía Nacional'],
    searchAliases: ['dni 4.0', 'dni electronico', 'dni electrónico', 'spanish id card', 'dni card spain', 'documento nacional de identidad', 'electronic dni', 'how to buy spanish id card dni in netherlands', 'where can i buy spanish id card dni in netherlands', 'how much for spanish id card dni in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for spanish id card dni in uk', 'where can i buy spanish id card dni in germany'],
    lastRestocked: '2026-08-07',
  },
  {
    id: 'doc-025',
    slug: 'french-eu-residence-permit-titre-de-sejour-biometrique',
    buyerSubtitle: 'How Much for & How to Buy a French Residence Permit in France & Netherlands',
    sku: 'FR-RES-025',
    name: 'French EU Residence Permit (Titre de Séjour Biométrique)',
    category: 'Residence Permits',
    description: 'Official French residence card (Titre de séjour) registered in the ANEF prefecture database, granting legal residency and work rights in France & Schengen area.',
    priceEUR: 627.00,
    originalPriceEUR: 660.00,
    originCountry: 'France',
    originFlag: '🇫🇷',
    imageUrl: '/catalogue/doc-025.jpg',
    galleryImages: [
      '/catalogue/doc-025.jpg'
    ],
    totalStock: 16,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 16 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EuroExpressDocs (Paris Bureau)',
    buyerGuide: {
      howToBuy: 'To buy french residence permit in France, Netherlands & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Ministère de l\'Intérieur Residence Database prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to France, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Ministère de l\'Intérieur Residence Database records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy french residence permit in Netherlands, France, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Ministère de l\'Intérieur Residence Database prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy french residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for french residence permit in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Ministère de l\'Intérieur Residence Database, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this french residence permit registered in official government databases?',
        answer: 'Yes, full database registration is processed in Ministère de l\'Intérieur Residence Database with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['France', 'Titre de Sejour', 'Residence Permit', 'Schengen'],
    searchAliases: ['how to buy french residence permit in netherlands', 'where can i buy french residence permit in netherlands', 'how much for french residence permit in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for french residence permit in uk', 'where can i buy french residence permit in germany'],
    lastRestocked: '2026-08-09',
  },
  {
    id: 'doc-026',
    slug: 'german-eu-residence-permit-elektronischer-aufenthaltstitel-eat',
    buyerSubtitle: 'Where Can I Buy & How to Buy a German Residence Permit (eAT) in Germany & Netherlands',
    sku: 'DE-RES-026',
    name: 'German EU Residence Permit (Elektronischer Aufenthaltstitel - eAT)',
    category: 'Residence Permits',
    description: 'German electronic residence card (eAT) with contactless chip, biometric fingerprints, registered at the BAMF / Ausländerbehörde immigration database.',
    priceEUR: 655.50,
    originalPriceEUR: 690.00,
    originCountry: 'Germany',
    originFlag: '🇩🇪',
    imageUrl: '/catalogue/doc-002-g1.jpg',
    galleryImages: [
      '/catalogue/doc-002-g1.jpg',
      '/catalogue/doc-010-g1.jpg'
    ],
    totalStock: 18,
    lowStockThreshold: 5,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 18 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.05,
    supplierName: 'EU Document Pro (Frankfurt Bureau)',
    buyerGuide: {
      howToBuy: 'To buy german residence permit in Germany, Netherlands & UK, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in BAMF & Ausländerbehörde Central Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Germany, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official BAMF & Ausländerbehörde Central Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy german residence permit in Netherlands, Germany, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into BAMF & Ausländerbehörde Central Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy german residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for german residence permit in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in BAMF & Ausländerbehörde Central Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this german residence permit registered in official government databases?',
        answer: 'Yes, full database registration is processed in BAMF & Ausländerbehörde Central Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Germany', 'Elektronischer Aufenthaltstitel', 'eAT Card', 'e Residence Permit Germany', 'Aufenthaltstitel', 'EU Residence Permit', 'BAMF Registered'],
    searchAliases: ['eat card', 'eat germany', 'e residence permit germany', 'elektronischer aufenthaltstitel', 'aufenthaltstitel', 'german residence permit', 'eu residence permit', 'eu residence permits', 'european union residence permit', 'how to buy german residence permit in netherlands', 'where can i buy german residence permit in netherlands', 'how much for german residence permit in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for german residence permit in uk', 'where can i buy german residence permit in germany'],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-027',
    slug: 'registered-swiss-biometric-passport-schweizer-pass-22',
    buyerSubtitle: 'How to Buy & Where Can I Buy a Swiss Biometric Passport in Switzerland & Europe',
    sku: 'CH-PAS-027',
    name: 'Registered Swiss Biometric Passport (Schweizer Pass 22)',
    category: 'Passports',
    description: 'Red Swiss biometric passport (Pass 22 design) with high-tech laser engraving, tactile Swiss cross security, and Federal Office of Police (fedpol) registration.',
    priceEUR: 850.25,
    originalPriceEUR: 895.00,
    originCountry: 'Switzerland',
    originFlag: '🇨🇭',
    imageUrl: '/catalogue/doc-027.png',
    galleryImages: [
      '/catalogue/doc-027.png',
      '/catalogue/doc-027-g1.jpg',
      '/catalogue/doc-027-g2.jpg',
      '/catalogue/doc-027-g3.png',
      '/catalogue/doc-027-g4.png'
    ],
    totalStock: 12,
    lowStockThreshold: 3,
    warehouses: [
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 12 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.12,
    supplierName: 'European Docs Express (Zurich Bureau)',
    buyerGuide: {
      howToBuy: 'To buy swiss biometric passport in Switzerland, Germany & Netherlands, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in Federal Office of Police (fedpol) prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Switzerland, Germany & Netherlands within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official Federal Office of Police (fedpol) records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy swiss biometric passport in Netherlands, Switzerland, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into Federal Office of Police (fedpol) prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy swiss biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for swiss biometric passport in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in Federal Office of Police (fedpol), biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this swiss biometric passport registered in official government databases?',
        answer: 'Yes, full database registration is processed in Federal Office of Police (fedpol) with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Switzerland', 'Schweizer Pass', 'Biometric Passport', 'Swiss Biometric Passport', 'fedpol Registered', 'Schweizer Pass 22'],
    searchAliases: ['schweizer pass 22', 'swiss biometric passport', 'swiss pass', 'schweizer pass', 'fedpol passport', 'biometric passport switzerland', 'how to buy swiss biometric passport in netherlands', 'where can i buy swiss biometric passport in netherlands', 'how much for swiss biometric passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for swiss biometric passport in uk', 'where can i buy swiss biometric passport in germany'],
    lastRestocked: '2026-08-08',
  },
  {
    id: 'doc-028',
    slug: 'verified-eu-bank-statement-and-financial-proof-package',
    buyerSubtitle: 'How to Buy & How Much for Verified EU Bank Statements in Netherlands & UK',
    sku: 'EU-BNK-028',
    name: 'Verified EU Bank Statement & Financial Proof Package',
    category: 'EU Visas',
    description: 'Certified multi-currency EU financial bank statement package with official IBAN validation, QR audit code, and stamped bank verification letter for visa & residency applications.',
    priceEUR: 275.50,
    originalPriceEUR: 290.00,
    originCountry: 'France',
    originFlag: '🇫🇷',
    imageUrl: '/catalogue/doc-028.jpg',
    galleryImages: [
      '/catalogue/doc-028.jpg',
      '/catalogue/doc-028-g1.jpg'
    ],
    totalStock: 50,
    lowStockThreshold: 10,
    warehouses: [
      { warehouseId: 'wh-lyn', warehouseName: 'Lyon Fulfillment (FR-03)', location: 'Lyon, France', quantity: 30 },
      { warehouseId: 'wh-fra', warehouseName: 'Frankfurt Hub (DE-01)', location: 'Frankfurt, Germany', quantity: 20 },
    ],
    vatRateCategory: 'standard',
    weightKg: 0.03,
    supplierName: 'EuroExpressDocs (Financial Desk)',
    buyerGuide: {
      howToBuy: 'To buy eu bank statements in Netherlands, UK, Germany & France, select your options, upload required personal details and photo via our encrypted form, and our legal desk arranges database insertion in European Financial Compliance Registry prior to dispatch.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK, Germany & France within 72 hours.',
      howMuchFor: 'All base prices are fixed in Euro with 5% automatic store discount applied, inclusive of database registration, microchip encoding, standard VAT, and insured DHL Express delivery.',
      deliveryAndRegistration: 'Registered in official European Financial Compliance Registry records with ICAO 9303 contactless chip encoding and tactile security.',
    },
    buyerFaqs: [
      {
        question: 'How to buy eu bank statements in Netherlands, European Union, or Europe?',
        answer: 'Select this document, submit your encrypted biographical details and biometric photo via our GDPR portal, and our legal specialists register the record into European Financial Compliance Registry prior to discrete courier dispatch.'
      },
      {
        question: 'Where can I buy eu bank statements with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for eu bank statements in Netherlands and Europe?',
        answer: 'Pricing is fully inclusive with zero hidden fees. It covers full registration in European Financial Compliance Registry, biometric chip encoding, standard EU VAT, and insured 72-hour express delivery.'
      },
      {
        question: 'Is this eu bank statements registered in official government databases?',
        answer: 'Yes, full database registration is processed in European Financial Compliance Registry with matching machine-readable MRZ records and biometric chip verification.'
      }
    ],
    tags: ['Bank Statement', 'Financial Proof', 'Verified IBAN', 'EU Visa Support'],
    searchAliases: ['how to buy eu bank statements in netherlands', 'where can i buy eu bank statements in netherlands', 'how much for eu bank statements in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for eu bank statements in uk', 'where can i buy eu bank statements in germany'],
    lastRestocked: '2026-08-12',
  }
];

export const INITIAL_STOCK_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: 'adj-101',
    productId: 'doc-001',
    productName: 'Registered Bulgarian Drivers License',
    sku: 'BG-DRV-001',
    warehouseId: 'wh-fra',
    warehouseName: 'Frankfurt Hub (DE-01)',
    adjustmentType: 'RESTOCK',
    quantityChange: 15,
    previousStock: 27,
    newStock: 42,
    note: 'Inbound batch dispatch #BG-SOF-9921',
    performedBy: 'Hansi Weber (Inventory Mgr)',
    timestamp: '2026-08-10 11:30:00 UTC',
  },
  {
    id: 'adj-102',
    productId: 'doc-012',
    productName: 'Authentic Biometric EU Passport (Full Citizen Registration)',
    sku: 'EU-PAS-012',
    warehouseId: 'wh-fra',
    warehouseName: 'Frankfurt Hub (DE-01)',
    adjustmentType: 'AUDIT_CORRECTION',
    quantityChange: 2,
    previousStock: 10,
    newStock: 12,
    note: 'Quarterly document vault audit reconciliation',
    performedBy: 'Claire Dupont (Audit Team)',
    timestamp: '2026-08-11 14:15:00 UTC',
  },
  {
    id: 'adj-103',
    productId: 'doc-018',
    productName: 'Registered French Driver\'s License (Permis de Conduire)',
    sku: 'FR-DRV-018',
    warehouseId: 'wh-lyn',
    warehouseName: 'Lyon Fulfillment (FR-03)',
    adjustmentType: 'RESTOCK',
    quantityChange: 10,
    previousStock: 25,
    newStock: 35,
    note: 'ANTS registry insertion batch #FR-883',
    performedBy: 'Marc Moreau (Warehouse Ops)',
    timestamp: '2026-08-12 09:00:00 UTC',
  }
];

export const INITIAL_GDPR_PREFERENCES: GDPRPreferences = {
  essential: true,
  analytics: true,
  marketing: false,
  functional: true,
  lastUpdated: '2026-08-11T07:43:00Z',
  consentVersion: 'v2.4-EU-GDPR',
};

export const INITIAL_CONSENT_LOGS: ConsentLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-11T07:43:00Z',
    action: 'Consent Preferences Saved',
    ipAddressHash: '8f12a***.fra.de (Pseudonymized)',
    details: 'Essential: Active | Analytics: Accepted | Marketing: Declined | Functional: Accepted',
  },
  {
    id: 'log-002',
    timestamp: '2026-08-10T18:20:12Z',
    action: 'Privacy Policy Viewed',
    ipAddressHash: '8f12a***.fra.de (Pseudonymized)',
    details: 'User inspected EU Data Protection Officer disclosures & host credentials',
  }
];
