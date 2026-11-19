import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  User, 
  MapPin, 
  Euro, 
  TrendingUp,
  Inbox
} from 'lucide-react';
import { QuotationRequest, QuotationStatus } from '../../types';
import { CONTACT_PHONE_DISPLAY } from '../../brand';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.139-1.633-.79-1.886-.88-.253-.09-.437-.139-.62.14-.184.279-.713.88-.873 1.061-.16.18-.32.202-.593.07-.274-.139-1.447-.533-2.757-1.7-1.019-.906-1.707-2.028-1.907-2.372-.2-.345-.021-.531.14-.7.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.62-1.493-.85-2.047-.224-.535-.45-.463-.62-.472l-.527-.01c-.187 0-.49.07-.746.35-.256.28-.98.958-.98 2.34 0 1.38 1.003 2.713 1.143 2.9.14.187 1.973 3.01 4.78 4.22.668.287 1.19.458 1.597.586.67.214 1.28.183 1.763.111.538-.08 1.633-.667 1.865-1.312.23-.645.23-1.197.16-1.312-.07-.114-.255-.18-.552-.32zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const QuotationsLedgerView: React.FC = () => {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<QuotationRequest | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch quotations from /api/contact
  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        // Filter or prioritize messages with subject: 'quote' or product inquiries
        const quoteItems: QuotationRequest[] = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id || `QUO-${Date.now()}`,
              name: item.name || 'Anonymous',
              email: item.email || '',
              phone: item.phone || undefined,
              subject: item.subject || 'quote',
              message: item.message || '',
              createdAt: item.createdAt || new Date().toISOString(),
              productName: item.productName || 'European Document Specification',
              sku: item.sku || 'SKU-DOC',
              referencePriceEUR: Number(item.referencePriceEUR) || 440,
              quantity: Number(item.quantity) || 1,
              country: item.country || 'European Union',
              channel: item.channel === 'whatsapp' ? 'whatsapp' : 'email',
              status: (item.status || 'NEW') as QuotationStatus,
            }))
          : [];
        setQuotations(quoteItems);
      }
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Update status handler
  const handleStatusChange = async (id: string, newStatus: QuotationStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setQuotations((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote && selectedQuote.id === id) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update quotation status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete quotation handler
  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete quotation ${id}?`)) return;
    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setQuotations((prev) => prev.filter((q) => q.id !== id));
        if (selectedQuote?.id === id) setSelectedQuote(null);
      }
    } catch (err) {
      console.error('Failed to delete quotation:', err);
    }
  };

  // Filtered quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchId = q.id.toLowerCase().includes(query);
        const matchName = q.name.toLowerCase().includes(query);
        const matchEmail = q.email.toLowerCase().includes(query);
        const matchProduct = (q.productName || '').toLowerCase().includes(query);
        const matchSku = (q.sku || '').toLowerCase().includes(query);
        const matchCountry = (q.country || '').toLowerCase().includes(query);
        if (!matchId && !matchName && !matchEmail && !matchProduct && !matchSku && !matchCountry) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
      if (channelFilter !== 'ALL' && q.channel !== channelFilter) return false;
      return true;
    });
  }, [quotations, searchTerm, statusFilter, channelFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = quotations.length;
    const newCount = quotations.filter((q) => q.status === 'NEW').length;
    const inProgress = quotations.filter((q) => q.status === 'CONTACTED' || q.status === 'QUOTED').length;
    const totalPipelineValue = quotations.reduce((sum, q) => {
      const unit = q.referencePriceEUR || 0;
      const qty = q.quantity || 1;
      return sum + unit * qty;
    }, 0);
    const whatsappCount = quotations.filter((q) => q.channel === 'whatsapp').length;
    return { total, newCount, inProgress, totalPipelineValue, whatsappCount };
  }, [quotations]);

  const copySummary = (q: QuotationRequest) => {
    const text = `Quotation Reference: ${q.id}
Customer: ${q.name} (${q.email})
Phone: ${q.phone || 'N/A'}
Destination: ${q.country || 'EU'}
Product: ${q.productName} (SKU: ${q.sku})
Unit Price: €${(q.referencePriceEUR || 0).toFixed(2)}
Quantity: ${q.quantity || 1}
Total Value: €${((q.referencePriceEUR || 0) * (q.quantity || 1)).toFixed(2)}
Channel: ${q.channel?.toUpperCase()}
Date: ${new Date(q.createdAt).toLocaleString()}
Status: ${q.status}

Message:
${q.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    const headers = ['ID,Date,Customer,Email,Phone,Country,Product,SKU,Quantity,UnitPriceEUR,TotalValueEUR,Channel,Status'];
    const rows = quotations.map((q) => [
      `"${q.id}"`,
      `"${new Date(q.createdAt).toISOString()}"`,
      `"${q.name.replace(/"/g, '""')}"`,
      `"${q.email}"`,
      `"${q.phone || ''}"`,
      `"${q.country || ''}"`,
      `"${(q.productName || '').replace(/"/g, '""')}"`,
      `"${q.sku || ''}"`,
      q.quantity || 1,
      (q.referencePriceEUR || 0).toFixed(2),
      ((q.referencePriceEUR || 0) * (q.quantity || 1)).toFixed(2),
      `"${q.channel || 'email'}"`,
      `"${q.status}"`,
    ].join(','));
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eudossier-Quotations-Export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">NEW</span>;
      case 'CONTACTED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">CONTACTED</span>;
      case 'QUOTED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">QUOTED</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">CLOSED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Subtitle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#04928F]" />
            <span>Commercial Quotations & Inquiries</span>
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Real-time management of quotations requested via WhatsApp and email form from the catalogue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchQuotations}
            disabled={isLoading}
            className="p-2 text-xs font-semibold rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh quotations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportCsv}
            disabled={quotations.length === 0}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>Total Quotations</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-[var(--color-text-primary)]">{stats.total}</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">All catalog inquiries</div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>New & Unreviewed</span>
            <AlertCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.newCount}</div>
          <div className="text-[11px] text-emerald-500/80 font-semibold">Requires immediate review</div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>Pipeline Reference Value</span>
            <Euro className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            €{stats.totalPipelineValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)]">Cumulative dossier value</div>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>Channel Split</span>
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-2xl font-black text-[#25D366]">
            {stats.whatsappCount} <span className="text-xs text-[var(--color-text-muted)] font-normal">WhatsApp / {stats.total - stats.whatsappCount} Email</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)]">Omni-channel leads</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, product, SKU, reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUOTED">Quoted</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="ALL">All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Direct Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Quotations Table */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">Ref ID & Date</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Qty & Unit Ref</th>
                <th className="p-3.5">Total Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--color-text-muted)]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#04928F]" />
                    <span>Loading quotation entries...</span>
                  </td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--color-text-muted)]">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">No quotations found</p>
                    <p className="text-xs mt-0.5">Try adjusting your search terms or filter selection.</p>
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((q) => {
                  const total = (q.referencePriceEUR || 0) * (q.quantity || 1);
                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedQuote(q)}
                    >
                      {/* Ref ID & Date */}
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-[var(--color-text-primary)] text-xs">
                          {q.id}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{new Date(q.createdAt).toLocaleDateString()} {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-3.5">
                        <div className="font-bold text-[var(--color-text-primary)]">{q.name}</div>
                        <div className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[180px]">{q.email}</div>
                        {q.country && (
                          <div className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                            <span>{q.country}</span>
                          </div>
                        )}
                      </td>

                      {/* Channel */}
                      <td className="p-3.5">
                        {q.channel === 'whatsapp' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
                            <WhatsAppIcon className="w-3 h-3 shrink-0" />
                            <span>WhatsApp</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>Direct Form</span>
                          </span>
                        )}
                      </td>

                      {/* Product & SKU */}
                      <td className="p-3.5">
                        <div className="font-semibold text-[var(--color-text-primary)] truncate max-w-[200px]">
                          {q.productName}
                        </div>
                        <div className="text-[10px] font-mono text-blue-400 uppercase mt-0.5">
                          {q.sku}
                        </div>
                      </td>

                      {/* Qty & Unit Ref */}
                      <td className="p-3.5">
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {q.quantity || 1} {q.quantity === 1 ? 'unit' : 'units'}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                          €{(q.referencePriceEUR || 0).toFixed(2)} each
                        </div>
                      </td>

                      {/* Total Value */}
                      <td className="p-3.5 font-bold font-mono text-[var(--color-text-primary)]">
                        €{total.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={q.status}
                          disabled={updatingId === q.id}
                          onChange={(e) => handleStatusChange(q.id, e.target.value as QuotationStatus)}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="NEW">🟢 NEW</option>
                          <option value="CONTACTED">🟡 CONTACTED</option>
                          <option value="QUOTED">🟣 QUOTED</option>
                          <option value="CLOSED">⚪ CLOSED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="p-1.5 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                        <a
                          href={`mailto:${q.email}?subject=${encodeURIComponent(`Quotation Reference ${q.id} — ${q.productName} | Eudossier`)}&body=${encodeURIComponent(`Hello ${q.name},\n\nThank you for requesting a quotation for ${q.productName} (SKU: ${q.sku}) on Eudossier.\n\nWe are pleased to provide the official specifications and lead times:\n- Quantity: ${q.quantity || 1}\n- Total Reference: €${total.toFixed(2)}\n\nPlease let us know if you require further assistance.\n\nBest regards,\nEudossier Compliance Team`)}`}
                          className="p-1.5 inline-block rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
                          title="Reply by Email"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        </a>
                        {q.phone && (
                          <a
                            href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${q.name}, following up regarding your quotation request ${q.id} for ${q.productName} on Eudossier.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 inline-block rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
                            title="Chat with Customer on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteQuote(q.id)}
                          className="p-1.5 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-rose-500/10 border border-[var(--color-border)] hover:border-rose-500/30 text-[var(--color-text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Detail Modal */}
      {selectedQuote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedQuote(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#04928F]" />
                <div>
                  <h3 className="font-bold text-base text-[var(--color-text-primary)]">
                    Quotation #{selectedQuote.id}
                  </h3>
                  <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-2 mt-0.5">
                    <span>Submitted on {new Date(selectedQuote.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    {getStatusBadge(selectedQuote.status)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Customer Card & Channel Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] space-y-2">
                  <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 uppercase tracking-wide">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Customer Details</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-[var(--color-text-muted)]">Name: </span>
                      <strong className="text-[var(--color-text-primary)]">{selectedQuote.name}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-muted)]">Email: </span>
                      <a href={`mailto:${selectedQuote.email}`} className="text-blue-400 hover:underline">
                        {selectedQuote.email}
                      </a>
                    </div>
                    {selectedQuote.phone && (
                      <div>
                        <span className="text-[var(--color-text-muted)]">Phone / WA: </span>
                        <a
                          href={`tel:${selectedQuote.phone}`}
                          className="text-emerald-400 hover:underline"
                        >
                          {selectedQuote.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-[var(--color-text-muted)]">Destination: </span>
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {selectedQuote.country || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] space-y-2">
                  <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 uppercase tracking-wide">
                    <Euro className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Document & Financials</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-[var(--color-text-muted)]">Document: </span>
                      <strong className="text-[var(--color-text-primary)]">{selectedQuote.productName}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-muted)]">SKU: </span>
                      <span className="font-mono text-blue-400">{selectedQuote.sku}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-muted)]">Quantity: </span>
                      <strong className="text-[var(--color-text-primary)]">{selectedQuote.quantity || 1} unit(s)</strong>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-muted)]">Ref Unit Price: </span>
                      <span className="text-[var(--color-text-primary)]">€{(selectedQuote.referencePriceEUR || 0).toFixed(2)}</span>
                    </div>
                    <div className="pt-1 border-t border-[var(--color-border)] flex justify-between font-bold text-sm">
                      <span className="text-[var(--color-text-muted)]">Total Ref Value:</span>
                      <span className="text-emerald-400">
                        €{((selectedQuote.referencePriceEUR || 0) * (selectedQuote.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-[var(--color-text-secondary)]">Update Workflow Status:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['NEW', 'CONTACTED', 'QUOTED', 'CLOSED'] as QuotationStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedQuote.id, st)}
                      disabled={selectedQuote.status === st || updatingId === selectedQuote.id}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedQuote.status === st
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Message / Instruction Box */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between">
                  <span>Customer Message & Special Specifications</span>
                  <button
                    onClick={() => copySummary(selectedQuote)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] font-mono whitespace-pre-wrap leading-relaxed">
                  {selectedQuote.message}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`mailto:${selectedQuote.email}?subject=${encodeURIComponent(`Quotation ${selectedQuote.id} — ${selectedQuote.productName} | Eudossier`)}&body=${encodeURIComponent(`Hello ${selectedQuote.name},\n\nRegarding your quotation inquiry for ${selectedQuote.productName} on Eudossier...\n`)}`}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl bg-[#04928F] hover:bg-[#037A77] text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#04928F]/20 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email Reply</span>
                </a>
                {selectedQuote.phone && (
                  <a
                    href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedQuote.name}, following up regarding your quotation request ${selectedQuote.id} for ${selectedQuote.productName} on Eudossier.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
