import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  status: {
    type: String,
    enum: [
      "Applied",
      "Round1",
      "Round2",
      "HR",
      "Selected",
      "Rejected"
    ],
    default: "Applied"
  },

  appliedDate: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
})

const Application = mongoose.model(
  "Application",
  applicationSchema
)

export default Application