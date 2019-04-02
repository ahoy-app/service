class WebSocketController {
  constructor() {
    this._onConnected = this._onConnected.bind(this)
  }

  _onConnected() {
    this.setConnected(true)
    console.log('Connected')
  }

  setConnected(connected) {
    document.getElementById('connect').disabled = connected
    document.getElementById('disconnect').disabled = !connected
    document.getElementById('mural').style.visibility = connected
      ? 'visible'
      : 'hidden'
    document.getElementById('response').innerHTML = ''
  }

  connect() {
    this.socket = new WebSocket('ws://localhost:8080/ws')
    this.socket.onopen = this._onConnected
    this.socket.onmessage = this.showMessage
    this.socket.onclose = () => this.setConnected(false)
    console.log('Connection established')
  }

  disconnect() {
    if (this.socket != null) {
      this.socket.close()
    }
    this.setConnected(false)
    console.log('Disconnected')
  }

  sendMessage() {
    var room = document.getElementById('channel').value || 'main'
    var message = document.getElementById('text').value
    this.socket.send(JSON.stringify({ room: room, message: message }))
  }

  showMessage(message) {
    console.log(message)
    var response = document.getElementById('response')
    var p = document.createElement('p')
    p.style.wordWrap = 'break-word'
    var content = JSON.parse(message.data)
    p.appendChild(
      document.createTextNode(content.room + ': ' + content.message)
    )
    response.appendChild(p)
  }
}

window.webSocket = new WebSocketController()
