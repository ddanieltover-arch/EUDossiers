import React, { useState } from 'react';
import { 
  COMPLIANCE_EVIDENCE_REGISTER, 
  ComplianceRegisterEntry 
} from '../../server/complianceRegister';
import { 
  ShieldAlert, 
  Scale, 
  Search, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Clock, 
  EyeOff, 
  Ban 
} from 'lucide-react';

export const ComplianceRegisterView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<ComplianceRegisterEntry | null>(null);

  const entries = COMPLIANCE_EVIDENCE_REGISTER;

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.advertisedClaims.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      entry.authorizationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Confidential • Administrator Compliance Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] font-display flex items-center space-x-2">
            <Scale className="w-6 h-6 text-amber-400" />
            <span>Catalogue Legal Compliance &amp; Evidence Register</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl leading-relaxed">
            Statutory tracking mechanism governing all 28 commercial catalogue listings. Mandates documentary evidence, licensing agreements, and human legal sign-off before restoring indexation or commercial availability.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-center px-4 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
            <div className="text-xl font-bold text-amber-400">28 / 28</div>
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Under Review</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
            <div className="text-xl font-bold text-rose-400">0</div>
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Approved</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)]">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, product, claims or category..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="ALL">All Statuses (28)</option>
            <option value="UNVERIFIED">UNVERIFIED (28)</option>
            <option value="SUBSTANTIATED">SUBSTANTIATED (0)</option>
            <option value="REJECTED">REJECTED (0)</option>
          </select>
        </div>
      </div>

      {/* Register Table */}
      <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product Name &amp; Category</th>
                <th className="py-3 px-4">Advertised Claims</th>
                <th className="py-3 px-4">Required Evidence</th>
                <th className="py-3 px-4">Status &amp; Decision</th>
                <th className="py-3 px-4 text-center">Indexing / Sales</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/60 text-[var(--color-text-secondary)]">
              {filteredEntries.map((entry) => (
                <tr 
                  key={entry.productId}
                  className="hover:bg-[var(--color-bg-secondary)]/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-text-primary)]">
                    {entry.productId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[var(--color-text-primary)]">{entry.productName}</div>
                    <span className="text-[10px] text-blue-400 font-medium">{entry.category}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate" title={entry.advertisedClaims}>
                    {entry.advertisedClaims}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate" title={entry.requiredEvidence}>
                    {entry.requiredEvidence}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{entry.authorizationStatus}</span>
                    </span>
                    <div className="text-[10px] text-[var(--color-text-muted)] mt-1">
                      {entry.approvalDecision.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col gap-1 items-center">
                      <span className="inline-flex items-center space-x-1 text-[10px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <EyeOff className="w-3 h-3" />
                        <span>noindex</span>
                      </span>
                      <span className="inline-flex items-center space-x-1 text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Ban className="w-3 h-3" />
                        <span>Purchase Gated</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-input)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] hover:border-amber-500/50 transition-colors inline-flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Detailed Drawer for Single Entry */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {selectedEntry.productId}
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-1.5">
                  {selectedEntry.productName}
                </h3>
                <span className="text-xs text-[var(--color-text-muted)]">{selectedEntry.category}</span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-sm font-bold p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                  Advertised Commercial Claims:
                </label>
                <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedEntry.advertisedClaims}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                  Mandatory Legal Evidence Required:
                </label>
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200 leading-relaxed">
                  {selectedEntry.requiredEvidence}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Evidence Received</span>
                  <span className="font-bold text-rose-400">{selectedEntry.evidenceReceived}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Reviewer</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{selectedEntry.reviewer}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Indexing Directive</span>
                  <span className="font-bold text-rose-400">noindex, follow (Excluded from sitemap)</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Commercial Availability</span>
                  <span className="font-bold text-amber-400">Purchase Gated (Orders Blocked)</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                  Compliance Notes:
                </label>
                <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {selectedEntry.notes}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Review Date: <strong className="text-[var(--color-text-primary)]">{selectedEntry.reviewDate}</strong>
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
