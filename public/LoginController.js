class LoginController {
  constructor() {}

  setLoged(loged) {
    document.getElementById('login').disabled = loged
    document.getElementById('logout').disabled = !loged
    document.getElementById('app').style.visibility = loged
      ? 'visible'
      : 'hidden'
  }

  login() {
    const user = document.getElementById('user').value
    const body = {
      id: '',
      user: user,
    }

    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(response.statusText)
        }
      })
      .then(data => {
        console.log(`Logged in: ${data.token}`)
        window.token = data.token
        this.setLoged(true)
      })
      .catch(error => {
        console.error(error)
      })
  }

  logout() {
    this.setLoged(false)
    window.webSocket.disconnect()
    console.log('Logged out')
  }
}

window.login = new LoginController()
