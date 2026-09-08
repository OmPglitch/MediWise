import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Fingerprint,
  RefreshCw,
  Stethoscope,
  Store,
  Shield,
  Heart,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Database,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { AuthMode, UserProfile, UserRole, ThemeMode } from '../../types';
import { DEMO_USERS, ROLE_DETAILS } from '../../data/mockUsers';
import { GoogleOAuthModal, GoogleIcon } from '../modals/GoogleOAuthModal';
import { TermsModal } from '../modals/TermsModal';

interface AuthScreenProps {
  initialMode?: AuthMode;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (newUser: UserProfile) => void;
  onContinueAsGuest?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onRegisterSuccess,
  onContinueAsGuest,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleFlow, setGoogleFlow] = useState<'login' | 'register'>('login');
  const [showTermsModal, setShowTermsModal] = useState(false);

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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeHipaa, setAgreeHipaa] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
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
      const matched = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
      ) || DEMO_USERS.cmio;

      if (matched.twoFactorEnabled) {
        setPendingUser(matched);
        setMode('two_factor');
      } else {
        onLoginSuccess(matched);
      }
    }, 500);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(pendingUser);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }
    if (!agreeTerms || !agreeHipaa) {
      setLoginError('Please accept terms and HIPAA compliance agreement.');
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
            ? 'Attending Clinical Pharmacologist'
            : regRole === 'pharmacy_partner'
            ? 'Pharmacy Network Dispenser'
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
    }, 600);
  };

  const passwordStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex flex-col justify-between select-none">
      {/* Top Banner Bar */}
      <header className="h-14 bg-[#0d1424] border-b border-[#1e293b] px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-white text-sm font-['Hanken_Grotesk'] leading-tight block">
              MediWise Operations
            </span>
            <span className="text-[10px] text-[#94a3b8] font-mono leading-none">
              Enterprise Clinical Mesh & Identity
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-[#1e293b] font-mono text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM HEALTHY 99.98%</span>
          </span>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-[#94a3b8] hover:text-white rounded bg-[#090d16] hover:bg-[#1e293b] border border-[#1e293b] transition-all cursor-pointer flex items-center justify-center relative group"
              title={theme === 'dark' ? 'Switch to Sterile Light Mode' : 'Switch to Clinical Dark Mode'}
              aria-label="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              className="px-3 py-1.5 rounded bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] hover:text-white font-semibold transition-colors cursor-pointer text-xs"
            >
              Explore Console as Guest
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Platform Authority & Clinical Badges */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Unified Clinical Governance & CPA Mesh</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white font-['Hanken_Grotesk'] tracking-tight leading-tight">
                Secure Access to the <span className="text-cyan-400">Generic Drug Discovery</span> & Verification Mesh
              </h1>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                MediWise connects verified clinicians, dispensing pharmacies, and regulatory auditors with 18,900+ bioequivalence profiles and cryptographic settlement ledgers.
              </p>
            </div>

            {/* Architecture Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase font-['Hanken_Grotesk']">18,924 Generics</span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">FDA Orange Book & CDSCO bioequivalence parity maps</p>
              </div>

              <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <FileCheck2 className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase font-['Hanken_Grotesk']">HIPAA §164.312</span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">Immutable SHA-256 Merkle chain audit logging</p>
              </div>

              <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Store className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase font-['Hanken_Grotesk']">142 Dispensaries</span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">Live Kafka & FHIR REST stock feeds with CPA escrow</p>
              </div>

              <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase font-['Hanken_Grotesk']">FIPS 140-2</span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">Hardware Security Module (HSM) key rotation</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Auth Portal Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#0d1424] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden">
              {/* Card Tabs */}
              {(mode === 'login' || mode === 'register') && (
                <div className="flex border-b border-[#1e293b] bg-[#0b101d]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLoginError(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                      mode === 'login'
                        ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLoginError(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                      mode === 'register'
                        ? 'text-white border-b-2 border-cyan-400 bg-[#0d1424]'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Create Account</span>
                  </button>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Global Error Banner */}
                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/50 rounded flex items-center gap-2 text-xs text-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* LOGIN FORM */}
                {mode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    {/* Primary Google Sign In Button */}
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
                        or sign in with password
                      </span>
                      <div className="flex-grow border-t border-[#1e293b]"></div>
                    </div>

                    {/* Demo 1-Click Role Fill */}
                    <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-[#94a3b8] uppercase font-['Hanken_Grotesk']">
                          Instant Demo Sign-In:
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">1-Click Test Personas</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickFill('cmio')}
                          className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-cyan-500/50 transition-all cursor-pointer"
                        >
                          <div className="font-semibold text-white truncate text-[11px]">Dr. Vikram Rao, MD</div>
                          <div className="text-[9px] text-cyan-300 font-mono">CMIO / Clinical Lead</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill('pharmacy_partner')}
                          className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-blue-500/50 transition-all cursor-pointer"
                        >
                          <div className="font-semibold text-white truncate text-[11px]">Priya Sharma, RPh</div>
                          <div className="text-[9px] text-blue-300 font-mono">Apollo Retail Admin</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill('compliance_officer')}
                          className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-purple-500/50 transition-all cursor-pointer"
                        >
                          <div className="font-semibold text-white truncate text-[11px]">Elena Vance, CISA</div>
                          <div className="text-[9px] text-purple-300 font-mono">Regulatory Auditor</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill('patient')}
                          className="p-1.5 text-left rounded bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] hover:border-emerald-500/50 transition-all cursor-pointer"
                        >
                          <div className="font-semibold text-white truncate text-[11px]">Jane Doe</div>
                          <div className="text-[9px] text-emerald-300 font-mono">Prescription Patient</div>
                        </button>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-white font-['Hanken_Grotesk']">
                        Clinical Email / Work ID
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="name@hospital.org"
                          className="w-full h-9 pl-9 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-semibold text-white font-['Hanken_Grotesk']">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot_password');
                            setForgotEmail(loginEmail);
                          }}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
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

                    {/* Remember Session */}
                    <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="accent-cyan-500 rounded"
                        />
                        <span>Remember workstation session</span>
                      </label>
                      <span className="font-mono text-[#64748b]">FIPS 140-2 Validated</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold rounded flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Verifying Identity...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Sign In to MediWise</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* REGISTER FORM */}
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
                        or register with credentials
                      </span>
                      <div className="flex-grow border-t border-[#1e293b]"></div>
                    </div>

                    {/* Persona Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white uppercase font-['Hanken_Grotesk']">
                        Account Type:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRegRole('patient')}
                          className={`p-2 rounded border text-left cursor-pointer transition-all ${
                            regRole === 'patient'
                              ? 'bg-emerald-950/40 border-emerald-500 text-white'
                              : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8]'
                          }`}
                        >
                          <div className="font-semibold text-white text-[11px]">Patient / Consumer</div>
                          <div className="text-[9px] text-[#64748b]">Prescription savings</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegRole('pharmacy_partner')}
                          className={`p-2 rounded border text-left cursor-pointer transition-all ${
                            regRole === 'pharmacy_partner'
                              ? 'bg-blue-950/40 border-blue-500 text-white'
                              : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8]'
                          }`}
                        >
                          <div className="font-semibold text-white text-[11px]">Pharmacy Partner</div>
                          <div className="text-[9px] text-[#64748b]">Inventory feed & CPA</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegRole('cmio')}
                          className={`p-2 rounded border text-left cursor-pointer transition-all ${
                            regRole === 'cmio'
                              ? 'bg-cyan-950/40 border-cyan-500 text-white'
                              : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8]'
                          }`}
                        >
                          <div className="font-semibold text-white text-[11px]">Physician / Clinician</div>
                          <div className="text-[9px] text-[#64748b]">Bioequivalence approval</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegRole('compliance_officer')}
                          className={`p-2 rounded border text-left cursor-pointer transition-all ${
                            regRole === 'compliance_officer'
                              ? 'bg-purple-950/40 border-purple-500 text-white'
                              : 'bg-[#090d16] border-[#1e293b] text-[#94a3b8]'
                          }`}
                        >
                          <div className="font-semibold text-white text-[11px]">Compliance Auditor</div>
                          <div className="text-[9px] text-[#64748b]">HIPAA Merkle log review</div>
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Dr. Alex Mercer"
                          className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white">Work Email</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="alex@healthsystem.org"
                          className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white">Organization / Hospital</label>
                        <input
                          type="text"
                          value={regOrg}
                          onChange={(e) => setRegOrg(e.target.value)}
                          placeholder="Health System Name"
                          className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white">License / NPI Number</label>
                        <input
                          type="text"
                          value={regLicense}
                          onChange={(e) => setRegLicense(e.target.value)}
                          placeholder="NPI-1940283921"
                          className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Password Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white">Password</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 8 chars"
                          className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white">Confirm</label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repeat"
                          className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs font-mono outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Password match feedback */}
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

                    {/* Password strength */}
                    {regPassword && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[#64748b]">Entropy Score:</span>
                          <span className={passwordStrength >= 3 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {passwordStrength >= 3 ? 'Clinical Grade Strong' : 'Moderate'}
                          </span>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 ${passwordStrength >= 2 ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 ${passwordStrength >= 3 ? 'bg-emerald-400' : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 ${passwordStrength >= 4 ? 'bg-cyan-400' : 'bg-transparent'}`}></div>
                        </div>
                      </div>
                    )}

                    {/* Checkboxes with Clickable Terms Modal */}
                    <div className="p-2.5 bg-[#090d16] border border-[#1e293b] rounded space-y-1.5 text-[11px] text-[#cbd5e1]">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 accent-cyan-500 rounded"
                        />
                        <span>
                          I accept the{' '}
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
                          & Bioequivalence guidelines.
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
                          </button>.
                        </span>
                      </label>
                    </div>

                    {/* Submit Register */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !agreeTerms || !agreeHipaa}
                      className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Creating Identity...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Register & Authenticate</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* 2FA MODE */}
                {mode === 'two_factor' && (
                  <form onSubmit={handle2FASubmit} className="space-y-4 text-xs">
                    <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded text-cyan-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white">2-Factor Authentication Challenge</span>
                      </div>
                      <p className="text-[11px] text-[#cbd5e1]">
                        Please enter the 6-digit TOTP security code from your registered device for{' '}
                        <span className="font-mono text-white">{pendingUser?.email}</span>.
                      </p>
                    </div>

                    <div className="text-center py-2 space-y-2">
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-44 h-11 text-center font-mono text-2xl tracking-[0.5em] bg-[#090d16] border border-cyan-500/60 rounded text-white focus:ring-2 focus:ring-cyan-500 outline-none mx-auto block"
                      />
                      <span className="text-[10px] text-[#64748b] block">
                        Expires in <span className="text-cyan-400 font-mono">{twoFactorTimer}s</span>
                      </span>
                    </div>

                    {/* Hardware Key Simulator */}
                    <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-[11px] font-medium">YubiKey / WebAuthn Sensor</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTwoFactorCode('849201')}
                        className="h-6 px-2 bg-[#0d1424] border border-[#1e293b] hover:border-emerald-400 rounded text-[10px] text-white"
                      >
                        Touch Key
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="flex-1 h-9 bg-[#090d16] hover:bg-[#1e293b] text-[#cbd5e1] font-semibold rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || twoFactorCode.length < 6}
                        className="flex-1 h-9 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-semibold rounded text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Authorize Access</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* FORGOT PASSWORD */}
                {mode === 'forgot_password' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded text-amber-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">Password Reset Challenge</span>
                      </div>
                      <p className="text-[11px] text-[#cbd5e1]">
                        Enter your registered clinical email to receive a cryptographically signed recovery token.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-white">Account Email</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="dr.v.rao@mediwise.io"
                        className="w-full h-9 px-3 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="flex-1 h-9 bg-[#090d16] hover:bg-[#1e293b] text-[#cbd5e1] font-semibold rounded text-xs"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setLoginEmail(forgotEmail);
                        }}
                        className="flex-1 h-9 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs"
                      >
                        Send Reset Token
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-[#0d1424] border-t border-[#1e293b] px-6 flex items-center justify-between text-[11px] text-[#64748b] font-mono">
        <div>MediWise Enterprise Clinical Mesh • v1.0.4 FIPS 140-2 Validated</div>
        <div>SOC2 Type II • HIPAA §164.312 Compliant</div>
      </footer>

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
