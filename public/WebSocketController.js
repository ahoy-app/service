class WebSocketController {
  constructor() {
    this._onConnected = this._onConnected.bind(this)
    this.showMessage = this.showMessage.bind(this)
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
    if (localStorage.getItem('access_token')) {
      const host = window.location.host
      console.log(host)
      this.socket = new WebSocket(
        `ws://${host}/ws?token=${localStorage.getItem('access_token')}`
      )
      this.socket.onopen = this._onConnected
      this.socket.onmessage = this.showMessage
      this.socket.onclose = () => this.setConnected(false)
      console.log('Connection established')
    }
  }

  disconnect() {
    if (this.socket != null) {
      this.socket.close()
    }
    this.setConnected(false)
    console.log('Disconnected')
  }

  sendMessage() {
    var room = document.getElementById('room').value || 'main'
    var message = document.getElementById('text').value
    this.socket.send(JSON.stringify({ room: room, message: message }))
  }

  setRoomOptions(rooms) {
    console.log(rooms)
    var room = document.getElementById('room')
    //Clean previous options
    while (room.firstChild) {
      room.removeChild(room.firstChild)
    }
    // Add new options
    rooms.forEach(r => {
      var option = document.createElement('option')
      option.value = r
      option.text = r
      room.appendChild(option)
    })
  }

  showMessage(message) {
    console.log(message)
    var response = document.getElementById('response')
    var p = document.createElement('p')
    p.style.wordWrap = 'break-word'
    var content = JSON.parse(message.data)

    if (content.room === 'server') {
      var rooms = content.message
        .split('=>')[1]
        .split(',')
        .map(r => r.trim())
      this.setRoomOptions(rooms)
    }

    p.appendChild(
      document.createTextNode(
        `#${content.room}: @${content.from || 'admin'}:  ${content.message}`
      )
    )
    response.appendChild(p)
  }
}

window.webSocket = new WebSocketController()
