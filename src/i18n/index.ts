import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, normalizeLocale, SUPPORTED_LOCALES } from './languages';

const localeModules = import.meta.glob('./locales/*/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, unknown>>;

const resources: Record<string, Record<string, Record<string, unknown>>> = {};
const namespaces = new Set<string>();

for (const [path, json] of Object.entries(localeModules)) {
  const match = path.match(/locales\/([a-z]+)\/([a-z]+)\.json$/);
  if (!match) continue;
  const [, lng, ns] = match;
  resources[lng] ??= {};
  resources[lng][ns] = json;
  namespaces.add(ns);
}

const supportedCodes = SUPPORTED_LOCALES.map((l) => l.code);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: supportedCodes,
    ns: [...namespaces],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      convertDetectedLanguage: (lng) => normalizeLocale(lng),
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = normalizeLocale(lng);
});

document.documentElement.lang = normalizeLocale(i18n.language);

export default i18n;
