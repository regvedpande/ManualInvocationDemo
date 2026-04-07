# Manual Invocation — Interactive Demo

> **Live Demo:** [View on Vercel →](https://manual-invocation-demo.vercel.app)

A fully interactive mock demo of a **financial pledge invocation workflow** used by NBFCs and lending institutions in India. Built to demonstrate real-world enterprise fintech UX — no backend, no login required.

---

## What Is Pledge Invocation?

When a borrower takes a loan against pledged shares and defaults, the lender must **invoke** (claim) those shares. This system manages the **Manual Invocation workflow** — the multi-stage approval process that governs this operation.

---

## Approval Workflow

```mermaid
flowchart LR
    A([Initiator\nSubmits Request]) --> B{Account Maker\nReview}
    B -->|Approve| C{Account Checker\nReview}
    B -->|Reject| R([❌ Rejected])
    C -->|Approve| D{Risk Team\nFinal Approval}
    C -->|Reject| R
    D -->|Approve| E([✅ Invocation\nExecuted])
    D -->|Reject| R

    style A fill:#3b82f6,color:#fff,stroke:none
    style B fill:#f59e0b,color:#fff,stroke:none
    style C fill:#8b5cf6,color:#fff,stroke:none
    style D fill:#0369a1,color:#fff,stroke:none
    style E fill:#059669,color:#fff,stroke:none
    style R fill:#dc2626,color:#fff,stroke:none
```

---

## System Architecture

```mermaid
graph TD
    subgraph Frontend ["Frontend (This Demo)"]
        UI[React + Material UI]
        CTX[AppContext — Global State]
        UI <--> CTX
    end

    subgraph Pages
        P1[Dashboard]
        P2[Initiate Invocation]
        P3[Account Maker]
        P4[Account Checker]
        P5[Risk Approval]
        P6[Target DP Master]
    end

    subgraph Backend ["Backend (ASP.NET Core 6 — Actual System)"]
        API[REST API Controllers]
        DAL[DAL — Raw ADO.NET]
        DB[(SQL Server\nStored Procedures)]
        API --> DAL --> DB
    end

    CTX --> P1 & P2 & P3 & P4 & P5 & P6
    UI -.->|"HTTP + AuthToken header"| API
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant I as Initiator
    participant M as Account Maker
    participant C as Account Checker
    participant R as Risk Team
    participant SYS as System

    I->>SYS: Submit invocation (ISIN, Qty, CMP, Docs)
    SYS-->>M: New request in Maker queue
    M->>SYS: Approve / Reject with remarks
    alt Approved by Maker
        SYS-->>C: Request moves to Checker queue
        C->>SYS: Approve / Reject with remarks
        alt Approved by Checker
            SYS-->>R: Request moves to Risk queue
            R->>SYS: Final Approve / Reject
            alt Final Approved
                SYS-->>I: ✅ Invocation Executed
            else Rejected
                SYS-->>I: ❌ Rejected at Risk
            end
        else Rejected
            SYS-->>I: ❌ Rejected at Checker
        end
    else Rejected
        SYS-->>I: ❌ Rejected at Maker
    end
```

---

## Domain Concepts

| Term | Meaning |
|---|---|
| **ISIN** | International Securities Identification Number — uniquely identifies a stock |
| **Pledger** | The borrower who pledged shares as loan collateral |
| **Pledgee** | The lender (NBFC/bank) holding the pledge |
| **DP ID / Client ID** | Depository Participant ID + account number in CDSL/NSDL |
| **CMP** | Current Market Price of the pledged share |
| **Invocation** | The act of the lender claiming the pledged shares |
| **PSN** | Pledge Sequence Number — unique ID for the pledge transaction |
| **Drawing Power** | Maximum loan amount drawable against the collateral |
| **UTR** | Unique Transaction Reference — bank transaction identifier |
| **Maker-Checker** | Dual-control: one person initiates, another approves |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + Vite |
| Component Library | Material UI v5 |
| Charts | Recharts |
| Routing | React Router v6 |
| State | React Context API |
| Deploy | Vercel |
| Backend (real system) | ASP.NET Core 6.0 |
| Database (real system) | Microsoft SQL Server + Stored Procedures |
| Auth (real system) | Custom `AuthToken` header → `TOKEN_VALIDATE` SP |

---

## How to Explore the Demo

1. **Dashboard** — See live stats and the workflow guide
2. **Initiate Invocation** → Fill the form and submit a new request
3. **Account Maker** → Approve the request (it moves to Checker)
4. **Account Checker** → Approve again (it moves to Risk)
5. **Risk Approval** → Give final approval (status becomes ✅ Approved)
6. **Target DP Master** → Add/manage destination demat accounts

> All state is live in-memory — approvals in one tab update counts in the sidebar badges immediately.

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx        ← Global state (invocations, CRUD, derived views)
├── components/
│   ├── Layout.jsx            ← Responsive sidebar + topbar
│   ├── StatusChip.jsx        ← Colour-coded status badges
│   └── PageHeader.jsx        ← Consistent page headers
├── pages/
│   ├── Dashboard.jsx         ← Stats, charts, workflow guide
│   ├── InvocationInitiation.jsx
│   ├── AccountMaker.jsx
│   ├── AccountChecker.jsx
│   ├── RiskApproval.jsx      ← Risk scoring + auto-approve mode
│   └── TargetDPMaster.jsx
├── mockData.js               ← Seed data (8 requests, 3 target DPs)
└── theme.js                  ← MUI theme (Inter font, custom palette)
```

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

*Built as a portfolio demo. The backend (ASP.NET Core + SQL Server) is a separate production system by CYLSYS for FinSmart.*
