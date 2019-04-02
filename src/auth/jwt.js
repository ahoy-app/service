import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

//Config
dotenv.config()

const jwt_secret = process.env.JWT_SECRET

export const signToken = payload => {
  return jwt.sign(payload, jwt_secret, {
    expiresIn: '1m', // expires in 24 hours
  })
}

export const verifyToken = (token, callback) => {
  jwt.verify(token, jwt_secret, callback)
}
