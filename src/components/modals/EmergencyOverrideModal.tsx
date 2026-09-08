import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Lock, Check } from 'lucide-react';

interface EmergencyOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerOverride: (reason: string) => void;
}

export const EmergencyOverrideModal: React.FC<EmergencyOverrideModalProps> = ({
  isOpen,
  onClose,
  onTriggerOverride,
}) => {
  const [reason, setReason] = useState('Critical Clinical Dispensary Outage Mitigation');
  const [pin, setPin] = useState('');
  const [bypassWaf, setBypassWaf] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerOverride(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-red-500/50 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-start bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-950 border border-red-600/60 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] leading-tight">
                Emergency Cluster Override Protocol
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Elevated privileged execution. All actions recorded to append-only ledger.
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded text-red-200 leading-relaxed">
            <span className="font-bold text-white block mb-1">ELEVATED PRIVILEGES WARNING</span>
            Activating this override temporarily suspends non-critical rate limits, forces local cache flush, and grants elevated dispatch privileges to attending CMIO.
          </div>

          <div>
            <label className="text-[10px] text-[#64748b] uppercase font-bold block mb-1">
              Statutory Justification (Audit Logged)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#64748b] uppercase font-bold block mb-1">
              Director Master Key PIN / Passcode
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-red-500"
            />
          </div>

          <label className="flex items-center gap-2 text-[#cbd5e1] cursor-pointer">
            <input
              type="checkbox"
              checked={bypassWaf}
              onChange={(e) => setBypassWaf(e.target.checked)}
              className="accent-red-500 rounded"
            />
            <span>Enable Cloudflare Edge Rate Bypass for 15 minutes</span>
          </label>

          <div className="p-3 bg-[#090d16] border-t border-[#1e293b] flex justify-end items-center gap-3 -mx-5 -mb-5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 text-xs font-semibold text-[#cbd5e1] hover:text-white rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Confirm Emergency Override</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
