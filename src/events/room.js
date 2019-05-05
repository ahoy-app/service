export const room_deleted = roomId => ({
  key: `room.${roomId}.deleted`,
  body: { roomId },
})

export const room_created = room => ({
  key: `room.${room.id}.created`,
  body: room,
})

export const user_invited = (userId, room) => ({
  key: `user.${userId}.invited`,
  body: room,
})

export const user_kicked = (userId, room) => ({
  key: `user.${userId}.kicked`,
  body: room,
})
