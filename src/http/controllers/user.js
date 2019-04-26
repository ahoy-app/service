import { signToken } from '../../auth/jwt'
import User from '../../model/User'
import { validateCode, getUserInfo } from '../../auth/gitlab'

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
    const token = await validateCode(req.query.code)
    console.log(token)
    console.log('Getting userinfo')
    const user_info = await getUserInfo(token.access_token)

    console.log(user_info)
    res.status(200).send(`Wellcome ${user_info}`)
  } catch (error) {
    res.status(404)
  }
}

// export const auth_redirect = async (req, res) => {
//
// }
