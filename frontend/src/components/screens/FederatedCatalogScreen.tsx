import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  FlaskConical,
  BarChart3,
  Download,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { RegulatoryJurisdiction } from '../../types';
import { MOCK_FEDERATED_DRUGS, FederatedDrugEntry } from '../../data/mockPhase5Data';

type CategoryFilter = 'all' | 'Cardiology' | 'Endocrinology' | 'Gastroenterology' | 'Anti-infective' | 'Respiratory';

const JURISDICTION_META: Record<RegulatoryJurisdiction, { label: string; flag: string; color: string }> = {
  IN_CDSCO: { label: 'CDSCO (India)', flag: '🇮🇳', color: 'bg-orange-950 text-orange-300 border-orange-800' },
  US_FDA: { label: 'FDA (USA)', flag: '🇺🇸', color: 'bg-blue-950 text-blue-300 border-blue-800' },
  EU_EMA: { label: 'EMA (EU)', flag: '🇪🇺', color: 'bg-violet-950 text-violet-300 border-violet-800' },
};

const STATUS_META = {
  approved: { label: 'Approved', icon: CheckCircle2, cls: 'text-emerald-400' },
  under_evaluation: { label: 'Under Evaluation', icon: Clock, cls: 'text-amber-400' },
  clinical_trial: { label: 'Clinical Trial', icon: FlaskConical, cls: 'text-cyan-400' },
  not_registered: { label: 'Not Registered', icon: XCircle, cls: 'text-rose-400' },
};

export const FederatedCatalogScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<RegulatoryJurisdiction | 'all'>('all');
  const [selectedDrugId, setSelectedDrugId] = useState<string>(MOCK_FEDERATED_DRUGS[0].id);

  const filtered = MOCK_FEDERATED_DRUGS.filter((d) => {
    const matchSearch =
      d.internationalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.activeSalt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.atcCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'all' || d.therapeuticCategory === categoryFilter;
    const matchJurisdiction =
      jurisdictionFilter === 'all' ||
      d.approvals.some((a) => a.jurisdiction === jurisdictionFilter && a.status === 'approved');
    return matchSearch && matchCategory && matchJurisdiction;
  });

  const selected = MOCK_FEDERATED_DRUGS.find((d) => d.id === selectedDrugId) ?? MOCK_FEDERATED_DRUGS[0];

  const approvalCount = (drug: FederatedDrugEntry) =>
    drug.approvals.filter((a) => a.status === 'approved').length;

  const parityColor = (score: number) =>
    score >= 99 ? 'text-emerald-400' : score >= 97 ? 'text-cyan-400' : 'text-amber-400';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-2">
              Multi-Region Federated Drug Catalog
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                Phase 5 · Sprint 5.1
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              Unified formulary spanning CDSCO (India), FDA Orange Book (USA), and EMA (EU) generic registrations
            </p>
          </div>
        </div>
        <button className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-[#cbd5e1] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Federated Report
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Federated SKUs', value: MOCK_FEDERATED_DRUGS.length, unit: 'drugs', color: 'text-white' },
          { label: 'Tri-Jurisdiction', value: MOCK_FEDERATED_DRUGS.filter(d => approvalCount(d) === 3).length, unit: 'fully approved', color: 'text-emerald-400' },
          { label: 'Total BE Studies', value: MOCK_FEDERATED_DRUGS.reduce((s, d) => s + d.bioequivalenceStudies, 0), unit: 'cross-region', color: 'text-cyan-400' },
          { label: 'Avg Parity Score', value: (MOCK_FEDERATED_DRUGS.reduce((s, d) => s + d.crossRegionParityScore, 0) / MOCK_FEDERATED_DRUGS.length).toFixed(1) + '%', unit: 'harmonized', color: 'text-blue-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-3">
            <div className={`text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-[#64748b] font-mono">{kpi.unit}</div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search INN, salt, ATC code…"
            className="h-8 pl-8 pr-3 w-52 text-xs bg-[#0d1424] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-[#090d16] border border-[#1e293b] rounded text-xs">
          {(['all', 'Cardiology', 'Endocrinology', 'Gastroenterology', 'Anti-infective', 'Respiratory'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-1 rounded transition-all cursor-pointer capitalize ${
                categoryFilter === cat ? 'bg-blue-700 text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-[#090d16] border border-[#1e293b] rounded text-xs">
          {(['all', 'IN_CDSCO', 'US_FDA', 'EU_EMA'] as const).map((j) => (
            <button
              key={j}
              onClick={() => setJurisdictionFilter(j)}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                jurisdictionFilter === j ? 'bg-blue-700 text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {j === 'all' ? 'All Regions' : j === 'IN_CDSCO' ? '🇮🇳 CDSCO' : j === 'US_FDA' ? '🇺🇸 FDA' : '🇪🇺 EMA'}
            </button>
          ))}
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Left: Drug List */}
        <div className="xl:col-span-2 space-y-1.5">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-[#64748b] text-xs">No drugs match the selected filters.</div>
          )}
          {filtered.map((drug) => (
            <button
              key={drug.id}
              onClick={() => setSelectedDrugId(drug.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedDrugId === drug.id
                  ? 'bg-blue-950/30 border-blue-700/60'
                  : 'bg-[#0d1424] border-[#1e293b] hover:border-blue-800/40'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="text-xs font-bold text-white">{drug.internationalName}</div>
                  <div className="text-[11px] text-[#94a3b8] mt-0.5">{drug.activeSalt}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-mono font-bold ${parityColor(drug.crossRegionParityScore)}`}>
                    {drug.crossRegionParityScore}%
                  </span>
                  <div className="flex items-center gap-1">
                    {drug.approvals.map((a) => {
                      const meta = JURISDICTION_META[a.jurisdiction];
                      return (
                        <span key={a.jurisdiction} title={`${meta.label}: ${a.status}`} className="text-[11px]">
                          {a.status === 'approved' ? meta.flag : '○'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] border border-[#334155] font-mono">{drug.atcCode}</span>
                <span className="text-[#64748b]">{drug.therapeuticCategory}</span>
                <span className="text-[#64748b]">{drug.bioequivalenceStudies} BE studies</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Drug Detail */}
        <div className="xl:col-span-3 bg-[#0d1424] border border-[#1e293b] rounded-lg overflow-hidden">
          <div className="p-4 bg-[#090d16] border-b border-[#1e293b]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white font-['Hanken_Grotesk']">{selected.internationalName}</h3>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{selected.activeSalt} · {selected.atcCode} · {selected.molecularFormula}</p>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-2xl font-extrabold font-mono ${parityColor(selected.crossRegionParityScore)}`}>
                  {selected.crossRegionParityScore}%
                </div>
                <div className="text-[10px] text-[#64748b]">Harmonized parity</div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
            {/* Jurisdiction Approval Cards */}
            <div>
              <h4 className="text-[10px] text-[#64748b] uppercase font-bold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Regulatory Approvals by Jurisdiction
              </h4>
              <div className="space-y-2">
                {selected.approvals.map((approval) => {
                  const jMeta = JURISDICTION_META[approval.jurisdiction];
                  const sMeta = STATUS_META[approval.status];
                  const StatusIcon = sMeta.icon;
                  return (
                    <div key={approval.jurisdiction} className="p-3 bg-[#090d16] rounded-lg border border-[#1e293b] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{jMeta.flag}</span>
                          <div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border font-mono ${jMeta.color}`}>
                              {approval.badgeLabel}
                            </span>
                            <span className="text-[10px] text-[#64748b] ml-2">{jMeta.label}</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] font-semibold ${sMeta.cls}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {sMeta.label}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div>
                          <span className="text-[#64748b] block">Application No.</span>
                          <span className="font-mono text-white font-semibold">{approval.applicationNumber}</span>
                        </div>
                        <div>
                          <span className="text-[#64748b] block">Registered Moiety</span>
                          <span className="text-[#cbd5e1]">{approval.registeredMoiety}</span>
                        </div>
                        <div>
                          <span className="text-[#64748b] block">Valid Through</span>
                          <span className="text-[#cbd5e1]">{approval.validThrough}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Harmonized Pricing */}
            <div>
              <h4 className="text-[10px] text-[#64748b] uppercase font-bold mb-2 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Cross-Region Price Harmonization
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '🇮🇳 India (INR)', value: `₹${selected.harmonizedPrice.inrAvg.toFixed(2)}`, sub: 'per tablet' },
                  { label: '🇺🇸 USA (USD)', value: `$${selected.harmonizedPrice.usdAvg.toFixed(2)}`, sub: 'per tablet' },
                  { label: '🇪🇺 EU (EUR)', value: `€${selected.harmonizedPrice.eurAvg.toFixed(2)}`, sub: 'per tablet' },
                ].map((p) => (
                  <div key={p.label} className="p-3 bg-[#090d16] rounded border border-[#1e293b] text-center">
                    <div className="text-[10px] text-[#64748b] mb-1">{p.label}</div>
                    <div className="text-sm font-extrabold font-mono text-emerald-400">{p.value}</div>
                    <div className="text-[10px] text-[#64748b]">{p.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BE Studies */}
            <div className="p-3 bg-[#090d16] rounded border border-blue-900/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-300">
                  <FlaskConical className="w-4 h-4" />
                  <span className="font-semibold">Cross-Region Bioequivalence Studies</span>
                </div>
                <span className="text-2xl font-extrabold font-mono text-blue-400">{selected.bioequivalenceStudies}</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1.5">
                Dissolution, Cmax, and AUC studies aggregated from CDSCO BE guidelines, FDA 21 CFR §320, and EMA BE guideline CPMP/EWP/QWP/1401/98.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
