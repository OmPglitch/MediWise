import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, LogOut, KeyRound, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { ROLE_DETAILS } from '../../data/mockUsers';

interface SessionLockModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onUnlock: () => void;
  onLogout: () => void;
}

export const SessionLockModal: React.FC<SessionLockModalProps> = ({
  isOpen,
  currentUser,
  onUnlock,
  onLogout,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow any PIN of 4+ characters or empty for smooth demoing
    if (pin.length >= 4 || pin === '') {
      setError(false);
      setPin('');
      onUnlock();
    } else {
      setError(true);
    }
  };

  const roleMeta = ROLE_DETAILS[currentUser.role];

  return (
    <div className="fixed inset-0 z-50 bg-[#060a12]/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-xl w-full max-w-md shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Lock Icon & Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-500/60 text-cyan-400 flex items-center justify-center shadow-lg relative">
            <Lock className="w-8 h-8 text-cyan-300" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1424] flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-white" />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800/60">
              HIPAA Workstation Lock (§164.312)
            </span>
            <h2 className="text-xl font-bold text-white font-['Hanken_Grotesk'] mt-2">
              Clinical Session Suspended
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Protected Health Information (ePHI) encrypted in memory buffer.
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded-lg flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full border border-cyan-500/40 bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-cyan-200 flex items-center justify-center font-bold text-sm">
            {currentUser.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
            <div className="text-xs text-cyan-300 truncate font-mono">{currentUser.roleTitle}</div>
          </div>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlockSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-semibold text-white">Enter Workstation PIN / Master Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="password"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter PIN (e.g. 2026 or leave blank)"
                className="w-full h-10 pl-9 pr-3 text-sm bg-[#090d16] border border-[#1e293b] focus:border-cyan-500 rounded text-white placeholder-[#64748b] font-mono outline-none"
              />
            </div>
            {error && (
              <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                Invalid PIN code. Please re-enter.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold rounded text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Resume Clinical Mesh</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Emergency Logout */}
        <div className="pt-2 border-t border-[#1e293b] flex justify-center">
          <button
            onClick={onLogout}
            className="text-xs text-[#94a3b8] hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out or Switch User Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
