import Student from "../Models/studentModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



// REGISTER
export const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      branch,
      cgpa
    } = req.body

    const existingStudent = await Student.findOne({ email })

    if (existingStudent) {

      return res.status(400).json({
        success: false,
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

    res.status(201).json({

      success: true,
      message: "Registration Successful",
      student

    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

}



// LOGIN
export const login = async (req, res) => {

  try {

    const { email, password } = req.body

    const student = await Student.findOne({ email })

    if (!student) {

      return res.status(404).json({

        success: false,
        message: "Student not found"

      })

    }

    const match = await bcrypt.compare(
      password,
      student.password
    )

    if (!match) {

      return res.status(400).json({

        success: false,
        message: "Invalid credentials"

      })

    }

    // JWT TOKEN
    const token = jwt.sign(

      {
        id: student._id,
        email: student.email
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    )

    // COOKIE
    res.cookie("token", token, {

      httpOnly: true,

      secure: false,

      sameSite: "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000

    })

    res.status(200).json({

      success: true,

      message: "Login Successful",

      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }

    })

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message

    })

  }

}



// LOGOUT
export const logout = async (req, res) => {

  try {

    res.cookie("token", "", {

      httpOnly: true,
      expires: new Date(0)

    })

    res.status(200).json({

      success: true,
      message: "Logout Successful"

    })

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message

    })

  }

}