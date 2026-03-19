# Calendar Tasks — Addax Assessment

A collaborative calendar with event management, authentication, and real-time features. Built with **TypeScript**, **React**, **Node.js**, **MongoDB**, and **Emotion** (CSS-in-JS). No calendar libraries are used; the grid is implemented from scratch.

## Features

### Calendar & Events

- **Month & Week views** — Switch between monthly grid and weekly time slots.
- **Create, edit, delete events** — Full event modal with title, date range, time, colors, and recurrence.
- **Recurring events** — Daily, weekly, monthly, yearly with optional weekdays for weekly.
- **Event series** — Edit or unlink individual occurrences from a series.
- **Color labels** — Assign colors to events (orange, green, blue, purple, yellow).
- **Country binding** — Tie events to specific countries (UA, US, DE, GB, PL) or leave for all.
- **Drag and drop** — Move events between days and reorder within a day.
- **Conflict detection** — Warning when creating/editing overlapping events.
- **Search filter** — Filter events by text; non-matching events are dimmed.
- **Event sidebar** — Browse all events and holidays with filters by type, color, and country.

### Holidays

- **Public holidays** — From [Nager.Date API](https://date.nager.at) for US, UA, DE, GB, PL.
- **Filter by country** — Show/hide holidays per country in the sidebar.

### Authentication & Users

- **Magic link login** — Sign in with email (no password for regular users).
- **Super-admin** — Password-protected; bootstrap via API token.
- **Roles** — `user`, `admin`, `super-admin` with different permissions.
- **Nickname** — Set a unique nickname visible to others on hover.
- **Avatar** — Upload profile photo; shown in header and on event cards.
- **Password reset** — For super-admins via email (SMTP).

### Admin Panel

- **Admin management** (super-admin only) — Add/revoke admin role.
- **User management** (admin & super-admin) — Delete accounts and all their events.
- **Bulk actions** — Make admins, revoke admins, delete users in batch.

### Real-time & Collaboration

- **Online users** — See who’s online in the header (WebSocket).
- **Visibility rules** — Regular users don’t see super-admins online; admins do.
- **Share calendar** — Copy invite link to clipboard.

### Mobile

- **Responsive header** — Logo, online users, event filter, burger menu.
- **Slide-out menu** — Search, create event, share, login/avatar.
- **Compact navigation** — Month title + Today/prev/next + Week|Month tabs in one row.
- **Event sidebar** — Full-width on mobile.

### UX

- **Welcome modal** — One-time info about registered user features (localStorage).
- **Toast notifications** — Success, error, warning, info.
- **i18n** — Strings loaded from server (`/api/content/strings?lang=en`).

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Emotion (CSS-in-JS), Redux Toolkit
- **Backend:** Node.js, Express, TypeScript, Mongoose
- **Database:** MongoDB
- **Real-time:** WebSocket (ws) for online users
- **Auth:** JWT, bcrypt (super-admin), magic link (users)

## Setup

### Prerequisites

- Node.js 18+
- MongoDB: local install, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), or **Docker** (see below)

### MongoDB with Docker

From the project root:

```bash
docker compose up -d
```

MongoDB will listen on `localhost:27017`. Use in `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/addax-calendar
```

Stop: `docker compose down`. Data is kept in a Docker volume `mongodb_data`.

### Backend

```bash
cd server
cp .env.example .env   # set MONGODB_URI, JWT_SECRET, and optionally PORT
npm install
npm run dev
```

Runs at `http://localhost:3001` by default.

### Frontend

```bash
cd client
cp .env.example .env    # optional: VITE_API_URL, VITE_NAGER_DATE_API_URL
npm install
npm run dev
```

Runs at `http://localhost:5173`. API requests to `/api` are proxied to the backend.

### From repo root

```bash
npm install
npm run dev   # runs server + client with concurrently
```

## API

### Tasks

- `GET /api/tasks` — List all tasks (optional `?date=YYYY-MM-DD`)
- `POST /api/tasks` — Create task (auth required)
- `POST /api/tasks/bulk` — Bulk create (auth required)
- `PATCH /api/tasks/:id` — Update task (auth required)
- `PATCH /api/tasks/:id/detach` — Unlink from series (auth required)
- `PATCH /api/tasks/series/:seriesId` — Update series (auth required)
- `PUT /api/tasks/reorder` — Reorder in a cell (auth required)
- `DELETE /api/tasks/:id` — Delete task (auth required)

### Auth

- `GET /api/auth/me` — Get user by email (`?email=`)
- `POST /api/auth/login` — Login (magic link or super-admin password)
- `PATCH /api/auth/me` — Update nickname (auth required)
- `POST /api/auth/avatar` — Upload avatar (auth required)
- `GET /api/auth/avatar` — Get avatar by email
- `POST /api/auth/admins` — Add/revoke admin (super-admin only)
- `GET /api/auth/users` — List users for admin panel (auth required)
- `DELETE /api/auth/users/:email` — Delete user (admin/super-admin only)
- `POST /api/auth/password-reset/request` — Request reset email
- `POST /api/auth/password-reset/reset` — Reset with token

### Content

- `GET /api/content/strings?lang=en` — i18n strings

### WebSocket

- `ws://host/ws` — Online users; send `{ type: "register", name, email }` after connect.

## Deploy

- **Frontend (Vercel):** Deploy the `client` folder; set `VITE_API_URL` to your backend URL if not same-origin.
- **Backend:** Deploy to Railway, Render, or any Node host; set `MONGODB_URI`, `JWT_SECRET`, and optionally `PORT`.
- **WebSocket:** Ensure the same server handles `/ws` upgrade for online users.
