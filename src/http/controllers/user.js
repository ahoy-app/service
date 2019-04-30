import { signToken } from '../../auth/jwt'
import User from '../../model/User'
import { getToken, getUserInfo, getUserEmail } from '../../auth/github'

export const login = async (req, res) => {
  const userId = req.body.user

  if (userId && userId !== '') {
    const user = await User.findById(userId)

    if (user) {
      const token = signToken({ user: userId })
      res.send(JSON.stringify({ token }))
    } else {
      res.status(403).send(JSON.stringify({ error: 'User not signed' }))
    }
  } else {
    res.status(403).send(JSON.stringify({ error: 'No user provided' }))
  }
}

export const oauth_redirect = async (req, res) => {
  try {
    console.log('Getting token')
    const token = await getToken(req.query.code)
    const user_email = await getUserEmail(token)
    console.log(user_email)
    const user_info = await getUserInfo(token)

    // const user = await User.findById(userId)

    res.status(200).send(`Wellcome ${user_info.login} ${user_email}`)
  } catch (error) {
    res.status(404).send('Error authenticating')
  }
}

// export const auth_redirect = async (req, res) => {
//
// }
