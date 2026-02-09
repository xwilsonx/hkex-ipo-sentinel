# HKEX IPO Sentinel 🏦

**Next-Generation Private Banking Lead Generation Interface**

> *IPO Sentinel empowers Relationship Managers to capture New-to-Bank (NTB) opportunities from Hong Kong Exchange filings using AI-driven analysis, reducing days of manual research into seconds of actionable intelligence.*

---

## 💼 The Business Journey

### The Challenge: The "Speed-to-Relationship" Gap
In the high-stakes world of Private Banking, an Initial Public Offering (IPO) is a massive liquidity event. Founders and early executives suddenly possess significant liquid wealth.
*   **The Old Way:** Relationship Managers (RMs) manually monitor stock exchange RSS feeds, download 600-page prospectuses (PDFs), read through "Shareholder Structure" sections, and manually cross-reference names against internal client databases (Excel/CRM) to see if they are already clients.
*   **The Pain Point:** This process is slow, prone to human error, and often results in contacting prospects who are already clients of another division (internal conflict) or missing the window of opportunity entirely.

### The Solution: AI-Augmented Workflow
**IPO Sentinel** acts as a force multiplier for the banking team.

#### 1. The Watchlist (Market Intelligence)
The RM logs into a secure, corporate-branded portal. They are presented with a curated list of upcoming listings on the HKEX. Data includes offering size, sector, and underwriters. This replaces the manual monitoring of exchange websites.

#### 2. AI Screening (The Engine)
Instead of reading the prospectus, the RM selects high-potential listings and clicks **"Run Screening"**.
*   **Scanning:** The system ingests the filing documents.
*   **Analysis:** Generative AI (Gemini) extracts Key Management Personnel (KMP) and substantial shareholders. It estimates their post-IPO net worth based on equity stake and offering price.
*   **Conflict Check:** The system cross-references these names against the bank's internal "Existing-to-Bank" (ETB) ledger.

#### 3. Decision & Action
The RM is presented with a sorted list of leads:
*   **Clean Leads (Green):** High net worth, low probability of being an existing client. Action: **Assign** to a frontline banker immediately.
*   **Conflicts (Red):** The system detects the prospect is already a client (e.g., "Client Key: HK-772-104"). Action: **Flagged** to prevent embarrassing double-contact.

#### 4. Assignment
With one click, the lead is routed to a specific Relationship Manager, syncing with the core banking CRM.

---

## 🛠 Technical Highlights

This project demonstrates a **World-Class Frontend Architecture**, moving beyond simple component rendering to a robust, scalable, and testable engineering standard.

### 1. Clean Architecture & Separation of Concerns
We strictly separate the **Presentation Layer** from the **Business Logic**.
*   **View (Components):** `LeadScreening.tsx` contains *no* complex logic. It only handles rendering data and triggering events.
*   **Logic (Hooks):** `useLeadManager.ts` acts as the Controller. It handles sorting algorithms, state transitions (Idle -> Posting -> Complete), and business rules (e.g., *Is this lead actionable?*).
*   **Data (Services):** `geminiService.ts` handles data fetching.

### 2. Service Layer & Dependency Inversion
The application does not fetch data directly inside components.
*   **Interface Definition:** We defined `IBankingService` in `services/interfaces.ts`.
*   **Implementation:** `geminiService.ts` implements this interface using Mock Data (Strategy Pattern).
*   **Benefit:** To go live, we simply create `RealApiService.ts` implementing the same interface and swap the import. No component code needs to change.

### 3. "The AI" Simulation (Deterministic Mocking)
To allow for consistent demoing and testing without incurring API costs or latency during development:
*   We use a **Deterministic Mock Service**.
*   It returns specific, consistent "personas" based on the Ticker selected (e.g., selecting `9988.HK` always returns "Dr. Leon Zhou").
*   This allows UAT testers to verify specific scenarios (e.g., "Check if the Conflict Flag appears for Dr. Sarah Wu").

### 4. Robust Testing Strategy
We employ **Vitest** for unit testing:
*   **Business Logic Tests:** `useLeadManager.test.ts` verifies sorting logic and state machines without rendering UI.
*   **Service Tests:** `geminiService.test.ts` ensures data integrity.

### 5. Corporate Design System
*   **Tailwind CSS:** Used for rapid, utility-first styling.
*   **Custom Animations:** `slide-up`, `fade-in` configured in `tailwind.config` for a premium, native-app feel.
*   **Canvas API:** `InteractiveBackground.tsx` creates a subtle, premium financial atmosphere using floating particles.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   NPM

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run local development server
npm run dev
```

### Testing

```bash
# Run unit tests
npm run test
```

## Important
**MUST READ** the application development environment is running in WSL2 on top of a windows machine. Whenever opens a terminal or command prompt, make sure it is the WSL2 terminal, not the windows terminal. Otherwise, the application will not run.