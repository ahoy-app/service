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
    // var channel = document.getElementById('channel').value;
    var message = document.getElementById('text').value
    this.socket.send(message)
  }

  showMessage(message) {
    console.log(message)
    var response = document.getElementById('response')
    var p = document.createElement('p')
    p.style.wordWrap = 'break-word'
    p.appendChild(document.createTextNode(message.data))
    response.appendChild(p)
  }
}

window.webSocket = new WebSocketController()
