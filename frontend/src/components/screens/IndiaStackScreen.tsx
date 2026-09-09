import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  FileText,
  Link,
  Zap,
  Info,
  ExternalLink,
  Heart,
  Stethoscope,
  Store,
} from 'lucide-react';
import { ABHAProfile, UHIServiceProvider } from '../../types';
import { MOCK_ABHA_PROFILES, MOCK_UHI_PROVIDERS } from '../../data/mockPhase3Data';

interface IndiaStackScreenProps {
  currentUserName?: string;
}

type UHIServiceType = 'all' | 'pharmacy' | 'diagnostic' | 'teleconsult';

export const IndiaStackScreen: React.FC<IndiaStackScreenProps> = ({
  currentUserName = 'Om Patil',
}) => {
  const [selectedAbha, setSelectedAbha] = useState<ABHAProfile>(MOCK_ABHA_PROFILES[0]);
  const [abhaSearchInput, setAbhaSearchInput] = useState('');
  const [abhaVerified, setAbhaVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<UHIServiceType>('all');
  const [consentGiven, setConsentGiven] = useState<Record<string, boolean>>({});
  const [activeSubtab, setActiveSubtab] = useState<'abha' | 'uhi' | 'locker'>('abha');

  const filteredProviders = MOCK_UHI_PROVIDERS.filter(
    (p) => serviceFilter === 'all' || p.serviceType === serviceFilter
  );

  const handleVerifyAbha = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setAbhaVerified(true);
      setIsVerifying(false);
    }, 1600);
  };

  const handleToggleConsent = (providerId: string) => {
    setConsentGiven((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const serviceIcon = (type: UHIServiceProvider['serviceType']) => {
    if (type === 'pharmacy') return <Store className="w-4 h-4 text-cyan-400" />;
    if (type === 'diagnostic') return <Heart className="w-4 h-4 text-rose-400" />;
    return <Stethoscope className="w-4 h-4 text-violet-400" />;
  };

  const serviceColor = (type: UHIServiceProvider['serviceType']) => {
    if (type === 'pharmacy') return 'bg-cyan-950/30 border-cyan-800/40';
    if (type === 'diagnostic') return 'bg-rose-950/30 border-rose-800/40';
    return 'bg-violet-950/30 border-violet-800/40';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-orange-950/80 border border-orange-800 text-orange-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-2">
              India Stack Integration
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-300 border border-orange-800">
                Phase 3 · Sprint 3.2
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              ABDM Health ID verification, UHI service discovery, and Digital Health Locker integration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-950/30 border border-orange-800/40 rounded text-orange-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block"></span>
            ABDM Sandbox Connected
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/30 border border-emerald-800/40 rounded text-emerald-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            UHI Gateway Live
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#090d16] border border-[#1e293b] rounded-lg w-fit">
        {(['abha', 'uhi', 'locker'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubtab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeSubtab === tab
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            {tab === 'abha' ? 'ABHA Verification' : tab === 'uhi' ? 'UHI Discovery' : 'Health Locker'}
          </button>
        ))}
      </div>

      {/* ABHA TAB */}
      {activeSubtab === 'abha' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Left: Verify ABHA */}
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-4 space-y-3">
              <h2 className="text-xs font-bold text-white font-['Hanken_Grotesk'] uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-orange-400" /> Verify Ayushman Bharat Health Account (ABHA)
              </h2>
              <p className="text-[11px] text-[#94a3b8]">
                Enter the patient's 14-digit ABHA Number or @abdm address to verify identity against the national registry.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
                  <input
                    type="text"
                    value={abhaSearchInput}
                    onChange={(e) => setAbhaSearchInput(e.target.value)}
                    placeholder="91-XXXX-XXXX-XXXX or patient@abdm"
                    className="w-full h-9 pl-8 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-orange-500 outline-none font-mono"
                  />
                </div>
                <button
                  onClick={handleVerifyAbha}
                  disabled={isVerifying}
                  className="h-9 px-4 bg-orange-700 hover:bg-orange-600 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{isVerifying ? 'Verifying…' : 'Verify'}</span>
                </button>
              </div>

              {/* Demo profiles */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#64748b] uppercase font-bold">Demo Profiles:</span>
                {MOCK_ABHA_PROFILES.map((p) => (
                  <button
                    key={p.abhaId}
                    onClick={() => { setSelectedAbha(p); setAbhaVerified(true); }}
                    className={`w-full text-left p-2.5 rounded border text-xs transition-all cursor-pointer ${
                      selectedAbha.abhaId === p.abhaId
                        ? 'bg-orange-950/40 border-orange-700/60'
                        : 'bg-[#090d16] border-[#1e293b] hover:border-orange-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{p.fullName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${p.kycStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                        {p.kycStatus}
                      </span>
                    </div>
                    <span className="text-[10px] text-orange-400 font-mono">{p.abhaId}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: ABHA Profile Card */}
          {abhaVerified && (
            <div className="bg-[#0d1424] border border-orange-900/40 rounded-lg overflow-hidden">
              <div className="p-3.5 bg-gradient-to-r from-orange-950/60 to-[#0d1424] border-b border-orange-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-orange-950 border border-orange-700 text-orange-300 flex items-center justify-center font-bold text-sm">
                    {selectedAbha.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{selectedAbha.fullName}</div>
                    <div className="text-[10px] text-orange-400 font-mono">{selectedAbha.abhaAddress}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${selectedAbha.kycStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                  {selectedAbha.kycStatus}
                </span>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'ABHA ID', value: selectedAbha.abhaId },
                    { label: 'Gender', value: selectedAbha.gender === 'M' ? 'Male' : selectedAbha.gender === 'F' ? 'Female' : 'Other' },
                    { label: 'Date of Birth', value: selectedAbha.dateOfBirth },
                    { label: 'Mobile Verified', value: selectedAbha.mobileVerified ? '✓ Yes' : '✗ No' },
                    { label: 'Linked Records', value: `${selectedAbha.linkedRecordsCount} records` },
                    { label: 'KYC Status', value: selectedAbha.kycStatus },
                  ].map((f) => (
                    <div key={f.label} className="p-2 bg-[#090d16] rounded border border-[#1e293b]">
                      <span className="text-[10px] text-[#64748b] uppercase block">{f.label}</span>
                      <span className="font-mono text-white font-semibold">{f.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#1e293b]">
                  <button className="flex-1 h-8 bg-orange-700 hover:bg-orange-600 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <FileText className="w-3.5 h-3.5" /> Pull Health Records
                  </button>
                  <button className="flex-1 h-8 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <Link className="w-3.5 h-3.5 text-cyan-400" /> Link to Portal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UHI TAB */}
      {activeSubtab === 'uhi' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search providers near you…"
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#0d1424] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-orange-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-[#090d16] border border-[#1e293b] rounded">
              {(['all', 'pharmacy', 'diagnostic', 'teleconsult'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setServiceFilter(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer capitalize ${
                    serviceFilter === t ? 'bg-orange-700 text-white' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProviders.map((p) => (
              <div key={p.providerId} className={`p-4 rounded-lg border space-y-2.5 ${serviceColor(p.serviceType)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {serviceIcon(p.serviceType)}
                    <div>
                      <div className="text-xs font-bold text-white">{p.providerName}</div>
                      <div className="text-[10px] text-[#94a3b8] capitalize">{p.serviceType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-mono font-bold">{p.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1 text-[#94a3b8]">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{p.distanceKm.toFixed(1)} km away</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#94a3b8]">
                    <Clock className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>~{p.estimatedFulfillmentMins} min</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[#1e293b]">
                  <span className={`text-[11px] font-semibold ${p.availableStock ? 'text-emerald-400' : 'text-red-400'}`}>
                    {p.availableStock ? '● In Stock' : '○ Out of Stock'}
                  </span>
                  <button className="h-7 px-2.5 bg-orange-700 hover:bg-orange-600 text-white text-[11px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer">
                    Select <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOCKER TAB */}
      {activeSubtab === 'locker' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Health Locker — Patient Consent Required</span>
              <p className="mt-0.5 text-[11px] text-amber-200/80">
                Access to the patient's National Digital Health Locker requires explicit HIE consent via ABDM Health ID. The patient must authorize record sharing via OTP verification on their registered mobile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_ABHA_PROFILES.map((profile) => (
              <div key={profile.abhaId} className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-orange-950 border border-orange-700 text-orange-300 flex items-center justify-center font-bold text-sm">
                      {profile.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{profile.fullName}</div>
                      <div className="text-[10px] text-orange-400 font-mono">{profile.abhaAddress}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#94a3b8]">{profile.linkedRecordsCount} records</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  {['Prescription Records', 'Lab Reports', 'Discharge Summaries', 'Vaccination History'].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-2 bg-[#090d16] rounded border border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-[#64748b]" />
                        <span className="text-[#cbd5e1]">{doc}</span>
                      </div>
                      <button
                        onClick={() => handleToggleConsent(`${profile.abhaId}-${doc}`)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          consentGiven[`${profile.abhaId}-${doc}`]
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:border-orange-700'
                        }`}
                      >
                        {consentGiven[`${profile.abhaId}-${doc}`] ? 'Consented ✓' : 'Grant Consent'}
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full h-8 bg-orange-700/80 hover:bg-orange-700 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" /> Open Digital Health Locker
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
