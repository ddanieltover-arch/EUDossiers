import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { SITE_NAME, LEGAL_NAME, PRIVACY_EMAIL, ADDRESS_LINE } from '../brand';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('privacy');
  const {
    gdprPreferences,
    updateGDPRPreferences,
    consentLogs,
    downloadDSARPackage,
    requestRightToBeForgotten,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'consent' | 'dsar' | 'erasure' | 'logs' | 'policy'>('policy');
  const [showErasureConfirm, setShowErasureConfirm] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [erasureDone, setErasureDone] = useState(false);

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

  const tabs = [
    { key: 'policy' as const, label: t('tabs.policy') },
    { key: 'consent' as const, label: t('tabs.consent') },
    { key: 'dsar' as const, label: t('tabs.dsar') },
    { key: 'erasure' as const, label: t('tabs.erasure') },
    { key: 'logs' as const, label: t('tabs.logs') },
  ];

  const preferenceCopy = {
    analytics: { title: t('analyticsTitle'), desc: t('analyticsDesc') },
    marketing: { title: t('marketingTitle'), desc: t('marketingDesc') },
    functional: { title: t('functionalTitle'), desc: t('functionalDesc') },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t('title')}</h1>
            <p className="text-xs text-[var(--color-text-muted)]">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] border border-[var(--color-border-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {activeTab === 'policy' && (
          <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <h2 className="font-bold text-[var(--color-text-primary)] text-lg">{t('policyTitle', { site: SITE_NAME })}</h2>
            <p>{t('policyBody', { legal: LEGAL_NAME })}</p>
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-[var(--color-text-primary)]">{t('dpo')}</div>
              <div className="text-[var(--color-text-muted)]">{PRIVACY_EMAIL} · {ADDRESS_LINE}</div>
              <div className="font-semibold text-[var(--color-text-primary)] pt-1">{t('processor')}</div>
              <div className="text-[var(--color-text-muted)]">{t('processorValue')}</div>
            </div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-base pt-4">{t('rightsTitle')}</h3>
            <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)] text-xs">
              <li>{t('rights.access')}</li>
              <li>{t('rights.rectification')}</li>
              <li>{t('rights.erasure')}</li>
              <li>{t('rights.restrict')}</li>
              <li>{t('rights.portability')}</li>
              <li>{t('rights.object')}</li>
            </ul>
          </div>
        )}

        {activeTab === 'consent' && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--color-text-secondary)]">{t('consentIntro')}</p>
            <div className="space-y-3">
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{t('essentialTitle')}</span>
                    <span className="text-[10px] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded font-mono">{t('alwaysActive')}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('essentialDesc')}</p>
                </div>
                <input type="checkbox" disabled checked className="w-5 h-5 rounded accent-emerald-500 opacity-70" />
              </div>
              {(['analytics', 'marketing', 'functional'] as const).map(key => (
                <div key={key} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{preferenceCopy[key].title}</span>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{preferenceCopy[key].desc}</p>
                  </div>
                  <button onClick={() => handleTogglePreference(key)} className={`w-12 h-6 rounded-full p-1 transition-colors ${gdprPreferences[key] ? 'bg-emerald-500' : 'bg-[var(--color-bg-tertiary)]'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${gdprPreferences[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] pt-2 flex items-center justify-between">
              <span>{t('lastUpdated', { date: new Date(gdprPreferences.lastUpdated).toLocaleString() })}</span>
              <span>{t('consentVersion', { version: gdprPreferences.consentVersion })}</span>
            </div>
          </div>
        )}

        {activeTab === 'dsar' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50 p-4 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
                <Download className="w-4 h-4 text-blue-500" />
                <span>{t('dsarTitle')}</span>
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                {t('dsarBody', { site: SITE_NAME })}
              </p>
            </div>
            <button onClick={downloadDSARPackage} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20">
              <Download className="w-4 h-4" />
              <span>{t('dsarDownload')}</span>
            </button>
          </div>
        )}

        {activeTab === 'erasure' && (
          <div className="space-y-4">
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/50 p-4 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>{t('erasureTitle')}</span>
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-200 leading-relaxed">{t('erasureBody')}</p>
            </div>
            {erasureDone ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-[var(--color-text-primary)] text-sm">{t('erasureDone')}</h4>
              </div>
            ) : showErasureConfirm ? (
              <div className="bg-[var(--color-bg-tertiary)] border border-rose-500/50 p-5 rounded-2xl space-y-3">
                <p className="text-xs text-[var(--color-text-secondary)]">{t('erasureConfirm')}</p>
                <div className="flex space-x-2">
                  <button onClick={handleExecuteErasure} disabled={isErasing} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs">
                    {isErasing ? t('erasing') : t('erasureYes')}
                  </button>
                  <button onClick={() => setShowErasureConfirm(false)} className="flex-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] font-semibold py-2.5 rounded-xl text-xs">{t('cancel')}</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowErasureConfirm(true)} className="w-full bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>{t('erasureRequest')}</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)]">
              <span>{t('logsTitle')}</span>
              <span>{t('logsIp')}</span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {consentLogs.length === 0 && <p className="text-xs text-[var(--color-text-muted)] text-center py-8">{t('logsEmpty')}</p>}
              {consentLogs.map(log => (
                <div key={log.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-3 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-500">{log.action}</span>
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{log.ipAddressHash}</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">{log.details}</p>
                  <div className="text-[10px] text-[var(--color-text-muted)] text-right">{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;
