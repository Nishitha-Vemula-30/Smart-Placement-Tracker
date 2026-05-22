import { useState } from "react"
import axios from "axios"

const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        branch: "",
        cgpa: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const res = await axios.post(
                "http://localhost:5000/api/students/register",
                formData
            )

            alert("Registered Successfully")

            console.log(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px"
        }}>

            <form onSubmit={handleSubmit}>

                <h1>Register</h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="text"
                    name="branch"
                    placeholder="Branch"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="cgpa"
                    placeholder="CGPA"
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>
    )
}

export default Register