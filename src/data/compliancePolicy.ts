/**
 * Single Authoritative Source of Truth for Temporary Compliance Review Policy.
 * 
 * All 28 commercial catalogue products describe the supply, registration,
 * authentication or expedited processing of government documents (driver's licenses,
 * national identity cards, passports, residence permits, visas, and financial packages).
 * 
 * In accordance with Phase 3 sitewide compliance and risk-mitigation directives,
 * until documented official authorisations, statutory licenses, or government
 * agreements are validated in the Human Compliance Evidence Register, ALL 28
 * products MUST:
 * 1. Carry 'noindex, follow' on their product pages.
 * 2. Have promotional Product & Offer structured data suppressed.
 * 3. Remain excluded from public sitemap generation.
 * 4. Remain crawlable by search engines (not blocked in robots.txt).
 * 5. Be temporarily restricted from commercial purchasing / checkout workflows.
 */

export const COMPLIANCE_REVIEW_PRODUCT_IDS: ReadonlySet<string> = new Set([
  'doc-001', // Registered Bulgarian Drivers License
  'doc-002', // Registered Austrian Drivers License
  'doc-003', // Authentic US Driver's License (REAL ID Compliant)
  'doc-004', // Registered Belgian ID Card (eID)
  'doc-005', // Registered Danish Drivers License (Kørekort)
  'doc-006', // Fast-Track EU Driver's License (Express 72-Hour Fulfillment)
  'doc-007', // Registered Hungarian Driver's License (Vezetői Engedély)
  'doc-008', // Italian Electronic ID Card (Carta d'Identità CIE)
  'doc-009', // Registered Dutch Identity Card (Nederlandse Identiteitskaart)
  'doc-010', // Italian EU Residence Permit (Permesso di Soggiorno UE)
  'doc-011', // Swedish EU Residence Permit (Uppehållstillståndskort)
  'doc-012', // Authentic Biometric EU Passport (Full Citizen Registration)
  'doc-013', // Authentic US Passport Book (e-Passport Chip & Registration)
  'doc-014', // Registered Dutch Biometric Passport (Nederlands Paspoort)
  'doc-015', // Original Registered UK Passport (HM Passport Office)
  'doc-016', // Real Canadian Electronic Passport (Passport Canada Registered)
  'doc-017', // Multi-Entry Schengen EU Visa Processing (1 - 5 Year Visa)
  'doc-018', // Registered French Driver's License (Permis de Conduire)
  'doc-019', // Registered German Driver's License (EU Führerschein)
  'doc-020', // Registered Spanish Driver's License (Carné de Conducir)
  'doc-021', // Registered French Biometric Passport (Passeport Biométrique)
  'doc-022', // Registered Spanish Biometric Passport (Pasaporte Español)
  'doc-023', // Registered French ID Card (Carte Nationale d'Identité CNIe)
  'doc-024', // Registered Spanish ID Card (DNI Electrónico 4.0)
  'doc-025', // French EU Residence Permit (Titre de Séjour Biométrique)
  'doc-026', // German EU Residence Permit (Elektronischer Aufenthaltstitel - eAT)
  'doc-027', // Registered Swiss Biometric Passport (Schweizer Pass 22)
  'doc-028', // Verified EU Bank Statement & Financial Proof Package
]);

/**
 * Checks whether a product or product ID is under compliance review.
 * Accepts a product object (with id / complianceReviewPending) or a raw ID string.
 */
export function isProductUnderComplianceReview(
  productOrId: { id?: string; complianceReviewPending?: boolean } | string | null | undefined
): boolean {
  if (!productOrId) return false;
  if (typeof productOrId === 'string') {
    return COMPLIANCE_REVIEW_PRODUCT_IDS.has(productOrId);
  }
  if (productOrId.complianceReviewPending === true) {
    return true;
  }
  if (productOrId.id && COMPLIANCE_REVIEW_PRODUCT_IDS.has(productOrId.id)) {
    return true;
  }
  return false;
}
