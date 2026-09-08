import React, { useState } from 'react';
import { X, AlertTriangle, RotateCcw, ShieldCheck, Check } from 'lucide-react';

interface RollbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRollback: () => void;
  isRollingBack: boolean;
}

export const RollbackModal: React.FC<RollbackModalProps> = ({
  isOpen,
  onClose,
  onConfirmRollback,
  isRollingBack,
}) => {
  const [attestationConfirmed, setAttestationConfirmed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-amber-500/50 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-start bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-950/80 border border-amber-600/60 text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] leading-tight">
                Confirm Production Rollback: Revert to v4.11.9
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Emergency cluster reversion sequence to restore validated stable state
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
        <div className="p-5 space-y-4 text-xs">
          {/* Critical Warning Alert */}
          <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded flex items-start gap-2.5 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">CRITICAL ACTION:</strong> Executing this rollback will terminate active hotfix candidate deployments and re-synchronize 16 worker pods to snapshot <strong className="text-white font-mono">v4.11.9-STABLE</strong>. In-flight transactions are preserved via graceful connection draining.
            </p>
          </div>

          {/* Parameter Regression Matrix */}
          <div className="bg-[#090d16] p-3.5 rounded border border-[#1e293b] space-y-2">
            <span className="text-[11px] font-bold font-['Hanken_Grotesk'] text-[#94a3b8] uppercase tracking-wider block">
              Parameter Regression Matrix
            </span>

            <div className="space-y-1.5 font-mono">
              <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b] flex justify-between">
                <span className="text-[#94a3b8]">bioeq_confidence_floor:</span>
                <span className="text-amber-300 font-bold">0.9800 → 0.9750</span>
              </div>
              <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b] flex justify-between">
                <span className="text-[#94a3b8]">vault_rotation_interval:</span>
                <span className="text-amber-300 font-bold">"14d" → "30d"</span>
              </div>
              <div className="p-2 bg-[#0d1424] rounded border border-[#1e293b] flex justify-between">
                <span className="text-[#94a3b8]">disclaimer_enforcement:</span>
                <span className="text-white">"STRICT_PRD_SEC9" → "STRICT"</span>
              </div>
            </div>
          </div>

          {/* Blast Radius & Telemetry */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
              <span className="text-[10px] text-[#64748b] block">Worker Pods</span>
              <span className="text-white font-bold text-sm">16 / 16 Revert</span>
            </div>
            <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
              <span className="text-[10px] text-[#64748b] block">Interrupted Tx</span>
              <span className="text-emerald-400 font-bold text-sm">0 Drops</span>
            </div>
            <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b]">
              <span className="text-[10px] text-[#64748b] block">Cache Purged</span>
              <span className="text-cyan-400 font-bold text-sm">1,420 Keys</span>
            </div>
          </div>

          {/* Attestation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 bg-[#090d16] rounded border border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors">
            <input
              type="checkbox"
              checked={attestationConfirmed}
              onChange={(e) => setAttestationConfirmed(e.target.value === 'on' ? !attestationConfirmed : e.target.checked)}
              className="mt-0.5 accent-amber-500 rounded cursor-pointer"
            />
            <span className="text-[#cbd5e1] leading-tight select-none">
              I confirm authorization as CMIO or Lead Systems Director to execute emergency production reversion to snapshot <strong className="text-white font-mono">v4.11.9</strong>.
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#090d16] border-t border-[#1e293b] flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold text-[#cbd5e1] hover:text-white rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            Cancel Reversion
          </button>
          <button
            onClick={onConfirmRollback}
            disabled={!attestationConfirmed || isRollingBack}
            className="h-8 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRollingBack ? 'animate-spin' : ''}`} />
            <span>{isRollingBack ? 'Reverting Nodes...' : 'Execute Reversion to v4.11.9'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
