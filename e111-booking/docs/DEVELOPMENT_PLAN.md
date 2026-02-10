# E111-Booking System Development Plan

**Last Updated:** 2026-02-11
**Version:** 1.0 (Alpha Complete)
**Status:** Phase 1 Completed / Phase 2 Planning

---

## 1. Project Overview (專案概觀)
Target: Develop a modern, responsive booking system for "金指藝" massage parlor.
Key Features: Branch selection, Service selection, Staff selection (with No-Preference logic), Real-time Availability, Booking Confirmation.

### Tech Stack (技術架構)
*   **Frontend**: Nuxt 3 (Vue 3 + Composition API)
*   **Styling**: Tailwind CSS v3 (Custom Config)
*   **Backend**: Nuxt Server (Nitro)
*   **Database**: SQLite (`file:./dev.db`) via Prisma ORM
*   **Deployment**: Validated for Vercel/Node environment (Standard Nuxt Build)

---

## 2. Roadmap & Phases (開發里程碑)

### ✅ Phase 1: Infrastructure & Core Booking Flow (Completed)
*   **Environment**: Established Nuxt 3 + SQLite + Tailwind v3 stack. Resolved Docker/Port/Tailwind v4 conflicts.
*   **Database**: Designed Schema (Branch, Service, Staff, Booking). Seeded initial data.
*   **API**:
    *   `GET /api/branches`: List active branches.
    *   `GET /api/services`: List categories & services.
    *   `GET /api/staff`: List staff by branch.
    *   `GET /api/availability`: Calculate free slots (Mock/Logic Beta).
*   **UI (steps 1-5)**:
    *   Branch Selection.
    *   Service Selection (Tabs).
    *   Staff Selection (Photo + Level + "Any Staff").
    *   Time Selection (Date Picker + Slots).
    *   Booking Summary (Confirmation Page).

### ⏳ Phase 2: Booking Logic & Order Management (Next Step)
*   **API Implementation**:
    *   `POST /api/bookings`:
        *   Validate slot availability again (double-booking check).
        *   Create Booking record.
        *   (Optional) Create Customer record if new.
*   **Frontend**:
    *   **Form**: User Details (Name, Phone, Email, Note).
    *   **Success Page**: Booking Reference ID, Summary, "Add to Calendar".
*   **Notification System (Mock)**:
    *   Log email/LINE notifications to console (Preparation for Phase 4).

### 📅 Phase 3: Admin Dashboard (Internal Management)
*   **Authentication**: Basic Admin Login (Hardcoded or DB-based).
*   **Dashboard UI**:
    *   **Calendar View**: Daily/Weekly view of bookings per staff.
    *   **Booking List**: Filter by status (Pending, Confirmed, Cancelled).
*   **Management**:
    *   **Staff Management**: Toggle Active status, Edit Schedule.
    *   **Service Management**: Edit Prices/Durations.

### 🔗 Phase 4: External Integrations (Production Ready)
*   **LINE OA Integration**:
    *   Push Notification on Booking Success.
    *   Reminder (Cron Job) 2 hours before.
*   **Email**: SendGrid/Resend integration.
*   **SMS**: Verification code (Optional).

---

## 3. Architecture Details (架構細節)

### Database Schema (Prisma)
```prisma
model Branch { ... }
model ServiceCategory { ... }
model Service { ... }
model Staff { ... }
model Booking {
  id        Int      @id @default(autoincrement())
  startTime DateTime
  endTime   DateTime
  status    String   // Pending, Confirmed, Cancelled, Completed
  staffId   Int?     // Nullable for "Any Staff" intent (but usually resolved to specific staff at booking time)
  userId    Int?     // For registered members
  guestName String?  // For guest bookings
  guestPhone String?
}
```

### API Structure
*   `server/api/bookings/create.post.ts`: Order submission.
*   `server/api/admin/*`: Protected admin routes.

---

## 4. Immediate Action Items (當前待辦)
1.  **Create Booking API**: Define request body validation (Zod/Valibot).
2.  **UI - Step 5 Form**: Add input fields for Customer Name/Phone.
3.  **Concurrency Handling**: Ensure `availability` check is atomic or re-checked before insertion.

---

## 5. Development Guidelines (開發規範)
*   **State Management**: Use `useState` or `Pinia` (if complex) for booking flow data.
*   **Styling**: Use Tailwind utility classes. NO pure CSS unless for animations.
*   **Type Safety**: Share types between API (server) and Frontend via `shared/types.ts` or automatic inference.
