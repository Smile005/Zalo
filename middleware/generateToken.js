const jwt = require('jsonwebtoken')
require('dotenv').config()

// Generate Access Token
const accessToken = (phone) => jwt.sign({ phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' })

// Generate Refresh Token
const refreshToken = (phone) => jwt.sign({ phone }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' })

module.exports = { accessToken, refreshToken }