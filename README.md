# NoteFlow — Full Stack Notes App

A fully functional full-stack web application built with Node.js, Express, Supabase, and vanilla JavaScript. Features real user authentication, secure password hashing, JWT tokens, and full CRUD operations for notes.

---

## 🌐 Live Demo

- **Frontend:** https://my-app-frontend.vercel.app
- **Backend:** https://my-app-backend.onrender.com

---

## ✨ Features

- User signup and login with email and password
- Passwords securely hashed with bcrypt
- JWT token based authentication
- Sessions last 7 days
- Create, view and delete notes
- Each user only sees their own notes
- Fully deployed and live on the internet
- Responsive design works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via Supabase |
| Authentication | JWT tokens + bcrypt |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 📁 Project Structure

```
my-app/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js            # Checks if user is logged in
│   ├── routes/
│   │   ├── auth.js            # Signup and login endpoints
│   │   └── notes.js           # Create, get and delete notes
│   ├── .env                   # Secret keys (not uploaded to GitHub)
│   ├── .gitignore             # Files to ignore in GitHub
│   ├── package.json           # Project dependencies
│   ├── server.js              # Main entry point of backend
│   └── supabaseClient.js      # Connects to Supabase database
│
└── frontend/
    ├── app.js                 # API calls and helper functions
    ├── dashboard.html         # Notes page after login
    ├── login.html             # Login page
    ├── signup.html            # Signup page
    └── style.css              # All styles for every page
```

---

## ⚙️ How to Run Locally

### Step 1 — Clone the repository

```bash
git clone https://github.com/yourname/my-app.git
cd my-app
```

### Step 2 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 — Create `.env` file inside the backend folder
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=any-long-random-string
PORT=5000

### Step 4 — Set up Supabase database

Go to your Supabase dashboard → SQL Editor → run this:

```sql
create table users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz default now()
);

create table notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade not null,
  title      text not null,
  body       text,
  created_at timestamptz default now()
);

alter table users enable row level security;
alter table notes enable row level security;

create policy "allow all" on users using (true) with check (true);
create policy "allow all" on notes using (true) with check (true);
```

### Step 5 — Start the backend server

```bash
npm run dev
```

You should see:
Server on http://localhost:5000

### Step 6 — Open the frontend

Open `frontend/login.html` in your browser.

---

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | / | Health check | No |
| POST | /auth/signup | Create new account | No |
| POST | /auth/login | Login to account | No |
| GET | /notes | Get all notes for user | Yes |
| POST | /notes | Create a new note | Yes |
| DELETE | /notes/:id | Delete a note | Yes |

---

## 🔐 Environment Variables

| Variable | Description | Where to find |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Your Supabase anon public key | Supabase → Settings → API |
| `JWT_SECRET` | Any long random string you make up | Make it yourself |
| `PORT` | Port the server runs on | Set to 5000 |

---

## 🚀 Deployment

### Backend — Render
1. Go to [render.com](https://render.com) and sign up with GitHub
2. New → Web Service → connect your repo
3. Set Root Directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `PORT`
7. Click Deploy → get your live URL

### Frontend — Netlify
1. Go to [netlify.com](https://netlify.com) and sign up with GitHub
2. Add new site → Import an existing project → connect your repo
3. Set Base directory to `frontend`
4. Click Deploy → get your live URL

### After Deploying
- Update `frontend/app.js` → change `API` to your Render URL
- Update `backend/server.js` → change `cors` to your Netlify URL
- Push changes to GitHub → both sites redeploy automatically
