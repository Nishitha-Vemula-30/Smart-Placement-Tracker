# 🎓 Smart Placement Tracker

A full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) to streamline and manage the college placement process. It allows students to track company listings, submit applications, and receive real-time notifications — while administrators can manage companies, review applications, and monitor placement statistics.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Student Side
- **Registration & Login** — Secure authentication using JWT and bcrypt
- **Browse Companies** — View all available companies with details like package, eligibility, and deadlines
- **Apply to Companies** — Submit applications and track their status (Pending / Accepted / Rejected)
- **Dashboard** — Personalized dashboard showing application history and stats
- **Profile Management** — View and manage personal profile (name, email, branch, CGPA)
- **Notifications** — Receive real-time notifications about application updates and new company listings

### Admin Side
- **Admin Dashboard** — Overview of all placement activities
- **Manage Companies** — Add, edit, and delete company listings
- **Review Applications** — View all student applications, update their status
- **Student Management** — View registered students and their details
- **Send Notifications** — Broadcast notifications to students
- **Placement Statistics** — Track placement rates, company-wise selections, and more

---

## 🛠️ Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | React 19, Vite, TailwindCSS 4, React Router, React Hook Form |
| **Backend**  | Node.js, Express 5, Mongoose, JWT, bcryptjs                  |
| **Database** | MongoDB                                                       |
| **Email**    | Nodemailer                                                    |
| **HTTP**     | Axios                                                         |
| **Styling**  | TailwindCSS                                                   |

---

## 📁 Project Structure

```
Smart_Placement_Tracker/
├── Backend/
│   ├── Config/              # Database & app configuration
│   ├── Controllers/         # Route handler logic
│   │   ├── applicationController.js
│   │   ├── authControllers.js
│   │   ├── companyController.js
│   │   ├── notificationController.js
│   │   └── studentController.js
│   ├── Middleware/           # Auth & admin middleware
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── Models/              # Mongoose schemas
│   │   ├── applicationModel.js
│   │   ├── companyModel.js
│   │   ├── notificationModel.js
│   │   └── studentModel.js
│   ├── Routes/              # API route definitions
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── notificationRoute.js
│   │   └── studentRoute.js
│   ├── Utils/               # Utility functions
│   │   └── sendEmail.js
│   ├── server.js            # Express app entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
├── Frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── Components/      # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── CompanyCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Pages/           # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── AddCompany.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── AdminApplications.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Statistics.jsx
│   │   ├── App.jsx          # Root component with routing
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── .env                 # Frontend env variables (not committed)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Smart_Placement_Tracker.git
   cd Smart_Placement_Tracker
   ```

2. **Set up the Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start the Backend server**
   ```bash
   cd Backend
   npm run dev
   ```

6. **Start the Frontend dev server**
   ```bash
   cd Frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
DB_URL=mongodb://localhost:27017/placement_tracker
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Never commit `.env` files to version control.** They are excluded via `.gitignore`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint    | Description          |
| ------ | ----------- | -------------------- |
| POST   | `/login`    | Student/Admin login  |
| POST   | `/register` | Register new student |

### Students (`/api/students`)
| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| GET    | `/`      | Get all students        |
| GET    | `/:id`   | Get student by ID       |
| PUT    | `/:id`   | Update student profile  |
| DELETE | `/:id`   | Delete a student        |

### Companies (`/api/company`)
| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| GET    | `/`      | Get all companies     |
| POST   | `/`      | Add a new company     |
| GET    | `/:id`   | Get company by ID     |
| PUT    | `/:id`   | Update company        |
| DELETE | `/:id`   | Delete a company      |

### Applications (`/api/application`)
| Method | Endpoint | Description              |
| ------ | -------- | ------------------------ |
| GET    | `/`      | Get all applications     |
| POST   | `/`      | Submit new application   |
| PUT    | `/:id`   | Update application status|

### Notifications (`/api/notifications`)
| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| GET    | `/`      | Get all notifications  |
| POST   | `/`      | Create a notification  |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👩‍💻 Author

**Nishitha Vemula**

---

> Built with ❤️ using the MERN Stack
