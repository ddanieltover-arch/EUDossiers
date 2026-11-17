/**
 * Single Authoritative Source of Truth for Temporary Compliance Review Policy.
 * 
 * Five commercial catalogue products describe the supply, registration,
 * authentication or expedited processing of government documents.
 * Per legal governance instructions, until human legal and compliance review is
 * completed, these listings MUST:
 * 1. Carry 'noindex, follow' on their product pages.
 * 2. Have promotional Product & Offer structured data suppressed.
 * 3. Remain excluded from public sitemap generation.
 * 4. Remain crawlable by search engines (not blocked in robots.txt).
 * 5. Retain commercial availability and order handling without interruption.
 */

export const COMPLIANCE_REVIEW_PRODUCT_IDS: ReadonlySet<string> = new Set([
  'doc-006', // Fast-Track EU Driver's License (Express 72-Hour Fulfillment)
  'doc-009', // Registered Dutch Identity Card (Nederlandse Identiteitskaart)
  'doc-013', // Authentic US Passport Book (e-Passport Chip & Registration)
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
