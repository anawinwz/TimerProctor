import jwt from 'jsonwebtoken'
import { JWT_AUTHEN_SECRET, JWT_ADMIN_AUTHEN_SECRET } from '../config'

import User from '../models/user'
import { jsonResponse } from '../utils/helpers'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']
    const { _id } = jwt.verify(token, JWT_AUTHEN_SECRET)
    if (!_id) return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ'))
    
    const user = await User.findById(_id)
    if (!user) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลผู้ใช้'))

    req.user = user
    req.fromAdmin = false
    return next()
  } catch (err) {
    return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ'))
  }
} 

export const adminAuthen = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']
    const { _id } = jwt.verify(token, JWT_ADMIN_AUTHEN_SECRET)
    if (!_id) return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ'))
    
    const user = await User.findById(_id)
    if (!user) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลผู้ใช้'))

    req.user = user
    req.fromAdmin = true
    return next()
  } catch (err) {
    return res.json(jsonResponse('failed', 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ'))
  }
} 
