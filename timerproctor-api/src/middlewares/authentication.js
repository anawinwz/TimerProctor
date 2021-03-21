import jwt from 'jsonwebtoken'
import { JWT_AUTH_SECRET, JWT_ADMINAUTH_SECRET } from '../config'

import User from '../models/user'
import { jsonResponse } from '../utils/helpers'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']
    const { _id } = jwt.verify(token, JWT_AUTH_SECRET)
    if (!_id) return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))
    
    const user = await User.findById(_id)
    if (!user) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลผู้ใช้'))

    req.user = user
    req.fromAdmin = false
    return next()
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.json(jsonResponse('tokenExpired', 'ข้อมูลการเข้าสู่ระบบหมดอายุ'))

    return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))
  }
} 

export const adminAuthen = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']
    const { _id } = jwt.verify(token, JWT_ADMINAUTH_SECRET)
    if (!_id) return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))
    
    const user = await User.findById(_id)
    if (!user) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลผู้ใช้'))

    req.user = user
    req.fromAdmin = true
    return next()
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.json(jsonResponse('tokenExpired', 'ข้อมูลการเข้าสู่ระบบหมดอายุ'))
      
    return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))
  }
} 

export const roleBasedAuthen = ({ guest = false }) => async (req, res, next) => {
  const token = req.headers['x-access-token']
  if (guest && !token) {
    req.user = null
    req.fromAdmin = false
    req.isGuest = true
    return next()
  }

  let fromAdmin = false
  let userId = ''

  try {
    const { _id } = jwt.verify(token, JWT_AUTH_SECRET)
    userId = _id
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.json(jsonResponse('tokenExpired', 'ข้อมูลการเข้าสู่ระบบหมดอายุ'))

    try {
      const { _id } = jwt.verify(token, JWT_ADMINAUTH_SECRET)
      userId = _id
      fromAdmin = true
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return res.json(jsonResponse('tokenExpired', 'ข้อมูลการเข้าสู่ระบบหมดอายุ'))
      
      return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง'))
    }
  }
  
  const user = await User.findById(userId)
  if (!user) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลผู้ใช้'))

  req.user = user
  req.fromAdmin = fromAdmin
  return next()
}

