importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js');

let config = {}

this.addEventListener('install', (event) => {
  parseQueryToObj(event.srcElement.location.search)
  validateConfig() ? init() : null
})

/**
 * @method parseQueryToObj
 * @param { String } query 
 */

function parseQueryToObj(query) {
  query = query.slice(1).split('&')

  for (let i = 0; i < query.length; i++) {
    const [key, value] = query[i].split('=')
    config[key] = value
  }
}

function init() {
  console.log(config)
  firebase.initializeApp(config)

  const messaging = firebase.messaging()

  messaging.setBackgroundMessageHandler((payload) => {
    console.log('[firebase-messaging-sw] Received background message', payload)

    return self.registration.showNotification('Test', {
      body: 'Test'
    })
  })
}

function validateConfig() {
  for (const key in config) {
    if (config[key] === '') return false
  }

  return true
}
