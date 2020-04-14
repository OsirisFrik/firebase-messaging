import { firebaseEditor, logEditor } from './js/editor'
import firebase from 'firebase/app'
import 'firebase/messaging'

/**
 * @type { HTMLButtonElement }
 */
let startBtn = document.getElementById('start')

/**
 * @type { HTMLSpanElement }
 */
let tokenDisplay = document.getElementById('token')

/**
 * @type { firebase.messaging.Messaging }
 */
let messaging
let notifications = []
let firebaseConfig = JSON.parse(localStorage.getItem('firebase')) || {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
}

console.log(firebaseConfig)

firebaseEditor.set(firebaseConfig)


function startFirebase() {
  try {
    startBtn.disabled = true
    firebaseConfig = firebaseEditor.get()

    let validation = validateConfig(firebaseConfig)

    if (validation.length > 0) {
      logEditor.set(validation)
      startBtn.disabled = false

      return
    }

    localStorage.setItem('firebase', JSON.stringify(firebaseConfig))
    firebase.initializeApp(firebaseConfig)
    messaging = firebase.messaging()

    navigator.serviceWorker
      .register(`firebase-messaging-sw.js?${formatKeysToQuery(firebaseConfig)}`)
      .then((register) => {
        messaging.useServiceWorker(register)
        messaging.onMessage(onMessage)

        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') getToken()
          else alert('Notification access denegated')
        })
      })
  } catch (err) {
    startBtn.disabled = false
    console.trace(err)
  }
}

function getToken() {
  messaging.getToken().then((token) => {
    tokenDisplay.innerText = token

    messaging.onTokenRefresh(getToken)
  })
  .catch((err) => {
    console.error(err)
  })
}

function onMessage(payload) {
  notifications.push(payload)

  logEditor.set(notifications.reverse())
  logEditor.expandAll()
}

function formatKeysToQuery(config) {
  let query = ''

  for (const key in config) {
    if (query !== '') query += '&'
    query += `${key}=${config[key]}`
  }

  return query
}

function validateConfig(config) {
  let errors = []
  
  for (const key in config) {
    if (config[key] === '') errors.push(`${key} is required!`)
  }

  return errors
}

window.onload = () => startBtn.addEventListener('click', startFirebase)
