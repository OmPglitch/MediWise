import React, { useState } from 'react';
import {
  CreditCard,
  FileText,
  Globe,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Download,
  RefreshCw,
  ChevronRight,
  Lock,
  Unlock,
  IndianRupee,
  TrendingUp,
  Send,
  Eye,
  Zap,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  StripeEscrowPayout,
  GSTInvoice,
  SupportedCurrency,
  CurrencyRate,
  AuditEvent,
} from '../../types';
import {
  MOCK_ESCROW_PAYOUTS,
  MOCK_GST_INVOICES,
  CURRENCY_RATES,
  formatCurrency,
  convertFromINR,
} from '../../data/mockPhase4Data';

interface CommerceScreenProps {
  onAddAuditEvent: (event: AuditEvent) => void;
  currentUserRole?: string;
}

type CommerceTab = 'escrow' | 'gst' | 'currency';

export const CommerceScreen: React.FC<CommerceScreenProps> = ({
  onAddAuditEvent,
  currentUserRole = 'cmio',
}) => {
  const [activeTab, setActiveTab] = useState<CommerceTab>('escrow');
  const [payouts, setPayouts] = useState<StripeEscrowPayout[]>(MOCK_ESCROW_PAYOUTS);
  const [invoices, setInvoices] = useState<GSTInvoice[]>(MOCK_GST_INVOICES);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('INR');
  const [selectedPayoutId, setSelectedPayoutId] = useState<string>(MOCK_ESCROW_PAYOUTS[0].id);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(MOCK_GST_INVOICES[0].id);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeCurrencyRate = CURRENCY_RATES.find((r) => r.currency === selectedCurrency) ?? CURRENCY_RATES[0];
  const selectedPayout = payouts.find((p) => p.id === selectedPayoutId) ?? payouts[0];
  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId) ?? invoices[0];

  const totalEscrowINR = payouts.reduce((sum, p) => sum + p.amount, 0);
  const disbursedINR = payouts.filter((p) => p.status === 'disbursed').reduce((sum, p) => sum + p.amount, 0);

  // --- Escrow Actions ---
  const handleApproveCompliance = (payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId ? { ...p, complianceApproved: true } : p
      )
    );
    onAddAuditEvent({
      id: `audit-escrow-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      actor: 'e.vance.compliance@mediwise.io',
      actorRole: 'SUPER_ADMIN',
      action: `Compliance Sign-Off: Escrow Payout ${payoutId}`,
      resource: 'Stripe Connect — Dual Authorization Gate',
      complianceCode: 'SOC2 CC6.2',
      ip: '10.128.0.4 (Compliance Console)',
      status: 'Verified Pass',
      statusType: 'success',
    });
  };

  const handleDisburse = (payoutId: string) => {
    const p = payouts.find((x) => x.id === payoutId);
    if (!p) return;
    if (p.requiresDualAuth && (!p.cmioApproved || !p.complianceApproved)) return;
    setIsDisbursing(true);
    setTimeout(() => {
      setIsDisbursing(false);
      const transferId = `tr_live_${Date.now().toString(16)}`;
      setPayouts((prev) =>
        prev.map((x) =>
          x.id === payoutId
            ? { ...x, status: 'disbursed', stripeTransferId: transferId, disbursedAt: new Date().toISOString() }
            : x
        )
      );
      onAddAuditEvent({
        id: `audit-disburse-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        actor: 'stripe-webhook@mediwise.io',
        actorRole: 'SYSTEM_BOT',
        action: `CPA Escrow Disbursed: ₹${p.amount.toLocaleString('en-IN')} → ${p.partnerName}`,
        resource: `Stripe Transfer [${transferId}]`,
        complianceCode: 'SOC2 CC6.1 / RBI PA Regulations',
        ip: '54.187.174.169 (Stripe)',
        status: 'Verified Pass',
        statusType: 'success',
      });
    }, 1600);
  };

  // --- GST Actions ---
  const handleGenerateInvoice = (invoiceId: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === invoiceId
            ? { ...i, status: 'generated', irnHash: `SHA256:${Math.random().toString(16).substring(2, 18)}` }
            : i
        )
      );
    }, 1200);
  };

  const handleFileInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'filed' } : i))
    );
    onAddAuditEvent({
      id: `audit-gst-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      actor: 'finance@mediwise.io',
      actorRole: 'SUPER_ADMIN',
      action: `GST Invoice Filed: ${invoices.find((i) => i.id === invoiceId)?.invoiceNumber}`,
      resource: 'GSTN Portal Export — B2B Invoice',
      complianceCode: 'GST Act 2017 §31',
      ip: '10.128.0.7 (Finance Console)',
      status: 'Verified Pass',
      statusType: 'success',
    });
  };

  const payoutStatusBadge = (status: StripeEscrowPayout['status']) => {
    const map: Record<StripeEscrowPayout['status'], { label: string; cls: string }> = {
      disbursed: { label: 'DISBURSED', cls: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
      in_escrow: { label: 'IN ESCROW', cls: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
      dual_approval_required: { label: 'DUAL AUTH', cls: 'bg-amber-950 text-amber-300 border-amber-800' },
      pending_fulfillment: { label: 'PENDING', cls: 'bg-[#1e293b] text-[#94a3b8] border-[#334155]' },
      failed: { label: 'FAILED', cls: 'bg-red-950 text-red-300 border-red-800' },
    };
    const m = map[status];
    return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${m.cls}`}>{m.label}</span>;
  };

  const invoiceStatusBadge = (status: GSTInvoice['status']) => {
    const map = {
      draft: 'bg-[#1e293b] text-[#94a3b8] border-[#334155]',
      generated: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      filed: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${map[status]}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-2">
              Commerce & Financial Settlement
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Phase 4 · Sprints 4.1–4.3
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              Stripe escrow payouts, GST-compliant invoicing, and multi-currency display management
            </p>
          </div>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Escrow Pool', value: formatCurrency(totalEscrowINR, activeCurrencyRate), color: 'text-white' },
          { label: 'Disbursed (MTD)', value: formatCurrency(disbursedINR, activeCurrencyRate), color: 'text-emerald-400' },
          { label: 'Pending Invoices', value: String(invoices.filter((i) => i.status !== 'filed').length), color: 'text-amber-400' },
          { label: 'Active Currency', value: selectedCurrency, color: 'text-cyan-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-3">
            <div className={`text-xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#090d16] border border-[#1e293b] rounded-lg w-fit">
        {([
          { id: 'escrow', label: 'Stripe Escrow', icon: CreditCard },
          { id: 'gst', label: 'GST Invoicing', icon: FileText },
          { id: 'currency', label: 'Multi-Currency', icon: Globe },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === id ? 'bg-[#0284c7] text-white shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ========== STRIPE ESCROW TAB ========== */}
      {activeTab === 'escrow' && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Left: Payout List */}
          <div className="xl:col-span-2 space-y-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Payout Queue</h2>
            {payouts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPayoutId(p.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedPayoutId === p.id
                    ? 'bg-emerald-950/30 border-emerald-700/60'
                    : 'bg-[#0d1424] border-[#1e293b] hover:border-emerald-800/40'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-semibold text-white truncate">{p.partnerName}</span>
                  {payoutStatusBadge(p.status)}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] font-mono text-[#94a3b8]">{p.payoutNumber}</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {formatCurrency(p.amount, activeCurrencyRate)}
                  </span>
                </div>
                {p.requiresDualAuth && (
                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span className={`flex items-center gap-1 ${p.cmioApproved ? 'text-emerald-400' : 'text-[#64748b]'}`}>
                      {p.cmioApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />} CMIO
                    </span>
                    <span className={`flex items-center gap-1 ${p.complianceApproved ? 'text-emerald-400' : 'text-[#64748b]'}`}>
                      {p.complianceApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />} Compliance
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right: Detail */}
          <div className="xl:col-span-3 bg-[#0d1424] border border-[#1e293b] rounded-lg overflow-hidden">
            <div className="p-4 bg-[#090d16] border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedPayout.partnerName}</h3>
                <p className="text-[11px] text-[#94a3b8] font-mono">{selectedPayout.payoutNumber}</p>
              </div>
              {payoutStatusBadge(selectedPayout.status)}
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Amount (INR)', value: `₹${selectedPayout.amount.toLocaleString('en-IN')}` },
                  { label: `Amount (${selectedCurrency})`, value: formatCurrency(selectedPayout.amount, activeCurrencyRate) },
                  { label: 'Currency', value: selectedPayout.currency },
                  { label: 'Created', value: new Date(selectedPayout.createdAt).toLocaleDateString() },
                ].map((f) => (
                  <div key={f.label} className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#64748b] uppercase block">{f.label}</span>
                    <span className="font-mono text-white font-semibold">{f.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded text-xs space-y-1">
                <span className="text-[10px] text-[#64748b] uppercase block">Release Condition</span>
                <p className="text-[#cbd5e1]">{selectedPayout.escrowReleaseCondition}</p>
              </div>

              {selectedPayout.stripeTransferId && (
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Transfer ID: <span className="font-mono">{selectedPayout.stripeTransferId}</span></span>
                </div>
              )}

              {selectedPayout.requiresDualAuth && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold">
                    <Lock className="w-4 h-4" />
                    <span>Dual Authorization Required (Amount &gt; ₹1,00,000)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded border text-center ${selectedPayout.cmioApproved ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-[#090d16] border-[#1e293b] text-[#64748b]'}`}>
                      {selectedPayout.cmioApproved ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : <Clock className="w-3.5 h-3.5 inline mr-1" />}
                      CMIO Sign-Off
                    </div>
                    <div className={`p-2 rounded border text-center ${selectedPayout.complianceApproved ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-[#090d16] border-[#1e293b] text-[#64748b]'}`}>
                      {selectedPayout.complianceApproved ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : <Clock className="w-3.5 h-3.5 inline mr-1" />}
                      Compliance Sign-Off
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedPayout.status !== 'disbursed' && selectedPayout.status !== 'failed' && (
                <div className="flex gap-2 pt-2 border-t border-[#1e293b]">
                  {selectedPayout.requiresDualAuth && !selectedPayout.complianceApproved && (
                    <button
                      onClick={() => handleApproveCompliance(selectedPayout.id)}
                      className="flex-1 h-9 bg-amber-700/80 hover:bg-amber-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Compliance Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDisburse(selectedPayout.id)}
                    disabled={
                      isDisbursing ||
                      (selectedPayout.requiresDualAuth && (!selectedPayout.cmioApproved || !selectedPayout.complianceApproved))
                    }
                    className="flex-1 h-9 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDisbursing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Release Escrow via Stripe</span>
                  </button>
                </div>
              )}
              {selectedPayout.status === 'disbursed' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 rounded p-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Disbursed on {selectedPayout.disbursedAt ? new Date(selectedPayout.disbursedAt).toLocaleString() : '—'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== GST INVOICING TAB ========== */}
      {activeTab === 'gst' && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Left: Invoice List */}
          <div className="xl:col-span-2 space-y-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Invoice Register</h2>
            {invoices.map((inv) => (
              <button
                key={inv.id}
                onClick={() => setSelectedInvoiceId(inv.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedInvoiceId === inv.id
                    ? 'bg-cyan-950/30 border-cyan-700/60'
                    : 'bg-[#0d1424] border-[#1e293b] hover:border-cyan-800/40'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-white truncate">{inv.invoiceNumber}</span>
                  {invoiceStatusBadge(inv.status)}
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{inv.buyerName}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#64748b]">{inv.date}</span>
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {formatCurrency(inv.totalInvoiceValue, activeCurrencyRate)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Invoice Detail */}
          <div className="xl:col-span-3 bg-[#0d1424] border border-[#1e293b] rounded-lg overflow-hidden">
            <div className="p-4 bg-[#090d16] border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{selectedInvoice.invoiceNumber}</h3>
                <p className="text-[11px] text-[#94a3b8] truncate">{selectedInvoice.buyerName}</p>
              </div>
              {invoiceStatusBadge(selectedInvoice.status)}
            </div>
            <div className="p-4 space-y-4 text-xs">
              {/* Buyer Info */}
              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold block">Buyer Details</span>
                <div className="font-semibold text-white">{selectedInvoice.buyerName}</div>
                <div className="text-[11px] text-[#94a3b8]">{selectedInvoice.buyerAddress}</div>
                <div className="font-mono text-cyan-400 text-[11px]">GSTIN: {selectedInvoice.partnerGstin}</div>
              </div>

              {/* Tax Breakdown */}
              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-2">
                <span className="text-[10px] text-[#64748b] uppercase font-bold block flex items-center gap-1.5">
                  <IndianRupee className="w-3 h-3" /> GST Tax Breakdown
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: 'Taxable Amount', value: selectedInvoice.taxableAmount, cls: 'text-white' },
                    ...(selectedInvoice.cgstAmount > 0 ? [{ label: `CGST @ ${selectedInvoice.cgstRatePct}%`, value: selectedInvoice.cgstAmount, cls: 'text-[#94a3b8]' }] : []),
                    ...(selectedInvoice.sgstAmount > 0 ? [{ label: `SGST @ ${selectedInvoice.sgstRatePct}%`, value: selectedInvoice.sgstAmount, cls: 'text-[#94a3b8]' }] : []),
                    ...(selectedInvoice.igstAmount > 0 ? [{ label: `IGST @ ${selectedInvoice.igstRatePct}%`, value: selectedInvoice.igstAmount, cls: 'text-amber-400' }] : []),
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-[#94a3b8]">{row.label}</span>
                      <span className={`font-mono font-semibold ${row.cls}`}>
                        {formatCurrency(row.value, activeCurrencyRate)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-[#1e293b] pt-1.5 flex justify-between items-center font-bold">
                    <span className="text-white">Total Invoice Value</span>
                    <span className="font-mono text-emerald-400 text-sm">
                      {formatCurrency(selectedInvoice.totalInvoiceValue, activeCurrencyRate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'HSN Code', value: selectedInvoice.hsnCode },
                  { label: 'Invoice Date', value: selectedInvoice.date },
                  { label: 'Due Date', value: selectedInvoice.dueDate },
                  { label: 'IRN Hash', value: selectedInvoice.irnHash ? selectedInvoice.irnHash.substring(0, 20) + '…' : 'Not generated' },
                ].map((f) => (
                  <div key={f.label} className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#64748b] uppercase block">{f.label}</span>
                    <span className="font-mono text-white font-semibold text-[11px] break-all">{f.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#1e293b]">
                {selectedInvoice.status === 'draft' && (
                  <button
                    onClick={() => handleGenerateInvoice(selectedInvoice.id)}
                    disabled={isGenerating}
                    className="flex-1 h-9 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    <span>Generate Invoice + IRN</span>
                  </button>
                )}
                {selectedInvoice.status === 'generated' && (
                  <>
                    <button
                      onClick={() => handleFileInvoice(selectedInvoice.id)}
                      className="flex-1 h-9 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> File to GSTN Portal
                    </button>
                    <button className="h-9 px-3 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> PDF
                    </button>
                  </>
                )}
                {selectedInvoice.status === 'filed' && (
                  <div className="flex-1 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 rounded px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Filed with GSTN Portal. IRN cryptographically anchored.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MULTI-CURRENCY TAB ========== */}
      {activeTab === 'currency' && (
        <div className="space-y-5">
          <div className="p-4 bg-[#0d1424] border border-[#1e293b] rounded-lg space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Display Currency Configuration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {CURRENCY_RATES.map((rate) => (
                <button
                  key={rate.currency}
                  onClick={() => setSelectedCurrency(rate.currency)}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedCurrency === rate.currency
                      ? 'bg-cyan-950/50 border-cyan-600 text-cyan-300'
                      : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8] hover:border-cyan-800/40 hover:text-white'
                  }`}
                >
                  <div className="text-lg font-bold">{rate.symbol}</div>
                  <div className="text-xs font-mono font-bold mt-0.5">{rate.currency}</div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">
                    {rate.currency === 'INR' ? 'Base' : `1 ${rate.currency} = ₹${rate.rateToInr}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sample Price Conversion Table */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-[#1e293b] bg-[#090d16]">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Partner Commission Conversion Preview
                <span className="text-[10px] font-mono text-[#94a3b8] normal-case">Displaying in {selectedCurrency}</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1e293b] text-[#64748b] text-[10px] uppercase tracking-wider">
                    <th className="text-left p-3">Partner</th>
                    <th className="text-right p-3">INR Base</th>
                    <th className="text-right p-3">{selectedCurrency} Equivalent</th>
                    <th className="text-right p-3">Exchange Rate</th>
                    <th className="text-right p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ESCROW_PAYOUTS.map((p) => (
                    <tr key={p.id} className="border-b border-[#1e293b]/50 hover:bg-[#090d16] transition-colors">
                      <td className="p-3 font-semibold text-white">{p.partnerName}</td>
                      <td className="p-3 text-right font-mono text-[#94a3b8]">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(p.amount, activeCurrencyRate)}
                      </td>
                      <td className="p-3 text-right font-mono text-[#64748b] text-[10px]">
                        {activeCurrencyRate.currency === 'INR' ? '1:1' : `1 ${activeCurrencyRate.currency} = ₹${activeCurrencyRate.rateToInr}`}
                      </td>
                      <td className="p-3 text-right">{payoutStatusBadge(p.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-[#090d16] border-t border-[#1e293b] text-[10px] text-[#64748b] flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              <span>Exchange rates sourced from Open Exchange Rates API. Last updated: Sep 9, 2026 00:00 UTC. All settlements default to INR per RBI PA regulations.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
