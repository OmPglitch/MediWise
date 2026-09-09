import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Terminal,
  Clock,
  Key,
  Shield,
  RefreshCw,
  ExternalLink,
  Code
} from 'lucide-react';
import { AuditEvent } from '../../types';

interface ComplianceScreenProps {
  auditEvents: AuditEvent[];
  onExportAuditLedger: () => void;
  onVerifyLedgerIntegrity: () => void;
  isVerifying: boolean;
}

export const ComplianceScreen: React.FC<ComplianceScreenProps> = ({
  auditEvents,
  onExportAuditLedger,
  onVerifyLedgerIntegrity,
  isVerifying,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(auditEvents[0]?.id || '');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEvent = auditEvents.find((e) => e.id === selectedEventId) || auditEvents[0];

  const filteredEvents = auditEvents.filter((ev) => {
    const matchesSearch =
      ev.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.hash.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (severityFilter === 'all') return true;
    return ev.statusType === severityFilter;
  });

  return (
    <div className="space-y-5">
      {/* Title Ribbon & Global Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-white font-['Hanken_Grotesk'] tracking-tight">
              Compliance, Security & Regulatory Audit Ledger
            </h1>
            <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Append-Only (SHA-256)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94a3b8] mt-1 flex-wrap font-mono">
            <span className="text-emerald-400">SOC2 Type II Certified</span>
            <span className="text-[#334155]">•</span>
            <span className="text-cyan-300">HIPAA 164.312(b) Audit Controls</span>
            <span className="text-[#334155]">•</span>
            <span>21 CFR Part 320 Validation</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onVerifyLedgerIntegrity}
            disabled={isVerifying}
            className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className={`w-3.5 h-3.5 text-emerald-400 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Merkle Roots...' : 'Verify Cryptographic Chain'}</span>
          </button>

          <button
            onClick={onExportAuditLedger}
            className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Regulatory Ledger</span>
          </button>
        </div>
      </div>

      {/* 4x KPI Metric Scorecards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-cyan-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Audit Events Indexed (24h)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              482,910
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              +12.4% vs Baseline
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Ingestion Rate:</span>
            <span className="font-mono font-bold text-white">5.6 events/sec avg</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-emerald-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Regulatory Compliance Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              99.94%
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Zero Non-Conformances
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Audit Standard:</span>
            <span className="font-mono font-bold text-emerald-300">HIPAA + CDSCO Rule 65</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-purple-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Security & Tamper Anomalies
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-white font-['Hanken_Grotesk']">
              0 Flagged
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              SHA-256 Chain Intact
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Root KMS Rotation:</span>
            <span className="font-mono font-bold text-white">Executed 1h ago</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 border-t-2 border-t-amber-500 shadow-sm">
          <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
            Mandatory Disclaimer Adherence
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-emerald-400 font-['Hanken_Grotesk']">
              100.0%
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              PRD §9 FR-DISC-01 Compliant
            </span>
          </div>
          <div className="mt-3 text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 flex justify-between">
            <span>Verified Impressions:</span>
            <span className="font-mono font-bold text-white">128,450 verified</span>
          </div>
        </div>
      </section>

      {/* Main Dual Grid: Cryptographic Ledger (65%) & Event Inspector + Chain Health (35%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Column: Ledger Table */}
        <div className="xl:col-span-7 space-y-4">
          {/* Filters */}
          <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hash, actor, resource, action..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-[#0284c7] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="h-8 px-2.5 bg-[#090d16] border border-[#1e293b] text-xs text-[#cbd5e1] rounded outline-none cursor-pointer"
              >
                <option value="all">All Audit Statuses</option>
                <option value="success">Verified Pass</option>
                <option value="warning">Action Required</option>
                <option value="error">Flagged WAF</option>
              </select>
            </div>
          </div>

          {/* Audit Ledger Table */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="h-8 bg-[#090d16] border-b border-[#1e293b] font-['Hanken_Grotesk'] font-bold text-[#94a3b8] uppercase text-[10px] tracking-wider">
                    <th className="py-2 px-3">Timestamp & Hash</th>
                    <th className="py-2 px-3">Actor / Identity</th>
                    <th className="py-2 px-3">Action & Resource</th>
                    <th className="py-2 px-3">Standard</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b] text-[#cbd5e1]">
                  {filteredEvents.map((ev) => {
                    const isSelected = ev.id === selectedEvent?.id;
                    return (
                      <tr
                        key={ev.id}
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`hover:bg-[#1e293b]/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-cyan-950/30 border-l-2 border-l-cyan-400' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono">
                          <div className="text-white font-medium">{ev.timestamp.split(' ')[1]}</div>
                          <div className="text-[10px] text-cyan-400/80">{ev.hash}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-white truncate max-w-[140px]">
                            {ev.actor.split('@')[0]}
                          </div>
                          <div className="text-[10px] font-mono text-[#64748b]">{ev.actorRole}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="text-[#cbd5e1] font-medium">{ev.action}</div>
                          <div className="text-[10px] font-mono text-[#94a3b8] truncate max-w-[150px]">
                            {ev.resource}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#94a3b8]">
                          {ev.complianceCode}
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              ev.statusType === 'success'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : ev.statusType === 'warning'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                : 'bg-red-950 text-red-300 border border-red-800/40'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventId(ev.id);
                            }}
                            className="h-7 px-2 bg-[#090d16] border border-[#1e293b] hover:text-cyan-300 rounded text-[11px]"
                          >
                            Diff
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-[#090d16] border-t border-[#1e293b] flex justify-between items-center text-xs font-mono text-[#94a3b8]">
              <span>Audit Chain Height: #4,829,102 blocks</span>
              <span className="text-emerald-400">Zero chain breaks detected</span>
            </div>
          </div>
        </div>

        {/* Right Column: Event Inspector & Chain Topology (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          {/* Selected Event Inspector Card */}
          {selectedEvent && (
            <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3 shadow-sm">
              <div className="pb-2 border-b border-[#1e293b] flex justify-between items-center">
                <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
                  Audit Event Inspector
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  {selectedEvent.hash}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-[#090d16] rounded border border-[#1e293b]">
                  <span className="text-[10px] text-[#64748b] block">Actor Identity</span>
                  <span className="font-semibold text-white break-all">{selectedEvent.actor}</span>
                </div>
                <div className="p-2 bg-[#090d16] rounded border border-[#1e293b]">
                  <span className="text-[10px] text-[#64748b] block">Source IP / Node</span>
                  <span className="font-mono text-white">{selectedEvent.ip}</span>
                </div>
              </div>

              {/* JSON Patch Diff Container */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase">
                    Cryptographic Payload Diff (RFC 6902)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Validated</span>
                </div>

                <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] font-mono text-[11px] space-y-1 overflow-x-auto">
                  <div className="text-[#64748b]">// Resource: {selectedEvent.resource}</div>
                  <div className="text-[#64748b]">{'{'}</div>

                  {selectedEvent.payloadDiff ? (
                    <>
                      {selectedEvent.payloadDiff.preserved?.map((line, idx) => (
                        <div key={idx} className="text-[#94a3b8] pl-3">
                          {line},
                        </div>
                      ))}
                      {selectedEvent.payloadDiff.removed?.map((line, idx) => (
                        <div key={idx} className="text-red-400 bg-red-950/40 pl-3">
                          - {line},
                        </div>
                      ))}
                      {selectedEvent.payloadDiff.added?.map((line, idx) => (
                        <div key={idx} className="text-emerald-400 bg-emerald-950/40 pl-3">
                          + {line},
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-[#94a3b8] pl-3">
                      <div>"event_type": "{selectedEvent.action}",</div>
                      <div>"regulatory_standard": "{selectedEvent.complianceCode}",</div>
                      <div className="text-emerald-400">+ "state": "VERIFIED_AUDIT_PASS"</div>
                    </div>
                  )}

                  <div className="text-[#64748b]">{'}'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Chain Integrity & Hardware Security */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3 shadow-sm">
            <div className="pb-2 border-b border-[#1e293b]">
              <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider">
                Cryptographic Chain Integrity & HSM
              </span>
              <div className="text-sm font-bold text-white font-['Hanken_Grotesk']">
                Immutable Ledger Anchors
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#64748b] block">Current Block Height</span>
                  <span className="font-bold text-white">#4,829,102</span>
                </div>
                <span className="text-emerald-400 font-bold">5/5 Nodes Synced</span>
              </div>

              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
                <span className="text-[10px] text-[#64748b] block">Merkle Tree Root Hash</span>
                <span className="text-cyan-300 font-semibold break-all text-[11px]">
                  0xbc88f12a99d420188ea7b4200192eab
                </span>
              </div>

              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#64748b] block">Security Module Standard</span>
                  <span className="font-bold text-white">FIPS 140-2 Level 3 HSM</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
