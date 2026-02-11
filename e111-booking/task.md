
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
