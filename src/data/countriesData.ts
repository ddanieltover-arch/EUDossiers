export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  vatRate: number;
  standardCurrency: string;
  language: string;
}

export interface ContinentGroup {
  continent: string;
  countries: CountryItem[];
}

export const CONTINENT_COUNTRIES: ContinentGroup[] = [
  {
    continent: 'Europe',
    countries: [
      // Top Countries first
      { code: 'DE', name: 'Germany', flag: '🇩🇪', vatRate: 0.19, standardCurrency: 'EUR', language: 'Deutsch' },
      { code: 'FR', name: 'France', flag: '🇫🇷', vatRate: 0.20, standardCurrency: 'EUR', language: 'Français' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹', vatRate: 0.22, standardCurrency: 'EUR', language: 'Italiano' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸', vatRate: 0.21, standardCurrency: 'EUR', language: 'Español' },
      { code: 'NL', name: 'Netherlands', flag: '🇳🇱', vatRate: 0.21, standardCurrency: 'EUR', language: 'Nederlands' },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', vatRate: 0.20, standardCurrency: 'GBP', language: 'English' },
      { code: 'BE', name: 'Belgium', flag: '🇧🇪', vatRate: 0.21, standardCurrency: 'EUR', language: 'Français / Nederlands' },
      { code: 'AT', name: 'Austria', flag: '🇦🇹', vatRate: 0.20, standardCurrency: 'EUR', language: 'Deutsch' },
      { code: 'CH', name: 'Switzerland', flag: '🇨🇭', vatRate: 0.081, standardCurrency: 'CHF', language: 'Deutsch / Français / Italiano' },
      { code: 'SE', name: 'Sweden', flag: '🇸🇪', vatRate: 0.25, standardCurrency: 'SEK', language: 'Svenska' },
      { code: 'DK', name: 'Denmark', flag: '🇩🇰', vatRate: 0.25, standardCurrency: 'DKK', language: 'Dansk' },
      { code: 'FI', name: 'Finland', flag: '🇫🇮', vatRate: 0.255, standardCurrency: 'EUR', language: 'Suomi' },
      { code: 'IE', name: 'Ireland', flag: '🇮🇪', vatRate: 0.23, standardCurrency: 'EUR', language: 'English' },
      { code: 'PL', name: 'Poland', flag: '🇵🇱', vatRate: 0.23, standardCurrency: 'PLN', language: 'Polski' },
      { code: 'PT', name: 'Portugal', flag: '🇵🇹', vatRate: 0.23, standardCurrency: 'EUR', language: 'Português' },
      { code: 'CZ', name: 'Czechia', flag: '🇨🇿', vatRate: 0.21, standardCurrency: 'CZK', language: 'Čeština' },
      { code: 'GR', name: 'Greece', flag: '🇬🇷', vatRate: 0.24, standardCurrency: 'EUR', language: 'Ελληνικά' },
      // Other European Countries
      { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', vatRate: 0.20, standardCurrency: 'BGN', language: 'Български' },
      { code: 'HR', name: 'Croatia', flag: '🇭🇷', vatRate: 0.25, standardCurrency: 'EUR', language: 'Hrvatski' },
      { code: 'CY', name: 'Cyprus', flag: '🇨🇾', vatRate: 0.19, standardCurrency: 'EUR', language: 'Ελληνικά' },
      { code: 'EE', name: 'Estonia', flag: '🇪🇪', vatRate: 0.22, standardCurrency: 'EUR', language: 'Eesti' },
      { code: 'HU', name: 'Hungary', flag: '🇭🇺', vatRate: 0.27, standardCurrency: 'HUF', language: 'Magyar' },
      { code: 'IS', name: 'Iceland', flag: '🇮🇸', vatRate: 0.24, standardCurrency: 'ISK', language: 'Íslenska' },
      { code: 'LV', name: 'Latvia', flag: '🇱🇻', vatRate: 0.21, standardCurrency: 'EUR', language: 'Latviešu' },
      { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', vatRate: 0.081, standardCurrency: 'CHF', language: 'Deutsch' },
      { code: 'LT', name: 'Lithuania', flag: '🇱🇹', vatRate: 0.21, standardCurrency: 'EUR', language: 'Lietuvių' },
      { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', vatRate: 0.17, standardCurrency: 'EUR', language: 'Lëtzebuergesch / Français' },
      { code: 'MT', name: 'Malta', flag: '🇲🇹', vatRate: 0.18, standardCurrency: 'EUR', language: 'Malti / English' },
      { code: 'MC', name: 'Monaco', flag: '🇲🇨', vatRate: 0.20, standardCurrency: 'EUR', language: 'Français' },
      { code: 'NO', name: 'Norway', flag: '🇳🇴', vatRate: 0.25, standardCurrency: 'NOK', language: 'Norsk' },
      { code: 'RO', name: 'Romania', flag: '🇷🇴', vatRate: 0.19, standardCurrency: 'RON', language: 'Română' },
      { code: 'SK', name: 'Slovakia', flag: '🇸🇰', vatRate: 0.20, standardCurrency: 'EUR', language: 'Slovenčina' },
      { code: 'SI', name: 'Slovenia', flag: '🇸🇮', vatRate: 0.22, standardCurrency: 'EUR', language: 'Slovenščina' },
    ],
  },
  {
    continent: 'North America',
    countries: [
      { code: 'US', name: 'United States', flag: '🇺🇸', vatRate: 0.0, standardCurrency: 'USD', language: 'English' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦', vatRate: 0.05, standardCurrency: 'CAD', language: 'English / Français' },
      { code: 'MX', name: 'Mexico', flag: '🇲🇽', vatRate: 0.16, standardCurrency: 'MXN', language: 'Español' },
    ],
  },
  {
    continent: 'South America',
    countries: [
      { code: 'BR', name: 'Brazil', flag: '🇧🇷', vatRate: 0.17, standardCurrency: 'BRL', language: 'Português' },
      { code: 'AR', name: 'Argentina', flag: '🇦🇷', vatRate: 0.21, standardCurrency: 'ARS', language: 'Español' },
      { code: 'CO', name: 'Colombia', flag: '🇨🇴', vatRate: 0.19, standardCurrency: 'COP', language: 'Español' },
      { code: 'CL', name: 'Chile', flag: '🇨🇱', vatRate: 0.19, standardCurrency: 'CLP', language: 'Español' },
      { code: 'PE', name: 'Peru', flag: '🇵🇪', vatRate: 0.18, standardCurrency: 'PEN', language: 'Español' },
    ],
  },
  {
    continent: 'Asia',
    countries: [
      { code: 'JP', name: 'Japan', flag: '🇯🇵', vatRate: 0.10, standardCurrency: 'JPY', language: '日本語' },
      { code: 'SG', name: 'Singapore', flag: '🇸🇬', vatRate: 0.09, standardCurrency: 'SGD', language: 'English' },
      { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', vatRate: 0.05, standardCurrency: 'AED', language: 'العربية' },
      { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', vatRate: 0.15, standardCurrency: 'SAR', language: 'العربية' },
      { code: 'KR', name: 'South Korea', flag: '🇰🇷', vatRate: 0.10, standardCurrency: 'KRW', language: '한국어' },
      { code: 'IN', name: 'India', flag: '🇮🇳', vatRate: 0.18, standardCurrency: 'INR', language: 'English / हिन्दी' },
      { code: 'TH', name: 'Thailand', flag: '🇹🇭', vatRate: 0.07, standardCurrency: 'THB', language: 'ไทย' },
      { code: 'VN', name: 'Vietnam', flag: '🇻🇳', vatRate: 0.10, standardCurrency: 'VND', language: 'Tiếng Việt' },
      { code: 'ID', name: 'Indonesia', flag: '🇮🇩', vatRate: 0.11, standardCurrency: 'IDR', language: 'Bahasa Indonesia' },
      { code: 'MY', name: 'Malaysia', flag: '🇲🇾', vatRate: 0.06, standardCurrency: 'MYR', language: 'Bahasa Melayu' },
      { code: 'PH', name: 'Philippines', flag: '🇵🇭', vatRate: 0.12, standardCurrency: 'PHP', language: 'English / Tagalog' },
      { code: 'IL', name: 'Israel', flag: '🇮🇱', vatRate: 0.17, standardCurrency: 'ILS', language: 'עברית' },
      { code: 'TR', name: 'Turkey', flag: '🇹🇷', vatRate: 0.20, standardCurrency: 'TRY', language: 'Türkçe' },
    ],
  },
  {
    continent: 'Oceania',
    countries: [
      { code: 'AU', name: 'Australia', flag: '🇦🇺', vatRate: 0.10, standardCurrency: 'AUD', language: 'English' },
      { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', vatRate: 0.15, standardCurrency: 'NZD', language: 'English' },
    ],
  },
  {
    continent: 'Africa',
    countries: [
      { code: 'ZA', name: 'South Africa', flag: '🇿🇦', vatRate: 0.15, standardCurrency: 'ZAR', language: 'English' },
      { code: 'EG', name: 'Egypt', flag: '🇪🇬', vatRate: 0.14, standardCurrency: 'EGP', language: 'العربية' },
      { code: 'NG', name: 'Nigeria', flag: '🇳🇬', vatRate: 0.075, standardCurrency: 'NGN', language: 'English' },
      { code: 'KE', name: 'Kenya', flag: '🇰🇪', vatRate: 0.16, standardCurrency: 'KES', language: 'English / Swahili' },
      { code: 'MA', name: 'Morocco', flag: '🇲🇦', vatRate: 0.20, standardCurrency: 'MAD', language: 'العربية / Français' },
    ],
  },
];

// Flat list of all countries
export const ALL_COUNTRIES: CountryItem[] = CONTINENT_COUNTRIES.flatMap(g => g.countries);
