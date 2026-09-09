import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronRight,
  FileCode,
  ShieldCheck,
  Zap,
  Database,
  Link,
  XCircle,
  Info,
  Send,
} from 'lucide-react';
import { FHIRMedicationRequest, AuditEvent } from '../../types';
import {
  MOCK_FHIR_REQUESTS,
  MOCK_EHR_ENDPOINTS,
} from '../../data/mockPhase3Data';

interface FHIRIngestionScreenProps {
  onAddAuditEvent: (event: AuditEvent) => void;
  onNavigateToCatalog: (drugId: string) => void;
}

type FilterStatus = 'all' | 'validated' | 'pending' | 'rejected';

export const FHIRIngestionScreen: React.FC<FHIRIngestionScreenProps> = ({
  onAddAuditEvent,
  onNavigateToCatalog,
}) => {
  const [requests, setRequests] = useState<FHIRMedicationRequest[]>(MOCK_FHIR_REQUESTS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_FHIR_REQUESTS[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isIngestingDemo, setIsIngestingDemo] = useState(false);

  const selected = requests.find((r) => r.id === selectedId) || requests[0];

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.medicationCodeableConcept.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.display.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requester.display.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (filterStatus === 'all') return true;
    return r.complianceStatus === filterStatus;
  });

  const stats = {
    total: requests.length,
    validated: requests.filter((r) => r.complianceStatus === 'validated').length,
    pending: requests.filter((r) => r.complianceStatus === 'pending').length,
    rejected: requests.filter((r) => r.complianceStatus === 'rejected').length,
  };

  const handleValidate = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, complianceStatus: 'validated' } : r))
    );
    const req = requests.find((r) => r.id === id);
    onAddAuditEvent({
      id: `fhir-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      actor: 'fhir-gateway@mediwise.io',
      actorRole: 'SYSTEM_BOT',
      action: `FHIR R4 MedicationRequest Validated: ${req?.medicationCodeableConcept.text}`,
      resource: `EHR Bundle [${id}] → Formulary cross-reference complete`,
      complianceCode: 'HL7 FHIR R4 §8.3',
      ip: '10.128.0.12 (FHIR Gateway)',
      status: 'Verified Pass',
      statusType: 'success',
    });
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, complianceStatus: 'rejected' } : r))
    );
  };

  const handleDemoIngest = () => {
    setIsIngestingDemo(true);
    setTimeout(() => {
      const newReq: FHIRMedicationRequest = {
        id: `fhir-demo-${Date.now()}`,
        resourceType: 'MedicationRequest',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '860975', display: 'Metformin 500 MG Oral Tablet' }],
          text: 'Metformin 500mg',
        },
        subject: { reference: 'Patient/ABDM-91-1234-5678-9012', display: 'Demo Patient (ABDM Verified)' },
        requester: { display: 'Dr. A. Mehta, MBBS (Apollo Hospital)', identifier: { system: 'NMC', value: 'NMC-2019-004512' } },
        dosageInstruction: [{ text: '500mg twice daily with meals', timing: { code: { text: 'BID' } } }],
        authoredOn: new Date().toISOString(),
        complianceStatus: 'pending',
      };
      setRequests((prev) => [newReq, ...prev]);
      setSelectedId(newReq.id);
      setIsIngestingDemo(false);
      onAddAuditEvent({
        id: `fhir-ingest-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        actor: 'apollo-ehr@apollo24x7.in',
        actorRole: 'PHARMACY_WEBHOOK',
        action: 'FHIR R4 MedicationRequest Received: Metformin 500mg',
        resource: 'Apollo Hospital HL7/FHIR R4 → POST /api/fhir/ingest',
        complianceCode: 'HL7 FHIR R4 §8.3 / CDSCO GR-2022',
        ip: '203.90.14.21 (Apollo EHR Relay)',
        status: 'Action Required',
        statusType: 'warning',
      });
    }, 1400);
  };

  const statusBadge = (status: FHIRMedicationRequest['complianceStatus']) => {
    if (status === 'validated')
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">VALIDATED</span>;
    if (status === 'rejected')
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">REJECTED</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">PENDING</span>;
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded bg-violet-950/80 border border-violet-800 text-violet-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-['Hanken_Grotesk'] leading-tight flex items-center gap-2">
                FHIR R4 / HL7 EHR Ingestion Gateway
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800">
                  Phase 3 · Sprint 3.1
                </span>
              </h1>
              <p className="text-xs text-[#94a3b8]">
                Ingest hospital EHR prescriptions via FHIR R4 bundles, cross-reference formulary, and validate compliance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDemoIngest}
            disabled={isIngestingDemo}
            className="h-8 px-3 bg-violet-900/60 hover:bg-violet-800/60 border border-violet-700/60 text-violet-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isIngestingDemo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isIngestingDemo ? 'Ingesting…' : 'Simulate EHR Push'}</span>
          </button>
          <button
            onClick={() => {}}
            className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-[#cbd5e1] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Bundle Log</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Ingested', value: stats.total, color: 'text-white', bg: 'bg-[#0d1424]', border: 'border-[#1e293b]' },
          { label: 'Validated', value: stats.validated, color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-900/50' },
          { label: 'Pending Review', value: stats.pending, color: 'text-amber-400', bg: 'bg-amber-950/20', border: 'border-amber-900/50' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-900/50' },
        ].map((kpi) => (
          <div key={kpi.label} className={`${kpi.bg} border ${kpi.border} rounded-lg p-3`}>
            <div className={`text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* EHR Endpoint Registry */}
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-4 space-y-3">
        <h2 className="text-xs font-bold text-white font-['Hanken_Grotesk'] uppercase tracking-wider flex items-center gap-2">
          <Link className="w-3.5 h-3.5 text-violet-400" />
          Registered EHR Endpoints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {MOCK_EHR_ENDPOINTS.map((ep) => (
            <div key={ep.id} className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white">{ep.name}</span>
                <span className={`w-2 h-2 rounded-full mt-1 ${ep.status === 'active' ? 'bg-emerald-400' : ep.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'}`} />
              </div>
              <div className="text-[10px] text-[#64748b] font-mono truncate">{ep.baseUrl}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-violet-950/60 text-violet-300 border border-violet-800/40">{ep.version}</span>
                <span className="text-[10px] text-[#94a3b8]">{ep.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Split: List + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Left: Request List */}
        <div className="xl:col-span-2 space-y-3">
          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drug, patient, physician…"
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#0d1424] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-violet-500 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="h-8 px-2 text-xs bg-[#0d1424] border border-[#1e293b] rounded text-white outline-none focus:border-violet-500"
            >
              <option value="all">All</option>
              <option value="validated">Validated</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <div className="p-6 text-center text-[#64748b] text-xs">No requests match the filter.</div>
            )}
            {filtered.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedId(req.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedId === req.id
                    ? 'bg-violet-950/40 border-violet-700/60'
                    : 'bg-[#0d1424] border-[#1e293b] hover:border-violet-800/40'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold text-white truncate">{req.medicationCodeableConcept.text}</span>
                  {statusBadge(req.complianceStatus)}
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{req.subject.display}</div>
                <div className="text-[10px] text-[#64748b] mt-0.5 font-mono">{new Date(req.authoredOn).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detail Panel */}
        {selected && (
          <div className="xl:col-span-3 bg-[#0d1424] border border-[#1e293b] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#1e293b] bg-[#090d16] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white font-['Hanken_Grotesk']">
                  {selected.medicationCodeableConcept.text}
                </h3>
                <p className="text-[11px] text-[#94a3b8] font-mono mt-0.5">{selected.id}</p>
              </div>
              {statusBadge(selected.complianceStatus)}
            </div>
            <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto">
              {/* FHIR Resource Fields */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Resource Type', value: selected.resourceType },
                  { label: 'Status', value: selected.status },
                  { label: 'Intent', value: selected.intent },
                  { label: 'Authored On', value: new Date(selected.authoredOn).toLocaleString() },
                ].map((f) => (
                  <div key={f.label} className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#64748b] uppercase block">{f.label}</span>
                    <span className="font-mono text-white font-semibold">{f.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Patient (ABDM ID)', value: selected.subject.display, ref: selected.subject.reference },
                  { label: 'Prescribing Physician', value: selected.requester.display, ref: selected.requester.identifier?.value },
                  { label: 'Dosage Instruction', value: selected.dosageInstruction[0]?.text, ref: selected.dosageInstruction[0]?.timing?.code.text },
                ].map((row) => (
                  <div key={row.label} className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] text-xs">
                    <span className="text-[10px] text-[#64748b] uppercase block">{row.label}</span>
                    <span className="text-white font-semibold">{row.value}</span>
                    {row.ref && <span className="text-[10px] text-violet-400 font-mono ml-2">{row.ref}</span>}
                  </div>
                ))}
              </div>

              {/* RxNorm Coding */}
              <div className="p-3 bg-[#090d16] border border-violet-900/40 rounded space-y-1.5">
                <span className="text-[10px] text-violet-400 font-bold uppercase block flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> RxNorm / SNOMED Coding
                </span>
                {selected.medicationCodeableConcept.coding.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800 text-[10px]">{c.code}</span>
                    <span className="text-[#94a3b8]">{c.system.split('/').pop()}</span>
                    <ChevronRight className="w-3 h-3 text-[#64748b]" />
                    <span className="text-white">{c.display}</span>
                  </div>
                ))}
              </div>

              {selected.mappedDrugId && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold">Formulary Match Found</span>
                    <span className="font-mono text-[10px] text-emerald-400">{selected.mappedDrugId}</span>
                  </div>
                  <button
                    onClick={() => onNavigateToCatalog(selected.mappedDrugId!)}
                    className="h-7 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    View in Catalog <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Actions */}
              {selected.complianceStatus === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-[#1e293b]">
                  <button
                    onClick={() => handleValidate(selected.id)}
                    className="flex-1 h-9 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Validate & Cross-Reference
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    className="flex-1 h-9 bg-red-900/60 hover:bg-red-800/60 text-red-200 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-800/40"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Bundle
                  </button>
                </div>
              )}
              {selected.complianceStatus === 'validated' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded p-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>This FHIR bundle has been validated and logged to the cryptographic audit ledger.</span>
                </div>
              )}
              {selected.complianceStatus === 'rejected' && (
                <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/30 border border-red-800/40 rounded p-2.5">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Bundle rejected. Non-compliant FHIR format or unregistered prescriber NPI. Logged to audit trail.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
