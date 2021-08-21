const router = require("express").Router()
const pool = require("../db")

//registering

router.post("/register", async (req, res) => {
	try {
		//1. destructure the req.body (name, email, password)

		const { name, email, password } = req.body

		//2. check if user exist (if user exists, throw error)

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email
		])

		//3. bcrypt the user password

		//4. enter the new user inside our db

		//5 generate jwt token
	} catch (error) {
		console.error(error.message)
		res.status(500).send("Server Error")
	}
})

module.exports = router
