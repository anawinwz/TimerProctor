import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_GAPPS_SECRET, JWT_SOCKET_SECRET } from '../config'
import Exam from '../models/exam'
import User from '../models/user'
import { authenticate } from '../middlewares/authentication'
import { populateExam } from '../middlewares/exam'
import { jsonResponse, getExamNsp } from '../utils/helpers'
import Attempt from '../models/attempt'

const router = Router()

router.post('/create', async (req, res, next) => {
  try {
    const { token } = req.body
    const payload = jwt.verify(token, JWT_GAPPS_SECRET)
    if (!payload) {
      return jsonResponse('error', 'Access Denied.')
    }

    const { provider, id, publicURL, ownerEmail, name, desc } = payload

    let ownerUser = await User.findOne({ email: ownerEmail })
    if (!ownerUser) {
      const newUser = new User({ email: ownerEmail })
      ownerUser = await newUser.save()
    }

    let exam = await Exam.findOne({
      linked: { provider, id }
    })
    if (!exam) {
      const newExam = new Exam({
        name,
        desc,
        owner: ownerUser._id,
        linked: {
          provider,
          id,
          publicURL
        }
      })
      exam = await newExam.save()
      return res.json(jsonResponse('success'))
    } else {
      return res.json(jsonResponse('error', 'การสอบนี้มีอยู่แล้วในระบบ'))
    }
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการสร้างการสอบ'))
  }
  
})

router.get('/:id', populateExam, async (req, res, next) => {
  const exam = req.exam
  return res.json(exam)
})

router.post('/:id/attempt', authenticate, populateExam, async (req, res, next) => {
  try {
    const { _id: examId } = req.exam
    const { _id: userId } = req.user
    
    let lastAttempt = await Attempt.findOne({ exam: examId, user: userId, status: { $ne: 'completed' } })
    if (!lastAttempt) {
      const newAttempt = new Attempt({
        exam: examId,
        user: userId
      })
      lastAttempt = await newAttempt.save()
    }

    const socketToken = jwt.sign({ userId, role: 'testtaker' }, JWT_SOCKET_SECRET)
    const { status, idCheck } = lastAttempt
    return res.json(jsonResponse('ok', {
      socketToken,
      status,
      idCheck: {
        accepted: idCheck.accepted,
        reason: idCheck.reason
      }
    }))
  } catch {
    return res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/start', populateExam, async (req, res, next) => {
  try {
    const exam = req.exam

    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'started')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งเริ่มการสอบนี้ได้'))
    
    getExamNsp(req.app, exam._id).to('testtaker').emit('examStatus', 'started')
  
    exam.timeWindow.realtime.status = 'started'
    exam.timeWindow.realtime.startedAt = new Date()
    await exam.save()

    return res.json(jsonResponse('ok', 'สั่งเริ่มการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/stop', populateExam, async (req, res, next) => {
  try {
    const exam = req.exam

    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'stopped')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งยุติการสอบนี้ได้'))

    getExamNsp(req.app, exam._id).to('testtaker').emit('examStatus', 'stopped')
    
    exam.timeWindow.realtime.status = 'stopped'
    exam.timeWindow.realtime.stoppedAt = new Date()
    await exam.save()

    return res.json(jsonResponse('ok', 'สั่งยุติการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/update', populateExam, async (req, res, next) => {
  try {
    const exam = req.exam

    Object.assign(exam, req.body)
    await exam.save()

    return res.json(jsonResponse('ok', 'อัปเดตข้อมูลการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

export default router
