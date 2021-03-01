import { Router } from 'express'
import Proctoring from '../models/proctoring'
import { adminAuthen } from '../middlewares/authentication'
import { jsonResponse } from '../utils/helpers'

const router = Router()

router.get('/', adminAuthen, async (req, res, next) => {
  try {
    const proctorings = await Proctoring.find({ user: req.user._id }).populate('exam')
    const exams = proctorings.map(proctoring => ({
      status: proctoring.status,
      ...proctoring.exam
    }))
    return res.json(jsonResponse('ok', { proctorings: exams } ))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการโหลดรายชื่อการคุมสอบ'))
  }
})

export default router
