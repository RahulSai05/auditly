# Auditly Platform (Full Stack)

This is the full-stack implementation of the **Auditly** platform, consisting of:

- **Backend:** FastAPI (Python 3.10.12)
- **Frontend:** React + TypeScript + Vite

It provides RESTful APIs for barcode scanning, inspection workflows, role-based user access, delivery routing, and Power BI integrations.

---

## 📁 Project Structure

```
FINAL_AUDITLY/
├── auditly/
│   └── api/                     # FastAPI backend
│       ├── app.py
│       ├── models.py
│       ├── database.py
│       ├── routes/
│       ├── requirements.txt
│       └── ...
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   └── App.tsx, main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                    # You're here!
```

---

## 🐍 Backend - FastAPI

### ✅ Requirements

Python version: `3.10.12`

Install dependencies:

```bash
cd auditly/api
pip install -r requirements.txt
```

> **Note:** By default, the database is configured to connect to the cloud version.
> If you'd like to use a different database (local or custom), update the connection details in `database.py`.

### 🚀 Run the API server

```bash
uvicorn app:app --reload
```

Visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## ⚛️ Frontend - React + Vite + TypeScript

### ✅ Requirements

- Node.js: `v22.12.0`
- npm: `v10.9.0`

### 📦 Install packages

```bash
cd frontend
npm install
```

### 🚀 Run the dev server

```bash
npm run dev
```

Visit the frontend at: `http://localhost:5173`

---

## ✅ Features Summary

### Backend
- 🔐 Role-based access: Admin, Agent, Manager, Reports, Inspection
- 📦 Sales & Return Order Handling
- 🧠 AI-powered Inspection Logic (Base vs Difference Images)
- 📊 Power BI integration with token-based auth
- 📌 Routing preferences: FIFO/LIFO, ZIP code-based filtering
- ⚙️ Cron job scheduling for backend automation
- 📨 Email notifications (invites, approvals, etc.)

### Frontend
- ⚛️ Clean UI using React + Tailwind
- 🧭 Role-based dashboard navigation
- 🗺️ Dynamic ZIP entry forms
- 📷 Barcode scanning & inspection workflows
- 🔔 Toast notifications & protected routes

---