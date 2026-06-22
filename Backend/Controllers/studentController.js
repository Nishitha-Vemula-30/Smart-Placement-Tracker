import Student from "../Models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// STUDENT CONTROLLER
// Handles registration, login, logout, and student user queries.

// REGISTER STUDENT / ADMIN
export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      branch,
      cgpa,
      role
    } = req.body;

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user data based on whether this is an admin or a student.
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "student"
    };

    // Only include student-specific fields for non-admin users.
    if (role !== "admin") {
      userData.branch = branch ? branch.trim().toUpperCase() : branch;
      userData.cgpa = cgpa;
    }

    const student = await Student.create(userData);

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// LOGIN STUDENT / ADMIN
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    // Create a JWT token with the student id and role for authenticated access
    const token = jwt.sign(
      {
        id: student._id,
        role: student.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Send the JWT token as an HTTP-only cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login Successful",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        branch: student.branch,
        cgpa: student.cgpa
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// LOGOUT STUDENT / ADMIN
// Clears the authentication cookie.
export const logoutStudent = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(200).json({
      message: "Logout Successful"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CURRENT USER
// Return the logged-in user's details without the password.
export const getCurrentUser = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET ALL STUDENTS
// Return only student users, excluding admin accounts.
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: "student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
