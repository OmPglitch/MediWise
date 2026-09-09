# AI Development Rules & Project Standards — MediWise

This document contains **mandatory rules and standards** that any AI coding assistant or engineer working on the **MediWise Operations** codebase must strictly adhere to.

> [!IMPORTANT]
> **Cardinal Rule**: **NEVER BREAK EXISTING FUNCTIONALITY** unless explicitly instructed by the user. Always preserve existing state structures, props interfaces, data contracts, and visual features.

---

## 1. Prime Directives for AI Assistants

1. **Do No Harm**: Refactoring must never silently delete, bypass, or degrade existing screens, tabs, modals, filters, or clinical calculators.
2. **Verify Before Modifying**: Inspect existing types in `src/types.ts` and data contracts in `src/data/` before altering any component.
3. **Preserve Documentation & Comments**: Retain existing code comments, docstrings, and license headers.
4. **Maintain Type Safety**: Zero TypeScript compilation errors (`npm run lint` / `tsc --noEmit` must always pass).
5. **No Blind Overwrites**: When modifying files, prefer targeted replacements over wiping and re-generating entire large files.

---

## 2. Coding Standards

### 2.1 TypeScript Standards
- **Strict Typing**: All variables, props, function parameters, and state hooks must be explicitly typed. Do NOT use `any`. Use `unknown` with type guards if the schema is indeterminate.
- **Centralized Types**: All shared domain models (`DrugItem`, `PartnerPharmacy`, `AuditEvent`, `DeliveryOrder`, `UserProfile`, `SystemConfig`) **must** live in `src/types.ts`. Do not declare duplicate interfaces inside individual component files.
- **Null Safety**: Always handle optional fields with optional chaining (`?.`) or nullish coalescing (`??`). Provide safe defaults for collections (`|| []`).
- **Union Types over Enums**: Use TypeScript string union types (e.g., `type DeliverySpeed = 'same_day' | 'next_day' | ...`) rather than numeric enums for readability and serialization clarity.

```typescript
// ✅ CORRECT: Explicit typing with centralized interface
import { DeliveryOrder, DeliveryStatus } from '../types';

interface DeliveryCardProps {
  order: DeliveryOrder;
  onStatusChange: (orderId: string, status: DeliveryStatus) => void;
}

export function DeliveryCard({ order, onStatusChange }: DeliveryCardProps) {
  return <div>{order.orderNumber} - {order.statusLabel}</div>;
}

// ❌ INCORRECT: Implicit any, localized duplicate types, or loose objects
export function DeliveryCard({ order, onStatusChange }: any) {
  return <div>{order.orderNumber}</div>;
}
```

### 2.2 React Architecture
- **Functional Components**: Use modern functional components with standard React hooks (`useState`, `useMemo`, `useCallback`, `useEffect`, `useRef`).
- **State Immutability**: Always treat state objects and arrays as immutable. Never mutate state directly (e.g., `list.push(item)`); use array spreads (`[...list, item]`) or functional updater forms (`setItems(prev => [...prev, item])`).
- **Effect Cleanup**: Any `useEffect` establishing timers, intervals, or event listeners must return an appropriate cleanup function to prevent memory leaks.
- **Clean Props Interfaces**: Keep component props clear and documented. Favor passing semantic IDs or well-defined model interfaces.

---

## 3. Folder Structure & Placement Rules

The project directory structure is strictly organized by functional responsibility. AI must place new files into their designated folders:

```
MediWise/
├── .env.example                # Canonical template for environment variables
├── index.html                  # HTML5 shell with Google Fonts & Material Symbols
├── metadata.json               # Platform capabilities & frame permission manifest
├── package.json                # Project dependencies & build scripts
├── tsconfig.json               # TypeScript strict compiler options
├── vite.config.ts              # Vite 6 + Tailwind v4 configuration
├── decisions.md                # Architectural Decision Records (ADRs)
├── rules.md                    # This document (AI instructions & standards)
├── memory.md                   # Long-term platform memory & schema
├── changelog.md                # Chronological release and feature changelog
└── src/
    ├── main.tsx                # Application entrypoint & root DOM mounting
    ├── App.tsx                 # Root coordinator, global state, tab switching
    ├── index.css               # Design system, CSS variables, light-mode rules
    ├── types.ts                # Canonical domain models & type definitions
    ├── components/             # Reusable core widgets & shell components
    │   ├── EnterpriseHeader.tsx# App header, tenant switcher, role selector, theme
    │   ├── RailDrawer.tsx      # Main navigation sidebar
    │   ├── NotificationToast.tsx # Visual toast notification container
    │   ├── screens/            # Screen-level views corresponding to ActiveTab
    │   │   ├── OverviewScreen.tsx
    │   │   ├── DrugCatalogScreen.tsx
    │   │   ├── PartnerNetworkScreen.tsx
    │   │   ├── ComplianceScreen.tsx
    │   │   ├── DeliveryManagementScreen.tsx
    │   │   ├── PatientPortalScreen.tsx
    │   │   ├── SettingsScreen.tsx
    │   │   └── AuthScreen.tsx
    │   └── modals/             # Action-oriented dialogs and workflows
    │       ├── DeliveryTrackingModal.tsx
    │       ├── OrderDeliveryModal.tsx
    │       ├── ConfigDiffModal.tsx
    │       ├── RollbackModal.tsx
    │       ├── SessionLockModal.tsx
    │       ├── AuthModal.tsx
    │       ├── ProfileSettingsModal.tsx
    │       ├── EmergencyOverrideModal.tsx
    │       ├── DoctorSlipModal.tsx
    │       ├── GoogleOAuthModal.tsx
    │       └── TermsModal.tsx
    └── data/                   # Initial fixtures & mock data models
        ├── mockData.ts         # Drugs, partners, audit events, system config
        ├── mockDeliveries.ts   # Amazon-style logistics delivery data
        └── mockUsers.ts        # RBAC user profiles & permission sets
```

### Placement Rules:
1. **Screens vs. Modals**: Full-page navigation targets mapped to `ActiveTab` in `src/types.ts` belong in `src/components/screens/`. Dialog overlays, popups, and confirmations belong in `src/components/modals/`.
2. **Data Fixtures**: Never embed large arrays of mock data directly inside UI screen components. Place all static datasets or default state in `src/data/`.
3. **No Root Clutter**: Do not place arbitrary `.ts` or `.tsx` files directly inside `src/` unless they are fundamental application orchestrators like `App.tsx` or `types.ts`.

---

## 4. Naming Conventions

| Category | Convention | Example |
| :--- | :--- | :--- |
| **React Components** | `PascalCase.tsx` | `DeliveryManagementScreen.tsx`, `OrderDeliveryModal.tsx` |
| **Component Files** | Exact match with component export | `export function EnterpriseHeader()` in `EnterpriseHeader.tsx` |
| **Screen Views** | `*Screen.tsx` | `OverviewScreen.tsx`, `ComplianceScreen.tsx` |
| **Modal Dialogs** | `*Modal.tsx` | `DeliveryTrackingModal.tsx`, `RollbackModal.tsx` |
| **Data & Utility Files** | `camelCase.ts` | `mockDeliveries.ts`, `mockUsers.ts` |
| **TypeScript Types & Interfaces** | `PascalCase` | `DrugItem`, `DeliveryOrder`, `TenantScope` |
| **Type Files** | `types.ts` | `src/types.ts` |
| **Variables & Functions** | `camelCase` | `handleToggleTheme`, `activeTab`, `isAuthModalOpen` |
| **Boolean State Variables** | Prefixed with `is`, `has`, `should` | `isAuthenticated`, `isSessionLocked`, `hasWarning` |
| **Constants & Default Fixtures** | `UPPER_SNAKE_CASE` | `INITIAL_DRUGS`, `DEMO_USERS`, `DEFAULT_DELIVERY_ADDRESS` |
| **Event Handlers** | `handle<Action>` | `handleSelectTheme`, `handleSaveConfig`, `handleTrackOrder` |
| **Callback Props** | `on<Event>` | `onClose`, `onSelectUser`, `onStatusChange` |

---

## 5. UI/UX Consistency Rules

### 5.1 Design Tokens & Palettes
- **Dark Mode (Default)**:
  - Base canvas: `#090d16`
  - Card / Panel surface: `#0d1424` or `#0f172a`
  - Inner card / Well: `#0b101d`
  - Border: `#1e293b` or `#334155`
  - Primary Accent: Cyan `#06b6d4` / Sky `#38bdf8`
  - Success / Clinical Pass: Emerald `#10b981`
  - Warning / Delta: Amber `#f59e0b`
  - Danger / Alarm: Rose `#f43F5E` / Red `#ef4444`
- **Sterile Light Mode**:
  - Base canvas: `#f8fafc`
  - Card / Panel surface: `#ffffff`
  - Border: `#e2e8f0`
  - Text primary: `#0f172a`
  - Text secondary: `#475569`

### 5.2 Typography Hierarchy
- Use `font-sans` (`Inter`) for all descriptive text, labels, and standard inputs.
- Use `font-headline` (`Hanken Grotesk`) for page headings, KPI counters, and screen titles.
- Use `font-mono` (`JetBrains Mono`) for:
  - Currency figures (e.g., `₹18.50`)
  - NDC numbers, CAS codes, SMILES strings, and ATC codes
  - Cryptographic hashes, tokens, IP addresses, and versions
  - Quantities, timestamps, and percentages

### 5.3 Currency Formatting
- **Standard**: Always display financial figures in **Indian Rupees (INR - ₹)**.
- Format with standard decimals: `₹18.50`, `₹1,240.00`, `₹1,84,200`.
- Do not use `$` or generic currency labels unless specifically referencing international cross-border pricing benchmarks.

### 5.4 Micro-Interactions & User Feedback
- Every destructive or major state action (saving settings, rolling back configurations, triggering emergency overrides, placing delivery orders) must fire a visual feedback toast via `addToast(type, title, message)`.
- Use interactive hover states (`transition-all duration-200 hover:border-cyan-500/40`).
- Use badges with clear status semantics (`live`, `active`, `synced`, `warning`, `critical`).

---

## 6. Git Commit Rules

The project enforces the **Conventional Commits** specification. Commit messages must be structured as:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Allowed Types:
- `feat`: A new user-facing feature or screen.
- `fix`: A bug fix or patch.
- `docs`: Documentation updates (e.g., `decisions.md`, `memory.md`).
- `style`: Visual styling, theme refinement, CSS tokens (no logic change).
- `refactor`: Code restructuring without changing functional behavior.
- `perf`: Performance optimization.
- `test`: Adding or modifying automated tests.
- `chore`: Tooling, build scripts, dependency bumps.

### Commit Guidelines:
1. Subject line in imperative mood: *"feat: add cold-chain sensor threshold alert to delivery modal"* (not *"added cold-chain sensor"*).
2. Keep the first line under 72 characters.
3. Separate commit for documentation vs. code implementations whenever possible.

---

## 7. Security and Environment Variable Rules

### 7.1 Secrets & API Keys
- **NEVER** commit secret keys, API credentials, private tokens, or connection strings into git.
- Secrets belong in local `.env` files which must remain in `.gitignore`.
- Always update `.env.example` when introducing a new required configuration key.
- For Gemini API calls, use the server-side proxy paradigm; do not expose `GEMINI_API_KEY` to browser client bundles.

### 7.2 HIPAA & Healthcare Compliance Rules
- **No PHI in Git**: Never place real Patient Health Information (PHI), real National Provider Identifiers (NPI), or actual patient medical records into mock datasets.
- Use simulated, synthetic clinical names and fake identifiers (e.g., `Dr. Vikram Rao`, `MD-84920-MA`, `ORD-2026-9481`).
- Ensure audit logging captures actor roles and timestamps whenever configuration or prescription records change.

### 7.3 Client-Side Input Sanitization
- Escape and validate user input prior to rendering.
- Do not use `dangerouslySetInnerHTML` unless explicitly sanitized.
- Enforce length limits and regex pattern checks on prescription numbers, NDC codes, and email inputs.

---

## 8. Quality Assurance Checklist

Before marking any task as complete, an AI assistant must verify:

- [ ] `npm run lint` or `tsc --noEmit` succeeds without errors.
- [ ] No existing tabs (`Overview`, `Catalog`, `Partners`, `Compliance`, `Settings`, `Patient`, `Deliveries`) are broken or missing.
- [ ] Theme toggling between Dark Mode and Light Mode functions seamlessly without unreadable text contrast.
- [ ] Modals can be opened, interacted with, and cleanly dismissed (via `Esc`, backdrop click, or Close button).
- [ ] Numbers, currency symbols (`₹`), and percentages render correctly without NaN or undefined displays.
- [ ] Added or modified features are documented in `changelog.md` and `memory.md`.
