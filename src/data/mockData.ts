import { EUCountryVAT, Currency, Product, StockAdjustment, GDPRPreferences, ConsentLog } from '../types';
import { ALL_COUNTRIES } from './countriesData';

export const EU_COUNTRIES: EUCountryVAT[] = ALL_COUNTRIES;

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
    description: 'Bulgarian EU-format driving license specimen featuring physical micro-text security elements and UV-reactive ink technology.',
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
      howToBuy: 'Browse the bulgarian drivers license information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, Germany & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy bulgarian drivers license in Netherlands, Bulgaria, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy bulgarian drivers license with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for bulgarian drivers license in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Austrian credit-card format driving license (Führerschein) specimen with high-security tactile surface features and optical variable elements.',
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
      howToBuy: 'Browse the austrian drivers license information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Germany, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy austrian drivers license in Netherlands, Austria, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy austrian drivers license with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for austrian drivers license in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'REAL ID format American driving license specimen with magnetic stripe encoding, barcode scanability, and holographic state seal features.',
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
    description: 'Belgian Electronic Identity Card (eID) specimen equipped with contactless microchip technology and biometric optical security features.',
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
      howToBuy: 'Browse the belgian id card information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, France & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy belgian id card in Netherlands, Belgium, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy belgian id card with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for belgian id card in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Danish EU-format driving permit (Kørekort) specimen featuring laser-etched photo security and Nordic design elements.',
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
      howToBuy: 'Browse the danish drivers license information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, Germany & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy danish drivers license in Netherlands, Denmark, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy danish drivers license with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for danish drivers license in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      }
    ],
    tags: ['Denmark', 'Kørekort', 'Driver License', 'Nordic'],
    searchAliases: ['how to buy danish drivers license in netherlands', 'where can i buy danish drivers license in netherlands', 'how much for danish drivers license in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for danish drivers license in uk', 'where can i buy danish drivers license in germany'],
    lastRestocked: '2026-08-07',
  },
  {
    id: 'doc-006',
    sku: 'EU-DRV-006',
    complianceReviewPending: true,
    name: 'Fast-Track EU Driver\'s License (Express 72-Hour Fulfillment)',
    category: 'Driver Licenses',
    description: 'EU driving permit specimen with express document preparation and 72-hour DHL Express insured delivery across EU member states.',
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
    description: 'Hungarian driving license card (Vezetői engedély) specimen crafted with optical laser security elements and EU-format design.',
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
    description: 'Italian Carta d\'Identità Elettronica (CIE 3.0) specimen featuring NFC microchip technology, MRZ zone design, and polycarbonate security substrate.',
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
    complianceReviewPending: true,
    buyerSubtitle: 'Official Dutch ID Card (Nederlandse Identiteitskaart) · Europe Identity Card & EEA National ID',
    sku: 'NL-IDC-009',
    name: 'Registered Dutch Identity Card (Nederlandse Identiteitskaart)',
    category: 'Identity Cards',
    description: 'Dutch identity card specimen featuring Kinegram optic security, RFID contactless chip technology, and high-precision security printing.',
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
      howToBuy: 'Browse the dutch identity card information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK & Europe within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'Is the Dutch ID card accepted as an official Europe Identity Card and EEA national ID across all EU member states?',
        answer: 'Under EU Directive 2004/38/EC, EU member state national identity cards serve as travel documents within the EU and EEA. The Nederlandse Identiteitskaart follows this framework as a Dutch national identity document.'
      },
      {
        question: 'How to buy dutch identity card in Netherlands, Belgium, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy dutch identity card with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for dutch identity card in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      }
    ],
    tags: [
      'Netherlands',
      'Nederlandse Identiteitskaart',
      'Dutch ID',
      'Europe Identity Card',
      'European Identity Card',
      'EEA Identity Card',
      'EEA National ID Card',
      'EEA ID Card',
      'BRP Registered',
      'ID-Kaart',
      'Registratiekaart'
    ],
    searchAliases: [
      'nederlandse identiteitskaart',
      'dutch id card',
      'registratiekaart',
      'dutch id',
      'netherlands id card',
      'id card netherlands',
      'europe identity card',
      'european identity card',
      'eea identity card',
      'eea national id card',
      'eea id card',
      'brp registration card',
      'how to buy dutch identity card in netherlands',
      'where can i buy dutch identity card in belgium',
      'how much for dutch identity card in netherlands'
    ],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-010',
    slug: 'italian-eu-residence-permit-permesso-di-soggiorno-ue',
    buyerSubtitle: 'How to Buy an Italian EU Residence Permit in Italy, Netherlands & Europe',
    sku: 'IT-RES-010',
    name: 'Italian EU Residence Permit (Permesso di Soggiorno UE)',
    category: 'Residence Permits',
    description: 'Italian biometric EU residence permit card specimen featuring Schengen-format design, biometric data page layout, and security hologram elements.',
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
      howToBuy: 'Browse the italian eu residence permit information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Italy, Netherlands & Germany within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy italian eu residence permit in Netherlands, Italy, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy italian eu residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for italian eu residence permit in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Swedish residence permit card specimen with embedded biometric data page design, high-security microprint, and EU-format layout.',
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
      howToBuy: 'Browse the swedish residence permit information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, Germany & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy swedish residence permit in Netherlands, Sweden, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy swedish residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for swedish residence permit in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Burgundy EU passport book specimen with ICAO 9303 e-Passport smart chip design, biometric photo page layout, and UV watermark security features.',
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
      howToBuy: 'Browse the biometric eu passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK, Germany & Italy within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy biometric eu passport in Netherlands, European Union, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy biometric eu passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for biometric eu passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      }
    ],
    tags: ['EU Passport', 'Biometric', 'ICAO 9303', 'Citizenship'],
    searchAliases: ['how to buy biometric eu passport in netherlands', 'where can i buy biometric eu passport in netherlands', 'how much for biometric eu passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for biometric eu passport in uk', 'where can i buy biometric eu passport in germany'],
    lastRestocked: '2026-08-11',
  },
  {
    id: 'doc-013',
    slug: 'authentic-us-passport-book-e-passport-chip-and-registration',
    complianceReviewPending: true,
    buyerSubtitle: 'Where Can I Buy & How Much for a US Biometric Passport Book in Europe & UK',
    sku: 'US-PAS-013',
    name: 'Authentic US Passport Book (e-Passport Chip & Registration)',
    category: 'Passports',
    description: 'United States electronic passport booklet specimen with high-security polycarbonate data page, embedded microchip design, and security thread elements.',
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
      howToBuy: 'Browse the us passport book information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to UK, Netherlands & Germany within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy us passport book in Netherlands, United States, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy us passport book with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for us passport book in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Kingdom of the Netherlands passport specimen featuring tactile laser technology, ICAO e-chip design, and Dutch security printing elements.',
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
      howToBuy: 'Browse the dutch biometric passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK & Europe within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy dutch biometric passport in Netherlands, Netherlands, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy dutch biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for dutch biometric passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'British passport specimen (dark blue cover) with encrypted biometric data page design, watermark security threads, and UV-reactive elements.',
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
      howToBuy: 'Browse the uk passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to UK, Netherlands & Europe within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy uk passport in Netherlands, United Kingdom, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy uk passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for uk passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Canadian e-Passport specimen featuring historic watermark designs, UV optical shift elements, and maple leaf security printing.',
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
      howToBuy: 'Browse the canadian passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to UK, Netherlands & Europe within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy canadian passport in Netherlands, Canada, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy canadian passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for canadian passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Multi-entry Schengen Visa sticker specimen featuring holographic overlay, UV-reactive printing, and machine-readable zone design.',
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
      howToBuy: 'Browse the schengen eu visa information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK, Germany & France within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy schengen eu visa in Netherlands, European Union, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy schengen eu visa with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for schengen eu visa in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Credit-card format French driving permit (Permis de conduire) specimen featuring ANTS security design elements and EU-format layout.',
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
    description: 'German EU credit-card format driving license specimen with laser-etched photo technology and optical variable ink security features.',
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
    description: 'Spanish driving permit specimen featuring DGT-format design, tactile raised text elements, and UV watermark seal technology.',
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
    description: 'French biometric passport booklet specimen featuring 36 security-printed pages, e-Passport RFID microchip design, and UV Republic artwork elements.',
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
      howToBuy: 'Browse the french biometric passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to France, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy french biometric passport in Netherlands, France, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy french biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for french biometric passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'Spanish electronic passport book specimen with ICAO e-Chip design and high-resolution laser engraved data page layout.',
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
      howToBuy: 'Browse the spanish biometric passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Spain, Netherlands & Italy within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy spanish biometric passport in Netherlands, Spain, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy spanish biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for spanish biometric passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      }
    ],
    tags: ['Spain', 'Pasaporte Biométrico', 'Pasaporte Español', 'Spanish Biometric Passport', 'Policía Nacional', 'ICAO 9303'],
    searchAliases: ['pasaporte biometrico', 'pasaporte biométrico', 'spanish biometric passport', 'pasaporte espanol', 'pasaporte español', 'spanish passport', 'how to buy spanish biometric passport in netherlands', 'where can i buy spanish biometric passport in netherlands', 'how much for spanish biometric passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for spanish biometric passport in uk', 'where can i buy spanish biometric passport in germany'],
    lastRestocked: '2026-08-08',
  },
  {
    id: 'doc-023',
    slug: 'registered-french-id-card-carte-nationale-didentite-cnie',
    buyerSubtitle: 'Official French ID Card (CNIe) · Registered in ANTS & PRADO with Biometric RFID Microchip',
    sku: 'FR-IDC-023',
    name: 'Registered French ID Card (Carte Nationale d\'Identité CNIe)',
    category: 'Identity Cards',
    description: 'Electronic French identity card (Carte Nationale d\'Identité - CNIe) specimen equipped with dual microchip design, laser-engraved polycarbonate substrate, and transparent window security feature.',
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
    buyerGuide: {
      howToBuy: 'Browse the French ID card (Carte Nationale d\'Identité - CNIe) information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'Order directly online on Eudossier. Fulfillment is managed via Lyon Fulfillment (FR-03) and Amsterdam Logistics (NL-02) with 72-hour DHL Express delivery across France, Europe, the UK, and international destinations.',
      howMuchFor: 'Transparent pricing displayed in Euro. Includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Features machine-readable zone (MRZ) design, ICAO 9303 chip layout, and Schengen e-Gate format compatibility. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'What is a French national identity card (CNIe) and can it be used as a French ID card across Europe?',
        answer: 'The French Carte Nationale d\'Identité (CNIe) is an official European Economic Area (EEA) national identity document compliant with EU Regulation 2019/1157. It grants full freedom of movement and entry across all 27 EU member states, Schengen nations, and Switzerland without requiring a passport.'
      },
      {
        question: 'What security features does the French CNIe include?',
        answer: 'The CNIe design includes dual-interface microchip technology, laser-engraved polycarbonate substrate, transparent window feature, and machine-readable zone (MRZ) compliant with ICAO Doc 9303 standards.'
      },
      {
        question: 'Can I travel within the Schengen Area using a French identification card?',
        answer: 'Under EU Directive 2004/38/EC, French national identity cards serve as travel documents within the EU and Schengen area. The CNIe format supports automated e-Gate border clearance.'
      },
      {
        question: 'Where can I buy a registered French ID card with delivery to France, Spain, UK, Germany, or the US?',
        answer: 'Browse the document information page on Eudossier. Document specimens feature laser-engraved polycarbonate substrate design and are shipped via insured courier.'
      },
      {
        question: 'What physical and digital security features are embedded on the French CNIe?',
        answer: 'The card includes a secure transparent window with ghost portrait, optically variable ink (OVI), tactile Guilloche engraving, a 3-line ICAO TD1 Machine Readable Zone (MRZ), and a contactless RFID microchip storing encrypted facial biometrics.'
      }
    ],
    tags: [
      'France',
      'CNIe',
      'Carte Nationale d\'Identité',
      'French ID Card',
      'French Identity Card',
      'French ID',
      'ID Card France',
      'ID Card French',
      'French Identification Card',
      'National Identity Card France',
      'French National Identity Card',
      'EEA National ID',
      'Europe Identity Card',
      'Cédula de Francia',
      'EU Identity'
    ],
    searchAliases: [
      'french id card',
      'france national id card',
      'carte nationale d identite',
      'carte d identite',
      'cnie',
      'french id',
      'id card france',
      'id card french',
      'french identification card',
      'national identity card france',
      'french national identity card',
      'french national id card',
      'id card in france',
      'france national identity card',
      'cédula de francia',
      'cedula de identidad francesa',
      'french identity card',
      'france national id',
      'how to buy french id card in france',
      'where can i buy french id card in spain',
      'how much for french id card in uk'
    ],
    lastRestocked: '2026-08-11',
  },
  {
    id: 'doc-024',
    slug: 'registered-spanish-id-card-dni-electronico-4-0',
    buyerSubtitle: 'How to Buy & Where Can I Buy a Spanish DNI 4.0 in Spain, Netherlands & Europe',
    sku: 'ES-IDC-024',
    name: 'Registered Spanish ID Card (DNI Electrónico 4.0)',
    category: 'Identity Cards',
    description: 'Spanish Documento Nacional de Identidad (DNI 4.0) specimen with embedded smart chip design and EU-format security elements.',
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
      howToBuy: 'Browse the spanish id card dni information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Spain, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy spanish id card dni in Netherlands, Spain, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy spanish id card dni with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for spanish id card dni in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    description: 'French residence card (Titre de séjour) specimen featuring biometric data page design and Schengen-format security elements.',
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
      howToBuy: 'Browse the French residence permit (Titre de Séjour) information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to France, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy french residence permit in Netherlands, France, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy french residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for french residence permit in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      },
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
    description: 'German electronic residence card (eAT) specimen with contactless chip technology, biometric data page design, and EU-format layout.',
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
      howToBuy: 'Browse the German residence permit (eAT) information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Germany, Netherlands & UK within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy german residence permit in Netherlands, Germany, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy german residence permit with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for german residence permit in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      }
    ],
    tags: ['Germany', 'Elektronischer Aufenthaltstitel', 'eAT Card', 'e Residence Permit Germany', 'Aufenthaltstitel', 'EU Residence Permit', 'BAMF Registered'],
    searchAliases: ['eat card', 'eat germany', 'e residence permit germany', 'elektronischer aufenthaltstitel', 'aufenthaltstitel', 'german residence permit', 'eu residence permit', 'eu residence permits', 'european union residence permit', 'how to buy german residence permit in netherlands', 'where can i buy german residence permit in netherlands', 'how much for german residence permit in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for german residence permit in uk', 'where can i buy german residence permit in germany'],
    lastRestocked: '2026-08-10',
  },
  {
    id: 'doc-027',
    slug: 'registered-swiss-biometric-passport-schweizer-pass-22',
    complianceReviewPending: true,
    buyerSubtitle: 'How to Buy & Where Can I Buy a Swiss Biometric Passport in Switzerland & Europe',
    sku: 'CH-PAS-027',
    name: 'Registered Swiss Biometric Passport (Schweizer Pass 22)',
    category: 'Passports',
    description: 'Red Swiss biometric passport (Pass 22 design) specimen with high-tech laser engraving, tactile Swiss cross security, and polycarbonate data page.',
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
      howToBuy: 'Browse the swiss biometric passport information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Switzerland, Germany & Netherlands within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy swiss biometric passport in Netherlands, Switzerland, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy swiss biometric passport with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for swiss biometric passport in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
      }
    ],
    tags: ['Switzerland', 'Schweizer Pass', 'Biometric Passport', 'Swiss Biometric Passport', 'fedpol Registered', 'Schweizer Pass 22'],
    searchAliases: ['schweizer pass 22', 'swiss biometric passport', 'swiss pass', 'schweizer pass', 'fedpol passport', 'biometric passport switzerland', 'how to buy swiss biometric passport in netherlands', 'where can i buy swiss biometric passport in netherlands', 'how much for swiss biometric passport in netherlands', 'how to buy in netherlands', 'where can i buy in uk', 'how much for in germany', 'how to buy in italy', 'where can i buy in europe', 'how much for swiss biometric passport in uk', 'where can i buy swiss biometric passport in germany'],
    lastRestocked: '2026-08-08',
  },
  {
    id: 'doc-028',
    slug: 'verified-eu-bank-statement-and-financial-proof-package',
    complianceReviewPending: true,
    buyerSubtitle: 'How to Buy & How Much for Verified EU Bank Statements in Netherlands & UK',
    sku: 'EU-BNK-028',
    name: 'Verified EU Bank Statement & Financial Proof Package',
    category: 'EU Visas',
    description: 'EU financial document template package with multi-currency formatting, IBAN structure examples, and administrative reference materials.',
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
      howToBuy: 'Browse the eu bank statements information page, review the document specifications and security features, and contact our support team for further guidance on document services.',
      whereToBuy: 'You can buy online directly through Eudossier with discrete courier fulfillment from logistics hubs in Amsterdam (NL-02), Frankfurt (DE-01), or Lyon (FR-03) delivering to Netherlands, UK, Germany & France within 72 hours.',
      howMuchFor: 'All base prices are displayed in Euro. Pricing includes document preparation, standard VAT, and insured express delivery.',
      deliveryAndRegistration: 'Document features ICAO 9303 compliant chip design and tactile security elements. Shipped via insured express courier.',
    },
    buyerFaqs: [
      {
        question: 'How to buy eu bank statements in Netherlands, European Union, or Europe?',
        answer: 'Browse the document information page, review the specifications and security features listed, and contact our support team for further assistance with document services.'
      },
      {
        question: 'Where can I buy eu bank statements with delivery to Netherlands, UK, Germany, or Italy?',
        answer: 'Order directly online on Eudossier. Fulfillment is managed via Amsterdam Logistics (NL-02) and Frankfurt (DE-01) with 72-hour DHL Express delivery across the Netherlands, UK, Germany, Italy, and Europe.'
      },
      {
        question: 'How much for eu bank statements in Netherlands and Europe?',
        answer: 'Pricing is transparent with no hidden fees. It covers document preparation, standard EU VAT, and insured 72-hour express delivery.'
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
    note: 'Inbound batch dispatch #FR-883',
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
