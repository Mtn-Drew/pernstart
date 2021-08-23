const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/authorization')

router.get('/', authorization, async (req, res)=>{
  try {

    //req.user has the payload
    // console.log(req.user)

    const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user])

  }catch(error){
    console.error(error)
    res.status(500).json("Server Error")
  }
})



module.exports = router
