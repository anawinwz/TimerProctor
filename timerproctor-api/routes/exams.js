import { Router } from 'express'
import Exam from '../models/exam'
import { jsonResponse } from '../utils/helpers'

const router = Router()

router.get('/:id/info', async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
    return res.json(exam)
  } catch {
    return res.json(jsonResponse('failed', 'ไม่พบข้อมูลการสอบดังกล่าว'))
  }
})

router.get('/demo/create', async (req, res, next) => {
  const newExam = new Exam({
    name: 'ข้อสอบกลางภาค วิชา มนุษย์กับทะเล',
    desc: `เป็นข้อสอบปรนัย 3 ข้อ <br/>
    มีเวลาในการทำข้อสอบ 50 นาที<br/>
    โดยจะเริ่มจับเวลาพร้อมกันทุกคน ขอให้นิสิตเข้าสู่ห้องสอบโดยเร็ว`,
    timeWindow: {
      mode: 'realtime',
      realtime: {
        status: 'pending'
      }
    },
    timer: { duration: 50 },
    authentication: {
      loginMethods: [{ method: 'google' }]
    }
  })
  const exam = await newExam.save()
  res.json(jsonResponse('success', exam))
})

export default router
