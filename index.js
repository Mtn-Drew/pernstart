const express = require('express')
const cors = require('cors')


const app = express()

// middleware

app.use(express.json()) //req.body
app.use(cors())

// routes

//register and login routes

app.use('/auth', require('./routes/jwtAuth'))


app.listen(5001, ()=>{
  console.log("The server is running on port 5001")
})