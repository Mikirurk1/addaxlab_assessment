# Calendar Tasks — Addax Assessment

A calendar grid with task management: create, edit, reorder, and move tasks between days. Built with **TypeScript**, **React**, **Node.js**, **MongoDB**, and **Emotion** (CSS-in-JS). No calendar libraries are used; the grid is implemented from scratch.

## Features

- **Inline create/edit** — Add and edit tasks directly in calendar cells (double-click to edit).
- **Drag and drop** — Move tasks between days and reorder tasks within a day.
- **Search filter** — Filter tasks by text; non-matching tasks are dimmed.
- **Worldwide holidays** — Public holidays per day from [Nager.Date API](https://date.nager.at) (US, UA, DE, GB, PL). Holiday names are fixed in the cell and are not draggable.
- **Persistence** — Tasks stored in MongoDB via a Node.js CRUD API.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Emotion (CSS-in-JS)
- **Backend:** Node.js, Express, TypeScript, Mongoose
- **Database:** MongoDB

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
cp .env.example .env   # set MONGODB_URI and optionally PORT
npm install
npm run dev
```

Runs at `http://localhost:3001` by default.

### Frontend

```bash
cd client
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

- `GET /api/tasks` — list all tasks (optional `?date=YYYY-MM-DD`)
- `POST /api/tasks` — create task `{ date, title, order? }`
- `PATCH /api/tasks/:id` — update task `{ date?, title?, order? }`
- `PUT /api/tasks/reorder` — reorder in a cell `{ date, taskIds: string[] }`
- `DELETE /api/tasks/:id` — delete task

## Deploy

- **Frontend (Vercel):** Deploy the `client` folder; set `VITE_API_URL` to your backend URL if not same-origin.
- **Backend:** Deploy to Railway, Render, or any Node host; set `MONGODB_URI` and optionally `PORT`.

## License

MIT

# addaxlab_assessment
