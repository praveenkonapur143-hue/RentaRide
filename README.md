# RentaRide — Zoomcar-Style Self-Drive Car Rental Platform

> **"Self-Drive Freedom Across India • Drive Smarter, Travel Easier."**

**RentaRide** is a full-stack, responsive multi-user vehicle rental management platform tailored for the **Indian automotive and self-drive car rental market**, styled and architected after industry leader **Zoomcar India**.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, **Prisma ORM**, and **Recharts**.

---

## 🌟 Key Features

### 1. 100% Self-Drive Passenger Car Fleet
- **Zero Two-Wheelers & Zero Heavy Commercials**: Purely dedicated to self-drive consumer passenger cars.
- **5 Zoomcar Categories**:
  - **Hatchbacks**: Maruti Suzuki Swift ZXi+, Tata Tiago EV Tech Lux
  - **Sedans**: Honda City ZX, Volkswagen Virtus GT Plus DSG
  - **SUVs & 4x4**: Mahindra Thar LX 4x4, Hyundai Creta SX (O), Tata Nexon Fearless+ S, Mahindra Scorpio-N Z8L 4x4, Toyota Fortuner Legender 4x4, Kia Seltos GTX+ Turbo
  - **7-Seaters & MPVs**: Toyota Innova Crysta 2.4 VX
  - **Luxury Cars**: Mercedes-Benz E-Class E200 Exclusive
- **Authentic Vehicle Photography**: Every car displays real-world photos matching its exact model, variant, and styling.
- **Indian RTO Registration Numbers**: Authentic registration plates (`DL 01 AB 4321`, `GA 03 AB 9999`, `HR 26 DQ 8821`, `MH 12 TS 3412`, `KA 04 MP 4455`, etc.).

### 2. Zoomcar-Inspired Booking Experience
- **Kilometre Packages**:
  - **Commute (120 km/day)**: Economical choice for intra-city meetings & daily chores.
  - **Traveler (300 km/day)**: Ideal for weekend road trips and hill-station getaways.
  - **Unlimited Kms**: Complete freedom with zero mileage overage charges.
- **Delivery Modes**:
  - **Airport / Metro Hub Self-Pickup**: Kempegowda BLR, IGI Delhi T3, CSMIA Mumbai T2, Dabolim Goa, etc.
  - **Doorstep Delivery**: Sanitized car brought straight to residence or hotel (+₹300 flat).
- **Zoom Shield Protection Plans**:
  - **Standard Protection Plan** (Included Free): Damage liability capped at ₹5,000.
  - **Peace of Mind Plan** (+₹350/day): Complete zero damage liability (₹0 liability) + 24x7 roadside towing.

### 3. Indian Compliance, KYC & Taxation
- **Aadhaar & PAN Verification**: Secure CRM capture for 12-digit masked Aadhaar and PAN cards.
- **Indian Driving Licence Verification**: LMV licence records with DigiLocker verification flags.
- **FASTag Automation**: Pre-loaded electronic toll deduction for seamless NHAI toll plaza passage.
- **GST Tax Invoices**: Full GSTIN itemization (18% GST: 9% CGST + 9% SGST) with HSN/SAC Code `9966`.
- **Instant UPI QR Code**: Scan-to-pay box compatible with Google Pay, PhonePe, Paytm, and BHIM UPI with UTR transaction reference logging.

### 4. Fleet Management & Operations
- **Double-Booking Collision Engine**: Mathematically guarantees no overlapping confirmed bookings for any vehicle.
- **Digital Inspection Checklists**: Check-out and return inspections with fuel levels, odometer reading, tyre checks, and automated damage assessment.
- **Damage Incident Reports**: Severity tagging (`MINOR`, `MODERATE`, `SEVERE`), liability assignment, and invoice adjustments.
- **Maintenance & 60-Day Expiry Radar**: Workshop expenses tracking and proactive alerts for impending Insurance, Registration, and PUC certificate expirations.
- **Executive Analytics & Reports**: Gross yield, revenue, workshop costs, and vehicle utilization leaderboards with one-click CSV export.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Data Resilience**: Dual-mode data layer with instant in-memory fallback for zero-config offline demonstration
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Test Suite**: [Vitest](https://vitest.dev/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/praveenkonapur143-hue/RentaRide.git
cd RentaRide
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

> **Note**: RentaRide features an integrated **Demo Resilience Provider**. If PostgreSQL is not connected, the application automatically runs using realistic in-memory demo data with zero setup!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Demo Credentials (Instant 1-Click Access)

On the login page ([http://localhost:3000/login](http://localhost:3000/login)), click either 1-click button:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@rentaride.com` | `admin123` | Full fleet control, pricing, settings, user management, and archiving |
| **Staff** | `staff@rentaride.com` | `staff123` | Customer CRM, booking creation, check-outs, and return inspections |

---

## 🧪 Running Automated Tests

Run the Vitest test suite:

```bash
npm test
```

Verifies booking calculation engines, 18% GST tax breakdowns, security deposits, availability collision matrices, and payment reconciliations.

---

## ⏱️ Background Worker Jobs

```bash
# Scan fleet for expiring insurance, registration, and pollution certificates
npm run worker:expiry

# Scan active rentals for overdue returns
npm run worker:overdue
```

---

## 📄 License

MIT License. Designed and developed for RentaRide Fleet Mobility Systems.
