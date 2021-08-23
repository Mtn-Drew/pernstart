const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")

//registering

router.post("/register", async (req, res) => {
	
	const { name, email, password } = req.body
	
	try {
		//1. destructure the req.body (name, email, password)


		//2. check if user exist (if user exists, throw error)

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email,
		])

		if (user.rows.length > 0){ //if user already exists
		
			return res.status(401).send("User already exists")  //401 for un-authenticated; 403 for un-authorized
		}

		//3. bcrypt the user password

		const saltRound = 10
		const salt = await bcrypt.genSalt(saltRound)

		const bcryptPassword = await bcrypt.hash(password, salt)

		//4. enter the new user inside our db

		const newUser = await pool.query(
			"INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *", [name, email,bcryptPassword])

		//5 generate jwt token


		res.json(newUser.rows[0])
	} catch (error) {
		console.error(error.message)
		res.status(500).send("Server Error")
	}
})

router.get('/get', (req,res)=>{
	return res.status(201).send("Im working")
})

module.exports = router
