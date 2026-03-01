# Student Transportation Management System

Municipal-grade system for managing student bus transportation. Only authenticated drivers can scan student QR codes during their active work session. Each scan deducts from the student's daily trip allowance.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: JWT + Refresh Tokens, RBAC

## Roles

| Role       | Description                                      |
| ---------- | ------------------------------------------------ |
| ADMIN      | Municipality admin. Full CRUD, analytics, export. |
| DRIVER     | Scans student QR codes during active shift.      |
| BUS_OWNER  | Aggregated fleet statistics. No student PII.    |
| STUDENT    | Passive. No login. QR codes for scanning only.   |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm or npm

### Setup

1. Clone and install:

```bash
cd bus-project
npm install
```

2. Configure environment:

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets
```

3. Database:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Run development:

```bash
npm run dev
```

- Client: http://localhost:3000
- Server: http://localhost:4000

### Seed Credentials

- **Admin**: admin@municipality.gov / Admin123!
- **Driver**: driver@bustransport.com / Admin123!
- **Bus Owner**: owner@bustransport.com / Admin123!

## Project Structure

```
/client          # React frontend
  /features      # Auth, scan
  /pages         # Login, Driver, Admin, Bus Owner
  /components
  /lib           # API client

/server          # Express backend
  /modules       # auth, shift, scan, admin, driver, busOwner
  /middlewares   # auth, rateLimit, errorHandler
  /routes
  /lib           # Prisma client

/prisma          # Schema, migrations, seed
/docs            # SECURITY.md, SCALABILITY.md
```

## Key Flows

### Driver Flow

1. Login as Driver
2. Click "Start Shift" (requires assigned bus)
3. Select direction: To University / From University
4. Scan student QR code
5. Immediate feedback: success or limit reached

### Student QR Logic

- Max 2 scans per calendar day (UTC)
- One TO_UNIVERSITY, one FROM_UNIVERSITY
- On second scan of same direction: blocked for the day
- Reset at day start (UTC)

### Security

See [docs/SECURITY.md](docs/SECURITY.md) for authentication, RBAC, QR protections, and audit trail.

### Scalability

See [docs/SCALABILITY.md](docs/SCALABILITY.md) for horizontal scaling, performance, and deployment notes.

## API Overview

| Endpoint              | Method | Auth   | Description        |
| --------------------- | ------ | ------ | ------------------ |
| /api/auth/login       | POST   | -      | Login              |
| /api/auth/refresh     | POST   | -      | Refresh tokens     |
| /api/shifts/start     | POST   | Driver | Start shift        |
| /api/shifts           | GET    | Driver | List shifts        |
| /api/scan             | POST   | Driver | Scan QR (active shift) |
| /api/driver/me        | GET    | Driver | Driver profile     |
| /api/driver/report    | GET    | Driver | Daily report       |
| /api/admin/*         | *      | Admin  | CRUD, analytics    |
| /api/bus-owner/stats | GET    | Owner  | Fleet statistics   |

## License

Proprietary. Municipal use.
# bus-service
