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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <span>GDPR Data Privacy Suite</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full uppercase font-bold">
                  Art. 15 / 17 Certified
                </span>
              </h3>
              <p className="text-xs text-slate-400">Regulation (EU) 2016/679 Protection &amp; Customer Rights</p>
            </div>
          </div>

          <button
            onClick={() => setIsGDPRModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Navigation Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto custom-scrollbar px-4">
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'consent'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Cookie Preferences
          </button>

          <button
            onClick={() => setActiveTab('dsar')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'dsar'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Export My Data (DSAR)
          </button>

          <button
            onClick={() => setActiveTab('erasure')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'erasure'
                ? 'border-rose-500 text-rose-400 bg-rose-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Right to Be Forgotten
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'logs'
                ? 'border-amber-500 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Consent Audit Trail
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'policy'
                ? 'border-slate-400 text-white bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5. EU Privacy Policy
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* TAB 1: COOKIE & DATA PREFERENCES */}
          {activeTab === 'consent' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Configure your data collection preferences under EU GDPR directives. You can modify these settings at any time with immediate server synchronization.
              </p>

              <div className="space-y-3">
                
                {/* Essential */}
                <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">Strictly Essential Cookies</span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">Always Active</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Required for Euro (€) cart management, security tokens, and local VAT calculation.
                    </p>
                  </div>
                  <input type="checkbox" disabled checked className="w-5 h-5 rounded accent-emerald-500 opacity-70" />
                </div>

                {/* Analytics */}
                <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white">Aggregated Performance Analytics</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Helps us optimize European delivery speeds and warehouse inventory turnover without personal tracking.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTogglePreference('analytics')}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      gdprPreferences.analytics ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      gdprPreferences.analytics ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Marketing */}
                <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white">Targeted Product Recommendations</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Allows personalized artisan suggestions based on past browsing history.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTogglePreference('marketing')}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      gdprPreferences.marketing ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      gdprPreferences.marketing ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Functional */}
                <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white">Localization &amp; Currency Memory</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Remembers your preferred EU destination country and reference currency preference.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTogglePreference('functional')}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      gdprPreferences.functional ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      gdprPreferences.functional ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>

              <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-between">
                <span>Last Updated: {new Date(gdprPreferences.lastUpdated).toLocaleString()}</span>
                <span>Consent Version: {gdprPreferences.consentVersion}</span>
              </div>

            </div>
          )}

          {/* TAB 2: DSAR DATA EXPORT */}
          {activeTab === 'dsar' && (
            <div className="space-y-4">
              <div className="bg-blue-950/40 border border-blue-800/50 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Article 15: Right of Access (DSAR Data Package)</span>
                </h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Under GDPR Article 15, you are entitled to export a machine-readable JSON copy of all personal data held by {SITE_NAME}, including profile credentials, order ledgers (recorded in EUR), consent logs, and pseudonymized IP hashes.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl space-y-2 text-xs">
                <div className="font-semibold text-slate-300">Package Contents:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
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

          {/* TAB 3: RIGHT TO BE FORGOTTEN */}
          {activeTab === 'erasure' && (
            <div className="space-y-4">
              <div className="bg-rose-950/40 border border-rose-800/50 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Article 17: Right to Erasure ("Right to Be Forgotten")</span>
                </h4>
                <p className="text-xs text-rose-200 leading-relaxed">
                  Executing an erasure request will permanently delete/anonymize all personal profile information and customer identity details from our active databases. Minimal transaction totals are retained in EUR strictly for EU tax compliance audit laws.
                </p>
              </div>

              {erasureDone ? (
                <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Data Anonymization Complete</h4>
                  <p className="text-xs text-slate-300">
                    Your customer profile has been scrubbed and replaced with pseudonymized placeholders in accordance with Article 17.
                  </p>
                </div>
              ) : showErasureConfirm ? (
                <div className="bg-slate-800 border border-rose-800/80 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Confirm Permanent Data Erasure Request</span>
                  </div>
                  <p className="text-xs text-slate-300">
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
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowErasureConfirm(true)}
                  className="w-full bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Request Account &amp; Identity Erasure (Art. 17)</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 4: CONSENT AUDIT TRAIL */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Timestamp &amp; Action Log</span>
                <span>Pseudonymized IP Hash</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {consentLogs.map(log => (
                  <div key={log.id} className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-400">{log.action}</span>
                      <span className="font-mono text-[10px] text-slate-500">{log.ipAddressHash}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{log.details}</p>
                    <div className="text-[10px] text-slate-500 text-right">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EU PRIVACY POLICY */}
          {activeTab === 'policy' && (
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-bold text-white text-sm">{SITE_NAME} Data Protection Notice (EU Directive 2016/679)</h4>
              <p>
                {LEGAL_NAME} operates strictly under European Union data sovereignty frameworks. All primary application databases, checkout ledgers, and inventory servers are hosted within <strong>Frankfurt, Germany (EU-West Cloud Run Container Infrastructure)</strong>.
              </p>
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl space-y-1 text-[11px]">
                <div className="font-semibold text-white">Data Protection Officer (DPO):</div>
                <div className="text-slate-400">{PRIVACY_EMAIL} · {ADDRESS_LINE}</div>
                <div className="font-semibold text-white pt-1">Primary Payment Processor:</div>
                <div className="text-slate-400">Stripe Payments Europe Ltd. (Dublin, Ireland) · EUR Default Settlement</div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
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
