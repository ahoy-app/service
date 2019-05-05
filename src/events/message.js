export const new_message = message => ({
  key: `room.${message.to}.new_message`,
  body: message,
})
