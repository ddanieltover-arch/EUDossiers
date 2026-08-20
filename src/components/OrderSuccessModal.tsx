import React, { useState } from 'react';
import { CheckCircle2, Download, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { downloadOfficialEuInvoice } from '../utils/generateInvoicePdf';
import { useTranslation } from 'react-i18next';

export const OrderSuccessModal: React.FC = () => {
  const { currentCompletedOrder, setCurrentCompletedOrder, formatPriceEUR } = useStore();
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!currentCompletedOrder) return null;

  const order = currentCompletedOrder;

  const handleDownloadInvoice = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadOfficialEuInvoice(order);
    } catch (err) {
      console.error('Failed to generate invoice PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        
        <button
          onClick={() => setCurrentCompletedOrder(null)}
          className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-[var(--color-text-primary)]">{t('checkout:modalTitle')}</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('checkout:orderRef')} <span className="font-mono text-blue-500 font-bold">{order.id}</span>
          </p>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3 text-xs mb-6">
          
          <div className="flex justify-between pb-2 border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
            <span>{t('checkout:customer')}: <strong className="text-[var(--color-text-primary)]">{order.customerName}</strong></span>
            <span>{t('checkout:destination')}: <strong className="text-[var(--color-text-primary)]">{order.destinationCountry}</strong></span>
          </div>
          <div className="space-y-1 text-[var(--color-text-muted)]">
            <div>Email: <strong className="text-[var(--color-text-primary)]">{order.customerEmail}</strong></div>
            {order.customerPhone && (
              <div>Phone: <strong className="text-[var(--color-text-primary)]">{order.customerPhone}</strong></div>
            )}
            {order.customerAddress && (
              <div>Address: <strong className="text-[var(--color-text-primary)]">{order.customerAddress}</strong></div>
            )}
            {order.paymentMethod && (
              <div>
                {t('checkout:paymentLabel')}{' '}
                <strong className="text-[var(--color-text-primary)]">
                  {order.paymentMethod === 'crypto' ? t('checkout:crypto') : t('checkout:bankTransfer')}
                </strong>
              </div>
            )}
          </div>

          <div className="space-y-2 py-1 max-h-36 overflow-y-auto custom-scrollbar">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-[var(--color-text-secondary)]">
                <span className="truncate pr-2">{it.quantity}x {it.name}</span>
                <span className="font-semibold text-[var(--color-text-primary)] shrink-0">{formatPriceEUR(it.totalPriceEUR)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--color-border)] space-y-1">
            {order.cryptoDiscountEUR && order.cryptoDiscountEUR > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>{t('checkout:cryptoDiscount')}:</span>
                <span>-{formatPriceEUR(order.cryptoDiscountEUR)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline font-bold pt-1">
              <span className="text-[var(--color-text-primary)] text-sm">{t('checkout:settledTotal')}</span>
              <span className="text-lg text-emerald-500">{formatPriceEUR(order.totalEUR)}</span>
            </div>
            {order.paidCurrency !== 'EUR' && (
              <div className="text-right text-[11px] text-indigo-500">
                Display reference: {order.paidCurrencySymbol}{order.paidAmountConverted.toFixed(2)} {order.paidCurrency}
              </div>
            )}
          </div>

        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50 rounded-xl p-3 mb-6 flex items-start space-x-2.5 text-[11px] text-blue-700 dark:text-blue-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            {t('checkout:gdprRecord')}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] disabled:opacity-60 text-[var(--color-text-primary)] font-semibold text-xs py-3 rounded-xl border border-[var(--color-border)] flex items-center justify-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>{isDownloading ? t('checkout:preparingPdf') : t('checkout:downloadInvoice')}</span>
          </button>

          <button
            onClick={() => setCurrentCompletedOrder(null)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <span>{t('checkout:continueShopping')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
