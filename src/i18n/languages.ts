export type AppLocale = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'pl' | 'pt' | 'sv' | 'da' | 'fi' | 'el';

export type TranslatedLocale = Exclude<AppLocale, 'en'>;

export const LOCALE_STORAGE_KEY = 'eudossier_locale';

export const SUPPORTED_LOCALES: {
  code: AppLocale;
  label: string;
  nativeName: string;
  flag: string;
}[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'sv', label: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', label: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', label: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'el', label: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
];

export const DEFAULT_LOCALE: AppLocale = 'en';

export function normalizeLocale(input: string | null | undefined): AppLocale {
  const raw = (input || '').trim().toLowerCase();
  if (!raw) return DEFAULT_LOCALE;
  const base = raw.split('-')[0] as AppLocale;
  return SUPPORTED_LOCALES.some((l) => l.code === base) ? base : DEFAULT_LOCALE;
}
