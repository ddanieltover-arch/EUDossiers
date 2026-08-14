import React from 'react';
import { CheckCircle2, Download, ShieldCheck, FileText, ArrowRight, X, Euro } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SITE_NAME, LEGAL_NAME, ADDRESS_LINE, EXPORT_PREFIX } from '../brand';

export const OrderSuccessModal: React.FC = () => {
  const { currentCompletedOrder, setCurrentCompletedOrder, formatPriceEUR } = useStore();

  if (!currentCompletedOrder) return null;

  const order = currentCompletedOrder;

  const downloadInvoiceText = () => {
    const invoiceContent = `=====================================================
            ${SITE_NAME.toUpperCase()} - OFFICIAL EU TAX INVOICE
=====================================================
Invoice Ref: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer Name: ${order.customerName}
Customer Email: ${order.customerEmail}
Destination EU Country: ${order.destinationCountry}
GDPR Compliance Status: Consent Recorded (Art. 6 Regulation EU 2016/679)

-----------------------------------------------------
ORDER ITEMS (ALL PRICES SETTLED IN EUR)
-----------------------------------------------------
${order.items.map(item => `${item.name} (${item.sku})
  Qty: ${item.quantity} x ${item.unitPriceEUR.toFixed(2)} EUR = ${item.totalPriceEUR.toFixed(2)} EUR`).join('\n\n')}

-----------------------------------------------------
TAX & FINANCIAL BREAKDOWN
-----------------------------------------------------
Subtotal: ${order.subtotalEUR.toFixed(2)} EUR
EU Country VAT (${(order.vatRate * 100).toFixed(0)}%): ${order.vatAmountEUR.toFixed(2)} EUR
Shipping Fee: ${order.shippingFeeEUR.toFixed(2)} EUR
-----------------------------------------------------
TOTAL AMOUNT SETTLED (EUR): ${order.totalEUR.toFixed(2)} EUR
-----------------------------------------------------
Display Reference: ${order.paidAmountConverted.toFixed(2)} ${order.paidCurrency} (Fx Rate: ${order.exchangeRateUsed})

Primary Server Node: Frankfurt Hub (EU-West)
Seller: ${LEGAL_NAME}, ${ADDRESS_LINE}
VAT ID: DE000000000

Thank you for supporting European artisans & craftsmen.
=====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id}_${EXPORT_PREFIX}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setCurrentCompletedOrder(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white">Payment Confirmed in EUR</h3>
          <p className="text-xs text-slate-400">
            Order Reference: <span className="font-mono text-blue-400 font-bold">{order.id}</span>
          </p>
        </div>

        {/* Invoice Summary Box */}
        <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs mb-6">
          
          <div className="flex justify-between pb-2 border-b border-slate-700/60 text-slate-400">
            <span>Customer: <strong className="text-white">{order.customerName}</strong></span>
            <span>Destination: <strong className="text-white">{order.destinationCountry}</strong></span>
          </div>

          <div className="space-y-2 py-1 max-h-36 overflow-y-auto custom-scrollbar">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-300">
                <span className="truncate pr-2">{it.quantity}x {it.name}</span>
                <span className="font-semibold text-white shrink-0">{formatPriceEUR(it.totalPriceEUR)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-700/60 space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>EU VAT ({(order.vatRate * 100).toFixed(0)}%):</span>
              <span className="text-slate-200">{formatPriceEUR(order.vatAmountEUR)}</span>
            </div>
            <div className="flex justify-between items-baseline font-bold pt-1">
              <span className="text-white text-sm">Settled EUR Total:</span>
              <span className="text-lg text-emerald-400">{formatPriceEUR(order.totalEUR)}</span>
            </div>
            {order.paidCurrency !== 'EUR' && (
              <div className="text-right text-[11px] text-indigo-300">
                Display reference: {order.paidCurrencySymbol}{order.paidAmountConverted.toFixed(2)} {order.paidCurrency}
              </div>
            )}
          </div>

        </div>

        {/* GDPR Notice */}
        <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3 mb-6 flex items-start space-x-2.5 text-[11px] text-blue-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>GDPR Order Processing Record:</strong> Your personal data and transaction log are secured under EU Regulation 2016/679. You can download or request erasure of this record anytime from the GDPR Privacy panel.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadInvoiceText}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-3 rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Download Official EU Invoice</span>
          </button>

          <button
            onClick={() => setCurrentCompletedOrder(null)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
