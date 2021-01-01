import { Router } from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import { getUserData } from '../utils/firebase'
import { jsonResponse, wsBroadcast } from '../utils/helpers'

const fs = require('fs')

const router = Router()

router.post('/login', async (req, res, next) => {
  const { userId: uid, userEmail: email } = req.body
  if (!uid || !email) return res.json(jsonResponse('error', 'Access Denied.'))

  try {
    const userData = await getUserData({ uid })
    if (!!userData.email && email !== userData.email) return res.json(jsonResponse('error', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))

    let user = await User.findOne({ email })
    const { displayName, photoURL } = userData

    if (!user) {
      const newUser = new User({
        firebaseUID: uid,
        email,
        info: {
          displayName,
          photoURL
        }
      })
      user = await newUser.save()
    } else {
      user.info.displayName = displayName
      user.info.photoURL = photoURL
      user.info.lastUpdated = Date.now()
      user = await user.save()
    }

    const token = jwt.sign({ _id: user._id }, 'testtoken')
    return res.json(jsonResponse('ok', {
      token,
      info: { displayName, photoURL }
    }))

  } catch (err) {
    console.log(err)
    res.json(jsonResponse('error', 'ไม่สามารถตรวจสอบความถูกต้องของข้อมูลได้'))
  }
})

router.post('/submitIDCheck' , (req, res, next) => {
  const userId = req.body.userId
  const image = req.body.image.replace('data:image/png;base64,', '')

  const fileName = `${userId}_${Date.now()}.png`
  const filePath = `idphotos/${fileName}`
  const imageURL = `http://localhost:5000/${filePath}`
  fs.writeFile(filePath, image, 'base64', function (err) {})
  req.app.locals.users[1234] = {
    displayName: 'anawin wongsadit',
    accepted: null,
    reason: '',
    imageURL: imageURL
  }
  wsBroadcast(req.app, { type: 'newIdCheckReq', payload: { userId: 1234, imageURL: imageURL } }, 'proctors')  
  return res.json(jsonResponse('ok'))
})

router.post('/1234/approve', (req, res, next) => {
  req.app.locals.users[1234].accepted = true
  req.app.locals.users[1234].reason = ''
  wsBroadcast(req.app, { type: 'idCheckResponse', payload: { accepted: true } }, 'testtakers')
  return res.json(jsonResponse('ok'))
})

router.post('/1234/reject', (req, res, next) => {
  const reason = req.body?.reason
  req.app.locals.users[1234].accepted = false
  req.app.locals.users[1234].reason = reason
  wsBroadcast(req.app, { type: 'idCheckResponse', payload: { accepted: false, reason: reason } }, 'testtakers')
  return res.json(jsonResponse('ok'))
})

export default router
