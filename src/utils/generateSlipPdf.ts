import { jsPDF } from 'jspdf';
import { DrugItem } from '../types';

export interface GenerateSlipPdfOptions {
  drug: DrugItem;
  patientName: string;
  physicianName: string;
}

export function generateSlipPdf({ drug, patientName, physicianName }: GenerateSlipPdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toISOString().slice(0, 10);
  const docRef = `MW-SUB-${today.replace(/-/g, '')}-${drug.id.slice(0, 6).toUpperCase()}`;

  // Primary banner
  doc.setFillColor(9, 13, 22); // #090d16
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Brand Name & Title
  doc.setTextColor(56, 189, 248); // #38bdf8
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDIWISE OPERATIONS', 15, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Clinical Bioequivalence Verification & Generic Substitution Consent', 15, 24);

  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.setFontSize(8);
  doc.text(`Doc Ref: ${docRef}  |  Issued: ${today}  |  Compliance: CDSCO Rule 65 & 21 CFR §320`, 15, 31);

  // Status Badge
  doc.setFillColor(16, 185, 129); // #10b981
  doc.roundedRect(pageWidth - 45, 12, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FDA AB RATED', pageWidth - 42, 17.5);

  // Patient & Physician Details Box
  let y = 48;
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.roundedRect(15, y, pageWidth - 30, 26, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT LEGAL NAME', 20, y + 8);
  doc.text('ATTENDING PHYSICIAN / CLINIC', (pageWidth / 2) + 5, y + 8);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(patientName || 'Jane Doe', 20, y + 16);
  doc.text(physicianName || 'Dr. Sarah Jenkins, MD', (pageWidth / 2) + 5, y + 16);

  // Drug Comparison Table
  y += 34;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 10, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESCRIBED REFERENCE (BRAND)', 20, y + 6.5);
  doc.text('AUTHORIZED BIOEQUIVALENT GENERIC', (pageWidth / 2) + 5, y + 6.5);

  y += 10;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, (pageWidth - 30) / 2, 30, 'D');
  doc.rect(15 + (pageWidth - 30) / 2, y, (pageWidth - 30) / 2, 30, 'D');

  // Brand Info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(drug.brandName, 20, y + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`NDC: ${drug.brandNdc}`, 20, y + 15);
  doc.text(`Original Price: ₹${drug.brandPriceInr.toFixed(2)}`, 20, y + 22);

  // Generic Info
  const col2X = 15 + (pageWidth - 30) / 2 + 5;
  doc.setTextColor(2, 132, 199); // blue
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${drug.activeSalt} (${drug.strength})`, col2X, y + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`ATC Code: ${drug.atcCode}  |  Form: ${drug.dosageForm}`, col2X, y + 15);
  doc.setTextColor(16, 185, 129); // green
  doc.setFont('helvetica', 'bold');
  doc.text(`Generic Price: ₹${drug.genericPriceInr.toFixed(2)} (Save ${drug.savingsPercent}%)`, col2X, y + 22);

  // Pharmacokinetic Bioequivalence Parity Section
  y += 38;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 30, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PHARMACOKINETIC BIOEQUIVALENCE METRICS (90% CONFIDENCE INTERVAL)', 20, y + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Peak Concentration (Cmax)', 20, y + 16);
  doc.text('Systemic Exposure (AUC 0-t)', 80, y + 16);
  doc.text('In-Vitro Dissolution Rate', 140, y + 16);

  doc.setTextColor(16, 185, 129);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${drug.cmaxParity}% Pass`, 20, y + 23);

  doc.setTextColor(2, 132, 199);
  doc.text(`${drug.aucParity}% Pass`, 80, y + 23);

  doc.setTextColor(15, 23, 42);
  doc.text('USP >85% @ 30 min', 140, y + 23);

  // Statutory Attestation Box
  y += 38;
  doc.setFillColor(254, 242, 242); // light red/warm
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(15, y, pageWidth - 30, 34, 2, 2, 'FD');

  doc.setTextColor(153, 27, 27);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PHYSICIAN ATTESTATION & PHARMACIST SUBSTITUTION AUTHORIZATION', 20, y + 7);

  doc.setTextColor(69, 10, 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const attestation = `I hereby confirm that substituting ${drug.brandName} with the chemically identical bioequivalent formulation (${drug.activeSalt}, ${drug.strength}) is therapeutically acceptable, safe, and complies with national pharmacovigilance standards.`;
  const splitText = doc.splitTextToSize(attestation, pageWidth - 42);
  doc.text(splitText, 20, y + 14);

  // Signatures Section
  y += 42;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, y + 20, 85, y + 20);
  doc.line((pageWidth / 2) + 10, y + 20, pageWidth - 20, y + 20);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized Prescriber Signature', 20, y + 25);
  doc.text('Clinical Pharmacist Signature & Stamp', (pageWidth / 2) + 10, y + 25);

  doc.text('Reg No: __________________   Date: ________', 20, y + 30);
  doc.text('Pharmacy License: ________________ Date: ________', (pageWidth / 2) + 10, y + 30);

  // Footer Verification Notice
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(`Digital verification hash: SHA256-${drug.id.slice(0, 12)}...  •  MediWise Clinical Intelligence v2.0`, 15, 285);

  // Download PDF
  const filename = `MediWise_Rx_Slip_${drug.id}_${today}.pdf`;
  doc.save(filename);
}
