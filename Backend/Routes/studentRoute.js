import express from "express"
import { registerStudent } from "../Controllers/studentController.js"

const router = express.Router()
router.get("/students",)
router.post("/register", registerStudent)

export default router