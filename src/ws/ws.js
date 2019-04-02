export const wsConsumer = onMessageCallback => (props, next) => {
  const { ws } = props
  ws.on('message', messageEnvelope => {
    onMessageCallback(props, messageEnvelope)
  })
  next()
}
