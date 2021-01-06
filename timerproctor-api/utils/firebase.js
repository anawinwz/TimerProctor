import * as admin from 'firebase-admin'
const serviceAccount = require('../serviceAccountKey.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default app

export const decodeToken = async idToken => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return decodedToken
  } catch (err) {
    return null
  }
}

export const getUserData = async ({ uid, email }) => {
  if (!!uid) return app.auth().getUser(uid)
  return app.auth().getUserByEmail(email)
}
