import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] bg-[#090d16] flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                MediWise Enterprise Terms & HIPAA Business Associate Agreement (BAA)
              </h3>
              <p className="text-[11px] text-[#94a3b8]">
                Statutory Compliance Revision: 2026.3 • 45 CFR Parts 160 & 164
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

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-[#cbd5e1] leading-relaxed">
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded text-cyan-200 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">ePHI Cryptographic Protection:</span> All electronic protected health information (ePHI) ingested into MediWise is encrypted at rest using FIPS 140-2 validated AES-256-GCM and in transit with TLS 1.3.
            </div>
          </div>

          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              1. Authorized Identity & Verification
            </h4>
            <p className="text-[#94a3b8]">
              Users registering under Clinician or Pharmacy Partner credentials warrant that their National Provider Identifier (NPI), DEA license number, and state pharmaceutical board registration are active and in good standing. Misrepresentation of clinical credentials constitutes a federal regulatory violation under 42 U.S. Code § 1320a-7b.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              2. HIPAA Business Associate Attestation
            </h4>
            <p className="text-[#94a3b8]">
              MediWise operates as a certified Business Associate under the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the Health Information Technology for Economic and Clinical Health (HITECH) Act. MediWise will implement administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of ePHI.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              3. Generic Equivalence & Doctor Slips
            </h4>
            <p className="text-[#94a3b8]">
              Equivalence ratings (FDA Orange Book AB/AP/BX codes) provided by MediWise are derived from verified pharmacopeial datasets. Doctor Slips generated via the platform serve as informational clinical transition aids and do not supersede clinical judgment or formal prescription issuance by licensed medical practitioners.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              4. CPA Commission & Pharmacy Partner Escrow
            </h4>
            <p className="text-[#94a3b8]">
              All Cost-Per-Acquisition (CPA) payouts, referral credits, and pharmacy fulfillment commissions are logged to the immutable audit ledger. Partner payouts are escrow-verified in compliance with the federal Anti-Kickback Statute (AKS) statutory safe harbor provisions.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              5. Audit Logging & Non-Repudiation
            </h4>
            <p className="text-[#94a3b8]">
              Every session login, Google OAuth verification, record modification, and configuration deployment produces a SHA-256 hash stored in an append-only cryptographic event bus for regulatory compliance inspections.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#1e293b] bg-[#090d16] flex justify-between items-center">
          <div className="text-[11px] text-[#64748b] font-mono">
            Document ID: MEDI-BAA-2026-REV3
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3.5 text-xs text-[#94a3b8] hover:text-white bg-[#1e293b] hover:bg-[#334155] rounded font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
            {onAccept && (
              <button
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="h-8 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept Terms & BAA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
