import * as admin from 'firebase-admin'
const serviceAccount = require('../serviceAccountKey.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default app

export const getUserData = async ({ uid, email }) => {
  if (!!uid) return app.auth().getUser(uid)
  return app.auth().getUserByEmail(email)
}
