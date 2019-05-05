import User from '../../model/User'

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId)

  if (!user) {
    res.status(404).send('Room not found')
    return
  }
  res.send({ id: user._id, name: user.name })
}
