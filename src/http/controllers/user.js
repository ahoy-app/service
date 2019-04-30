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
    const gh_token = await getToken(req.query.code)
    const user_email = await getUserEmail(gh_token)

    const user = await User.findById(user_email)
    if (user) {
      // If user was already registered
      console.log('User authenticated: ', user_email)
    } else {
      // If new user in the system
      const user_info = await getUserInfo(gh_token)
      const userBase = {
        role: 'user',
        crypto: { public: 'public-key', private: 'private-hashed-key' },
      }
      const user = new User({
        _id: user_email,
        name: user_info.login,
        ...userBase,
      })
      await user.save()
      console.log('New user created: ', user_email)
    }
    const token = signToken({ user: user._id })
    res.redirect(`/callback.html?access_token=${token}`)
  } catch (error) {
    console.log(error)
    res.status(404).send('Error authenticating')
  }
}

// export const auth_redirect = async (req, res) => {
//
// }
