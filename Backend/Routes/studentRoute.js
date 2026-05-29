import express from "express";

import {

  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentUser,
  getStudents

} from "../Controllers/studentController.js";

import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registerStudent
);

router.post(
  "/login",
  loginStudent
);

router.post(
  "/logout",
  logoutStudent
);

router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getStudents
);

export default router;