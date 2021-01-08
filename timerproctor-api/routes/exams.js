import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_GAPPS_SECRET, JWT_SOCKET_SECRET } from '../config'
import Exam from '../models/exam'
import User from '../models/user'
import { adminAuthen, authenticate } from '../middlewares/authentication'
import { onlyExamOwner, populateExam } from '../middlewares/exam'
import { jsonResponse, getExamNsp } from '../utils/helpers'
import Attempt from '../models/attempt'

const router = Router()

router.get('/', adminAuthen, async (req, res, next) => {
  try {
    const exams = await Exam.find({ owner: req.user._id })
    return res.json(jsonResponse('success', { exams: exams }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการโหลดรายชื่อการสอบ'))
  }
})

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

    if (lastAttempt.status === 'terminated')
      return res.json(jsonResponse('failed', 'คุณถูกเชิญออกจากห้องสอบแล้ว ไม่สามารถกลับเข้ามาได้อีก'))

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

router.get('/:id/testers', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  const { status } = req.query
  if (status && !['all', 'loggedin', 'authenticated', 'started', 'completed'].includes(status))
    return res.json(jsonResponse('error', 'Invalid request.'))

  try {
    const exam = req.exam
    const attempts = await Attempt.find({
      exam: exam._id, 
      ...(status && status !== 'all' ? 
        { status: status } : 
        { status: { $ne: 'terminated' } }
      )
    })
    .populate('user')

    const testers = attempts.map(attempt => {
      const { _id, user, status } = attempt
      const { info: { displayName, photoURL } } = user
      return {
        _id,
        name: displayName,
        avatar: photoURL,
        status
      }
    })

    return res.json(jsonResponse('success', { testers }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/start', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
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

router.get('/:id/stop', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
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

router.post('/:id/update', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
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
