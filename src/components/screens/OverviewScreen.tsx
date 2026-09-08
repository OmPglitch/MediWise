import React, { useState } from 'react';
import {
  DollarSign,
  ArrowRightLeft,
  Gauge,
  Store,
  Calendar,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Server,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { DrugItem, EventBusMessage } from '../../types';

interface OverviewScreenProps {
  drugs: DrugItem[];
  onInspectDrug: (drugId: string) => void;
  eventLogs: EventBusMessage[];
  onSyncFeeds: () => void;
  isSyncing: boolean;
  onExportReport: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  drugs,
  onInspectDrug,
  eventLogs,
  onSyncFeeds,
  isSyncing,
  onExportReport,
}) => {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // 14 days synthetic conversion data (from mockup)
  const barData = [
    { day: '05', height: 48, count: 2310 },
    { day: '06', height: 56, count: 2690 },
    { day: '07', height: 62, count: 2980 },
    { day: '08', height: 40, count: 1920 },
    { day: '09', height: 70, count: 3370 },
    { day: '10', height: 82, count: 3950 },
    { day: '11', height: 78, count: 3760 },
    { day: '12', height: 65, count: 3130 },
    { day: '13', height: 90, count: 4330 },
    { day: '14', height: 74, count: 3560 },
    { day: '15', height: 88, count: 4240 },
    { day: '16', height: 95, count: 4570 },
    { day: '17', height: 86, count: 4140 },
    { day: '18', height: 98, count: 4820, isToday: true },
  ];

  return (
    <div className="space-y-5">
      {/* Title Ribbon & Global Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-white font-['Hanken_Grotesk'] tracking-tight">
              Platform Operations & Referral Command Center
            </h1>
            <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time Sync
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#64748b]" />
              Telemetric Snapshot: <span className="font-mono text-cyan-300">2025-05-18T14:42:08.192Z</span>
            </span>
            <span className="text-[#334155]">•</span>
            <span>Active Nodes: 24/24 Online</span>
            <span className="text-[#334155]">•</span>
            <span>Tenant Group: Master Production Orchestrator</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Selector */}
          <div className="flex items-center bg-[#0d1424] border border-[#1e293b] rounded h-8 px-2.5 text-xs text-[#cbd5e1] gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="font-medium text-white">{dateRange}</span>
            <span className="text-[10px] font-mono text-[#64748b]">(Oct 18 - Nov 17)</span>
          </div>

          <button
            onClick={onSyncFeeds}
            disabled={isSyncing}
            className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Pharmacy Stock Feeds'}</span>
          </button>

          <button
            onClick={onExportReport}
            className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Compliance Report</span>
          </button>
        </div>
      </div>

      {/* 4x KPI Metric Scorecards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Referral GMV & Revenue */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-[#0284c7] relative overflow-hidden shadow-sm hover:border-[#334155] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
              Total Referral GMV & Revenue
            </span>
            <div className="w-7 h-7 rounded bg-cyan-950/60 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              $482,910
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
              +$38,420 (18.4% MoM)
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] flex items-center justify-between border-t border-[#1e293b] pt-2">
            <span>Net CPA Affiliate Fee:</span>
            <span className="font-mono font-bold text-cyan-300">$42,180 earned</span>
          </div>
        </div>

        {/* Card 2: Generic Substitutions Driven */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-emerald-500 relative overflow-hidden shadow-sm hover:border-[#334155] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
              Generic Substitutions Driven
            </span>
            <div className="w-7 h-7 rounded bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              128,450 Rx
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
              84.2% Avg Patient Savings
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] flex items-center justify-between border-t border-[#1e293b] pt-2">
            <span>Total Patient Savings:</span>
            <span className="font-mono font-bold text-emerald-300">$1.42M aggregate</span>
          </div>
        </div>

        {/* Card 3: Search Latency & SLA */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-cyan-500 relative overflow-hidden shadow-sm hover:border-[#334155] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
              Search Latency & Uptime SLA
            </span>
            <div className="w-7 h-7 rounded bg-cyan-950/60 text-cyan-400 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              186ms
            </span>
            <span className="text-xs font-mono text-[#64748b]">P95</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              99.98% Available
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] flex items-center justify-between border-t border-[#1e293b] pt-2">
            <span>Redis Layer Cache Hit:</span>
            <span className="font-mono font-bold text-white">94.2% hit rate</span>
          </div>
        </div>

        {/* Card 4: Active Partner Pharmacies */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-purple-500 relative overflow-hidden shadow-sm hover:border-[#334155] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
              Active Partner Pharmacies
            </span>
            <div className="w-7 h-7 rounded bg-purple-950/60 text-purple-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              142 Stores
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-[#94a3b8] truncate">
              Apollo • Netmeds • 1mg • Wellness
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] flex items-center justify-between border-t border-[#1e293b] pt-2">
            <span>Stock Feed Sync:</span>
            <span className="font-mono font-bold text-emerald-400">98.6% synchronized</span>
          </div>
        </div>
      </section>

      {/* Middle Two-Column Section */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-5">
        {/* Left Column (70%) */}
        <div className="xl:col-span-7 space-y-5">
          {/* Outbound Pharmacy Referral & Commission Flow Card */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-[#1e293b]">
              <div>
                <h2 className="text-sm md:text-base font-bold text-white font-['Hanken_Grotesk']">
                  Outbound Pharmacy Referral & Commission Flow
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Real-time prescription substitution routing and CPA fulfillment by network provider
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-[#94a3b8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#0284c7] rounded-xs"></span>
                  <span>Referrals Driven</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span>
                  <span>Converted Orders</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs"></span>
                  <span>Avg Ticket ($)</span>
                </span>
              </div>
            </div>

            {/* Synthetic High-Density Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Daily Conversion Trend Histogram */}
              <div className="lg:col-span-2 bg-[#090d16] border border-[#1e293b] p-3.5 rounded flex flex-col justify-between h-56 relative">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase">
                    Daily Conversion Trajectory (Past 14 Days)
                  </span>
                  <span className="font-mono text-[11px] text-white font-semibold">
                    Peak: <span className="text-cyan-400">4,820 Rx/day</span>
                  </span>
                </div>

                {/* Interactive Bar Chart Visualization */}
                <div className="flex items-end justify-between gap-1.5 h-36 pt-4 px-1 border-b border-[#1e293b] relative">
                  {barData.map((bar, i) => (
                    <div
                      key={bar.day}
                      onMouseEnter={() => setHoveredBarIndex(i)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative"
                    >
                      {/* Tooltip */}
                      {hoveredBarIndex === i && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-cyan-500/50 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap">
                          May {bar.day}: {bar.count.toLocaleString()} Rx
                        </div>
                      )}
                      <div
                        className={`w-full rounded-t transition-all duration-200 ${
                          bar.isToday
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-gradient-to-t from-[#0369a1] to-[#0284c7] group-hover:from-cyan-600 group-hover:to-cyan-400'
                        }`}
                        style={{ height: `${bar.height}%` }}
                      ></div>
                      <span
                        className={`font-mono text-[9px] ${
                          bar.isToday ? 'text-emerald-400 font-bold' : 'text-[#64748b]'
                        }`}
                      >
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center font-mono text-[10px] text-[#94a3b8] pt-1">
                  <span>Weighted 7-Day Moving Avg: 4,310 Rx/day</span>
                  <span className="text-emerald-400 font-semibold">+14.2% vs Previous Cycle</span>
                </div>
              </div>

              {/* Top Converting Therapy Categories */}
              <div className="bg-[#090d16] border border-[#1e293b] p-3.5 rounded flex flex-col justify-between h-56">
                <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase">
                  Top Converting Therapeutic Areas
                </span>
                <div className="space-y-2.5 my-1 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#cbd5e1]">Cardiovascular (Statins / ACE)</span>
                      <span className="font-mono text-[#94a3b8]">38.4% ($185k)</span>
                    </div>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0284c7] h-full" style={{ width: '38.4%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#cbd5e1]">Anti-diabetic (DPP-4 / Metformin)</span>
                      <span className="font-mono text-[#94a3b8]">29.1% ($140k)</span>
                    </div>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '29.1%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#cbd5e1]">Gastrointestinal (PPIs)</span>
                      <span className="font-mono text-[#94a3b8]">18.6% ($89k)</span>
                    </div>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full" style={{ width: '18.6%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#cbd5e1]">Antibiotics & Respiratory</span>
                      <span className="font-mono text-[#94a3b8]">13.9% ($67k)</span>
                    </div>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full" style={{ width: '13.9%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-[#1e293b] flex justify-between items-center font-mono text-[10px]">
                  <span className="text-[#64748b]">Top Partner: Apollo (44%)</span>
                  <span className="text-cyan-300 font-semibold">1mg (28%) • Netmeds (21%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Critical Composition Mappings & Validations Table */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-sm md:text-base font-bold text-white font-['Hanken_Grotesk']">
                  Recent Critical Composition Mappings & Validations
                </h2>
                <p className="text-xs text-[#94a3b8]">
                  Verified bioequivalence, CDSCO / FDA regulatory clearance, and active retail price disparity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#94a3b8]">
                  Filtering: <strong className="text-cyan-300">Active Formulations</strong>
                </span>
              </div>
            </div>

            {/* Structured Table Container */}
            <div className="overflow-x-auto border border-[#1e293b] rounded">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="h-8 bg-[#090d16] border-b border-[#1e293b] font-['Hanken_Grotesk'] font-bold text-[#94a3b8] tracking-wider uppercase text-[10px]">
                    <th className="py-2 px-3">Branded Reference Rx</th>
                    <th className="py-2 px-3">Active Generic Salt & Dose</th>
                    <th className="py-2 px-3">Price Comparison</th>
                    <th className="py-2 px-3">Patient Savings</th>
                    <th className="py-2 px-3">Regulatory Validation</th>
                    <th className="py-2 px-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b] text-[#cbd5e1]">
                  {drugs.slice(0, 4).map((drug) => (
                    <tr
                      key={drug.id}
                      className="hover:bg-[#1e293b]/40 transition-colors group cursor-pointer"
                      onClick={() => onInspectDrug(drug.id)}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white">{drug.brandName}</div>
                        <div className="font-mono text-[10px] text-[#64748b]">
                          {drug.brandManufacturer.split('•')[0]} • NDC {drug.brandNdc}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-cyan-400 font-medium">{drug.activeSalt}</div>
                        <div className="font-mono text-[10px] text-[#94a3b8]">
                          In-Stock: {drug.topGenerics.slice(0, 3).map((g) => g.split(' ')[0]).join(', ')}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-mono text-[11px]">
                          <span className="line-through text-[#64748b] mr-1">${drug.brandPrice.toFixed(2)}</span>
                          <span className="font-bold text-white">${drug.genericPriceAvg.toFixed(2)}</span>
                        </div>
                        <div className="font-mono text-[10px] text-[#64748b]">30 Day Supply</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 border border-emerald-800/50 text-emerald-300">
                          {drug.savingsPercent}% Savings (-${drug.savingsAmount.toFixed(2)})
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>FDA / CDSCO Approved</span>
                        </div>
                        <div className="font-mono text-[10px] text-[#64748b]">
                          Bioequivalence: {drug.parityPercent}% Parity
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectDrug(drug.id);
                          }}
                          className="h-7 px-2.5 bg-[#090d16] border border-[#1e293b] rounded hover:border-cyan-500 hover:text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Inspect Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Stats */}
            <div className="flex justify-between items-center text-xs font-mono text-[#94a3b8] pt-1">
              <span>Displaying 4 of 18,924 mapped pharmaceutical formulations</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onInspectDrug('drug-atorvastatin')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Open Full Drug Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="xl:col-span-3 space-y-5">
          {/* Live Event Bus Telemetry Card */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 flex flex-col justify-between h-[460px] shadow-sm">
            <div className="pb-2.5 border-b border-[#1e293b]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
                  HIPAA / 21 CFR AUDIT STREAM
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE WEBSOCKET
                </span>
              </div>
              <div className="text-sm font-bold text-white font-['Hanken_Grotesk'] mt-0.5">
                Event Bus Telemetry
              </div>
            </div>

            {/* Real-time Event Feed Stream */}
            <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2 font-mono text-xs">
              {eventLogs.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded bg-[#090d16] border border-[#1e293b] text-left space-y-1 hover:border-[#334155] transition-colors"
                >
                  <div className="flex justify-between text-[10px] text-[#64748b]">
                    <span className="text-cyan-400 font-bold">{ev.source}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                  <p className="text-white text-[11px] font-semibold leading-tight">{ev.title}</p>
                  <p className="text-[#94a3b8] text-[10px] leading-tight">{ev.description}</p>
                  <div className="flex items-center justify-between text-[9px] pt-1 text-[#64748b]">
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold ${
                        ev.badgeType === 'emerald'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : ev.badgeType === 'secondary'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                          : ev.badgeType === 'amber'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : 'bg-[#1e293b] text-[#94a3b8]'
                      }`}
                    >
                      {ev.badge}
                    </span>
                    <span>{ev.meta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Stream Action */}
            <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#64748b]">Stream: 480 events/sec</span>
              <span className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer">
                Full Regulatory Audit Ledger →
              </span>
            </div>
          </div>

          {/* Architecture Topology & Health Nodes */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 flex flex-col gap-3 shadow-sm">
            <div className="pb-2 border-b border-[#1e293b]">
              <span className="text-[10px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
                ARCHITECTURE TOPOLOGY & HEALTH
              </span>
              <div className="text-sm font-bold text-white font-['Hanken_Grotesk']">
                Core Infrastructure Nodes
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {/* Node 1 */}
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div>
                    <div className="font-bold text-white text-[11px]">Kubernetes EKS Cluster</div>
                    <div className="text-[10px] text-[#64748b]">24 Pods Healthy • 0 Restarts</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-bold text-[10px]">
                  100% OPERATIONAL
                </span>
              </div>

              {/* Node 2 */}
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div>
                    <div className="font-bold text-white text-[11px]">RabbitMQ Event Bus</div>
                    <div className="text-[10px] text-[#64748b]">14.8k msg/sec • 0 Lag</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#cbd5e1] font-semibold">0.4ms latency</span>
              </div>

              {/* Node 3 */}
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div>
                    <div className="font-bold text-white text-[11px]">Elasticsearch NDC Index</div>
                    <div className="text-[10px] text-[#64748b]">Shards: 5 Primary, 2 Replica</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#cbd5e1] font-semibold">32ms lookup</span>
              </div>

              {/* Node 4 */}
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div>
                    <div className="font-bold text-white text-[11px]">Redis Cache Cluster</div>
                    <div className="text-[10px] text-[#64748b]">Memory: 14.2 GB / 32 GB (44%)</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold">94.2% hit</span>
              </div>

              {/* Node 5 */}
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <div>
                    <div className="font-bold text-white text-[11px]">Cloudflare WAF / Shield</div>
                    <div className="text-[10px] text-[#64748b]">14 Bot attacks mitigated today</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-bold text-[10px]">
                  ACTIVE SHIELD
                </span>
              </div>
            </div>

            {/* Heartbeat Footer */}
            <div className="pt-2 border-t border-[#1e293b] flex justify-between items-center text-[10px] font-mono text-[#64748b]">
              <span>Telemetry Ping: 22ms</span>
              <span>Cluster TLS: v1.3 AES-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
