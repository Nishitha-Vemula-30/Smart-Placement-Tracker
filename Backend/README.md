# 🔧 Smart Placement Tracker — Backend

The backend server for Smart Placement Tracker, built with **Node.js**, **Express 5**, and **MongoDB** (via Mongoose). It provides a RESTful API for managing students, companies, applications, notifications, and authentication.

---

## 📌 Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Middleware](#middleware)
- [Models](#models)
- [Error Handling](#error-handling)

---

## 🛠️ Tech Stack

| Package      | Version | Purpose                              |
| ------------ | ------- | ------------------------------------ |
| Express      | 5.x     | Web framework                        |
| Mongoose     | 9.x     | MongoDB ODM                          |
| bcryptjs     | 3.x     | Password hashing                     |
| jsonwebtoken | 9.x     | JWT-based authentication             |
| dotenv       | 17.x   | Environment variable management      |
| cors         | 2.x     | Cross-Origin Resource Sharing        |
| cookie-parser| 1.x     | Cookie handling for JWT tokens       |
| nodemailer   | 8.x     | Email notifications                  |

---

## 📁 Folder Structure

```
Backend/
├── Config/                  # Database & app configuration
├── Controllers/             # Business logic for each route
│   ├── applicationController.js   # CRUD for job applications
│   ├── authControllers.js         # Login & registration logic
│   ├── companyController.js       # CRUD for company listings
│   ├── notificationController.js  # Notification management
│   └── studentController.js       # Student profile management
├── Middleware/
│   ├── authMiddleware.js    # JWT token verification
│   └── adminMiddleware.js   # Admin role authorization
├── Models/                  # Mongoose schemas & models
│   ├── applicationModel.js  # Application schema
│   ├── companyModel.js      # Company schema
│   ├── notificationModel.js # Notification schema
│   └── studentModel.js      # Student schema
├── Routes/                  # Express route definitions
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   ├── notificationRoute.js
│   └── studentRoute.js
├── Utils/
│   └── sendEmail.js         # Nodemailer email utility
├── server.js                # Application entry point
├── .env                     # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## 🚀 Setup & Installation

1. **Navigate to the Backend directory**
   ```bash
   cd Backend
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
   The server will start on the port specified in `.env` (default: `5000`).

5. **Start in production mode**
   ```bash
   npm start
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=5000
DB_URL=mongodb://localhost:27017/placement_tracker
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

| Variable     | Description                                    |
| ------------ | ---------------------------------------------- |
| `PORT`       | Port number for the Express server             |
| `DB_URL`     | MongoDB connection string                      |
| `JWT_SECRET` | Secret key for signing JWT tokens              |
| `EMAIL_USER` | Gmail address for sending email notifications  |
| `EMAIL_PASS` | App password for the Gmail account             |

---

## 📡 API Reference

### Authentication Routes — `/api/auth`

| Method | Endpoint    | Auth Required | Description                  |
| ------ | ----------- | ------------- | ---------------------------- |
| POST   | `/login`    | ❌            | Login with email & password  |
| POST   | `/register` | ❌            | Register a new student       |

### Student Routes — `/api/students`

| Method | Endpoint | Auth Required | Description             |
| ------ | -------- | ------------- | ----------------------- |
| GET    | `/`      | ✅            | Get all students        |
| GET    | `/:id`   | ✅            | Get student by ID       |
| PUT    | `/:id`   | ✅            | Update student profile  |
| DELETE | `/:id`   | ✅ (Admin)    | Delete a student        |

### Company Routes — `/api/company`

| Method | Endpoint | Auth Required | Description              |
| ------ | -------- | ------------- | ------------------------ |
| GET    | `/`      | ✅            | Get all companies        |
| POST   | `/`      | ✅ (Admin)    | Add a new company        |
| GET    | `/:id`   | ✅            | Get company by ID        |
| PUT    | `/:id`   | ✅ (Admin)    | Update company details   |
| DELETE | `/:id`   | ✅ (Admin)    | Delete a company         |

### Application Routes — `/api/application`

| Method | Endpoint | Auth Required | Description               |
| ------ | -------- | ------------- | ------------------------- |
| GET    | `/`      | ✅            | Get all applications      |
| POST   | `/`      | ✅            | Submit a new application  |
| PUT    | `/:id`   | ✅ (Admin)    | Update application status |

### Notification Routes — `/api/notifications`

| Method | Endpoint | Auth Required | Description             |
| ------ | -------- | ------------- | ----------------------- |
| GET    | `/`      | ✅            | Get all notifications   |
| POST   | `/`      | ✅ (Admin)    | Create a notification   |

---

## 🛡️ Middleware

### `authMiddleware.js`
- Extracts JWT token from cookies
- Verifies the token and attaches user data to `req.user`
- Returns `401 Unauthorized` if no valid token is found

### `adminMiddleware.js`
- Checks if the authenticated user has an admin role
- Returns `403 Forbidden` if the user is not an admin
- Must be used **after** `authMiddleware`

---

## 📦 Models

### Student Model
- `name` — Student's full name
- `email` — Unique email address
- `password` — Hashed password (bcrypt)
- `branch` — Academic branch/department
- `cgpa` — Current CGPA

### Company Model
- `name` — Company name
- `role` — Job role offered
- `package` — Salary package
- `eligibility` — CGPA or other criteria
- `deadline` — Application deadline

### Application Model
- `student` — Reference to Student
- `company` — Reference to Company
- `status` — Pending / Accepted / Rejected

### Notification Model
- `title` — Notification title
- `message` — Notification content
- `createdAt` — Timestamp

---

## ⚠️ Error Handling

The backend includes a centralized error-handling middleware that catches:

| Error Type          | HTTP Status | Description                          |
| ------------------- | ----------- | ------------------------------------ |
| `ValidationError`   | 400         | Mongoose schema validation failures  |
| `CastError`         | 400         | Invalid MongoDB ObjectId             |
| Duplicate Key (11000)| 409        | Unique field constraint violation     |
| Custom errors       | Variable    | Errors thrown with a `.status` field  |
| Unhandled errors    | 500         | Fallback server error                |

---

## 📝 Scripts

| Script        | Command            | Description                    |
| ------------- | ------------------ | ------------------------------ |
| `npm start`   | `node server.js`   | Start in production mode       |
| `npm run dev` | `nodemon server.js`| Start with hot-reload (dev)    |

---

> Part of the [Smart Placement Tracker](../README.md) project
