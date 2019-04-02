import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

//Config
dotenv.config()

const jwt_secret = process.env.JWT_SECRET

export const signToken = payload => {
  jwt.sign(payload, jwt_secret, {
    expiresIn: 1440, // expires in 24 hours
  })
}

export const verifyToken = (token, callback) => {
  jwt.verify(token, jwt_secret, callback)
}
