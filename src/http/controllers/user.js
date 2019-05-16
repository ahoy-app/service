import User from '../../model/User'

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId)

  if (!user) {
    res.status(404).send('User not found')
    return
  }
  res.send({ id: user._id, name: user.name })
}

export const getLoggedUser = async (req, res) => {
  res.redirect(`/user/${req.userId}`)
}
