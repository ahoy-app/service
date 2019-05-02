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
    const pass = document.getElementById('pass').value
    const body = {
      id: '',
      user: user,
      pass: pass,
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
        localStorage.setItem('access_token', data.token)
        this.setLoged(true)
      })
      .catch(error => {
        console.error(error)
      })
  }

  ghAuth() {
    const popup = window.open(
      'https://github.com/login/oauth/authorize?scope=user:email&client_id=4980e711a8dbd46fc066',
      'GitHub Login',
      'height=700,width=600,menubat=no'
    )

    window.addEventListener('message', function(event) {
      console.log(event.data)
      localStorage.setItem('access_token', event.data)
      popup.close()
      window.login.setLoged(true)
    })
  }

  logout() {
    this.setLoged(false)
    window.webSocket.disconnect()
    localStorage.removeItem('access_token')
    console.log('Logged out')
  }
}

window.login = new LoginController()
