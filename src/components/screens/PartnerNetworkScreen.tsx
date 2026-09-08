import React, { useState } from 'react';
import {
  Store,
  DollarSign,
  TrendingUp,
  Clock,
  RefreshCw,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { PartnerPharmacy, EventBusMessage } from '../../types';

interface PartnerNetworkScreenProps {
  partners: PartnerPharmacy[];
  eventLogs: EventBusMessage[];
  onSyncAllFeeds: () => void;
  isSyncing: boolean;
  onAddPartner: () => void;
  onExportPartnerReport: () => void;
  onAuditPartnerPayout: (partnerId: string) => void;
}

export const PartnerNetworkScreen: React.FC<PartnerNetworkScreenProps> = ({
  partners,
  eventLogs,
  onSyncAllFeeds,
  isSyncing,
  onAddPartner,
  onExportPartnerReport,
  onAuditPartnerPayout,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'national' | 'regional' | 'local' | 'warning'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'warning') return p.hasWarning;
    return p.category === filterTab;
  });

  return (
    <div className="space-y-5">
      {/* Title Ribbon & Global Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-white font-['Hanken_Grotesk'] tracking-tight">
              Partner Pharmacy Network & CPA Commission Manager
            </h1>
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Multi-Tenant Gateway
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-mono text-white">142 Connected Chains</span>
            <span className="text-[#334155]">•</span>
            <span>CDSCO / NABP Verified Dispensary Routing</span>
            <span className="text-[#334155]">•</span>
            <span>Zero PHI Leaks Invariant Enforced</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSyncAllFeeds}
            disabled={isSyncing}
            className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing All Feeds...' : 'Sync All Feeds'}</span>
          </button>

          <button
            onClick={onAddPartner}
            className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Pharmacy Partner</span>
          </button>
        </div>
      </div>

      {/* 4x KPI Metric Scorecards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-cyan-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Active Pharmacy Partners
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              142 Chains
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              +12 Added This Month
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Dispensaries Mapped:</span>
            <span className="font-mono font-bold text-white">1,840 dispensaries (98.6% live)</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-emerald-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Monthly Referral Volume
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              384,920 Clicks
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              +18.4% MoM (15.2% CTR)
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Leading Volume:</span>
            <span className="font-mono font-bold text-emerald-300">Apollo + 1mg (62.4%)</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-purple-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Total Net CPA Commission
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              $42,180.50
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-purple-300 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
              +9.1% MoM ($38,400 disbursed)
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Escrow Retention Hold:</span>
            <span className="font-mono font-bold text-cyan-300">$3,780.50 (7-day window)</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-amber-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Inventory Sync Latency
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              480ms
            </span>
            <span className="text-xs font-mono text-[#64748b]">P95</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              RabbitMQ Event Stream
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Live Catalog Feeds:</span>
            <span className="font-mono font-bold text-emerald-400">4.2M SKUs Live (0 stale)</span>
          </div>
        </div>
      </section>

      {/* Middle Two-Column Grid: CPA Commission Tiering & Referral Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Module 1: CPA Commission Tiering & Payout Rules */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3 shadow-sm">
          <div className="pb-2 border-b border-[#1e293b]">
            <h2 className="text-sm md:text-base font-bold text-white font-['Hanken_Grotesk']">
              CPA Commission Tiering & Payout Rules
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Automated smart contract attribution rates based on validated prescription order fulfillment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#090d16] rounded border border-cyan-900/40">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/50">
                  TIER 1 (8.5% CPA)
                </span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5">National Giants</div>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                Apollo, Netmeds, Tata 1mg. Webhook REST sync required.
              </p>
            </div>

            <div className="p-3 bg-[#090d16] rounded border border-[#1e293b]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/80 px-1.5 py-0.2 rounded border border-purple-800/50">
                  TIER 2 (7.0% CPA)
                </span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5">Regional Franchises</div>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                MedPlus, Wellness Forever, Frank Ross. Daily SFTP/EDI feeds.
              </p>
            </div>

            <div className="p-3 bg-[#090d16] rounded border border-[#1e293b]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-[#94a3b8] bg-[#1e293b] px-1.5 py-0.2 rounded border border-[#334155]">
                  TIER 3 ($0.25 FIXED)
                </span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5">Local Chemists</div>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                Independent retail pharmacies. Fixed fee per fulfilled intent.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center text-xs">
            <span className="text-[#94a3b8]">Dispute Settlement Window:</span>
            <span className="font-mono text-cyan-300 font-semibold">
              7-Day Retention Hold before automatic Stripe transfer
            </span>
          </div>
        </div>

        {/* Module 2: Referral Funnel & Conversion Attribution */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3 shadow-sm">
          <div className="pb-2 border-b border-[#1e293b]">
            <h2 className="text-sm md:text-base font-bold text-white font-['Hanken_Grotesk']">
              Referral Funnel & Conversion Attribution
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Aggregate pipeline efficiency from patient search intent to verified partner dispensary checkout
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Stage 1 */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#cbd5e1]">1. MediWise Outbound Intent Clicks</span>
                <span className="font-mono text-white font-bold">384,920 (100%)</span>
              </div>
              <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0284c7] h-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Stage 2 */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#cbd5e1]">2. Partner Cart Lands & Stock Check</span>
                <span className="font-mono text-cyan-300 font-bold">165,515 (43.0%)</span>
              </div>
              <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: '43%' }}></div>
              </div>
            </div>

            {/* Stage 3 */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-[#cbd5e1]">3. Verified Generic Order Fulfillment</span>
                <span className="font-mono text-emerald-400 font-bold">70,825 (18.4% Net CVR)</span>
              </div>
              <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '18.4%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e293b] grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#64748b] block">Apollo 24/7</span>
              <span className="font-mono text-white font-bold">19.2% CVR</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Tata 1mg</span>
              <span className="font-mono text-white font-bold">18.8% CVR</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Netmeds</span>
              <span className="font-mono text-white font-bold">17.1% CVR</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">MedPlus</span>
              <span className="font-mono text-white font-bold">16.4% CVR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Partner Directory Table */}
      <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#090d16] p-1 rounded border border-[#1e293b] text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterTab === 'all' ? 'bg-[#1e293b] text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              All Partners (142)
            </button>
            <button
              onClick={() => setFilterTab('national')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterTab === 'national' ? 'bg-[#1e293b] text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              National Chains (4)
            </button>
            <button
              onClick={() => setFilterTab('regional')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterTab === 'regional' ? 'bg-[#1e293b] text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Regional Franchises (28)
            </button>
            <button
              onClick={() => setFilterTab('local')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterTab === 'local' ? 'bg-[#1e293b] text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Local Chemists (110)
            </button>
            <button
              onClick={() => setFilterTab('warning')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterTab === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800/40 font-semibold' : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              Sync Alerts (1)
            </button>
          </div>

          {/* Search Toolbar */}
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner or code..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-[#0284c7] outline-none"
              />
            </div>

            <button
              onClick={onExportPartnerReport}
              className="h-8 px-2.5 bg-[#090d16] border border-[#1e293b] hover:bg-[#1e293b] text-[#cbd5e1] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto border border-[#1e293b] rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="h-8 bg-[#090d16] border-b border-[#1e293b] font-['Hanken_Grotesk'] font-bold text-[#94a3b8] uppercase text-[10px] tracking-wider">
                <th className="py-2 px-3">Partner Entity & Integration</th>
                <th className="py-2 px-3">Stock Feed Health</th>
                <th className="py-2 px-3">Referral Clicks & Share</th>
                <th className="py-2 px-3">Order CVR & GMV</th>
                <th className="py-2 px-3">CPA Tier & Accrual</th>
                <th className="py-2 px-3">Compliance</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-[#cbd5e1]">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-[#1e293b]/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{partner.name}</span>
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                        {partner.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748b] font-mono mt-0.5">
                      {partner.outlets} • {partner.protocol}
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    {partner.hasWarning ? (
                      <div className="flex items-center gap-1 text-amber-300 font-semibold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{partner.syncInfo}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{partner.syncInfo}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-2.5 px-3 font-mono">
                    <div className="font-bold text-white">{partner.referralClicks.toLocaleString()}</div>
                    <div className="text-[10px] text-[#64748b]">{partner.totalSharePercent}% network share</div>
                  </td>

                  <td className="py-2.5 px-3 font-mono">
                    <div className="text-cyan-300 font-bold">{partner.cvrPercent}% CVR</div>
                    <div className="text-[10px] text-[#94a3b8]">${partner.gmvAmount.toLocaleString()} GMV</div>
                  </td>

                  <td className="py-2.5 px-3 font-mono">
                    <div className="font-bold text-emerald-400">${partner.cpaAccrued.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="text-[10px] text-cyan-400/90">{partner.cpaTier}</div>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-800/50 text-emerald-300">
                      {partner.complianceBadge}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onAuditPartnerPayout(partner.id)}
                      className="h-7 px-2.5 bg-[#090d16] border border-[#1e293b] hover:border-cyan-500 hover:text-cyan-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Audit Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex justify-between items-center text-xs font-mono text-[#94a3b8] pt-1">
          <span>Displaying {filteredPartners.length} of 142 integrated partner organizations</span>
          <span className="text-cyan-400">Total CPA Pool Accrued: $42,180.50</span>
        </div>
      </div>
    </div>
  );
};
