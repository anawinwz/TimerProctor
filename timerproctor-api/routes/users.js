import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_ADMINAUTH_REFRESH_SECRET, JWT_AUTH_REFRESH_SECRET } from '../config'

import User from '../models/user'
import { decodeToken, getUserData } from '../utils/firebase'
import { jsonResponse } from '../utils/helpers'
import { createAccessToken, createRefreshToken } from '../utils/token'

const router = Router()

router.post('/login', async (req, res, next) => {
  const { idToken, admin = false } = req.body

  try {
    const decodedToken = await decodeToken(idToken)
    if (!decodedToken) return res.json(jsonResponse('error', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))

    const { uid } = decodedToken

    const userData = await getUserData({ uid })
    const { email, displayName, photoURL } = userData

    let user = await User.findOne({ email })
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
      if (!user.firebaseUID || user.firebaseUID !== uid) user.firebaseUID = uid
      user.info.displayName = displayName
      user.info.photoURL = photoURL
      user.info.lastUpdated = Date.now()
      user = await user.save()
    }

    const accessToken = createAccessToken(user._id, admin)
    const refreshToken = createRefreshToken(user._id, admin)

    return res.json(jsonResponse('ok', {
      accessToken,
      refreshToken,
      email,
      info: { displayName, photoURL }
    }))
  } catch (err) {
    console.log(err)
    res.json(jsonResponse('error', 'การเข้าสู่ระบบล้มเหลว โปรดลองใหม่ภายหลัง'))
  }
})

router.post('/renew', async (req, res, next) => {
  const { refreshToken, admin = false } = req.body
  
  try {
    const { _id } = jwt.verify(refreshToken, admin ? JWT_ADMINAUTH_REFRESH_SECRET : JWT_AUTH_REFRESH_SECRET)
    const accessToken = createAccessToken(_id, admin)
    const refreshToken = createRefreshToken(_id, admin)
    res.json(jsonResponse('ok', {
      accessToken,
      refreshToken
    }))
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.json(jsonResponse('tokenExpired', 'การเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่'))
    
    return res.json(jsonResponse('failed'))
  }
})

export default router
