import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Server, 
  ExternalLink 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SITE_NAME, LEGAL_NAME, PRIVACY_EMAIL, ADDRESS_LINE } from '../brand';

export const GDPRModal: React.FC = () => {
  const { 
    isGDPRModalOpen, 
    setIsGDPRModalOpen, 
    gdprPreferences, 
    updateGDPRPreferences, 
    consentLogs, 
    downloadDSARPackage, 
    requestRightToBeForgotten 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'consent' | 'dsar' | 'erasure' | 'logs' | 'policy'>('consent');
  const [showErasureConfirm, setShowErasureConfirm] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [erasureDone, setErasureDone] = useState(false);

  if (!isGDPRModalOpen) return null;

  const handleTogglePreference = (key: 'analytics' | 'marketing' | 'functional') => {
    updateGDPRPreferences({ [key]: !gdprPreferences[key] });
  };

  const handleExecuteErasure = async () => {
    setIsErasing(true);
    await requestRightToBeForgotten();
    setIsErasing(false);
    setShowErasureConfirm(false);
    setErasureDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-card)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--color-text-primary)] flex items-center space-x-2">
                <span>GDPR Data Privacy Suite</span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full uppercase font-bold">
                  Art. 15 / 17 Certified
                </span>
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Regulation (EU) 2016/679 Protection &amp; Customer Rights</p>
            </div>
          </div>

          <button
            onClick={() => setIsGDPRModalOpen(false)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto custom-scrollbar px-4">
          {([
            { key: 'consent', label: '1. Cookie Preferences', activeColor: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' },
            { key: 'dsar', label: '2. Export My Data (DSAR)', activeColor: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' },
            { key: 'erasure', label: '3. Right to Be Forgotten', activeColor: 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20' },
            { key: 'logs', label: '4. Consent Audit Trail', activeColor: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20' },
            { key: 'policy', label: '5. EU Privacy Policy', activeColor: 'border-[var(--color-text-muted)] text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)]' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? tab.activeColor
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-5">
          
          {activeTab === 'consent' && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--color-text-secondary)]">
                Configure your data collection preferences under EU GDPR directives. You can modify these settings at any time with immediate server synchronization.
              </p>

              <div className="space-y-3">
                
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[var(--color-text-primary)]">Strictly Essential Cookies</span>
                      <span className="text-[10px] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded font-mono">Always Active</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Required for Euro (€) cart management, security tokens, and local VAT calculation.
                    </p>
                  </div>
                  <input type="checkbox" disabled checked className="w-5 h-5 rounded accent-emerald-500 opacity-70" />
                </div>

                {(['analytics', 'marketing', 'functional'] as const).map(key => {
                  const labels: Record<string, { title: string; desc: string }> = {
                    analytics: { title: 'Aggregated Performance Analytics', desc: 'Helps us optimize European delivery speeds and warehouse inventory turnover without personal tracking.' },
                    marketing: { title: 'Targeted Product Recommendations', desc: 'Allows personalized artisan suggestions based on past browsing history.' },
                    functional: { title: 'Localization & Currency Memory', desc: 'Remembers your preferred EU destination country and reference currency preference.' },
                  };
                  return (
                    <div key={key} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[var(--color-text-primary)]">{labels[key].title}</span>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">{labels[key].desc}</p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference(key)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${
                          gdprPreferences[key] ? 'bg-emerald-500' : 'bg-[var(--color-bg-tertiary)]'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          gdprPreferences[key] ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  );
                })}

              </div>

              <div className="text-[11px] text-[var(--color-text-muted)] pt-2 flex items-center justify-between">
                <span>Last Updated: {new Date(gdprPreferences.lastUpdated).toLocaleString()}</span>
                <span>Consent Version: {gdprPreferences.consentVersion}</span>
              </div>

            </div>
          )}

          {activeTab === 'dsar' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Article 15: Right of Access (DSAR Data Package)</span>
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                  Under GDPR Article 15, you are entitled to export a machine-readable JSON copy of all personal data held by {SITE_NAME}, including profile credentials, order ledgers (recorded in EUR), consent logs, and pseudonymized IP hashes.
                </p>
              </div>

              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl space-y-2 text-xs">
                <div className="font-semibold text-[var(--color-text-secondary)]">Package Contents:</div>
                <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
                  <li>User Account Credentials &amp; Delivery Addresses</li>
                  <li>Complete Order Ledger &amp; EU VAT Calculations (in EUR)</li>
                  <li>Consent Action Log &amp; Pseudonymized IP Hashes</li>
                  <li>Data Server Storage Center (Frankfurt, EU Primary Node)</li>
                </ul>
              </div>

              <button
                onClick={downloadDSARPackage}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <Download className="w-4 h-4" />
                <span>Download My GDPR Personal Data Package (.json)</span>
              </button>
            </div>
          )}

          {activeTab === 'erasure' && (
            <div className="space-y-4">
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/50 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Article 17: Right to Erasure ("Right to Be Forgotten")</span>
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-200 leading-relaxed">
                  Executing an erasure request will permanently delete/anonymize all personal profile information and customer identity details from our active databases. Minimal transaction totals are retained in EUR strictly for EU tax compliance audit laws.
                </p>
              </div>

              {erasureDone ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-[var(--color-text-primary)] text-sm">Data Anonymization Complete</h4>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Your customer profile has been scrubbed and replaced with pseudonymized placeholders in accordance with Article 17.
                  </p>
                </div>
              ) : showErasureConfirm ? (
                <div className="bg-[var(--color-bg-tertiary)] border border-rose-500/50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-rose-500 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Confirm Permanent Data Erasure Request</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Are you sure you wish to anonymize your {SITE_NAME} customer account? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleExecuteErasure}
                      disabled={isErasing}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                    >
                      {isErasing ? 'Erasing...' : 'Yes, Permanently Anonymize My Data'}
                    </button>
                    <button
                      onClick={() => setShowErasureConfirm(false)}
                      className="flex-1 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] font-semibold py-2.5 rounded-xl text-xs transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowErasureConfirm(true)}
                  className="w-full bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Request Account &amp; Identity Erasure (Art. 17)</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)]">
                <span>Timestamp &amp; Action Log</span>
                <span>Pseudonymized IP Hash</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {consentLogs.map(log => (
                  <div key={log.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-3 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-500">{log.action}</span>
                      <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{log.ipAddressHash}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">{log.details}</p>
                    <div className="text-[10px] text-[var(--color-text-muted)] text-right">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm">{SITE_NAME} Data Protection Notice (EU Directive 2016/679)</h4>
              <p>
                {LEGAL_NAME} operates strictly under European Union data sovereignty frameworks. All primary application databases, checkout ledgers, and inventory servers are hosted within <strong>Frankfurt, Germany (EU-West Cloud Run Container Infrastructure)</strong>.
              </p>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-3 rounded-xl space-y-1 text-[11px]">
                <div className="font-semibold text-[var(--color-text-primary)]">Data Protection Officer (DPO):</div>
                <div className="text-[var(--color-text-muted)]">{PRIVACY_EMAIL} · {ADDRESS_LINE}</div>
                <div className="font-semibold text-[var(--color-text-primary)] pt-1">Primary Payment Processor:</div>
                <div className="text-[var(--color-text-muted)]">Stripe Payments Europe Ltd. (Dublin, Ireland) · EUR Default Settlement</div>
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex justify-end">
          <button
            onClick={() => setIsGDPRModalOpen(false)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
          >
            Done &amp; Save Privacy State
          </button>
        </div>

      </div>
    </div>
  );
};
