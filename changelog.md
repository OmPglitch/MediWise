# Changelog — MediWise Operations

All notable changes to the **MediWise Operations** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Playwright E2E browser tests running in CI via GitHub Actions (Sprint 5.3 follow-up).
- BLE hardware SDK integration for real refrigerated van fleet (Sprint 5.2 hardware layer).
- Stripe Connect live credentials and webhook signature verification (Sprint 4.1 production gate).

---

## [2.0.0] - 2026-09-09

### Added — Phase 5: Scale, Reliability & Global Expansion

- **Multi-Region Federated Drug Catalog** (`FederatedCatalogScreen.tsx`):
  - Unified formulary spanning CDSCO (India), FDA Orange Book (USA), and EMA (EU) regulatory registrations.
  - Per-drug regulatory approval cards with jurisdiction flags, application numbers, registered moieties, and validity dates.
  - Cross-region price harmonization panel (INR / USD / EUR per tablet).
  - Aggregated bioequivalence study counts and harmonized parity scores.
  - Filter by therapeutic category and jurisdiction approval status.
  - Mock data: `src/data/mockPhase5Data.ts` — 5 federated drug entries.

- **BLE Fleet Cold-Chain Telemetry** (`FleetTelemetryScreen.tsx`):
  - Live BLE beacon simulation for 5 refrigerated pharmacy vans across Delhi, Mumbai, Bengaluru, Chennai, and Kolkata.
  - Real-time chiller temperature gauge (SVG arc gauge), ambient vs. target range display.
  - ML breach predictor with countdown timer when temperature trend predicts breach within 15–30 minutes.
  - Live SVG sparkline temperature history with animated path rendering (5-second BLE tick).
  - Fleet KPI strip: total vehicles, optimal, at-risk, idle counts.
  - `FLEETVehicleSensor` type in `src/types.ts` (already declared in Phase 2 sprint).

- **Automated E2E Test Infrastructure** (`playwright.config.ts`, `e2e/`):
  - Playwright `^1.47.0` added to `devDependencies`.
  - `playwright.config.ts`: multi-browser matrix (Chromium, Firefox, WebKit, Pixel 5 mobile), HTML/JSON reporters, dev server auto-start.
  - `e2e/helpers.ts`: shared `loadApp`, `navigateToTab`, `waitForToast`, `assertNoAccessibilityErrors` utilities.
  - `e2e/auth.spec.ts`: authentication, RBAC boundary, and theme toggle tests.
  - `e2e/drug-catalog.spec.ts`: catalog load, bioequivalence metrics, order launch tests.
  - `e2e/delivery.spec.ts`: delivery management and critical end-to-end journey (Patient Portal → Order → Track).
  - `e2e/compliance.spec.ts`: audit ledger, verify integrity, emergency override tests.
  - `e2e/theme.spec.ts`: dark/light mode parity and localStorage persistence tests.
  - `npm run test:e2e`, `test:e2e:ui`, `test:e2e:report` scripts added to `package.json`.

### Added — Phase 4: Commerce & Financial Settlement

- **Commerce Screen** (`CommerceScreen.tsx`) — unified 3-tab financial workspace:
  - **Stripe Escrow tab**: payout queue with `pending_fulfillment`, `in_escrow`, `dual_approval_required`, `disbursed` states. Dual CMIO + Compliance Officer authorization gate for payouts > ₹1,00,000. Stripe transfer ID generation on release. Audit event logged on every disbursement.
  - **GST Invoicing tab**: invoice register with `draft` → `generated` (IRN hash) → `filed` lifecycle. CGST/SGST/IGST breakdown by intra/inter-state transaction. HSN code `30049099` for pharmaceutical dispensing. GSTN portal filing action.
  - **Multi-Currency tab**: 5-currency selector (INR, USD, EUR, GBP, AED). Exchange rate table with Open Exchange Rates sourcing. Real-time commission conversion preview table.
- `src/data/mockPhase4Data.ts`: 4 escrow payouts, 3 GST invoices, 5 currency rates.
- `formatCurrency()` and `convertFromINR()` utility functions.
- New types already declared in `src/types.ts`: `StripeEscrowPayout`, `GSTInvoice`, `SupportedCurrency`, `CurrencyRate`.

### Added — Phase 3: Healthcare Ecosystem Integrations

- **FHIR R4 / HL7 EHR Ingestion Screen** (`FHIRIngestionScreen.tsx`):
  - FHIR R4 MedicationRequest bundle list with validate / reject workflow.
  - KPI strip: total ingested, validated, pending, rejected counts.
  - EHR endpoint registry panel (Apollo, Fortis, AIIMS, Max Healthcare).
  - RxNorm / SNOMED CT coding display, formulary cross-reference link, audit event on validation.
  - "Simulate EHR Push" adds a live demo MedicationRequest to the queue.
  - 4 mock FHIR bundles in `src/data/mockPhase3Data.ts`.

- **India Stack Integration Screen** (`IndiaStackScreen.tsx`):
  - 3-tab workspace: ABHA Verification, UHI Discovery, Digital Health Locker.
  - ABHA tab: 14-digit ABHA ID lookup, KYC status badge, linked record count, Pull/Link actions.
  - UHI tab: pharmacy / diagnostic / teleconsult provider grid with distance, ETA, stock, rating.
  - Locker tab: per-patient HIE consent toggle per document type (prescriptions, labs, discharge summaries, vaccinations).
  - Mock data: 3 ABHA profiles, 6 UHI providers in `src/data/mockPhase3Data.ts`.

- **Live Courier Geolocation Map** (`DeliveryTrackingModal.tsx`):
  - SVG vector map rendered inline (no external dependency) with road polyline, completed route overlay, animated courier pin with heading indicator, destination flag pin, and ETA badge.
  - Replaces plain text "current location" with a visual 180px map panel.
  - `CourierCoordinates` mock data added to `src/data/mockPhase3Data.ts`.

### Added — Phase 2: Intelligence & Real-Time Capabilities (completed)

- **Gemini Rx Scanner fully wired** (`App.tsx`):
  - `handleScanPrescription(file)`: reads file as base64, calls `POST /api/rx/scan`, cross-references result against formulary, updates `rxScanState`.
  - `handleResetScan()`: clears scan state for re-upload.
  - Props `rxScanState`, `onScanPrescription`, `onResetScan` passed to `PatientPortalScreen`.

- **Settings clear local data wired** (`App.tsx`):
  - `handleClearLocalData()`: calls `clearAllLocalData()`, resets React state to mock defaults, shows success toast.
  - `onClearLocalData` prop passed to `SettingsScreen`.

- **PDF Clinical Slip fix** (`generateSlipPdf.ts`):
  - Fixed `brandPriceInr` → `brandPrice` and `genericPriceInr` → `genericPriceAvg` field references.

### Changed

- `src/types.ts`: `ActiveTab` union extended with `fhir`, `indiastack`, `commerce`, `federated`, `fleet`.
- `src/data/mockUsers.ts`: `recommendedView` field type widened from narrow union to `ActiveTab` import. Added `ActiveTab` to imports.
- `src/components/RailDrawer.tsx`:
  - Navigation scrollable (`overflow-y-auto`, `max-h-[calc(100vh-220px)]`).
  - Added Phase 3 section header + FHIR Gateway and India Stack buttons.
  - Added Phase 4 section header + Escrow/GST/Currency button.
  - Added Phase 5 section header + Federated Catalog and BLE Fleet Telemetry buttons with Live badge.
  - Added `Activity`, `Shield`, `CreditCard`, `Globe`, `Bluetooth` lucide icon imports.
- `src/App.tsx`:
  - Imports: added all 5 new Phase 3–5 screen components.
  - Render: added `activeTab === 'fhir'`, `indiastack`, `commerce`, `federated`, `fleet` branches in the ops viewport.
- `package.json`: added `@playwright/test ^1.47.0` to devDependencies; added `test:e2e`, `test:e2e:ui`, `test:e2e:report` scripts.

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
