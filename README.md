
# e111-booking: High-Performance Booking System

A modern, full-stack booking system built with **Nuxt 3**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**. Designed for high performance, scalability, and excellent user experience.

## 🚀 Features

### Client Side
- **5-Step Booking Flow**: Branch -> Service -> Staff -> Time -> Confirmation.
- **Real-time Availability**: Checks time slots against operating hours and existing bookings.
- **Responsive Design**: Optimized for mobile and desktop using Tailwind CSS.
- **User Friendly**: Smooth transitions and clear feedback.

### Admin Dashboard (`/admin`)
- **Secure Login**: Simple password-based authentication.
- **Booking Management**: View all bookings with status filters (Pending/Confirmed).
- **Staff Management**: (Planned) Manage staff schedules and assignments.
- **System Settings**: Configure notification tokens and business rules.

### Backend API
- **RESTful Endpoints**: Clean and structured API for all operations.
- **Transaction Safety**: Uses Prisma transactions to ensure data integrity during booking creation.
- **Smart Allocation**: Auto-assigns available staff if the user selects "No Preference".
- **Notification Integration**: Built-in support for LINE Notify and Email via SendGrid/Resend (Mock implemented).

## 🛠 Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3 + Nitro)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Production) / SQLite (Dev)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Vercel / Docker

## 📂 Project Structure

```bash
e111/
├── e111-booking/       # Main Nuxt Application
│   ├── app/            # Vue Pages & Components
│   ├── server/         # API Routes & Utilities
│   ├── prisma/         # Database Schema & Migrations
│   └── public/         # Static Assets
├── docs/               # Documentation
│   ├── DEPLOYMENT.md   # How to deploy
│   ├── INTEGRATION.md  # API Keys setup
│   └── FUTURE.md       # Roadmap
└── dev_log.md          # Development Log
```

## 🏁 Getting Started

1.  **Install Dependencies**
    ```bash
    cd e111-booking
    npm install
    ```

2.  **Database Setup** (Default: SQLite)
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    # Server running at http://localhost:3000
    ```

4.  **Access Admin Panel**
    - URL: `http://localhost:3000/admin`
    - Default Password: `admin123`

## 📄 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Integration Guide](./docs/INTEGRATION_GUIDE.md)
- [Future Features](./docs/FUTURE_FEATURES.md)
- [Development Log](./dev_log.md)

## 📜 License

MIT License
