import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_ADMINAUTH_REFRESH_SECRET, JWT_AUTH_REFRESH_SECRET } from '../config'

import User from '../models/user'
import { cookieNames, defaultCookieOptions } from '../utils/const'
import { decodeToken, getUserData } from '../utils/firebase'
import { jsonResponse } from '../utils/helpers'
import { createAccessToken, createRefreshToken, getRefreshTokenData, replaceRefreshToken, revokeRefreshToken } from '../utils/token'

import { roleBasedAuthen } from '../middlewares/authentication'

const router = Router()

router.post('/login', async (req, res) => {
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
        },
        lastLoginAt: Date.now()
      })
      user = await newUser.save()
    } else {
      if (!user.firebaseUID || user.firebaseUID !== uid) user.firebaseUID = uid
      user.info.displayName = displayName
      user.info.photoURL = photoURL
      user.info.lastUpdated = Date.now()
      user.lastLoginAt = Date.now()
      user = await user.save()
    }

    const accessToken = createAccessToken(user._id, admin)
    const refreshToken = await createRefreshToken(user._id, admin, true)

    return res
      .cookie(cookieNames[`refreshToken${admin ? '_admin' : ''}`], refreshToken, {
        ...defaultCookieOptions,
        expires: new Date(Date.now() + 24 * 3600000),
      })
      .json(jsonResponse('ok', {
        accessToken,
        email,
        info: { displayName, photoURL }
      }))
  } catch (err) {
    console.log(err)
    res.json(jsonResponse('error', 'การเข้าสู่ระบบล้มเหลว โปรดลองใหม่ภายหลัง'))
  }
})

router.get('/me', roleBasedAuthen({ guest: false }), async (req, res) => {
  const { firebaseUID = '', email = '', info: { displayName = '', photoURL = '' } } = req.user
  return res.json(jsonResponse('ok', {
    firebaseUID,
    email,
    displayName,
    photoURL
  }))
})

router.post('/renew', async (req, res) => {
  const { refreshToken: ssrRefreshToken, admin = false } = req.body
  
  const refreshTokenName = cookieNames[`refreshToken${admin ? '_admin' : ''}`]
  const refreshToken = req.cookies?.[refreshTokenName] || ssrRefreshToken
  if (!refreshToken)
    return res.json(jsonResponse('failed', 'ไม่พบ Refresh Token'))

  const isSSR = refreshToken === ssrRefreshToken
  try {
    const { _id } = jwt.verify(refreshToken, admin ? JWT_ADMINAUTH_REFRESH_SECRET : JWT_AUTH_REFRESH_SECRET)
    const refreshTokenData = await getRefreshTokenData(refreshToken)
    if (!refreshTokenData) {
      throw new Error('TokenRevoked')
    }

    const refreshTokenExpires = Date.now() + 24 * 3600000
    const newAccessToken = createAccessToken(_id, admin)
    const newRefreshToken = await createRefreshToken(_id, admin)

    await replaceRefreshToken(_id, refreshTokenData, newRefreshToken, refreshTokenExpires)

    if (!isSSR) {
      res.cookie(refreshTokenName, newRefreshToken, {
        ...defaultCookieOptions,
        expires: new Date(refreshTokenExpires)
      })
    }

    return res.json(jsonResponse('ok', {
      accessToken: newAccessToken,
      ...(isSSR ? { refreshToken: newRefreshToken } : {})
    }))
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.message === 'TokenRevoked') {
      if (!isSSR) res.clearCookie(refreshTokenName, defaultCookieOptions)

      return res.json(jsonResponse('relogin', 'การเข้าสู่ระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่'))
    }
    
    return res.json(jsonResponse('failed'))
  }
})

router.post('/logout', async (req, res) => {
  const { admin = false } = req.body

  const refreshTokenName = cookieNames[`refreshToken${admin ? '_admin' : ''}`]
  const refreshToken = String(req.cookies?.[refreshTokenName] || '')

  await revokeRefreshToken(refreshToken)

  res.clearCookie(refreshTokenName, defaultCookieOptions)
  res.json(jsonResponse('ok'))
})

export default router
