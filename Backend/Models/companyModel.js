import {Schema,model} from "mongoose"

const companySchema = new Schema({

  companyName: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  packageValue:  {
    type: String,
    required: true
  },

  minimumCGPA: {
    type: Number,
    required: true
  },

  eligibleBranches: [
    String
  ]

}, {
  timestamps: true
})

const Company = model(
  "Company",
  companySchema
)

export default Company