import fetch from 'node-fetch'
import dotenv from 'dotenv'

import { decodeToken } from './jwt'

dotenv.config()

const HOST = process.env.GITLAB_HOST
const CLIENT_ID = process.env.GITLAB_CLIENT_ID
const CLIENT_SECRET = process.env.GITLAB_CLIENT_SECRET
const REDIRECT_URI = process.env.GITLAB_REDIRECT_URI

export const validateCode = code =>
  fetch(`${HOST}/oauth/token`, {
    method: 'POST',
    headers: {
      // Host: 'localhost',
      // Referer: 'http://localhost:8080',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
  }).then(res => {
    if (!res.ok) {
      throw new Error('Error getting token')
    } else {
      return res.json()
    }
  })

export const getUserInfo = access_token =>
  fetch(`${HOST}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then(res => {
    if (!res.ok) {
      throw new Error('Error getting user info')
    } else {
      return res.json()
    }
  })
