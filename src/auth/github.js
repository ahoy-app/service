import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const CLIENT_ID = process.env.GITHUB_CLIENT_ID
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

export const getToken = async code => {
  const json = await fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      // Host: 'localhost',
      // Referer: 'http://localhost:8080',
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
  }).then(res => res.json())

  if (json.error) throw Error('Error getting access token')

  return json.access_token
}

export const getUserEmail = async token => {
  const json = await fetch('https://api.github.com/user/emails', {
    headers: { Authorization: `token ${token}` },
  }).then(res => res.json())

  if (json.error) throw Error('Error getting user email')
  return json.filter(mail => mail.primary)[0].email
}

export const getUserInfo = async token => {
  const json = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` },
  }).then(res => res.json())

  if (json.error) throw Error('Error getting user info')

  return json
}
