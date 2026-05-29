import mongoose from "mongoose"

const studentSchema = new mongoose.Schema(

  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    branch: {
      type: String
    },

    cgpa: {
      type: Number
    },

    role: {
    type: String,
    enum: ["admin", "student"],
    default: "student"
  }
  },

  {
    timestamps: true
  }

)

const Student = mongoose.models.Student || mongoose.model(
  "Student",
  studentSchema
)

export default Student
