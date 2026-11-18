// Generated hreflang alternates mapping for blog articles
// All alternates reference canonical URLs (https://eudossier.eu/blog/:slug)
export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

// Group definitions for reciprocal hreflang linking
const EEA_ID_ALTERNATES: HreflangAlternate[] = [
  { hreflang: 'en', href: 'https://eudossier.eu/blog/eea-identity-card-guide' },
  { hreflang: 'fr-FR', href: 'https://eudossier.eu/blog/carte-identite-eee-guide' },
  { hreflang: 'de-DE', href: 'https://eudossier.eu/blog/eu-identitaetskarte-reise-regeln' },
  { hreflang: 'nl-NL', href: 'https://eudossier.eu/blog/europese-identiteitskaart-reisregels' },
  { hreflang: 'es-ES', href: 'https://eudossier.eu/blog/tarjeta-identidad-ue-guia' },
  { hreflang: 'x-default', href: 'https://eudossier.eu/blog/eea-identity-card-guide' },
];

const FRENCH_CNI_ALTERNATES: HreflangAlternate[] = [
  { hreflang: 'en', href: 'https://eudossier.eu/blog/french-national-identity-card-cni-guide' },
  { hreflang: 'fr-FR', href: 'https://eudossier.eu/blog/carte-nationale-identite-cni-guide' },
  { hreflang: 'x-default', href: 'https://eudossier.eu/blog/french-national-identity-card-cni-guide' },
];

const DUTCH_ID_ALTERNATES: HreflangAlternate[] = [
  { hreflang: 'en', href: 'https://eudossier.eu/blog/dutch-identity-card-guide' },
  { hreflang: 'nl-NL', href: 'https://eudossier.eu/blog/nederlandse-identiteitskaart-aanvragen' },
  { hreflang: 'x-default', href: 'https://eudossier.eu/blog/dutch-identity-card-guide' },
];

const BIOMETRIC_PASSPORT_ALTERNATES: HreflangAlternate[] = [
  { hreflang: 'en', href: 'https://eudossier.eu/blog/biometric-passport-explained' },
  { hreflang: 'fr-FR', href: 'https://eudossier.eu/blog/passeport-biometrique-guide' },
  { hreflang: 'de-DE', href: 'https://eudossier.eu/blog/biometrischer-reisepass-guide' },
  { hreflang: 'nl-NL', href: 'https://eudossier.eu/blog/biometrisch-paspoort-guide' },
  { hreflang: 'es-ES', href: 'https://eudossier.eu/blog/pasaporte-biometrico-guia' },
  { hreflang: 'x-default', href: 'https://eudossier.eu/blog/biometric-passport-explained' },
];

const SPANISH_DNI_ALTERNATES: HreflangAlternate[] = [
  { hreflang: 'en', href: 'https://eudossier.eu/blog/spanish-dni-4-0-guide' },
  { hreflang: 'es-ES', href: 'https://eudossier.eu/blog/dni-electronico-4-0-guia' },
  { hreflang: 'x-default', href: 'https://eudossier.eu/blog/spanish-dni-4-0-guide' },
];

const GERMAN_EAT_ALTERNATES: HreflangAlternate[] = [
  { hreflang: 'en', href: 'https://eudossier.eu/blog/german-electronic-residence-permit-eat-guide' },
  { hreflang: 'de-DE', href: 'https://eudossier.eu/blog/elektronischer-aufenthaltstitel-eat-guide' },
  { hreflang: 'x-default', href: 'https://eudossier.eu/blog/german-electronic-residence-permit-eat-guide' },
];

// Note on Italian CIE:
// post-003 ('eea-id-cards-travel-rights-italian-cie') covers broader EEA travel rights with Directive 2004/38/EC,
// while post-024 ('carta-identita-elettronica-cie-guida') focuses specifically on domestic Italian issuance procedures.
// Because their core content and search intents are complementary rather than direct language equivalents,
// they are deliberately decoupled to avoid false canonical/hreflang equivalencies across search engines.

export const BLOG_HREFLANGS: Record<string, HreflangAlternate[]> = {
  // 1. EEA ID Card Cluster
  'eea-identity-card-guide': EEA_ID_ALTERNATES,
  'carte-identite-eee-guide': EEA_ID_ALTERNATES,
  'eu-identitaetskarte-reise-regeln': EEA_ID_ALTERNATES,
  'europese-identiteitskaart-reisregels': EEA_ID_ALTERNATES,
  'tarjeta-identidad-ue-guia': EEA_ID_ALTERNATES,

  // 2. French CNI Cluster
  'french-national-identity-card-cni-guide': FRENCH_CNI_ALTERNATES,
  'carte-nationale-identite-cni-guide': FRENCH_CNI_ALTERNATES,

  // 3. Dutch ID Card Cluster
  'dutch-identity-card-guide': DUTCH_ID_ALTERNATES,
  'nederlandse-identiteitskaart-aanvragen': DUTCH_ID_ALTERNATES,

  // 4. Biometric Passport Cluster
  'biometric-passport-explained': BIOMETRIC_PASSPORT_ALTERNATES,
  'passeport-biometrique-guide': BIOMETRIC_PASSPORT_ALTERNATES,
  'biometrischer-reisepass-guide': BIOMETRIC_PASSPORT_ALTERNATES,
  'biometrisch-paspoort-guide': BIOMETRIC_PASSPORT_ALTERNATES,
  'pasaporte-biometrico-guia': BIOMETRIC_PASSPORT_ALTERNATES,

  // 5. Spanish DNI 4.0 Cluster
  'spanish-dni-4-0-guide': SPANISH_DNI_ALTERNATES,
  'dni-electronico-4-0-guia': SPANISH_DNI_ALTERNATES,

  // 6. German eAT Cluster
  'german-electronic-residence-permit-eat-guide': GERMAN_EAT_ALTERNATES,
  'elektronischer-aufenthaltstitel-eat-guide': GERMAN_EAT_ALTERNATES,
};
