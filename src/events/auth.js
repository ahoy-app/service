export const user_authenticated = user => ({
  key: 'auth.user_authenticated',
  body: user,
})

export const user_created = user => ({
  key: 'auth.user_created',
  body: user,
})
