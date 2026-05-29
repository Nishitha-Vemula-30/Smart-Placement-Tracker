import express from "express";

import {
  sendNotification,
  getNotifications
} from "../Controllers/notificationController.js";

import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  sendNotification
);

router.get(
  "/",
  authMiddleware,
  getNotifications
);

export default router;