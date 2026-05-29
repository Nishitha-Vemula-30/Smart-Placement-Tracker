import jwt from "jsonwebtoken";
import Student from "../Models/studentModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id).select("role");
    if (!student) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    req.user = {
      id: decoded.id,
      role: student.role
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token"
    });
  }
};

export default authMiddleware;