import React, { useState } from 'react';
import {
  Pill,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  FileCheck,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { DrugItem } from '../../types';

interface DrugCatalogScreenProps {
  drugs: DrugItem[];
  selectedDrugId: string;
  setSelectedDrugId: (id: string) => void;
  onAddNewSalt: () => void;
  onAuditEquivalence: () => void;
  onExportFDA: () => void;
}

export const DrugCatalogScreen: React.FC<DrugCatalogScreenProps> = ({
  drugs,
  selectedDrugId,
  setSelectedDrugId,
  onAddNewSalt,
  onAuditEquivalence,
  onExportFDA,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSmiles, setCopiedSmiles] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const selectedDrug = drugs.find((d) => d.id === selectedDrugId) || drugs[0];

  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch =
      drug.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.activeSalt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.atcCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.casNumber.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopySmiles = () => {
    if (selectedDrug) {
      navigator.clipboard.writeText(selectedDrug.smiles);
      setCopiedSmiles(true);
      setTimeout(() => setCopiedSmiles(false), 2000);
    }
  };

  const handleRerunMatcher = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Title Ribbon & Global Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-white font-['Hanken_Grotesk'] tracking-tight">
              Drug Composition & Active Salt Mapping Engine
            </h1>
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Elasticsearch Synced
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-mono text-white">18,924 Formulations Indexed</span>
            <span className="text-[#334155]">•</span>
            <span>Live Bioequivalence Parser Active</span>
            <span className="text-[#334155]">•</span>
            <span>USP 44-NF 39 Compliant</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAuditEquivalence}
            className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit Equivalence Engine</span>
          </button>

          <button
            onClick={onAddNewSalt}
            className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Ingest Salt / Drug Formulation</span>
          </button>
        </div>
      </div>

      {/* 4x KPI Scorecards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-cyan-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Total Active Salt Compositions
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              18,924
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              +340 Mapped This Month
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Global Coverage:</span>
            <span className="font-mono font-bold text-white">99.1% of top 500 Rx</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-emerald-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Bioequivalence Mapped Generics
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              94.6%
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              FDA AB Standard Parity
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Avg Cmax Correlation:</span>
            <span className="font-mono font-bold text-emerald-300">98.8% match</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-purple-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Average Disparity / Savings
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              82.4%
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-purple-300 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
              ₹112.40 Average Saved / Rx
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Disparity Spread:</span>
            <span className="font-mono font-bold text-white">65% – 93% delta</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-amber-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Unmapped / Orphan Formulations
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-amber-300 font-['Hanken_Grotesk']">
              18
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              Pending Pharmacopeia Sign-off
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Critical Queue:</span>
            <span className="font-mono font-bold text-amber-300">0 High-Risk NTI</span>
          </div>
        </div>
      </section>

      {/* Main Dual Pane: Master Catalog Table (65%) & Selected Salt Inspector (35%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Column: Master Table (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by active salt, brand name, ATC code, CAS registry..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-[#0284c7] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-8 px-2.5 bg-[#090d16] border border-[#1e293b] text-xs text-[#cbd5e1] rounded outline-none cursor-pointer"
              >
                <option value="all">All Therapeutic Classes</option>
                <option value="Cardiology">Cardiology (Statins)</option>
                <option value="Endocrinology">Endocrinology (Diabetes)</option>
                <option value="Gastroenterology">Gastroenterology (PPIs)</option>
                <option value="Anti-infective">Anti-infective (Antibiotics)</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="h-8 px-2 bg-[#090d16] border border-[#1e293b] text-[11px] text-[#94a3b8] hover:text-white rounded"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="h-8 bg-[#090d16] border-b border-[#1e293b] font-['Hanken_Grotesk'] font-bold text-[#94a3b8] uppercase text-[10px] tracking-wider">
                    <th className="py-2 px-3">Active Salt & ATC</th>
                    <th className="py-2 px-3">Reference Brand & NDC</th>
                    <th className="py-2 px-3">Generic Substitutes</th>
                    <th className="py-2 px-3">Bioequivalence</th>
                    <th className="py-2 px-3">Disparity</th>
                    <th className="py-2 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b] text-[#cbd5e1]">
                  {filteredDrugs.map((drug) => {
                    const isSelected = drug.id === selectedDrug?.id;
                    return (
                      <tr
                        key={drug.id}
                        onClick={() => setSelectedDrugId(drug.id)}
                        className={`hover:bg-[#1e293b]/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-cyan-950/30 border-l-2 border-l-cyan-400' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{drug.activeSalt}</span>
                            <span className="text-[10px] font-mono text-cyan-300 font-normal">
                              ({drug.strength})
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-[#64748b]">
                            ATC: {drug.atcCode} • CAS {drug.casNumber}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-medium text-white">{drug.brandName}</div>
                          <div className="font-mono text-[10px] text-[#94a3b8]">
                            NDC {drug.brandNdc}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e293b] text-cyan-300">
                            {drug.genericsCount} Approved Generics
                          </span>
                          <div className="text-[10px] text-[#64748b] truncate max-w-[120px]">
                            {drug.topGenerics.slice(0, 2).map((g) => g.split(' ')[0]).join(', ')}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-mono text-[11px] font-bold text-emerald-400">
                            {drug.parityPercent}% Parity
                          </div>
                          <div className="text-[10px] text-[#64748b]">
                            {drug.dissolutionStatus.split('@')[0]}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-mono text-[11px]">
                            <span className="line-through text-[#64748b] mr-1">
                              ₹{drug.brandPrice.toFixed(2)}
                            </span>
                            <span className="font-bold text-emerald-400">
                              ₹{drug.genericPriceAvg.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">
                            -{drug.savingsPercent}%
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDrugId(drug.id);
                            }}
                            className={`h-7 px-2 text-[11px] rounded font-medium transition-colors ${
                              isSelected
                                ? 'bg-cyan-500 text-white'
                                : 'bg-[#090d16] border border-[#1e293b] hover:text-cyan-300'
                            }`}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-[#090d16] border-t border-[#1e293b] flex justify-between items-center text-xs font-mono text-[#94a3b8]">
              <span>Showing {filteredDrugs.length} of 18,924 mapped salt molecules</span>
              <span className="text-cyan-400">Page 1 of 378 • Next →</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Drug Salt Detail Inspection Drawer (5 cols on xl) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-4 shadow-sm relative">
            {/* Header Badge & Molecule Title */}
            <div className="pb-3 border-b border-[#1e293b]">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-mono text-[10px] font-semibold uppercase">
                  SELECTED SALT MOLECULE INSPECTION
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  FDA Bioequivalent (AB)
                </span>
              </div>

              <div className="mt-2">
                <h2 className="text-lg font-bold text-white font-['Hanken_Grotesk']">
                  {selectedDrug.activeSalt} ({selectedDrug.strength})
                </h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Reference Brand: <strong className="text-white">{selectedDrug.brandName}</strong> ({selectedDrug.brandManufacturer.split('•')[0]})
                </p>
              </div>
            </div>

            {/* Chemical & Bioequivalence Envelope */}
            <div className="space-y-3 bg-[#090d16] p-3.5 rounded border border-[#1e293b]">
              <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider block">
                Bioequivalence Envelope (In-Vitro & Pharmacokinetic)
              </span>

              {/* Progress Bars for Cmax & AUC */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-[#cbd5e1]">Peak Concentration (Cmax Parity)</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedDrug.cmaxParity}% (90% CI: 96.2–102.4%)</span>
                  </div>
                  <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedDrug.cmaxParity}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-[#cbd5e1]">Total Exposure (AUC 0-inf Parity)</span>
                    <span className="font-mono text-cyan-400 font-bold">{selectedDrug.aucParity}% (90% CI: 97.5–101.8%)</span>
                  </div>
                  <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${selectedDrug.aucParity}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Dissolution Status */}
              <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b] text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#64748b] uppercase font-bold block">Dissolution Profile</span>
                  <span className="font-mono text-white text-[11px]">{selectedDrug.dissolutionStatus}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  PASSED
                </span>
              </div>

              {/* Molecular Structure Info */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b]">Molecular Formula:</span>
                  <span className="font-mono text-white font-medium">{selectedDrug.molecularFormula}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b]">Molecular Weight:</span>
                  <span className="font-mono text-white">{selectedDrug.molecularWeight}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b]">Bioavailability:</span>
                  <span className="font-mono text-cyan-300">{selectedDrug.bioavailability}</span>
                </div>

                {/* SMILES string with copy button */}
                <div className="mt-2 p-2 bg-[#0b101d] rounded border border-[#1e293b]">
                  <div className="flex justify-between items-center text-[10px] text-[#64748b] mb-1">
                    <span>CANONICAL SMILES</span>
                    <button
                      onClick={handleCopySmiles}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSmiles ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSmiles ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[9px] text-[#94a3b8] break-all leading-tight max-h-12 overflow-y-auto">
                    {selectedDrug.smiles}
                  </div>
                </div>
              </div>
            </div>

            {/* Substitution Rules Matrix */}
            <div className="bg-[#090d16] p-3 rounded border border-[#1e293b] space-y-2">
              <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider block">
                Generic Substitution Rules Matrix
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                  <span className="text-[10px] text-[#64748b] block">Automatic Substitution</span>
                  <span className="font-semibold text-emerald-400">ALLOWED (FDA / CDSCO)</span>
                </div>
                <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                  <span className="text-[10px] text-[#64748b] block">Narrow Therapeutic Index</span>
                  <span className="font-semibold text-[#cbd5e1]">NO (Standard Safety)</span>
                </div>
                <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                  <span className="text-[10px] text-[#64748b] block">Physician Waiver Required</span>
                  <span className="font-semibold text-[#cbd5e1]">NO (Standard Dispense)</span>
                </div>
                <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                  <span className="text-[10px] text-[#64748b] block">PRD §9 Disclaimer Attached</span>
                  <span className="font-semibold text-cyan-300">YES (FR-DISC-01)</span>
                </div>
              </div>
            </div>

            {/* Live Partner Pharmacy Prices for this Salt */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white font-['Hanken_Grotesk']">
                  Partner Pharmacy Live Quotes (Generic Equivalent)
                </span>
                <span className="text-[10px] font-mono text-[#64748b]">Updated 2m ago</span>
              </div>

              <div className="space-y-1.5">
                {selectedDrug.partnerOffers.map((offer) => (
                  <div
                    key={offer.partnerName}
                    className="p-2 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-medium text-white">{offer.partnerName}</span>
                      <span className="text-[10px] font-mono text-[#64748b] ml-2">
                        Delivery: {offer.delivery}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">₹{offer.price.toFixed(2)}</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800/40">
                        {offer.savingsRate}% OFF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Attestation Block */}
            <div className="p-2.5 bg-[#090d16] border border-[#1e293b] rounded flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-[#64748b] block">Clinical Lead Sign-Off</span>
                <span className="font-semibold text-white">{selectedDrug.clinicalSignOff.doctor}</span>
                <span className="text-[10px] font-mono text-cyan-400/80 block">
                  Hash: {selectedDrug.clinicalSignOff.hash}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748b] block">Approval Date</span>
                <span className="font-mono text-[#cbd5e1]">{selectedDrug.clinicalSignOff.date}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#1e293b]">
              <button
                onClick={handleRerunMatcher}
                disabled={isMatching}
                className="flex-1 h-8 bg-[#090d16] border border-[#1e293b] hover:bg-[#1e293b] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isMatching ? 'animate-spin' : ''}`} />
                <span>{isMatching ? 'Re-evaluating...' : 'Re-run Algorithmic Matcher'}</span>
              </button>

              <button
                onClick={onExportFDA}
                className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Export FDA 356h</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
