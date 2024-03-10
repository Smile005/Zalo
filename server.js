const express = require('express')
const app = express()
const data = require('./data/data')
const jwt = require('jsonwebtoken')
const verifyToken = require('./middleware/auth')
require("dotenv").config()

app.use(express.json())

app.get('/posts', verifyToken, (req, res) => {
    res.json(data.filter(data => data.phone === req.phone))
})

const PORT = 4000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})





