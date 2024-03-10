const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
let users = require('./data/users')
let data = require('./data/data')
require("dotenv").config()
const verifyToken = require('./middleware/verifyToken')

app.use(express.json())

const generateTokens = payload => {
    const { phone } = payload

    // Create JWT
    const accessToken = jwt.sign({ phone }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
    })

    const refreshToken = jwt.sign({ phone }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1h'
    })
    return { accessToken, refreshToken }
}

const updateRefreshToken = (phone, refreshToken) => {
    users = users.map(user => {
        if (user.phone === phone) return {
            ...user,
            refreshToken
        }
        return user
    })
}

app.post("/login", (req, res) => {
    const phone = req.body.phone
    const password = req.body.password
    const user = users.find(user =>
        user.phone === phone && user.password === password
    )
    console.log(user)

    if (!user) return res.sendStatus(401)

    const tokens = generateTokens(user)
    updateRefreshToken(phone, tokens.refreshToken)

    res.json(tokens)
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.sendStatus(401)

    const user = users.find(user => user.refreshToken === refreshToken)
    if (!user) return res.sendStatus(403)

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const tokens = generateTokens(user)
        updateRefreshToken(user.username, tokens.refreshToken)

        res.json(tokens)
    } catch (error) {
        console.log(error)
        res.sendStatus(403)
    }
})

app.delete('/logout', verifyToken, (req, res) => {
    const user = users.find(user => user.id === req.userId)
    updateRefreshToken(user.username, null)

    res.sendStatus(204)
})

app.post('/createAccount', (req, res) => {
    const phone = req.body.phone
    const password = req.body.password
    const name = req.body.name
    const email = req.body.email

    if(users.find(user=>user.phone === phone)){
        return res.send("Trung SDT")
    }
       
    const user = {
        "phone": phone,
        "password": password,
        "refreshToken": null
    }

    const userInfo = {
        "phone": phone,
        "name": name,
        "email": email
    }

    users.push(user)
    data.push(userInfo)
    console.log(user)
    return res.send("Sucess!!!")
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})