const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")

const jwtGenerator = require('../utils/jwtGenerator')
const validInfo = require('../middleware/validInfo')
const authorization = require('../middleware/authorization')

//registering

router.post("/register", validInfo, async (req, res) => {
	
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

		const token = jwtGenerator(newUser.rows[0].user_id)

		res.json({token})


		return res.json(newUser.rows[0])
	} catch (error) {
		console.error(error.message)
		res.status(500).send("Server Error")
	}
})

//login route

router.post('/login', validInfo, async (req, res)=>{
	try{

		// destructure req. body
		const {email, password} = req.body

		//check if user doens't exist (or throw error)

		const user = await pool.query(
			"SELECT * FROM users WHERE user_email = $1", [email]
		)

		if (user.rows.length === 0){
			return res.status(401).send("Please check email and password and try again")
		}

		//check if incoming pword is same as db pword

		const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    )

		if (!validPassword){
			return res.status(401).send("Please check email and password and try again")
		}

		//give jwt token

		const token = jwtGenerator(user.rows[0].user_id)
		res.json({token})

	}catch(error){
		console.error(error.message)
		res.status(500).send("Server Error")
	}
})

	router.get('/is-verified', authorization, async(req,res)=>{
		try{
			res.json(true)
		}catch(error){
		console.error(error.message)
		res.status(500).send("Server Error")
	}
	})


module.exports = router
