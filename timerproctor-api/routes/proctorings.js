import { Router } from 'express'
import Proctoring from '../models/proctoring'
import { adminAuthen } from '../middlewares/authentication'
import { jsonResponse } from '../utils/helpers'

const router = Router()

router.get('/', adminAuthen, async (req, res, next) => {
  try {
    const proctorings = Proctoring.find({ user: req.user._id }).populate('exam')
    return res.json(jsonResponse('success', proctorings))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการโหลดรายชื่อการสอบ'))
  }
})
