import express from "express"

import {
  applyCompany,
  getMyApplications,
  getApplications,
  updateStatus
} from "../Controllers/applicationController.js"
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddleware from "../Middleware/adminMiddleware.js"

const router = express.Router()

router.post("/apply", authMiddleware, applyCompany)

router.get("/my-applications", authMiddleware, getMyApplications)

router.get("/all", authMiddleware, adminMiddleware, getApplications)

router.put("/status/:id", authMiddleware, adminMiddleware, updateStatus)

export default router