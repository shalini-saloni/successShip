# ContextOS — AI Agent Memory Management System

Full-stack React + Node.js + MongoDB application.

---

##  Complete Setup — Commands From Scratch

### Prerequisites
Make sure these are installed first:
- **Node.js** v18+  →  https://nodejs.org
- **npm** v9+  (comes with Node)
- **MongoDB** v6+  →  https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (free cloud DB, no local install needed)
- **Git** (optional, for cloning)

Check versions:
```bash
node -v        # should print v18.x or higher
npm -v         # should print 9.x or higher
mongod --version   # should print v6.x or higher (local only)
```

---

## Step 1 — Clone or copy the project

```bash
# If using git:
git clone <your-repo-url>
cd contextOS

# Or just unzip and cd into the folder:
cd contextOS
```

---

## Step 2 — Install Frontend Dependencies

```bash
# From the root contextOS/ folder:
npm install
```

---

## Step 3 — Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

---

## Step 4 — Configure MongoDB

### Option A: Local MongoDB

Start MongoDB locally (if installed):
```bash
# macOS (Homebrew):
brew services start mongodb-community

# Ubuntu/Debian:
sudo systemctl start mongod

# Windows: MongoDB runs as a service automatically after install
# Or manually: mongod --dbpath C:\data\db
```

Create the backend `.env` file:
```bash
cd server
cp .env.example .env
```

Open `server/.env` — it should look like this (default works for local MongoDB):
```
MONGO_URI=mongodb://localhost:27017/contextos
PORT=3001
NODE_ENV=development
```

### Option B: MongoDB Atlas (free cloud, no install)

1. Go to https://cloud.mongodb.com → create free account
2. Create a free M0 cluster
3. Click **Connect** → **Drivers** → copy the connection string
4. It looks like: `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/`

Create `server/.env`:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/contextos
PORT=3001
NODE_ENV=development
```

---

## Step 5 — Seed the Database

This inserts the 9 initial memory records (run once):
```bash
cd server
node seed.js
```

You should see:
```
  Connected to MongoDB
   Cleared 0 existing memory records
  Inserted 9 memory records:
    [m001] 30% broken products delivery
    [m002] Monsoon warehouse road damage
     ...
  Seed complete!
```

---

## Step 6 — Start the Backend Server

```bash
# From the server/ folder:
npm start

# Or in watch mode (auto-restart on file changes):
npm run dev
```

You should see:
```
  MongoDB connected: localhost
  ContextOS API  →  http://localhost:3001
```

Test it:
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/memories
```

---

## Step 7 — Start the Frontend

Open a **new terminal**, go back to the root folder:
```bash
cd contextOS      # root folder (not server/)
npm run dev
```

Open your browser: **http://localhost:5173**

The Topbar will show **"API Connected"** (green) when the backend is reachable, or **"Offline Mode"** (yellow) if it's not running.

---

## Full Project Structure

```
contextOS/
├── package.json              ← Frontend (React/Vite) deps
├── vite.config.js            ← Vite config + /api proxy to :3001
├── index.html
├── .env.example              ← Frontend env template
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── App.jsx               ← Root component, page routing
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── api/                  ← REST client (fetch wrappers)
│   │   ├── client.js         ← Base fetch, error handling
│   │   ├── memories.js       ← GET/POST/PUT/DELETE memories
│   │   ├── decisions.js      ← Run decision engine
│   │   ├── analytics.js      ← Analytics endpoint
│   │   └── index.js          ← Barrel exports
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx   ← Collapsible nav sidebar
│   │   │   └── Topbar.jsx    ← API status indicator
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MemoryStore.jsx
│   │   │   ├── DecisionEngine.jsx
│   │   │   ├── Inspector.jsx
│   │   │   ├── AddMemory.jsx
│   │   │   └── Analytics.jsx
│   │   └── ui/               ← Reusable UI primitives
│   │       ├── Panel.jsx
│   │       ├── Pill.jsx
│   │       ├── ScoreBar.jsx
│   │       ├── StatCard.jsx
│   │       ├── MemoryTypeIcon.jsx
│   │       ├── PageHeader.jsx
│   │       └── index.js
│   │
│   ├── data/                 ← Static fallback (offline mode)
│   │   ├── constants.js
│   │   ├── memories.js
│   │   ├── scenarios.js
│   │   └── decisions.js
│   │
│   ├── hooks/
│   │   ├── useMemories.js    ← API + offline fallback
│   │   └── useDecisionEngine.js
│   │
│   └── utils/
│       ├── theme.js          ← Design tokens
│       ├── scoring.js        ← Relevance score computation
│       └── styleHelpers.js
│
└── server/                   ← Node.js + Express + MongoDB backend
    ├── index.js              ← Express app entry point
    ├── seed.js               ← DB seed script
    ├── package.json          ← Backend dependencies
    ├── .env.example          ← Copy to .env
    │
    ├── config/
    │   └── db.js             ← Mongoose connect()
    │
    ├── models/               ← Mongoose schemas
    │   ├── Memory.js         ← Memory document schema
    │   └── DecisionLog.js    ← Decision audit log schema
    │
    ├── routes/
    │   ├── memories.js       ← CRUD /api/memories
    │   ├── decisions.js      ← POST /api/decisions/run
    │   ├── analytics.js      ← GET /api/analytics (aggregation pipeline)
    │   └── entities.js       ← GET /api/entities
    │
    └── middleware/
        ├── validate.js       ← express-validator integration
        └── errorHandler.js   ← Mongoose + global error handler
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server + DB status |
| GET | `/api/memories` | List all memories |
| GET | `/api/memories?entity=Supplier XYZ` | Filter by entity |
| GET | `/api/memories?type=episodic` | Filter by type |
| GET | `/api/memories?staleness=fresh` | Filter by staleness |
| GET | `/api/memories?search=payment` | Full-text search |
| GET | `/api/memories/:id` | Get by id or memoryId |
| POST | `/api/memories` | Create memory |
| PUT | `/api/memories/:id` | Update memory |
| DELETE | `/api/memories/:id` | Delete memory |
| GET | `/api/entities` | All entity names |
| GET | `/api/entities/:name/memories` | Memories for entity |
| GET | `/api/decisions` | Recent decision log |
| POST | `/api/decisions/run` | Run decision engine |
| GET | `/api/analytics` | Aggregated analytics |

### POST /api/memories — Body

```json
{
  "entity":       "Supplier XYZ",
  "type":         "episodic",
  "category":     "quality",
  "title":        "New quality issue",
  "content":      "Details about the issue...",
  "impact":       "high",
  "staleness":    "fresh",
  "weight":       0.85,
  "tags":         ["quality", "risk"],
  "relatedIds":   ["m001"],
  "emotionalFlag": false
}
```

### POST /api/decisions/run — Body

```json
{ "scenarioId": "invoice" }
```
or
```json
{ "scenarioId": "support" }
```

---

## MongoDB Collections

| Collection | Description |
|------------|-------------|
| `memories` | All memory records with text search index |
| `decisionlogs` | Audit log of every decision engine run |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 4, Lucide React |
| Fonts | DM Sans + DM Mono (Google Fonts) |
| API Client | Native `fetch` with error handling |
| Backend | Node.js 18, Express 4 |
| Database | MongoDB 6 via Mongoose 8 |
| Validation | express-validator |
| Logging | Morgan |
| Dev tools | Nodemon, ESLint |
