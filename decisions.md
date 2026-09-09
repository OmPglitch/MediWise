# Architectural & Product Decisions (ADR) — MediWise

This document logs all key architectural, technical, and product decisions for the **MediWise Operations** platform. It serves as persistent context for engineering teams and AI coding assistants to understand the rationale, trade-offs, and historical context behind the system design.

---

## Table of Decisions

| ID | Title | Date | Status | Area |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-001](#adr-001-frontend-architecture-with-react-19-vite-6-and-typescript-58) | React 19, Vite 6, and Strict TypeScript Stack | 2026-08-28 | **Accepted** | Core Architecture |
| [ADR-002](#adr-002-styling-foundation-with-tailwind-css-v4-and-clinical-dual-theme-system) | Tailwind CSS v4 & Clinical Dual-Theme System | 2026-08-29 | **Accepted** | UI / Design System |
| [ADR-003](#adr-003-multi-role-governance-and-granular-rbac-architecture) | Multi-Role Governance & Granular RBAC Architecture | 2026-09-01 | **Accepted** | Security / Auth |
| [ADR-004](#adr-004-cryptographic-audit-ledger-with-hash-chain-verification) | Cryptographic Audit Ledger with Hash-Chain Verification | 2026-09-03 | **Accepted** | Compliance & Regulatory |
| [ADR-005](#adr-005-amazon-style-delivery-management-with-iot-cold-chain-telemetry) | Amazon-Style Delivery Management with Cold-Chain Telemetry | 2026-09-06 | **Accepted** | Logistics & Operations |
| [ADR-006](#adr-006-currency-localization-to-inr--and-cpa-commission-tier-model) | Currency Localization to INR (₹) & CPA Commission Tiers | 2026-09-07 | **Accepted** | Financial & Commercial |
| [ADR-007](#adr-007-server-side-gemini-ai-integration-architecture) | Server-Side Gemini AI Integration Architecture | 2026-09-08 | **Accepted** | AI / Clinical Intelligence |

---

## ADR-001: Frontend Architecture with React 19, Vite 6, and TypeScript 5.8

### Date
2026-08-28

### Context / Problem
MediWise is an enterprise healthcare operations platform managing clinical bioequivalence parity calculations, pharmacy partner networks, logistics telemetry, and regulatory compliance. The dashboard requires high rendering performance, sub-second feedback loops during development, strict data contract safety across medical formulations, and minimal runtime bundle overhead.

### Decision Taken
Adopt **React 19.0.1** paired with **Vite 6.2.3** as the build engine and **TypeScript 5.8.2** under strict mode.

### Reasoning
- **Sub-Second HMR**: Vite 6 provides near-instantaneous Hot Module Replacement during development, essential for rapid iteration over complex UI screens.
- **Strict Clinical Typing**: TypeScript 5.8 eliminates runtime undefined exceptions when handling sensitive drug dosages, ATC codes, Cmax/AUC parities, and financial ledger figures.
- **Modern React 19 APIs**: Native support for modern React compiler optimizations, fine-grained state management, and streamlined action handling without heavy external state libraries.

### Alternatives Considered
1. **Next.js (App Router / SSR)**: Evaluated for potential SEO benefits. Rejected because MediWise is an authenticated clinical operations applet and portal; server-side rendering introduced unnecessary server complexity and cold-start latency for stateful operations.
2. **Create React App (CRA)**: Rejected as deprecated and lacking modern ESM-based bundling.
3. **Angular**: Strong enterprise typing, but steeper learning curve, rigid dependency injection, and slower prototyping velocity.

### Impact on Project
- Lightweight single-page application bundle deployable to any edge CDN or container runtime.
- High developer velocity and robust type safety across all domain models in `src/types.ts`.
- Predictable client-side lifecycle for active tab routing, modal dialogs, and real-time state manipulation.

---

## ADR-002: Styling Foundation with Tailwind CSS v4 and Clinical Dual-Theme System

### Date
2026-08-29

### Context / Problem
Healthcare practitioners operate in varying lighting conditions—from dark diagnostic imaging suites and night-shift control desks to bright, sterile hospital laboratories. The interface requires:
1. High-density information display without visual fatigue.
2. Medical-grade color contrast (WCAG 2.1 AA compliant).
3. Seamless switching between a "Clinical Dark Mode" (`#090d16`) and a "Sterile Light Mode" (`#f8fafc`).

### Decision Taken
Use **Tailwind CSS v4** (`@tailwindcss/vite`) combined with CSS custom properties and scoped `.light` CSS rules defined in `src/index.css`. The font stack is standardized to:
- **Body / Data**: `Inter`
- **Headlines / Metric Totals**: `Hanken Grotesk`
- **NDCs, SMILES, Hashes, Currency & Code**: `JetBrains Mono`

### Reasoning
- **Tailwind v4 Engine**: Eliminates JavaScript-based configuration files (`tailwind.config.js`), leveraging native CSS `@import "tailwindcss"` and modern CSS layers for instant compilation.
- **Ergonomic Dual Palette**: 
  - *Dark Mode*: Deep midnight navy (`#090d16` / `#0d1424`), cyan/teal accents (`#06b6d4`, `#10b981`), reducing eye strain in control rooms.
  - *Sterile Light Mode*: Clean laboratory slate/white (`#f8fafc` / `#ffffff`), neutral borders (`#e2e8f0`), high-contrast dark text (`#0f172a`).
- **Standardized Monospace Font**: Prevents layout jitter when updating numbers, tracking codes, or molecular formulas.

### Alternatives Considered
1. **Material UI (MUI) / Chakra UI**: Rejected due to high runtime JavaScript weight, CSS-in-JS performance bottlenecks, and opinionated styling that required extensive overriding to achieve a medical aesthetic.
2. **Vanilla CSS Modules**: High maintenance burden, excessive boilerplate, and inconsistency across team members.

### Impact on Project
- Instantaneous theme transitions persisted via `localStorage` (`mediwise_theme`).
- Zero layout shift during live metric updates.
- Cohesive, state-of-the-art medical aesthetic with polished micro-interactions and custom scrollbars.

---

## ADR-003: Multi-Role Governance and Granular RBAC Architecture

### Date
2026-09-01

### Context / Problem
Healthcare compliance frameworks (HIPAA, CDSCO, FDA 21 CFR Part 11) prohibit flat administrative privileges. A single operator must not simultaneously approve clinical bioequivalence tests, alter pharmacy commission rates, and inspect patient health records without explicit role segregation.

### Decision Taken
Implement a granular Role-Based Access Control (RBAC) model defining four distinct system actors:
1. **`cmio` (Chief Medical Systems Officer)**: Authority over bioequivalence clinical sign-offs, catalog composition, production rollbacks, and emergency overrides.
2. **`pharmacy_partner` (Pharmacy Network Operations)**: Authority over retail price feeds, inventory webhooks, stock synchronization, and CPA commission escrow tracking.
3. **`compliance_officer` (Regulatory & Data Integrity Auditor)**: Read-only ledger inspection, cryptographic proof verification, WAF rule audits, and regulatory export generation.
4. **`patient` (Healthcare Consumer)**: Prescription uploads, generic substitution browsing, order placement, and delivery tracking.

Each user record in `src/types.ts` (`UserProfile`) contains explicit `permissions: string[]` mapped against role definitions in `src/data/mockUsers.ts`.

### Reasoning
- Enables realistic demonstration and testing of enterprise security governance.
- Protects critical operations (e.g., `EmergencyOverrideModal`, `RollbackModal`) behind permission checks.
- Provides immediate role-switching capabilities in the header for testing different user journeys.

### Alternatives Considered
1. **Single Admin User**: Unrealistic for enterprise procurement and healthcare compliance audits.
2. **External OAuth-only provider during prototyping**: Hindered local offline development, testing, and automated demo simulations.

### Impact on Project
- Clear separation of operational concerns.
- Modals and screens conditionally render actions based on active actor permissions.
- Full session locking mechanism (`SessionLockModal`) ensuring HIPAA compliance when workstations are unattended.

---

## ADR-004: Cryptographic Audit Ledger with Hash-Chain Verification

### Date
2026-09-03

### Context / Problem
Any modification to generic drug formulations, bioequivalence parameters, or pricing matrices carries legal and patient safety consequences. Regulators require an indelible, tamper-evident audit record proving that logs have not been altered post-hoc.

### Decision Taken
Implement an in-memory and exportable **cryptographic hash-chain audit ledger** (`AuditEvent` in `src/types.ts`). Each event records:
- Monotonic timestamp and unique event ID
- Actor ID, role, and originating IP address
- Action name and compliance code (e.g., `CDSCO-SEC-28`, `21CFR-11.10`)
- `hash`: SHA-256 derivative anchored to the previous block hash (`auditHashChainAnchor`)
- Granular `payloadDiff` highlighting removed, added, and preserved keys
- Status verification (`Verified Pass`, `Action Required`, `Flagged WAF`)

### Reasoning
- Satisfies requirements for immutable record-keeping under FDA 21 CFR Part 11 and CDSCO digital directives.
- Visual payload diffing allows compliance officers to immediately inspect exact configuration shifts without raw JSON parsing.
- Hash anchoring establishes mathematical proof of log integrity.

### Alternatives Considered
1. **Standard Relational Database Timestamps**: Mutable by database administrators, failing strict regulatory audits.
2. **Full Public Blockchain**: High latency, high transaction gas costs, and inappropriate exposure of sensitive internal clinical metadata.

### Impact on Project
- Full visibility into platform state mutations.
- The `ComplianceScreen` renders real-time hash validations and payload diff views.
- Immediate flagging of unauthorized requests via Cloudflare WAF simulated telemetry.

---

## ADR-005: Amazon-Style Delivery Management with IoT Cold-Chain Telemetry

### Date
2026-09-06

### Context / Problem
Generic medicine adoption often stalls due to patient anxiety regarding fulfillment reliability, delayed delivery, and compromised efficacy of temperature-sensitive formulations (e.g., insulins, biologics, liquid suspensions).

### Decision Taken
Design and implement an **Amazon-grade Delivery Management System** (`DeliveryManagementScreen`, `OrderDeliveryModal`, `DeliveryTrackingModal`) featuring:
1. Multi-speed fulfillment: `same_day` (⚡ 4-hour priority), `next_day`, `standard`, and `in_store_pickup`.
2. Live interactive delivery timeline with step-by-step milestone progression.
3. IoT Cold-Chain Monitoring: Real-time temperature readout (target 2.0°C – 8.0°C), sensor status (`optimal`, `warning`, `critical`), and FIPS-140 tamper seal verification.
4. Courier dispatch tracking: Courier name, rating, vehicle type (e.g., Refrigerated EV Van), stops-away counter, and direct contact actions.
5. Delivery verification: Two-Factor OTP and digital proof-of-delivery signatures.

### Reasoning
- Eliminates the fulfillment black box for patients and clinical providers.
- Cold-chain verification guarantees active pharmaceutical ingredient (API) stability upon arrival.
- Standardizes delivery workflows across multiple competing partner pharmacies (Tata 1mg, Apollo 24/7, Netmeds, MedPlus).

### Alternatives Considered
1. **External Courier Redirect Links**: Sends users away from the platform, breaks clinical continuity, and forfeits temperature sensor data.
2. **Basic Status Dropdown ("Shipped" / "Delivered")**: Insufficient for high-stakes clinical medications requiring refrigerated transport.

### Impact on Project
- MediWise transforms from a passive drug discovery directory into an active fulfillment operations engine.
- High patient trust and tangible demonstration of clinical care continuity.

---

## ADR-006: Currency Localization to INR (₹) and CPA Commission Tier Model

### Date
2026-09-07

### Context / Problem
The primary commercial market for high-volume generic drug substitution is India / South Asia, where the retail price gap between branded originator drugs and bioequivalent generic equivalents frequently exceeds 80% to 93%. Utilizing US Dollars as the primary currency reduced operational relevance for Indian retail pharmacy chains and local healthcare providers.

### Decision Taken
1. Localize all pricing displays, cost savings, GMV values, and pharmacy partner escrow ledgers to **Indian Rupees (INR - ₹)** using standard Indian numbering formatting.
2. Formalize a 3-tier Cost-Per-Acquisition (CPA) monetization model:
   - **Tier 1 (8.5% GMV)**: National Omnichannel Aggregators (e.g., Tata 1mg, Apollo 24/7, Netmeds) with automated Kafka/FHIR feeds.
   - **Tier 2 (7.0% GMV)**: Regional Retail Franchises (e.g., MedPlus Health) with SFTP/daily batch feeds.
   - **Tier 3 (₹20 Flat / Unit)**: Independent community dispensaries and local POS connectors.

### Reasoning
- Direct alignment with primary commercial partners and end-user market economics.
- Demonstrates massive cost savings: e.g., Lipitor 20mg at ₹142.00 vs. Atorvastatin Generic at ₹18.50 (87.0% savings / ₹123.50 saved per pack).
- The tiered CPA model reflects realistic commission arrangements in the pharmaceutical aggregator sector.

### Alternatives Considered
1. **USD ($) Only**: Failed to reflect the real-world operational context of Indian national pharmacies.
2. **Dynamic Multi-Currency Converter Dropdown**: Added unnecessary UI complexity during initial operations rollout; INR was established as the primary operating currency.

### Impact on Project
- Consistent currency formatting throughout `DrugItem`, `PartnerPharmacy`, and `DeliveryOrder`.
- Clear, defensible business model demonstrating platform revenue viability.

---

## ADR-007: Server-Side Gemini AI Integration Architecture

### Date
2026-09-08

### Context / Problem
Users require intelligent clinical guidance: translating dense chemical monographs (SMILES formulas, pharmacokinetics, bioavailability) into patient-friendly explanations, checking drug-drug interaction warnings, and answering clinician inquiries regarding bioequivalence confidence bands.

### Decision Taken
Integrate the official Google Gen AI SDK (`@google/genai` v2.4.0) configured for **server-side proxy execution**. Declare the capability `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` in `metadata.json`. The client application accesses Gemini capabilities via managed server endpoints rather than embedding secret API keys into client bundles.

### Reasoning
- **Key Protection**: Client-side bundling of `GEMINI_API_KEY` exposes credentials to inspection and unauthorized extraction.
- **Regulatory Guardrails**: Server-side proxying enables pre-flight validation, clinical safety system instructions, prompt sanitization, and compliance audit logging.
- **Model Flexibility**: Enables seamless upgrading from Gemini 2.5/3.0 to future multimodal models without modifying client-side React components.

### Alternatives Considered
1. **Direct Client-Side SDK Calling (`process.env.GEMINI_API_KEY`)**: Rejected due to high credential leakage risks in browser environments.
2. **Third-Party LLM Gateway (OpenAI / Anthropic)**: Google Gemini was chosen for its multimodal capabilities, structured JSON output support, and direct integration with Google AI Studio hosting.

### Impact on Project
- Safe, compliant AI integration ready for clinical reasoning, generic substitution explanations, and document parsing.

---

## ADR-008: Client-Side IndexedDB as Persistence Layer (No Server-Side Database)

### Date
2026-09-09

### Context / Problem
MediWise is a frontend-heavy clinical SPA. Delivery orders, audit events, and drug catalog edits created during a session need to survive browser refreshes. A full server-side database (PostgreSQL, MongoDB) would require infrastructure provisioning, auth middleware, and API endpoints that are outside the current phase scope.

### Decision Taken
Use **IndexedDB** via the `idb` npm wrapper as the sole persistence layer for the current phases. Three object stores: `deliveries`, `auditEvents`, `drugs`. Preferences use `localStorage`.

### Reasoning
- **Zero infrastructure overhead**: Runs entirely in the browser; no backend DB connection string, no migrations, no server provisioning.
- **Adequate for SPA demo scope**: All data is user-session-local — the clinical data is mock/demo, so no multi-user sync is required.
- **Typed schema via `idb`**: The `DBSchema` interface provides TypeScript-safe object store definitions matching the `DrugItem`, `DeliveryOrder`, and `AuditEvent` types exactly.
- **Future upgrade path**: When server-side persistence is needed, `src/lib/db.ts` exports are the only touch-point — replacing them with REST/fetch calls to a Mongoose/MongoDB or PostgreSQL backend requires no changes to React components.

### Alternatives Considered
1. **MongoDB (Mongoose)**: Would require a running MongoDB server, Mongoose ODM, and full REST API layer in `server.ts`. Deferred to a future backend phase.
2. **SQLite (better-sqlite3)**: Server-side SQLite would require the Express server to manage connections, blocking I/O concerns, and WAL configuration. Deferred.
3. **Zustand + localStorage**: Evaluated for lightweight state persistence. Rejected because large array serialization to `localStorage` (5MB quota) is insufficient for audit ledgers with thousands of entries.

### Consequences
- Data is device-local and does not sync across browsers or users — acceptable for the current phase.
- `clearAllLocalData()` in `SettingsScreen` wipes all IndexedDB stores and `localStorage`, restoring factory defaults.
- Phase 6+ will introduce a proper MongoDB backend when multi-user, multi-tenant data sync is required.

---

## ADR-009: Phase 3–5 Screen Architecture — Standalone Workspace Tabs

### Date
2026-09-09

### Context / Problem
Phases 3, 4, and 5 each introduce multi-screen feature areas (FHIR ingestion, India Stack, commerce, federated catalog, fleet telemetry). These could be integrated as sub-panels inside existing screens or as independent top-level workspace tabs.

### Decision Taken
Each Phase 3–5 feature area is a **standalone workspace tab** registered in the `ActiveTab` union, rendered in the ops viewport, and navigable via the `RailDrawer` sidebar.

### Reasoning
- **Cognitive separation**: Clinical operators, compliance officers, and finance teams use distinct workspaces; mixing them would violate the single-responsibility principle for each screen.
- **Uniform routing model**: All screens follow the same `activeTab === 'xxx'` branch pattern — consistent, predictable, zero routing library overhead.
- **Progressive disclosure**: Phase 3–5 tabs are grouped under labelled section headers in the drawer, making their phase membership explicit without overwhelming the core Phase 1–2 navigation.

### Consequences
- `ActiveTab` union grew from 7 to 12 values: `overview | catalog | partners | compliance | settings | patient | deliveries | fhir | indiastack | commerce | federated | fleet`.
- `RailDrawer` is now scrollable (`overflow-y-auto`) to accommodate all 12 nav items without visual overflow.
- Each new screen is self-contained with its own mock data file (`mockPhase3Data.ts`, `mockPhase4Data.ts`, `mockPhase5Data.ts`), keeping Phase 1–2 data files untouched.
