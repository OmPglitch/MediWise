import React, { useState, useRef } from 'react';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  BookmarkPlus,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Store,
  IndianRupee,
  TrendingDown,
  Info,
  Clock,
  ArrowLeft,
  Truck,
  MapPin,
  ThermometerSnowflake,
  LogOut,
  Package,
  Check,
  Sun,
  Moon,
  Upload,
  Camera,
  Loader2,
  FileCheck,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { DrugItem, UserProfile, ThemeMode, RxScanState, RxScanResult } from '../../types';

interface PatientPortalScreenProps {
  drugs: DrugItem[];
  onBackToConsole: () => void;
  onOpenDoctorSlip: (drug: DrugItem) => void;
  savedRefills: string[];
  onToggleRefill: (drugId: string) => void;
  onOpenOrderModal: (drug: DrugItem) => void;
  onViewDeliveries: () => void;
  activeOrdersCount?: number;
  onSignOut?: () => void;
  currentUser?: UserProfile | null;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  rxScanState?: RxScanState;
  onScanPrescription?: (file: File) => Promise<void>;
  onResetScan?: () => void;
}

export const PatientPortalScreen: React.FC<PatientPortalScreenProps> = ({
  drugs,
  onBackToConsole,
  onOpenDoctorSlip,
  savedRefills,
  onToggleRefill,
  onOpenOrderModal,
  onViewDeliveries,
  activeOrdersCount = 1,
  onSignOut,
  currentUser,
  theme = 'dark',
  onToggleTheme,
  rxScanState,
  onScanPrescription,
  onResetScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('Lipitor');
  const [selectedDrug, setSelectedDrug] = useState<DrugItem>(drugs[0]);
  const [showClinicalAccordion, setShowClinicalAccordion] = useState(true);
  const [selectedPharmacyFilter, setSelectedPharmacyFilter] = useState<'all' | 'lowest' | 'fastest'>('all');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = (name: string) => {
    setSearchQuery(name);
    const found = drugs.find(
      (d) =>
        d.brandName.toLowerCase().includes(name.toLowerCase()) ||
        d.activeSalt.toLowerCase().includes(name.toLowerCase())
    );
    if (found) {
      setSelectedDrug(found);
    }
  };

  const isSaved = savedRefills.includes(selectedDrug.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back button & Portal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToConsole}
            className="h-8 px-2.5 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Ops Console</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white font-['Hanken_Grotesk'] leading-tight flex items-center gap-2">
              <span>Customer Medicine Price & Bioequivalence Portal</span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              Verify active salt equivalence, compare retail partner pricing, and track live prescription deliveries
            </p>
          </div>
        </div>

        {/* Deliveries, Refill Badge & Sign Out */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onViewDeliveries}
            className="h-8 px-3 bg-gradient-to-r from-cyan-900/60 to-cyan-800/40 hover:from-cyan-800/60 hover:to-cyan-700/50 border border-cyan-500/50 text-cyan-200 text-xs font-bold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span>My Orders & Delivery Track</span>
            <span className="px-1.5 py-0.2 bg-cyan-500 text-black text-[10px] font-mono font-extrabold rounded-full">
              {activeOrdersCount}
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d1424] border border-[#1e293b]">
            <span className="text-xs text-[#94a3b8]">Refills:</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-xs font-mono font-bold">
              {savedRefills.length}
            </span>
          </div>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="h-8 px-2.5 bg-[#0d1424] hover:bg-[#1e293b] border border-[#1e293b] text-[#cbd5e1] hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Sterile Light Mode' : 'Switch to Clinical Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="h-8 px-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out and revoke active tokens"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Amazon-Style Delivery & Location Strip */}
      <div className="bg-gradient-to-r from-[#0d1424] via-[#091322] to-[#0d1424] border border-cyan-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#94a3b8]">Deliver to:</span>
              <span className="font-bold text-white font-['Hanken_Grotesk']">
                {currentUser?.name || 'Om Patil'} - San Jose, CA 95128
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" />
              <span>FREE Prime Medical Delivery • <strong>Arrives Tomorrow, Sep 9 by 2:00 PM</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1e293b]">
          <div className="text-[11px] text-[#94a3b8] font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Order within <strong className="text-white">2h 45m</strong> for same-day dispatch</span>
          </div>
          <button
            onClick={() => onOpenOrderModal(selectedDrug)}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs transition-colors cursor-pointer shadow"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* SPRINT 2.1 — GEMINI RX PRESCRIPTION SCANNER */}
      <div className="bg-[#0d1424] border border-cyan-500/40 rounded-xl p-5 shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-2">
                <span>AI Prescription Scanner & Generic Switcher</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Gemini 2.5 Flash
                </span>
              </h2>
              <p className="text-[11px] text-[#94a3b8]">
                Upload a handwritten doctor's slip or printed Rx to instantly extract the prescribed salt and identify savings
              </p>
            </div>
          </div>
          {rxScanState?.result && (
            <button
              onClick={onResetScan}
              className="h-7 px-2.5 bg-[#1e293b] hover:bg-[#334155] text-white text-xs rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Scan Another Rx</span>
            </button>
          )}
        </div>

        {/* Scanner Body */}
        {rxScanState?.isScanning ? (
          <div className="p-8 border border-cyan-500/30 rounded-lg bg-[#090d16] flex flex-col items-center justify-center space-y-3 text-center animate-pulse">
            <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500 flex items-center justify-center text-cyan-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Gemini Vision Analyzing Prescription...</h3>
              <p className="text-xs text-[#94a3b8] max-w-md">
                De-identifying clinical metadata, transcribing prescriber calligraphy, and cross-matching with Jan Aushadhi bioequivalence monographs.
              </p>
            </div>
          </div>
        ) : rxScanState?.result ? (
          <div className="p-4 bg-[#090d16] border border-emerald-500/30 rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{(rxScanState.result.confidence * 100).toFixed(0)}% Confidence Match</span>
                </span>
                {rxScanState.result.scheduleFlag !== 'none' && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    Schedule {rxScanState.result.scheduleFlag}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#64748b]">Prescriber: <strong className="text-white">{rxScanState.result.physicianName}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded">
                <span className="text-[10px] text-[#64748b] uppercase block">Prescribed Medication</span>
                <div className="text-sm font-bold text-white font-['Hanken_Grotesk'] mt-0.5">
                  {rxScanState.result.drugName}
                </div>
                <div className="text-xs text-[#94a3b8] mt-1 font-mono">
                  {rxScanState.result.dosage} • {rxScanState.result.strength}
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-[#0d1424] border border-emerald-500/40 rounded">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Recommended Generic Equivalent
                </span>
                <div className="text-sm font-bold text-emerald-300 font-['Hanken_Grotesk'] mt-0.5">
                  {rxScanState.result.matchedDrugName || 'Atorvastatin Calcium Generic'}
                </div>
                <div className="text-xs text-emerald-400/80 mt-1">
                  FDA AB Rated • Chemical Bioequivalence Confirmed
                </div>
              </div>
            </div>

            {rxScanState.result.warnings.length > 0 && (
              <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded text-[11px] text-amber-300 space-y-1">
                {rxScanState.result.warnings.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
              <button
                onClick={() => {
                  const matched = drugs.find((d) => d.id === rxScanState.result?.matchedDrugId) || drugs[0];
                  setSelectedDrug(matched);
                  onOpenDoctorSlip(matched);
                }}
                className="h-8 px-3 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Doctor Consent Slip</span>
              </button>
              <button
                onClick={() => {
                  const matched = drugs.find((d) => d.id === rxScanState.result?.matchedDrugId) || drugs[0];
                  setSelectedDrug(matched);
                  onOpenOrderModal(matched);
                }}
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Order This Generic for Delivery</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onScanPrescription?.(e.dataTransfer.files[0]);
              }
            }}
            className={`p-6 border-2 border-dashed rounded-lg transition-colors flex flex-col items-center justify-center text-center gap-3 cursor-pointer ${
              isDraggingFile
                ? 'border-cyan-400 bg-cyan-950/30'
                : 'border-[#1e293b] hover:border-cyan-500/50 bg-[#090d16]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onScanPrescription?.(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">
                Drag & drop your prescription image here, or <span className="text-cyan-400 underline">browse files</span>
              </div>
              <p className="text-xs text-[#64748b]">
                Supports JPG, PNG, WebP or photographed doctor slips (Max 15MB)
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Create a simulated file to trigger the demo analysis
                  const blob = new Blob(['sample-prescription'], { type: 'image/jpeg' });
                  const demoFile = new File([blob], 'rx-demo-lipitor.jpg', { type: 'image/jpeg' });
                  onScanPrescription?.(demoFile);
                }}
                className="h-7 px-3 bg-[#1e293b] hover:bg-cyan-950 hover:border-cyan-600 border border-[#334155] text-cyan-300 text-xs rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Demo Prescription (Instant Scan)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Search Bar & Quick Selector */}
      <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3 shadow-md">
        <label className="text-xs font-bold text-white font-['Hanken_Grotesk'] uppercase tracking-wider block">
          Search Prescribed Medicine or Active Chemical Salt
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search branded medication (e.g. Lipitor, Januvia, Nexium, Augmentin, Glucophage)..."
            className="w-full h-10 pl-9 pr-4 text-sm bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-[#0284c7] outline-none"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-[#64748b]">Popular Prescriptions:</span>
          {drugs.map((drug) => (
            <button
              key={drug.id}
              onClick={() => {
                setSearchQuery(drug.brandName.split(' ')[0]);
                setSelectedDrug(drug);
              }}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                selectedDrug.id === drug.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold'
                  : 'bg-[#090d16] border border-[#1e293b] text-[#cbd5e1] hover:text-white'
              }`}
            >
              {drug.brandName}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Clinical Regulatory Notice Banner (PRD §9 FR-DISC-01) */}
      <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white font-mono text-[11px] block">
            MANDATORY CLINICAL & REGULATORY NOTICE (PRD §9 FR-DISC-01):
          </span>
          <p className="text-[#cbd5e1] leading-relaxed">
            Consult a qualified physician or registered pharmacist before replacing any prescribed medicine. Generic substitutes contain identical active pharmaceutical ingredients (APIs) and demonstrate bioequivalence, but medical conditions may require physician consent.
          </p>
        </div>
      </div>

      {/* Baseline Prescribed Medication vs Potential Savings Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Prescribed Branded Medicine Baseline */}
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono text-[#94a3b8] uppercase tracking-wider bg-[#090d16] px-2 py-0.5 rounded border border-[#1e293b]">
              CURRENT PRESCRIBED BRAND
            </span>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-1.5 py-0.2 rounded border border-red-800/40">
              High Disparity
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white font-['Hanken_Grotesk']">
              {selectedDrug.brandName}
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">{selectedDrug.brandManufacturer}</p>
          </div>

          <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748b]">Active Ingredient:</span>
              <span className="font-medium text-white">{selectedDrug.activeSalt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Strength & Form:</span>
              <span className="font-medium text-white">{selectedDrug.dosageForm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">NDC Code:</span>
              <span className="font-mono text-white">{selectedDrug.brandNdc}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e293b] flex justify-between items-baseline">
            <span className="text-xs text-[#94a3b8]">Branded Retail Cost:</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-white font-mono">
                ₹{selectedDrug.brandPrice.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#64748b] block font-mono">
                (₹{ (selectedDrug.brandPrice / 30).toFixed(2) } / tablet)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Potential Monthly Savings Highlight */}
        <div className="bg-[#0d1424] border border-emerald-900/60 rounded p-4 flex flex-col justify-between space-y-3 bg-gradient-to-br from-[#0d1424] to-emerald-950/30">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono text-emerald-300 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              VERIFIED POTENTIAL SAVINGS
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {selectedDrug.savingsPercent}% REDUCTION
            </span>
          </div>

          <div className="my-auto py-2">
            <div className="text-3xl lg:text-4xl font-extrabold text-emerald-400 font-mono">
              Save ₹{selectedDrug.savingsAmount.toFixed(2)}
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Projected Annualized Savings: <strong className="text-white font-mono">₹{(selectedDrug.savingsAmount * 12).toFixed(2)} / year</strong>
            </p>
          </div>

          <div className="p-3 bg-[#090d16]/80 rounded border border-emerald-900/40 text-xs text-[#cbd5e1] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bioequivalent Therapeutic Equivalence (AB Standard)</span>
            </div>
            <p className="text-[11px] text-[#94a3b8]">
              Active molecular salt binds to identical biological receptor targets with matching therapeutic efficacy.
            </p>
          </div>
        </div>
      </div>

      {/* Bioequivalent Generic Comparison Card */}
      <div className="bg-[#0d1424] border border-[#1e293b] rounded p-5 space-y-5 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#1e293b]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-['Hanken_Grotesk']">
                Top Bioequivalent Generic Recommendation
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                FDA AB Parity: {selectedDrug.parityPercent}%
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Identical active salt • Verified dissolution profile • Available across accredited pharmacy networks
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              ₹{selectedDrug.genericPriceAvg.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#64748b] block font-mono">
              30 Day Refill (₹{ (selectedDrug.genericPriceAvg / 30).toFixed(2) } / day)
            </span>
          </div>
        </div>

        {/* Live Partner Pharmacy Prices Table */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white font-['Hanken_Grotesk'] uppercase tracking-wider block">
              Accredited Partner Dispensary Pricing & Delivery Options
            </span>
            <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> All partner deliveries trackable via GPS & IoT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedDrug.partnerOffers.map((offer) => (
              <div
                key={offer.partnerName}
                className="p-3 bg-[#090d16] rounded-lg border border-[#1e293b] hover:border-cyan-500/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-white text-xs">{offer.partnerName}</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{offer.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                      {offer.savingsRate}% OFF
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">In-Stock</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e293b] mt-2 flex justify-between items-center">
                  <span className="text-[10px] text-[#cbd5e1] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{offer.delivery}</span>
                  </span>
                  <button
                    onClick={() => onOpenOrderModal(selectedDrug)}
                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/60 text-[11px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Order</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amazon-style Guaranteed Delivery Promise Badge */}
        <div className="p-3 bg-[#090d16] border border-cyan-900/40 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#cbd5e1]">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Guaranteed Cold-Chain Dispatch:</strong> Shipped with IoT thermal logger (2°C–8°C range) & tamper-evident FIPS-140 seal.
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono font-bold shrink-0">
            ✓ Eligible for Free Prime Same-Day
          </div>
        </div>

        {/* Action Buttons: Order Now, Doctor Slip & Refill List */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t border-[#1e293b]">
          <button
            onClick={() => onOpenOrderModal(selectedDrug)}
            className="flex-1 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Order Generic Now (Free Delivery Tomorrow by 2 PM)</span>
          </button>

          <button
            onClick={() => onOpenDoctorSlip(selectedDrug)}
            className="h-10 px-4 bg-[#090d16] border border-cyan-600/50 hover:bg-cyan-950/40 text-cyan-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Doctor Slip (PDF)</span>
          </button>

          <button
            onClick={() => onToggleRefill(selectedDrug.id)}
            className={`h-10 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 ${
              isSaved
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>In Monthly Refill List</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Save to Refill List</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clinical Bioequivalence Deep Dive Accordion */}
      <div className="bg-[#0d1424] border border-[#1e293b] rounded overflow-hidden shadow-sm">
        <button
          onClick={() => setShowClinicalAccordion(!showClinicalAccordion)}
          className="w-full p-4 flex justify-between items-center text-left hover:bg-[#1e293b]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold text-white text-sm font-['Hanken_Grotesk']">
                Clinical Bioequivalence & Pharmacokinetic Deep Dive
              </span>
              <span className="text-xs text-[#94a3b8] block">
                Evidence supporting safety, bio-parity, and FDA AB rating
              </span>
            </div>
          </div>
          {showClinicalAccordion ? (
            <ChevronUp className="w-4 h-4 text-[#64748b]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748b]" />
          )}
        </button>

        {showClinicalAccordion && (
          <div className="p-4 pt-0 border-t border-[#1e293b] space-y-3 text-xs bg-[#090d16]/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold block">
                  1. Peak Plasma Concentration (Cmax)
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {selectedDrug.cmaxParity}% Parity
                </span>
                <p className="text-[11px] text-[#94a3b8]">
                  90% Confidence Interval within the FDA 80–125% acceptance interval for rate of absorption.
                </p>
              </div>

              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold block">
                  2. Area Under Curve (AUC 0-inf)
                </span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {selectedDrug.aucParity}% Parity
                </span>
                <p className="text-[11px] text-[#94a3b8]">
                  Total extent of systemic exposure matches branded reference with 99.3% statistical correlation.
                </p>
              </div>

              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold block">
                  3. In-Vitro Dissolution Kinetics
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {selectedDrug.dissolutionStatus}
                </span>
                <p className="text-[11px] text-[#94a3b8]">
                  Meets USP monograph criteria in 0.1N HCl pH 1.2 buffer representing gastric condition.
                </p>
              </div>

              <div className="p-3 bg-[#090d16] rounded border border-[#1e293b] space-y-1">
                <span className="text-[10px] text-[#64748b] uppercase font-bold block">
                  4. Regulatory Clearance Authority
                </span>
                <span className="text-sm font-semibold text-white">
                  FDA AB Therapeutic Equivalence
                </span>
                <p className="text-[11px] text-[#94a3b8]">
                  Clearance signed off by {selectedDrug.clinicalSignOff.doctor} ({selectedDrug.clinicalSignOff.role}).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
