import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, FileCode, Check, RefreshCw } from 'lucide-react';

interface ConfigDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeploy: () => void;
  isDeploying: boolean;
}

export const ConfigDiffModal: React.FC<ConfigDiffModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeploy,
  isDeploying,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] leading-tight">
                Live Runtime Configuration & YAML Diff Inspector
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Comparing active baseline (<strong className="text-white font-mono">v4.11.9</strong>) with staged hotfix candidate (<strong className="text-cyan-300 font-mono">v4.12.0</strong>)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white p-1 rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Side by side diff snippet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Left Pane: Active Baseline */}
            <div className="bg-[#090d16] p-3 rounded border border-[#1e293b] space-y-1">
              <div className="text-[10px] text-[#64748b] uppercase font-bold border-b border-[#1e293b] pb-1 mb-2 flex justify-between">
                <span>Active Baseline (v4.11.9)</span>
                <span>SHA: 0x9a4f</span>
              </div>
              <div className="text-[#94a3b8]">version: "v4.11.9-STABLE"</div>
              <div className="text-[#94a3b8]">security:</div>
              <div className="text-red-400/90 bg-red-950/30 px-1 rounded">
                - vault_rotation_interval: "30d"
              </div>
              <div className="text-[#94a3b8]">algorithmic_matching:</div>
              <div className="text-red-400/90 bg-red-950/30 px-1 rounded">
                - bioeq_confidence_floor: 0.9750
              </div>
              <div className="text-[#94a3b8]">  disclaimer_enforcement: "STRICT"</div>
            </div>

            {/* Right Pane: Staged Hotfix Candidate */}
            <div className="bg-[#090d16] p-3 rounded border border-cyan-800/40 space-y-1">
              <div className="text-[10px] text-cyan-400 uppercase font-bold border-b border-[#1e293b] pb-1 mb-2 flex justify-between">
                <span>Staged Hotfix Candidate (v4.12.0)</span>
                <span>SHA: 0x8a92</span>
              </div>
              <div className="text-white">version: "v4.12.0-STABLE"</div>
              <div className="text-[#94a3b8]">security:</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded font-bold">
                + vault_rotation_interval: "14d"
              </div>
              <div className="text-[#94a3b8]">algorithmic_matching:</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded font-bold">
                + bioeq_confidence_floor: 0.9800
              </div>
              <div className="text-[#94a3b8]">  disclaimer_enforcement: "STRICT_PRD_SEC9"</div>
            </div>
          </div>

          {/* Inspection & Guardrail Audits */}
          <div className="bg-[#090d16] p-3.5 rounded border border-[#1e293b] space-y-2 text-xs">
            <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider block">
              Automated Guardrail & Safety Gate Verifications
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Syntax Validation</span>
                  <span className="text-[10px] text-[#64748b]">YAML 1.2 schema compliance PASS</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Clinical Safety Guard</span>
                  <span className="text-[10px] text-[#64748b]">Floor strictly increased (0.975 → 0.980)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Secret Sanitization</span>
                  <span className="text-[10px] text-[#64748b]">Zero plaintext keys exposed in manifest</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#0d1424] rounded border border-[#1e293b]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Zero-Downtime Guarantee</span>
                  <span className="text-[10px] text-[#64748b]">Rolling daemonset restart (0s outage)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Attestations */}
          <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono">
            <div>
              <span className="text-[#64748b] block text-[10px]">Attestation Co-Signers:</span>
              <span className="text-cyan-300">v.raman.sec (KMS Admin) • dr.s.mukherjee (CMIO Lead)</span>
            </div>
            <span className="text-emerald-400 text-[11px] font-semibold">2/2 Signatures Valid</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#090d16] border-t border-[#1e293b] flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold text-[#cbd5e1] hover:text-white rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmDeploy}
            disabled={isDeploying}
            className="h-8 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isDeploying ? 'Deploying Rolling Pods...' : 'Deploy Staged Hotfix (v4.12.0)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
