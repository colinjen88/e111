
# Task Checklist: E111 Booking System

## Phase 1: Infrastructure & Core Flow (Completed)
- [x] **Environment Setup**
    - [x] Nuxt 3 Project Init
    - [x] Tailwind CSS v3 Config
    - [x] SQLite + Prisma Setup
- [x] **Backend API (Read-Only)**
    - [x] `GET /api/branches`
    - [x] `GET /api/services`
    - [x] `GET /api/staff`
    - [x] `GET /api/availability` (Logic Implemented)
- [x] **Frontend UI (Booking Wizard)**
    - [x] Step 1: Branch Selection
    - [x] Step 2: Service Selection
    - [x] Step 3: Staff Selection
    - [x] Step 4: Time Selection
    - [x] Step 5: Summary View

## Phase 2: Booking Submission (Completed)
- [x] **API: Create Booking**
    - [x] Schema Validation (Body: name, phone, slot...)
    - [x] Double-booking Check
    - [x] DB Insertion
- [x] **Frontend: Customer Form**
    - [x] Add Name/Phone/Note inputs to Step 5
    - [x] Form Validation
- [x] **Frontend: Success Page**
    - [x] Display Booking ID
    - [x] "Back to Home" button

## Phase 3: Admin Dashboard (Completed)
- [x] **Admin Layout** (`layouts/admin.vue`)
- [x] **Authentication** (Simple Password API)
- [x] **Booking Manager** (Dashboard List)
- [x] **Middleware** (Route Protection)

## Phase 4: Integrations (Completed)
- [x] **Notification Service** (Mock)
    - [x] `utils/notify.ts`: Centralized logic for LINE(Push)/Email
    - [x] Console Logging (Simulation)
- [x] **API Integration**
    - [x] `POST /api/bookings`: Trigger notifications on success
- [x] **Admin Settings**
    - [x] `pages/admin/settings.vue`: UI for configuring tokens

## Phase 5: UI/UX Renewal (Completed)
- [x] **Global Styling**
    - [x] Update `tailwind.config.ts` with brand colors #8B0000 (Dark Red)
    - [x] Import Chinese fonts (Noto Sans TC/Serif)
- [x] **Index Page Redesign** (`pages/index.vue`)
    - [x] Hero Section with Background Image & Gradient overlay
    - [x] "御手國醫" Branding & Logo
    - [x] Responsive CTA Button
- [x] **Layout Optimization**
    - [x] Ensure mobile-first approach

## Phase 6: Member Services (In Progress)
- [x] **Backend API**
    - [x] `POST /api/orders/lookup`: Verify Ref + Phone
    - [x] `POST /api/orders/cancel`: Cancel Logic
- [x] **Frontend UI**
    - [x] `/order` (Lookup Entry Page)
    - [x] `/order/[ref]` (Detail & Cancel Page)
    - [x] Add Footer Links (Lookup/Admin)
    - [x] `/privacy` (Privacy Policy)
    - [x] `/terms` (Terms of Service)
    - [x] `/privacy` (Privacy Policy)
    - [x] `/terms` (Terms of Service)
- [x] **Admin Enhancements**
    - [x] `GET /api/admin/stats` (Revenue API)
    - [x] Dashboard UI (Charts & Summary Cards)
    - [x] Calendar View (`/admin/calendar`)

## Phase 7: Optimization & Refactoring (Stable)
- [x] **SSR/Hydration Fixes**
    - [x] `@vueuse/motion` SSR integration fix.
    - [x] Disabled SSR for `pages/index.vue` to prevent hydration mismatches.
    - [x] Wrapped animated components in `ClientOnly` to stabilize layout.
- [x] **GitHub Integration**
    - [x] Pushed latest fixes to remote repository.

## Phase 8: Staff & Leave Management
    - [x] Implemented Staff Management UI with weekly schedule editor
    - [x] Added Leave Management UI for recording technician time-off
    - [x] Refactored availability API to respect individual staff schedules and approved leaves
    - [x] Integrated Database migrations for `StaffSchedule` and `StaffLeave` models
- [x] Phase 9: Real Notification Integrations
    - [x] Implemented LINE Notify integration with token configuration
    - [x] Integrated Resend for automated customer confirmation emails
    - [x] Developed a unified `notifyBooking` trigger for multiple channels
    - [x] Upgraded Admin Settings UI for managing third-party API keys
- [x] Phase 10: Client Membership System
    - [x] Enhanced `Customer` schema with `password`, `points`, and `memberLevel`
    - [x] Implemented JWT-less secure cookie session auth for members
    - [x] Created Member Dashboard for viewing personal booking history and points
    - [x] Added Phone/Password Registration and Login flows
    - [x] Integrated Member Center links into Homepage and Navigation
- [x] Phase 11: Staff Portal
    - [x] Added `password` field to Staff model and seeded default credentials
    - [x] Implemented Staff Login API & Middleware
    - [x] Created Mobile-First Staff Dashboard (`/staff/dashboard`)
    - [x] Developed Booking Task List for technicians
- [x] Phase 12: Integrated System Hub (Startup Page)
    - [x] Created `startup.vue` as a premium "Command Center" for the local environment
    - [x] Unified all 4 major entry points (Public, Member, Staff, Admin) in one UI
    - [x] Added system status and environment indicators




