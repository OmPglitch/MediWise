# Changelog — MediWise Operations

All notable changes to the **MediWise Operations** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Gemini 2.5 Flash Vision integration for handwritten prescription recognition and Schedule H drug checks.
- Direct PDF download generator for clinician-signed substitution slips.
- IndexedDB client storage layer for persistent local state across browser refreshes.

---

## [1.2.0] - 2026-09-08

### Added
- Created foundational AI persistent context files:
  - `decisions.md`: Comprehensive Architectural Decision Records (ADRs 001 through 007).
  - `rules.md`: Strict AI development rules, coding standards, and folder placement conventions.
  - `memory.md`: Long-term platform memory, schema relationships, gateway topologies, and roadmap.
  - `changelog.md`: Chronological release and feature tracking ledger.
- Added Material Symbols Outlined font CDN integration in `index.html` for clinical telemetry icons.
- Added `Server-Side Gemini API` capability descriptor in `metadata.json`.

### Changed
- **Currency Localization to INR (₹)**:
  - Localized all financial metrics across drug catalog prices, partner GMV, savings calculations, and CPA commissions to Indian Rupees (`₹`).
  - Updated branded vs. generic comparative savings formulations to reflect Indian pharmaceutical retail economics (85% to 93% cost reduction).
- Enhanced Sterile Light Mode CSS rules in `src/index.css` for improved contrast against clinical white backgrounds.
- Updated delivery speed matrix badges with regional delivery SLAs (e.g., *Express 4h*, *Pickup / 2h*, *Same Day*).

### Fixed
- Fixed currency symbol inconsistencies between modal dialogs and table rows.
- Corrected potential layout shift in `DeliveryManagementScreen` when toggling between active status filters.

---

## [1.1.0] - 2026-09-07

### Added
- **Amazon-Style End-to-End Delivery Management**:
  - Implemented `DeliveryManagementScreen.tsx` with status filtering (`All`, `Out for Delivery`, `In Transit`, `Delivered`, `Delayed`).
  - Added `DeliveryTrackingModal.tsx` displaying interactive 5-step fulfillment timeline, courier live location, rating, vehicle specs, and stops-away counter.
  - Added `OrderDeliveryModal.tsx` allowing one-click prescription order placement with delivery speed options (`same_day`, `next_day`, `standard`, `in_store_pickup`).
- **IoT Cold-Chain Telemetry**:
  - Real-time digital temperature gauge monitoring active biologics between 2.0°C and 8.0°C.
  - Added `sensorStatus` tracking (`optimal`, `warning`, `critical`) with alert badges.
  - Embedded FIPS-140 tamper seal verification identifiers.
- Added `MOCK_DELIVERIES` fixture suite in `src/data/mockDeliveries.ts`.
- Added OTP verification and digital proof-of-delivery signature fields to `DeliveryOrder` model.

### Changed
- Refactored `src/types.ts` to introduce `DeliveryOrder`, `DeliveryAddress`, `DeliveryTimelineStep`, `DeliverySpeed`, and `DeliveryStatus`.
- Integrated `activeTab === 'deliveries'` route within `RailDrawer.tsx` and `App.tsx`.

### Fixed
- Resolved timestamp formatting discrepancies in delivery timeline steps.

---

## [1.0.0] - 2026-09-05

### Added
- **Core Operations Workspaces**:
  - `OverviewScreen.tsx`: Top-line healthcare KPIs, therapeutic savings category distribution chart, and real-time Event Bus stream.
  - `DrugCatalogScreen.tsx`: Bioequivalence parity analyzer (AUC, Cmax, USP dissolution rate), CAS/ATC codes, molecular formula, and SMILES notation.
  - `PartnerNetworkScreen.tsx`: Pharmacy partner registry (Apollo 24/7, Tata 1mg, Netmeds, MedPlus) with CPA commission tracking and live sync status.
  - `ComplianceScreen.tsx`: Cryptographic audit ledger with SHA-256 hash-chain verification and payload diff visualization.
  - `PatientPortalScreen.tsx`: Patient prescription review, potential generic savings summary, and doctor slip viewer.
  - `SettingsScreen.tsx`: Infrastructure configuration manager and external Service Gateway health monitors (Stripe, Cloudflare, Twilio, SendGrid, RxNorm, AWS S3).
  - `AuthScreen.tsx`: Multi-role onboarding and sign-in view.
- **Enterprise Shell & Navigation**:
  - `EnterpriseHeader.tsx`: Tenant scope switcher, global search, actor role switcher, and notification drawer.
  - `RailDrawer.tsx`: Slim clinical sidebar navigation.
  - `NotificationToast.tsx`: Dynamic status alerts for user operations.
- **Interactive Governance Modals**:
  - `ConfigDiffModal.tsx` & `RollbackModal.tsx`: Configuration audit and rollback management.
  - `EmergencyOverrideModal.tsx`: Dual-authorization clinical override workflow.
  - `SessionLockModal.tsx`: HIPAA compliant screen lock mechanism.
  - `ProfileSettingsModal.tsx` & `AuthModal.tsx`: User credentialing and 2FA settings.
  - `DoctorSlipModal.tsx`: Digital prescription disclosure slip viewer.
- **Role-Based Access Control (RBAC)**:
  - Granular permission matrix for `cmio`, `pharmacy_partner`, `compliance_officer`, and `patient` in `src/data/mockUsers.ts`.
- **Dual-Theme Design System**:
  - Clinical Dark Mode (`#090d16`) and Sterile Laboratory Light Mode (`#f8fafc`) with `localStorage` persistence.

### Changed
- Migrated default color palette to high-contrast cyan, sky blue, and emerald accents.
- Structured centralized type exports in `src/types.ts`.

---

## [0.1.0] - 2026-08-28

### Added
- Project initialization with Vite 6, React 19, and TypeScript 5.8.
- Tailwind CSS v4 integration via `@tailwindcss/vite`.
- Google Fonts configuration for `Inter`, `Hanken Grotesk`, and `JetBrains Mono`.
- Base HTML5 shell and project manifest in `index.html` and `metadata.json`.
- Environment variable configuration template in `.env.example`.
