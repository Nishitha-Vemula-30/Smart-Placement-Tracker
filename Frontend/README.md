# 🎨 Smart Placement Tracker — Frontend

The frontend application for Smart Placement Tracker, built with **React 19**, **Vite**, and **TailwindCSS 4**. It provides a modern, responsive UI for students and administrators to manage the college placement process.

---

## 📌 Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Pages & Features](#pages--features)
- [Components](#components)
- [Routing](#routing)
- [Scripts](#scripts)

---

## 🛠️ Tech Stack

| Package          | Version | Purpose                          |
| ---------------- | ------- | -------------------------------- |
| React            | 19.x    | UI library                       |
| Vite             | 8.x     | Build tool & dev server          |
| TailwindCSS      | 4.x     | Utility-first CSS framework      |
| React Router DOM | 7.x     | Client-side routing              |
| React Hook Form  | 7.x     | Form state management            |
| Axios            | 1.x     | HTTP client for API calls        |
| React Toastify   | 11.x   | Toast notifications              |

---

## 📁 Folder Structure

```
Frontend/
├── public/                  # Static files
├── src/
│   ├── Components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar with role-based links
│   │   ├── CompanyCard.jsx  # Company display card
│   │   └── ProtectedRoute.jsx  # Auth guard for private routes
│   │
│   ├── Pages/               # Application pages
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Student & admin login
│   │   ├── Register.jsx          # Student registration
│   │   ├── Dashboard.jsx         # Role-based dashboard router
│   │   ├── StudentDashboard.jsx  # Student's personal dashboard
│   │   ├── AdminDashboard.jsx    # Admin overview dashboard
│   │   ├── Companies.jsx         # Browse & manage companies
│   │   ├── AddCompany.jsx        # Add new company form (Admin)
│   │   ├── Applications.jsx      # Student's applications view
│   │   ├── AdminApplications.jsx # All applications (Admin)
│   │   ├── Students.jsx          # Student list (Admin)
│   │   ├── Notifications.jsx     # Notifications page
│   │   ├── Profile.jsx           # User profile page
│   │   └── Statistics.jsx        # Placement statistics
│   │
│   ├── App.jsx              # Root component with route definitions
│   ├── App.css              # App-level styles
│   ├── index.css            # Global styles (TailwindCSS import)
│   └── main.jsx             # React DOM entry point
│
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── .env                     # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## 🚀 Setup & Installation

1. **Navigate to the Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** (see [Environment Variables](#environment-variables))

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

| Variable       | Description                           |
| -------------- | ------------------------------------- |
| `VITE_API_URL` | Base URL for the backend API server   |

> ⚠️ All Vite environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

---

## 📄 Pages & Features

### 🏠 Home (`Home.jsx`)
- Landing page with application overview
- Navigation to login/register

### 🔐 Login (`Login.jsx`)
- Email & password authentication
- JWT token stored in cookies
- Role-based redirect (Student → Student Dashboard, Admin → Admin Dashboard)

### 📝 Register (`Register.jsx`)
- Student registration form
- Fields: Name, Email, Password, Branch, CGPA
- Form validation using React Hook Form

### 📊 Dashboard (`Dashboard.jsx`)
- Role-based routing component
- Redirects to `StudentDashboard` or `AdminDashboard` based on user role

### 🎓 Student Dashboard (`StudentDashboard.jsx`)
- Overview of student's placement journey
- Recent applications and their statuses
- Quick stats (total applications, accepted, pending)

### 🛠️ Admin Dashboard (`AdminDashboard.jsx`)
- Administrative overview
- Quick access to manage companies, applications, and students

### 🏢 Companies (`Companies.jsx`)
- Browse all available company listings
- Search and filter functionality
- Admin: Edit and delete company listings

### ➕ Add Company (`AddCompany.jsx`)
- Admin-only form to add new company listings
- Fields: Company name, role, package, eligibility, deadline

### 📋 Applications (`Applications.jsx`)
- Student view of their submitted applications
- Track application status (Pending / Accepted / Rejected)

### 📋 Admin Applications (`AdminApplications.jsx`)
- Admin view of all student applications
- Update application status
- Filter by company or status

### 👥 Students (`Students.jsx`)
- Admin view of all registered students
- Student details: name, email, branch, CGPA

### 🔔 Notifications (`Notifications.jsx`)
- View all notifications
- Admin: Create and send notifications

### 👤 Profile (`Profile.jsx`)
- View and manage user profile
- Display personal information

### 📈 Statistics (`Statistics.jsx`)
- Placement statistics and analytics
- Visual representation of placement data

---

## 🧩 Components

### `Navbar.jsx`
- Responsive navigation bar
- Role-based menu items (different links for students and admins)
- Logout functionality

### `CompanyCard.jsx`
- Reusable card component for displaying company information
- Shows company name, role, package, and deadline

### `ProtectedRoute.jsx`
- Route guard component
- Redirects unauthenticated users to login page
- Wraps private routes to enforce authentication

---

## 🗺️ Routing

The application uses **React Router v7** for client-side routing:

| Path               | Page                | Access     |
| ------------------ | ------------------- | ---------- |
| `/`                | Home                | Public     |
| `/login`           | Login               | Public     |
| `/register`        | Register            | Public     |
| `/dashboard`       | Dashboard           | Protected  |
| `/companies`       | Companies           | Protected  |
| `/add-company`     | Add Company         | Admin Only |
| `/applications`    | Applications        | Protected  |
| `/students`        | Students            | Admin Only |
| `/notifications`   | Notifications       | Protected  |
| `/profile`         | Profile             | Protected  |
| `/statistics`      | Statistics          | Protected  |

---

## 📝 Scripts

| Script              | Command          | Description                          |
| ------------------- | ---------------- | ------------------------------------ |
| `npm run dev`       | `vite`           | Start development server             |
| `npm run build`     | `vite build`     | Build for production                 |
| `npm run lint`      | `eslint .`       | Run ESLint checks                    |
| `npm run preview`   | `vite preview`   | Preview production build locally     |

---

> Part of the [Smart Placement Tracker](../README.md) project
