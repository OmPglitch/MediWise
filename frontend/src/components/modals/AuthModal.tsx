import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Building2,
  FileCheck2,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Fingerprint,
  RefreshCw,
  Stethoscope,
  Store,
  Shield,
  Heart
} from 'lucide-react';
import { AuthMode, UserProfile, UserRole } from '../../types';
import { DEMO_USERS, ROLE_DETAILS } from '../../data/mockUsers';
import { GoogleOAuthModal, GoogleIcon } from './GoogleOAuthModal';
import { TermsModal } from './TermsModal';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleFlow, setGoogleFlow] = useState<'login' | 'register'>('login');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('dr.v.rao@mediwise.io');
  const [loginPassword, setLoginPassword] = useState('ClinicalSecure#2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 2FA state
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [twoFactorTimer, setTwoFactorTimer] = useState(45);

  // Register form state
  const [regRole, setRegRole] = useState<UserRole>('patient');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regCondition, setRegCondition] = useState('');
  const [regPharmacy, setRegPharmacy] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeHipaa, setAgreeHipaa] = useState(false);
  const [regStep, setRegStep] = useState<1 | 2>(1);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const handleQuickFill = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setLoginEmail(demo.email);
    setLoginPassword('ClinicalSecure#2026!');
    setLoginError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    setTimeout(() => {
      setIsSubmitting(false);

      // Find matching user or fallback to CMIO
      const matched = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
      ) || DEMO_USERS.cmio;

      if (matched.twoFactorEnabled) {
        setPendingUser(matched);
        setMode('two_factor');
      } else {
        onLoginSuccess(matched);
        onClose();
      }
    }, 600);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(pendingUser);
      onClose();
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }
    if (!agreeTerms || !agreeHipaa) {
      setLoginError('Please accept statutory Terms and HIPAA agreements.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newUser: UserProfile = {
        id: `usr-reg-${Date.now()}`,
        name: regName || 'Dr. Alex Mercer',
        email: regEmail || 'alex.mercer@clinicalhealth.org',
        role: regRole,
        roleTitle:
          regRole === 'cmio'
            ? 'Attending Physician & Pharmacologist'
            : regRole === 'pharmacy_partner'
            ? 'Registered Pharmacy Dispenser'
            : regRole === 'compliance_officer'
            ? 'Staff Regulatory Auditor'
            : 'Verified Prescription Member',
        organization: regOrg || 'Metropolitan Health Network',
        avatarInitials: regName
          ? regName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()
          : 'AM',
        licenseNumber: regLicense || (regRole !== 'patient' ? 'LIC-2026-9481' : undefined),
        twoFactorEnabled: regRole !== 'patient',
        twoFactorMethod: regRole !== 'patient' ? 'totp' : 'sms',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        sessionToken: `jwt_live_${Math.random().toString(36).substring(2, 12)}`,
        ipAddress: '192.0.2.45 (Local Secure Session)',
        location: 'New York, NY',
        device: 'Desktop Workstation • Chrome 128',
        permissions: DEMO_USERS[regRole].permissions,
      };

      onRegisterSuccess(newUser);
      onClose();
    }, 700);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      setForgotStep(2);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setMode('login');
        setLoginEmail(forgotEmail);
        setLoginPassword(newPassword);
        setForgotStep(1);
      }, 600);
    }
  };

  const passwordStrength = getPasswordStrength(regPassword);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] leading-tight">
                  MediWise Secure Identity & Access Portal
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  FIPS 140-2
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                OAuth 2.0 • SAML 2.0 • HIPAA §164.312(d) Identity Verification
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

        {/* Tab Switcher (Login vs Register) */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex border-b border-[#1e293b] bg-[#0b101d]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In to Clinical Mesh</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Register New Account</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Global Error Banner */}
          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded flex items-center gap-2 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* =================================================== */}
          {/* MODE 1: LOGIN VIEW */}
          {/* =================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Google Sign-in Primary Button */}
              <button
                type="button"
                onClick={() => {
                  setGoogleFlow('login');
                  setShowGoogleModal(true);
                }}
                className="w-full h-10 px-4 bg-white hover:bg-slate-100 text-[#1f2937] font-semibold text-xs rounded-lg flex items-center justify-center gap-2.5 shadow transition-all cursor-pointer border border-slate-200"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>

              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-[#1e293b]"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-[#64748b] uppercase">
                  or sign in with email credentials
                </span>
                <div className="flex-grow border-t border-[#1e293b]"></div>
              </div>

              {/* Demo 1-Click Role Quick Fill Bar */}
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#94a3b8] uppercase font-['Hanken_Grotesk']">
                    1-Click Demo Persona Fill:
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Instant RBAC Preset</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('cmio')}
                    className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-cyan-500/50 transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-white truncate text-[11px]">Dr. V. Rao</div>
                    <div className="text-[9px] text-cyan-300 font-mono">CMIO Lead</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('pharmacy_partner')}
                    className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-blue-500/50 transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-white truncate text-[11px]">Priya S.</div>
                    <div className="text-[9px] text-blue-300 font-mono">Apollo Retail</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('compliance_officer')}
                    className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-purple-500/50 transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-white truncate text-[11px]">Elena V.</div>
                    <div className="text-[9px] text-purple-300 font-mono">HIPAA Audit</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('patient')}
                    className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-white truncate text-[11px]">Jane Doe</div>
                    <div className="text-[9px] text-emerald-300 font-mono">Rx Patient</div>
                  </button>
                </div>
              </div>

              {/* Email / Clinical ID Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white font-['Hanken_Grotesk'] block">
                  Clinical Email / Health System ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@hospital.org or dr.v.rao@mediwise.io"
                    className="w-full h-9 pl-9 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-white font-['Hanken_Grotesk']">
                    Master Password / Passphrase
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setForgotEmail(loginEmail);
                      setForgotStep(1);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-9 pl-9 pr-10 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-cyan-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Session Duration */}
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Persist encrypted device session (8 hrs)</span>
                </label>
                <span className="font-mono text-[#64748b]">TLS 1.3 / AES-GCM</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold rounded flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize Session Access</span>
                  </>
                )}
              </button>

              {/* SSO / SAML Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#1e293b]"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-[#64748b] uppercase">
                  or Enterprise SSO
                </span>
                <div className="flex-grow border-t border-[#1e293b]"></div>
              </div>

              {/* Enterprise SSO Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('cmio')}
                  className="h-8 px-2 bg-[#090d16] border border-[#1e293b] hover:border-cyan-500/60 rounded text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hospital SAML 2.0</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('pharmacy_partner')}
                  className="h-8 px-2 bg-[#090d16] border border-[#1e293b] hover:border-blue-500/60 rounded text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pharmacy Partner IdP</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================== */}
          {/* MODE 2: REGISTER NEW ACCOUNT */}
          {/* =================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Google Fast 1-Click Sign Up */}
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded-lg space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fast 1-Click Google Registration:</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">OpenID Verified</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleFlow('register');
                    setShowGoogleModal(true);
                  }}
                  className="w-full h-10 px-4 bg-white hover:bg-slate-100 text-[#1f2937] font-semibold text-xs rounded-lg flex items-center justify-center gap-2.5 shadow transition-all cursor-pointer border border-slate-200"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Sign up with Google (Om Patil)</span>
                </button>
              </div>

              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-[#1e293b]"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-[#64748b] uppercase">
                  or register with clinical credentials
                </span>
                <div className="flex-grow border-t border-[#1e293b]"></div>
              </div>

              {/* Step 1: Role / Persona Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white font-['Hanken_Grotesk'] block uppercase tracking-wider">
                  1. Select Clinical Account Classification:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    onClick={() => setRegRole('patient')}
                    className={`p-2.5 rounded border cursor-pointer transition-all ${
                      regRole === 'patient'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-xs">Patient / Healthcare Consumer</div>
                        <div className="text-[10px] text-[#64748b]">Compare prices, save refills, doctor slips</div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setRegRole('pharmacy_partner')}
                    className={`p-2.5 rounded border cursor-pointer transition-all ${
                      regRole === 'pharmacy_partner'
                        ? 'bg-blue-950/40 border-blue-500 text-white'
                        : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-xs">Pharmacy Dispensary Partner</div>
                        <div className="text-[10px] text-[#64748b]">Real-time inventory feed & CPA escrow</div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setRegRole('cmio')}
                    className={`p-2.5 rounded border cursor-pointer transition-all ${
                      regRole === 'cmio'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-xs">Physician / Clinical Authority</div>
                        <div className="text-[10px] text-[#64748b]">Bioequivalence audit & substitution consent</div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setRegRole('compliance_officer')}
                    className={`p-2.5 rounded border cursor-pointer transition-all ${
                      regRole === 'compliance_officer'
                        ? 'bg-purple-950/40 border-purple-500 text-white'
                        : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-xs">Regulatory / Security Auditor</div>
                        <div className="text-[10px] text-[#64748b]">SOC2 & HIPAA append-only Merkle ledger</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Form Inputs */}
              <div className="space-y-3 pt-2 border-t border-[#1e293b]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={regRole === 'patient' ? 'Jane Doe' : 'Dr. Sarah Jenkins, MD'}
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">Primary Work Email</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={regRole === 'patient' ? 'jane@email.com' : 's.jenkins@healthsystem.org'}
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Role Specific Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">
                      {regRole === 'patient'
                        ? 'Chronic Prescription Area'
                        : regRole === 'pharmacy_partner'
                        ? 'Pharmacy Organization Name'
                        : 'Hospital / Practice Affiliation'}
                    </label>
                    <input
                      type="text"
                      value={regOrg}
                      onChange={(e) => setRegOrg(e.target.value)}
                      placeholder={
                        regRole === 'patient'
                          ? 'Cardiology / Lipid Therapy'
                          : regRole === 'pharmacy_partner'
                          ? 'Apollo Dispensary Hub #412'
                          : 'Massachusetts General Hospital'
                      }
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">
                      {regRole === 'patient'
                        ? 'Preferred Retail Network'
                        : regRole === 'pharmacy_partner'
                        ? 'DEA / State Dispensary Reg #'
                        : 'Medical License / NPI Number'}
                    </label>
                    <input
                      type="text"
                      value={regLicense}
                      onChange={(e) => setRegLicense(e.target.value)}
                      placeholder={
                        regRole === 'patient'
                          ? 'Apollo 24/7 Home Delivery'
                          : regRole === 'pharmacy_partner'
                          ? 'DEA-AP84920-DL'
                          : 'NPI-1940283921'
                      }
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 8 chars"
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Confirm Password matching status */}
                {regConfirmPassword && (
                  <div className="text-[10px] font-mono">
                    {regPassword === regConfirmPassword ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}

                {/* Password strength meter */}
                {regPassword && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-[#64748b]">NIST 800-63B Entropy Strength:</span>
                      <span
                        className={
                          passwordStrength <= 1
                            ? 'text-red-400'
                            : passwordStrength <= 3
                            ? 'text-amber-400'
                            : 'text-emerald-400 font-bold'
                        }
                      >
                        {passwordStrength <= 1
                          ? 'Weak'
                          : passwordStrength <= 3
                          ? 'Moderate'
                          : 'Clinical-Grade Strong'}
                      </span>
                    </div>
                    <div className="w-full bg-[#1e293b] h-1 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 1 ? 'bg-red-500' : 'bg-transparent'
                        }`}
                      ></div>
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 2 ? 'bg-amber-500' : 'bg-transparent'
                        }`}
                      ></div>
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 3 ? 'bg-emerald-400' : 'bg-transparent'
                        }`}
                      ></div>
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 4 ? 'bg-cyan-400' : 'bg-transparent'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Statutory Checkboxes with Clickable Terms Modals */}
                <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2 text-[11px] text-[#cbd5e1]">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 accent-cyan-500 rounded"
                    />
                    <span>
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTermsModal(true);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
                      >
                        MediWise Terms of Service
                      </button>{' '}
                      and Bioequivalence Guidelines.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeHipaa}
                      onChange={(e) => setAgreeHipaa(e.target.checked)}
                      className="mt-0.5 accent-emerald-500 rounded"
                    />
                    <span>
                      I consent to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTermsModal(true);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                      >
                        HIPAA Business Associate Agreement (BAA)
                      </button>{' '}
                      and cryptographic audit logging.
                    </span>
                  </label>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms || !agreeHipaa}
                  className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold rounded flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Provisioning Identity Keys...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Create Verified Account ({ROLE_DETAILS[regRole].label})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =================================================== */}
          {/* MODE 3: TWO-FACTOR AUTHENTICATION (2FA) */}
          {/* =================================================== */}
          {mode === 'two_factor' && (
            <form onSubmit={handle2FASubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded text-cyan-200 space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">Two-Factor Authentication Required</span>
                </div>
                <p className="text-[11px] text-[#cbd5e1]">
                  Enter the 6-digit TOTP security token generated by your authenticator app (Google Authenticator, Duo, or 1Password) registered to{' '}
                  <strong className="text-white font-mono">{pendingUser?.email}</strong>.
                </p>
              </div>

              <div className="space-y-1 text-center py-2">
                <label className="text-xs font-semibold text-white block">6-Digit Security Token</label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-48 h-12 text-center font-mono text-2xl tracking-[0.5em] bg-[#090d16] border border-cyan-500/60 rounded text-white focus:ring-2 focus:ring-cyan-500 outline-none mx-auto block"
                />
                <span className="text-[10px] text-[#64748b] block pt-1">
                  Code expires in <strong className="text-cyan-400 font-mono">{twoFactorTimer}s</strong>
                </span>
              </div>

              {/* Hardware FIDO2 WebAuthn Option */}
              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-white font-semibold block text-[11px]">Hardware Token (YubiKey / Touch ID)</span>
                    <span className="text-[10px] text-[#64748b]">FIPS 140-2 Level 3 Key registered</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorCode('849201');
                  }}
                  className="h-7 px-2.5 bg-[#0d1424] border border-[#1e293b] hover:border-emerald-400 rounded text-[10px] font-semibold text-white transition-colors cursor-pointer"
                >
                  Simulate Touch
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex-1 h-9 bg-[#090d16] hover:bg-[#1e293b] text-[#cbd5e1] font-semibold rounded text-xs transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || twoFactorCode.length < 6}
                  className="flex-1 h-9 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  <span>Verify & Unlock</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================== */}
          {/* MODE 4: FORGOT PASSWORD / RECOVERY */}
          {/* =================================================== */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded text-amber-200 space-y-1">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">Cryptographic Password Recovery</span>
                </div>
                <p className="text-[11px] text-[#cbd5e1]">
                  {forgotStep === 1
                    ? 'Enter your verified account email or licensed NPI ID to receive an authenticated password reset challenge.'
                    : 'Enter the 6-digit challenge code sent to your registered inbox and configure a new password.'}
                </p>
              </div>

              {forgotStep === 1 ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white">Registered Email / NPI</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="dr.v.rao@mediwise.io"
                    className="w-full h-9 px-3 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">6-Digit Recovery Challenge Code</label>
                    <input
                      type="text"
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="e.g. 948201"
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white font-mono text-xs outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">New Master Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters with symbols"
                      className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white font-mono text-xs outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex-1 h-9 bg-[#090d16] hover:bg-[#1e293b] text-[#cbd5e1] font-semibold rounded text-xs transition-colors cursor-pointer"
                >
                  Return to Login
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-9 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {forgotStep === 1 ? 'Dispatch Challenge Link' : 'Set New Password & Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Google OAuth Account Picker & Consent Modal */}
      <GoogleOAuthModal
        isOpen={showGoogleModal}
        flow={googleFlow}
        initialRole={regRole}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={(googleUser) => {
          if (googleFlow === 'register') {
            onRegisterSuccess(googleUser);
          } else {
            onLoginSuccess(googleUser);
          }
          onClose();
        }}
      />

      {/* Terms & HIPAA BAA Agreement Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setAgreeTerms(true);
          setAgreeHipaa(true);
        }}
      />
    </div>
  );
};
