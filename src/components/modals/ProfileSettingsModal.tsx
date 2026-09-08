import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Key,
  Smartphone,
  Lock,
  LogOut,
  Clock,
  MapPin,
  Laptop,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  Fingerprint,
  ShieldCheck,
  Stethoscope,
  Store,
  Heart,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { UserProfile, UserRole, ThemeMode } from '../../types';
import { ROLE_DETAILS, DEMO_USERS } from '../../data/mockUsers';
import { GoogleIcon } from './GoogleOAuthModal';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onLogout: () => void;
  onSwitchPersona: (role: UserRole) => void;
  onLockSession: () => void;
  theme?: ThemeMode;
  onSelectTheme?: (mode: ThemeMode) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogout,
  onSwitchPersona,
  onLockSession,
  theme = 'dark',
  onSelectTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'rbac' | 'sessions'>('profile');
  const [copiedToken, setCopiedToken] = useState(false);
  const [twoFaActive, setTwoFaActive] = useState(currentUser.twoFactorEnabled);

  if (!isOpen) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(currentUser.sessionToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const roleMeta = ROLE_DETAILS[currentUser.role];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-cyan-500/40 bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-cyan-200 flex items-center justify-center font-bold text-sm shadow-inner">
              {currentUser.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] leading-tight">
                  {currentUser.name}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${roleMeta.badgeColor}`}>
                  {roleMeta.label}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-mono flex items-center gap-1.5 flex-wrap">
                <span>{currentUser.email}</span>
                {currentUser.emailVerified && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-[10px] rounded">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </span>
                )}
                <span>•</span>
                <span>{currentUser.organization}</span>
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

        {/* Sub Navigation */}
        <div className="flex border-b border-[#1e293b] bg-[#0b101d] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile & Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>2FA & Cryptography</span>
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'rbac'
                ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>RBAC Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Sessions</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: PROFILE & CREDENTIALS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-white font-['Hanken_Grotesk']">
                  <span>CLINICAL GOVERNANCE IDENTITY</span>
                  <span className="text-[10px] font-mono text-emerald-400">VERIFIED ID</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Assigned Role Title</span>
                    <span className="font-semibold text-white">{currentUser.roleTitle}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Organization / Facility</span>
                    <span className="font-semibold text-white">{currentUser.organization}</span>
                  </div>
                  {currentUser.licenseNumber && (
                    <div>
                      <span className="text-[#64748b] block text-[11px]">State Board / Clinical License</span>
                      <span className="font-mono text-cyan-300 font-semibold">{currentUser.licenseNumber}</span>
                    </div>
                  )}
                  {currentUser.npiNumber && (
                    <div>
                      <span className="text-[#64748b] block text-[11px]">National Provider Identifier (NPI)</span>
                      <span className="font-mono text-cyan-300 font-semibold">{currentUser.npiNumber}</span>
                    </div>
                  )}
                  {currentUser.chronicCondition && (
                    <div>
                      <span className="text-[#64748b] block text-[11px]">Prescription Care Profile</span>
                      <span className="font-semibold text-emerald-300">{currentUser.chronicCondition}</span>
                    </div>
                  )}
                  {currentUser.preferredPharmacy && (
                    <div>
                      <span className="text-[#64748b] block text-[11px]">Dispensary Routing</span>
                      <span className="font-semibold text-blue-300">{currentUser.preferredPharmacy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Persona Switcher Quick Panel */}
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-white uppercase font-['Hanken_Grotesk']">
                    Switch Active Persona (Evaluation Mode):
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Instant Role Hot-Swap</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                    const u = DEMO_USERS[r];
                    const isCurrent = currentUser.role === r;
                    return (
                      <div
                        key={r}
                        onClick={() => !isCurrent && onSwitchPersona(r)}
                        className={`p-2 rounded border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-cyan-950/50 border-cyan-500 text-white'
                            : 'bg-[#0d1424] border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#334155]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#1e293b] text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                            {u.avatarInitials}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-[11px] leading-tight">{u.name}</div>
                            <div className="text-[9px] text-[#64748b]">{u.roleTitle.split(' ')[0]}</div>
                          </div>
                        </div>
                        {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Theme & Display Ergonomics Box */}
              {onSelectTheme && (
                <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-white uppercase font-['Hanken_Grotesk'] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Interface Theme Mode</span>
                    </span>
                    <span className="text-[10px] text-[#94a3b8] font-mono uppercase">
                      Current: {theme}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTheme('dark')}
                      className={`p-2.5 rounded border text-left flex items-center justify-between transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#0d1424] border-cyan-500 ring-1 ring-cyan-500/30'
                          : 'bg-[#0d1424]/60 border-[#1e293b] hover:border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="font-bold text-white text-xs leading-tight">Dark Mode</div>
                          <div className="text-[10px] text-[#94a3b8]">Clinical Terminal</div>
                        </div>
                      </div>
                      {theme === 'dark' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTheme('light')}
                      className={`p-2.5 rounded border text-left flex items-center justify-between transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-[#0d1424] border-cyan-500 ring-1 ring-cyan-500/30'
                          : 'bg-[#0d1424]/60 border-[#1e293b] hover:border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-bold text-white text-xs leading-tight">Light Mode</div>
                          <div className="text-[10px] text-[#94a3b8]">Sterile Laboratory</div>
                        </div>
                      </div>
                      {theme === 'light' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SECURITY & CRYPTOGRAPHY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">Multi-Factor Authentication (MFA / 2FA)</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      twoFaActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {twoFaActive ? 'ENFORCED' : 'OPTIONAL'}
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">
                  FIPS 140-2 Level 3 cryptographic hardware token or TOTP authenticator is enforced for all clinical sign-offs.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-white">Require 2FA on every clinical transaction</span>
                  <input
                    type="checkbox"
                    checked={twoFaActive}
                    onChange={(e) => setTwoFaActive(e.target.checked)}
                    className="accent-cyan-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Identity Provider & Google Account Status */}
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white font-['Hanken_Grotesk'] text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AUTHENTICATION PROVIDER & FEDERATED IDENTITY</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                    OIDC ACTIVE
                  </span>
                </div>

                <div className="p-2.5 bg-[#0d1424] border border-[#1e293b] rounded flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                      <GoogleIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>Google Identity Services (OAuth 2.0)</span>
                        {currentUser.authProvider === 'google' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 font-mono">
                            Primary Provider
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#94a3b8] font-mono">
                        {currentUser.googleAccountId ? `Linked ID: ${currentUser.googleAccountId}` : `Linked Email: ${currentUser.email}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Linked</span>
                  </div>
                </div>
              </div>

              {/* JWT Bearer Token */}
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white font-['Hanken_Grotesk'] text-[11px]">
                    ACTIVE JWT SESSION BEARER
                  </span>
                  <button
                    onClick={handleCopyToken}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="p-2 bg-[#060a12] border border-[#1e293b] rounded font-mono text-[11px] text-cyan-300 break-all select-all">
                  {currentUser.sessionToken}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>Alg: ES256 • SHA-256</span>
                  <span>Expires: 7h 48m</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-[#090d16] border border-[#1e293b] rounded flex justify-between items-center">
                <div>
                  <span className="text-white font-bold text-xs block font-['Hanken_Grotesk']">
                    ROLE-BASED ACCESS CONTROL (RBAC)
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">Granted cryptographic permissions for {roleMeta.label}</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {currentUser.permissions.length} CAPABILITIES
                </span>
              </div>

              <div className="space-y-1.5">
                {currentUser.permissions.map((perm) => (
                  <div
                    key={perm}
                    className="p-2 bg-[#090d16] border border-[#1e293b] rounded flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white font-semibold">{perm}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      GRANTED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">Current Authorized Device</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    THIS WORKSTATION
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-[#cbd5e1]">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>{currentUser.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>{currentUser.location} ({currentUser.ipAddress})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>Last login: {currentUser.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Workstation Lock Button */}
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block text-[11px]">HIPAA Workstation Session Lock</span>
                  <span className="text-[10px] text-[#cbd5e1]">Instantly lock the display to protect ePHI compliance</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onLockSession();
                  }}
                  className="h-7 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock Screen</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1e293b] bg-[#090d16] flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onLockSession();
            }}
            className="h-8 px-3 bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] text-[#cbd5e1] hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Lock Screen</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3 bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] text-[#cbd5e1] hover:text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="h-8 px-3 bg-red-600/90 hover:bg-red-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm border border-red-500/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
