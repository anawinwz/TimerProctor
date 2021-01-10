import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyCMXk6jJwVmoc7XuNQRxkofPryCB8nMPuA",
  authDomain: "timerproctor.firebaseapp.com",
  projectId: "timerproctor",
  storageBucket: "timerproctor.appspot.com",
  messagingSenderId: "926658420781",
  appId: "1:926658420781:web:f794e6e83d737d117dd8a4",
  measurementId: "G-JCVPT80SMR"
}

const instance = firebase.initializeApp(config)

export const auth = instance.auth()

export const storage = instance.storage()

export default instance
