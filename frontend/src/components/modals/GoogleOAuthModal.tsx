import React, { useState } from 'react';
import { X, ShieldCheck, Check, ArrowRight, UserPlus, Sparkles, RefreshCw, Lock, Stethoscope, Store, Shield, Heart } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { ROLE_DETAILS, DEMO_USERS } from '../../data/mockUsers';

// Standard Google multi-color SVG icon
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

interface GoogleOAuthModalProps {
  isOpen: boolean;
  flow?: 'login' | 'register';
  initialRole?: UserRole;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

interface GoogleAccountOption {
  email: string;
  name: string;
  avatarColor: string;
  initials: string;
  isDefault?: boolean;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  flow = 'login',
  initialRole = 'cmio',
  onClose,
  onSuccess,
}) => {
  const [selectedAccountEmail, setSelectedAccountEmail] = useState<string>('ompatil.p42@gmail.com');
  const [useCustomAccount, setUseCustomAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm_role'>('select');

  if (!isOpen) return null;

  const GOOGLE_ACCOUNTS: GoogleAccountOption[] = [
    {
      email: 'ompatil.p42@gmail.com',
      name: 'Om Patil',
      avatarColor: 'bg-[#4285F4]',
      initials: 'OP',
      isDefault: true,
    },
    {
      email: 'dr.vikram.rao@clinical.io',
      name: 'Dr. Vikram Rao',
      avatarColor: 'bg-[#0f9d58]',
      initials: 'VR',
    },
  ];

  const handleSelectPredefined = (email: string) => {
    setSelectedAccountEmail(email);
    setUseCustomAccount(false);
  };

  const handleContinue = () => {
    // If registering, confirm role first
    if (flow === 'register' && step === 'select') {
      setStep('confirm_role');
      return;
    }

    completeOAuth(selectedRole);
  };

  const completeOAuth = (role: UserRole) => {
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);

      let finalName = 'Om Patil';
      let finalEmail = 'ompatil.p42@gmail.com';

      if (useCustomAccount) {
        finalName = customName.trim() || 'Google Healthcare User';
        finalEmail = customEmail.trim() || 'user@gmail.com';
      } else {
        const found = GOOGLE_ACCOUNTS.find((a) => a.email === selectedAccountEmail);
        if (found) {
          finalName = found.name;
          finalEmail = found.email;
        }
      }

      const initials = finalName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      const user: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: finalName,
        email: finalEmail,
        role: role,
        roleTitle:
          role === 'cmio'
            ? 'Attending Physician & Pharmacologist'
            : role === 'pharmacy_partner'
            ? 'Registered Pharmacy Dispenser'
            : role === 'compliance_officer'
            ? 'Principal Healthcare Compliance Auditor'
            : 'Verified Prescription Member',
        organization:
          role === 'cmio'
            ? 'Metropolitan Clinical Health'
            : role === 'pharmacy_partner'
            ? 'Apollo Dispensary Group'
            : role === 'compliance_officer'
            ? 'National Quality Forum'
            : 'Individual Health Member',
        avatarInitials: initials,
        authProvider: 'google',
        emailVerified: true,
        googleAccountId: `google_${Date.now()}`,
        twoFactorEnabled: true,
        twoFactorMethod: 'fido2',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        sessionToken: `google_oauth_jwt_${Math.random().toString(36).substring(2, 14)}`,
        ipAddress: '104.28.14.88 (Google Identity Provider)',
        location: 'Mountain View, CA (Authorized OAuth)',
        device: 'Google Chrome • FIDO2 WebAuthn',
        permissions: DEMO_USERS[role]?.permissions || DEMO_USERS.cmio.permissions,
        licenseNumber: role !== 'patient' ? `MED-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      };

      onSuccess(user);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-[#334155] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        {/* Google Header */}
        <div className="p-5 border-b border-[#1e293b] bg-[#090d16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{flow === 'register' ? 'Create Account with Google' : 'Sign in with Google'}</span>
              </h3>
              <p className="text-[11px] text-[#94a3b8]">to continue to MediWise Clinical Systems</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white p-1 rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'select' ? (
          <div className="p-5 space-y-4">
            <div className="text-xs text-[#cbd5e1] font-medium">Choose an account</div>

            {/* Predefined Account List */}
            <div className="space-y-2">
              {GOOGLE_ACCOUNTS.map((acc) => {
                const isSelected = !useCustomAccount && selectedAccountEmail === acc.email;
                return (
                  <div
                    key={acc.email}
                    onClick={() => handleSelectPredefined(acc.email)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1e293b] border-cyan-500 shadow-sm'
                        : 'bg-[#090d16]/80 border-[#1e293b] hover:border-[#475569] hover:bg-[#1e293b]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${acc.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-inner`}
                      >
                        {acc.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>{acc.name}</span>
                          {acc.isDefault && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                              Active Workspace
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#94a3b8] font-mono">{acc.email}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Use another account toggle */}
              <div
                onClick={() => setUseCustomAccount(!useCustomAccount)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  useCustomAccount
                    ? 'bg-[#1e293b] border-cyan-500 shadow-sm'
                    : 'bg-[#090d16]/80 border-[#1e293b] hover:border-[#475569] hover:bg-[#1e293b]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#334155] text-cyan-400 flex items-center justify-center font-bold text-xs">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Use another Google account</div>
                    <div className="text-[11px] text-[#94a3b8]">Enter a different Gmail or Workspace address</div>
                  </div>
                </div>
                {useCustomAccount && (
                  <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Custom account input form */}
              {useCustomAccount && (
                <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded-lg space-y-2.5 animate-in fade-in duration-100">
                  <div>
                    <label className="text-[10px] text-[#94a3b8] uppercase font-mono block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Om Patil"
                      className="w-full h-8 px-2.5 text-xs bg-[#0f172a] border border-[#334155] rounded text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94a3b8] uppercase font-mono block mb-1">Google Email Address</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full h-8 px-2.5 text-xs bg-[#0f172a] border border-[#334155] rounded text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Scopes & Permissions Notice */}
            <div className="p-3 bg-[#090d16] rounded-lg border border-[#1e293b] space-y-1.5 text-[11px] text-[#94a3b8]">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authorized OAuth 2.0 Scopes</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-[#94a3b8]">
                <li>View your email address and primary Google profile</li>
                <li>Verify your identity for HIPAA ePHI access logs</li>
                <li>Link Google account for cryptographic session signing</li>
              </ul>
              <div className="text-[10px] text-[#64748b] pt-1">
                MediWise will not store your Google password or have access to your Google Drive or Gmail.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#94a3b8] hover:text-white hover:bg-[#1e293b] rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={isAuthenticating}
                className="px-5 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting Google...</span>
                  </>
                ) : (
                  <>
                    <span>{flow === 'register' ? 'Continue with Selected Account' : 'Sign in as this User'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Role confirmation for Google Register */
          <div className="p-5 space-y-4">
            <div>
              <div className="text-xs font-semibold text-white">Select Your Clinical Role</div>
              <p className="text-[11px] text-[#94a3b8]">
                Assign your Google account to a MediWise permission profile to provision your role-based access.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {(['patient', 'cmio', 'pharmacy_partner', 'compliance_officer'] as UserRole[]).map((r) => {
                const isSelected = selectedRole === r;
                const meta = ROLE_DETAILS[r];
                return (
                  <div
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1e293b] border-cyan-400 shadow-sm'
                        : 'bg-[#090d16] border-[#1e293b] hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`p-1 rounded text-xs ${meta.badgeColor}`}>
                        {r === 'cmio' && <Stethoscope className="w-3.5 h-3.5" />}
                        {r === 'pharmacy_partner' && <Store className="w-3.5 h-3.5" />}
                        {r === 'compliance_officer' && <Shield className="w-3.5 h-3.5" />}
                        {r === 'patient' && <Heart className="w-3.5 h-3.5" />}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-xs font-bold text-white">{meta.label}</div>
                    <div className="text-[10px] text-[#94a3b8] line-clamp-2 mt-0.5">{meta.tagline}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white rounded transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => completeOAuth(selectedRole)}
                disabled={isAuthenticating}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Provisioning Google Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Google Registration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
