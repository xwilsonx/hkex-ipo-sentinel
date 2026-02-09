# Technical Requirement Document
## Project: HKEX IPO Sentinel

**Version:** 1.0  
**Date:** February 2026  
**Target Audience:** Frontend Engineers, UI/UX Designers, QA

---

### 1. Executive Summary
**HKEX IPO Sentinel** is a next-generation banking interface designed for Private Banking Relationship Managers (RMs). It tracks upcoming Initial Public Offering (IPO) filings on the Hong Kong Exchange and utilizes AI (simulated via Gemini models) to analyze prospectus data, identify high-net-worth individuals associated with these companies, and screen them against existing bank databases to generate "clean" New-to-Bank (NTB) leads.

### 2. Technology Stack
*   **Core Framework:** React 18+ (Functional Components, Hooks)
*   **Language:** TypeScript 5.0+ (Strict Mode)
*   **Build Tool:** Vite 4.3+
*   **Styling:** Tailwind CSS 3.3+
*   **Testing:** Vitest, React Testing Library
*   **Package Manager:** NPM

---

### 3. System Architecture

The application follows a **Clean Architecture** principle adapted for Frontend:

1.  **Presentation Layer (UI):**
    *   **Layouts:** `Layout.tsx` handles the application shell (Header, Navigation, Footer, User Profile).
    *   **Views:** `LandingPage`, `WelcomeScreen`, `IPOList`, `LeadScreening`.
    *   **Visuals:** `InteractiveBackground` (Canvas-based floating orbs).
2.  **Business Logic Layer (Hooks):**
    *   Custom hooks (e.g., `useLeadManager`) encapsulate state transitions, sorting rules, and complex validation logic, separating it from UI rendering.
3.  **Service Layer (Data Access):**
    *   Defined by `IBankingService` interface.
    *   `geminiService` implements the interface (currently using Mock Data).
    *   Allows easy swapping between Mock/Dev/Prod APIs without refactoring components.
4.  **Domain/Data Layer:**
    *   Types defined in `types.ts`.
    *   Static data in `mockData.ts`.

---

### 4. Functional Modules & Requirements

#### 4.1. Landing Page (`LandingPage.tsx`)
*   **Objective:** Secure entry point with corporate branding.
*   **Features:**
    *   HSBC-style Hexagon Logo (SVG).
    *   Animated entry button with loading state.
    *   Simulated SSO delay (1.5s) before authentication.
*   **Transition:** Redirects to `WelcomeScreen`.

#### 4.2. Welcome Screen (`WelcomeScreen.tsx`)
*   **Objective:** Personalized greeting and system initialization.
*   **Features:**
    *   Displays User Name and "Identity Verified" badge.
    *   Staggered CSS animations (`slide-up`).
*   **Logic:** Auto-advances to `IPOList` after 2.5 seconds.

#### 4.3. IPO Watchlist (`IPOList.tsx`)
*   **Objective:** Display upcoming filings and allow selection for screening.
*   **Features:**
    *   **Date Filter:** Filter IPOs by `Listing Date`.
    *   **Selection:** Multi-select IPO cards.
    *   **Screening Trigger:** "Run Screening" button initiates the AI workflow.
*   **Process Flow (Simulation):**
    1.  Scanning Filing Documents (1.5s)
    2.  Analyzing Shareholder Structures (1.5s)
    3.  Matching ETB (Existing-to-Bank) individuals (1.0s)
    4.  Generation via Service (~0.8s)
    5.  Success Notification (1.0s)
    6.  Transition to `LeadScreening`.

#### 4.4. Lead Screening (`LeadScreening.tsx`)
*   **Objective:** Review generated leads, distinguish between conflicts (Existing Clients) and opportunities (New-to-Bank), and assign to RMs.
*   **Data Presentation:**
    *   **Sorting Rule:** Ascending by `matchScore`. Lowest match % (Cleanest leads) appear at the top.
    *   **Visual Differentiation:**
        *   **Actionable (NTB):** White background, clickable "Assign" button, Green Match Meter.
        *   **Non-Actionable (ETB/Conflict):** Grayed out background, "Existing Client" or "Potential Match" label, Red Match Meter.
*   **Assignment Workflow:**
    1.  User clicks "Assign".
    2.  Modal opens with list of RMs.
    3.  Select RM -> "Posting" spinner -> "Success" checkmark.
    4.  Modal closes, Lead status updates to "Assigned" in the list.

---

### 5. Business Rules & Logic

#### 5.1. Lead Actionability
A lead is considered **Actionable (New-to-Bank)** only if:
1.  **Match Score:** <= 5% (Indicates low probability of being an existing client).
2.  **Client Key:** is `undefined` or `null`.

A lead is **Non-Actionable (Conflict)** if:
1.  **Match Score:** > 5% (Potential duplicate).
2.  **Client Key:** Exists (Confirmed existing client).

#### 5.2. Match Score Interpretation
The `matchScore` represents the AI's confidence that the prospect *already exists* in the bank's database.
*   **0-5%:** Clean Lead (High Opportunity).
*   **6-100%:** Potential Conflict / Existing Relationship.

---

### 6. Data Dictionary (`types.ts`)

| Type | Field | Description |
| :--- | :--- | :--- |
| **IPOData** | `ticker` | Stock code (e.g., "9988.HK") |
| | `offeringSize` | String value (e.g., "$3.2B HKD") |
| | `underwriters` | Array of strings (e.g., ["HSBC", "Goldman"]) |
| **Lead** | `matchScore` | Number (0-100). Confidence of database match. |
| | `clientKey` | Optional String. ID of existing client (ETB). |
| | `netWorthEstimate`| String range. |
| | `priority` | 'High' \| 'Medium' \| 'Low' |
| | `status` | 'New' \| 'Assigned' \| 'Contacted' |

---

### 7. UI/UX Design Standards

#### 7.1. Color Palette
*   **Brand Red:** `#db0011` (Primary Actions, Accents, Hover States)
*   **Corporate Dark:** `#2d2d2d` (Headings, Text)
*   **Text Gray:** `#595959` (Subtitles, Metadata)
*   **Background:** `#f5f5f5` (App Background), `#ffffff` (Cards)

#### 7.2. Typography
*   **Font Family:** "Plus Jakarta Sans"
*   **Weights:** Light (300), Regular (400), Medium (500), Bold (700)

#### 7.3. Components
*   **Buttons:** Rectangular, Sharp corners (No Border Radius), Hover lift effect.
*   **Cards:** "Corporate Card" style - White bg, light gray border, subtle shadow, red top border on selection/hover.
*   **Scrollbar:** Custom width (8px), square corners, gray track.

---

### 8. Testing Strategy

#### 8.1. Unit Tests (Vitest)
*   **Business Logic (`useLeadManager`):**
    *   Verify sorting order (Low match score first).
    *   Verify `isLeadActionable` logic (Boundary testing at 5%).
    *   Verify assignment state transitions (Idle -> Posting -> Complete).
*   **Service Layer (`geminiService`):**
    *   Verify Mock Data return structure.
    *   Verify fallback logic if empty inputs provided.
