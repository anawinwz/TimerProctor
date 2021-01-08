import { Router } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_ADMIN_AUTHEN_SECRET, JWT_AUTHEN_SECRET } from '../config'
import User from '../models/user'
import { decodeToken, getUserData } from '../utils/firebase'
import { jsonResponse } from '../utils/helpers'

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

    const token = jwt.sign({ _id: user._id }, admin ? JWT_ADMIN_AUTHEN_SECRET : JWT_AUTHEN_SECRET)
    return res.json(jsonResponse('ok', {
      token,
      info: { displayName, photoURL }
    }))

  } catch (err) {
    console.log(err)
    res.json(jsonResponse('error', 'การเข้าสู่ระบบล้มเหลว โปรดลองใหม่ภายหลัง'))
  }
})

export default router
