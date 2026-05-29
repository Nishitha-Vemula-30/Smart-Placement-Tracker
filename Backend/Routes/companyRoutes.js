import express from "express"

import {
  addCompany,
  getCompanies,
  getEligibleCompanies,
  updateCompany,
  deleteCompany
} from "../Controllers/companyController.js"
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddleware from "../Middleware/adminMiddleware.js"

const router = express.Router()

router.post("/add", authMiddleware, adminMiddleware, addCompany)

router.get("/all", getCompanies)

router.get("/eligible", authMiddleware, getEligibleCompanies)

router.put("/:id", authMiddleware, adminMiddleware, updateCompany)

router.delete("/:id", authMiddleware, adminMiddleware, deleteCompany)

export default router