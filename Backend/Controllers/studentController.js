import Student from "../Models/studentModel.js"
import bcrypt from "bcryptjs"

export const registerStudent = async (req, res) => {

    try {

        const { name, email, password, branch, cgpa } = req.body

        const studentExists = await Student.findOne({ email })

        if (studentExists) {
            return res.status(400).json({
                message: "Student already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
            branch,
            cgpa
        })

        res.status(201).json(student)

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}