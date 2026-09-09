import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, HeartHandshake, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { DrugItem } from '../../types';
import { generateSlipPdf } from '../../utils/generateSlipPdf';

interface DoctorSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: DrugItem | null;
}

export const DoctorSlipModal: React.FC<DoctorSlipModalProps> = ({
  isOpen,
  onClose,
  drug,
}) => {
  const [patientName, setPatientName] = useState('Jane Doe');
  const [physicianName, setPhysicianName] = useState('Dr. Sarah Jenkins, MD');
  const [copiedSlip, setCopiedSlip] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen || !drug) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // Small tick to allow UI to show loader
      setTimeout(() => {
        generateSlipPdf({
          drug,
          patientName,
          physicianName,
        });
        setIsGeneratingPdf(false);
      }, 250);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex justify-between items-start bg-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] leading-tight">
                Physician & Pharmacist Generic Substitution Consent Slip
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Statutory clinical bioequivalence certificate compliant with PRD §9 & CDSCO Rule 65
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

        {/* Printable Document Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-[#0b101d] text-xs print:bg-white print:text-black">
          {/* Slip Header Banner */}
          <div className="p-4 bg-[#090d16] border border-[#1e293b] rounded flex justify-between items-center print:border-black">
            <div>
              <div className="text-sm font-bold text-white font-['Hanken_Grotesk'] print:text-black">
                MEDIWAISE CLINICAL BIOEQUIVALENCE VERIFICATION
              </div>
              <div className="text-[10px] font-mono text-[#64748b] print:text-gray-600">
                Document Ref: MW-SUB-2026-0908 • Protocol ID: 21CFR-320
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50 print:bg-gray-200 print:text-black">
                FDA AB RATED
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#64748b] uppercase font-bold block mb-1">
                Patient Legal Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500 print:bg-white print:text-black print:border-gray-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#64748b] uppercase font-bold block mb-1">
                Attending Physician / Clinic
              </label>
              <input
                type="text"
                value={physicianName}
                onChange={(e) => setPhysicianName(e.target.value)}
                className="w-full h-8 px-2.5 bg-[#090d16] border border-[#1e293b] rounded text-white text-xs outline-none focus:border-cyan-500 print:bg-white print:text-black print:border-gray-400"
              />
            </div>
          </div>

          {/* Clinical Substitution Table */}
          <div className="p-3.5 bg-[#090d16] border border-[#1e293b] rounded space-y-2 print:border-gray-400">
            <div className="grid grid-cols-2 gap-3 border-b border-[#1e293b] pb-2 print:border-gray-300">
              <div>
                <span className="text-[10px] text-[#64748b] uppercase block">Prescribed Medication</span>
                <span className="font-bold text-white text-sm print:text-black">{drug.brandName}</span>
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-600">NDC: {drug.brandNdc}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] uppercase block">Proposed Bioequivalent Generic</span>
                <span className="font-bold text-cyan-300 text-sm print:text-black">{drug.activeSalt} ({drug.strength})</span>
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-600">ATC: {drug.atcCode}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div>
                <span className="text-[#64748b] block text-[9px]">Cmax Bio-Parity</span>
                <span className="font-bold text-emerald-400 print:text-black">{drug.cmaxParity}% (90% CI pass)</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px]">AUC Bio-Parity</span>
                <span className="font-bold text-cyan-300 print:text-black">{drug.aucParity}% (Exposure match)</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px]">Dissolution Monograph</span>
                <span className="font-bold text-white print:text-black">USP &gt;85% @ 30m</span>
              </div>
            </div>
          </div>

          {/* Statutory Doctor Consent Clause */}
          <div className="p-3 bg-[#090d16] rounded border border-amber-900/30 text-[11px] text-[#94a3b8] space-y-1.5 print:border-gray-400 print:text-gray-800">
            <span className="font-bold text-white print:text-black block">
              Physician Attestation & Pharmacist Authorization:
            </span>
            <p className="leading-relaxed">
              "I confirm that substituting the prescribed medication with the chemically bioequivalent generic formulation ({drug.activeSalt}) is therapeutically acceptable for this patient, and meets pharmacokinetic equivalence standards."
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 font-mono text-[10px] text-[#64748b] print:text-black">
              <div className="border-t border-dashed border-[#334155] pt-1">
                Doctor Signature: _______________________
              </div>
              <div className="border-t border-dashed border-[#334155] pt-1">
                License Reg #: ___________________ Date: ________
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#090d16] border-t border-[#1e293b] flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold text-[#cbd5e1] hover:text-white rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="h-8 px-3.5 bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="h-8 px-4 bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#075985] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Slip</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
