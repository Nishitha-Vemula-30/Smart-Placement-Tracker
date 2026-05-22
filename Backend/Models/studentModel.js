import {Schema,model} from "mongoose"

const studentSchema = new Schema({
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
    }
})

const Student = model("Student", studentSchema)

export default Student