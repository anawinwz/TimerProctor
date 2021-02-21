import { Router } from 'express'
import jwt from 'jsonwebtoken'
import dot from 'dot-object'

import { JWT_GAPPS_SECRET, JWT_SOCKET_SECRET } from '../../config'

import { adminAuthen, authenticate, roleBasedAuthen } from '../../middlewares/authentication'
import { onlyExamOwner, populateExam } from '../../middlewares/exam'
import testers from './testers'
import form from './form'

import Exam from '../../models/exam'
import User from '../../models/user'
import Attempt from '../../models/attempt'

import dayjs from '../../utils/dayjs'
import { jsonResponse, getExamNsp } from '../../utils/helpers'
import { getCompletedAttemptsCount, getLastAttempt } from '../../utils/attempt'

dot.keepArray = true

const router = Router()

router.get('/', adminAuthen, async (req, res, next) => {
  try {
    const exams = await Exam.find({ owner: req.user._id })
    return res.json(jsonResponse('ok', { exams: exams }))
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
      'linked.provider': provider,
      'linked.id': id
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
      return res.json(jsonResponse('ok', 'สร้างการสอบที่เชื่อมกับฟอร์มนี้เรียบร้อยแล้ว!\r\nตรวจสอบได้ที่ [การสอบของฉัน] ใน TimerProctor'))
    } else {
      if (String(exam.owner) === String(ownerUser._id))
        return res.json(jsonResponse('error', `คุณเคยสร้างการสอบจากฟอร์มนี้ไปแล้ว\r\nตรวจสอบได้ที่ [การสอบของฉัน] ใน TimerProctor`))

      exam.populate('owner', (err, exam) => {
        if (err)
          return res.json(jsonResponse('error', `มีผู้สร้างการสอบจากฟอร์มนี้ใน TimerProctor ไปแล้ว\r\nกรุณาติดต่ออาจารย์เจ้าของการสอบเพื่อรับเชิญเป็นกรรมการฯ`))

        return res.json(jsonResponse('error', `มีผู้สร้างการสอบจากฟอร์มนี้ใน TimerProctor ไปแล้ว\r\nกรุณาติดต่ออาจารย์เจ้าของการสอบ (${exam.owner.email}) เพื่อรับเชิญเป็นกรรมการฯ`))
      })     
    }
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการสร้างการสอบ'))
  }
  
})

router.get('/:id', roleBasedAuthen({ guest: true }), populateExam, async (req, res, next) => {
  const exam = req.exam
  
  let ret = exam.toJSON()
  delete ret.linked?.cached?.data

  const isThisExamPersonnel = String(req.user?._id) === String(exam.owner)
  if (!req.fromAdmin || !isThisExamPersonnel) {
    delete ret.announcements

    delete ret.owner
    delete ret.linked
    delete ret.maxAttempts
    delete ret.createdAt
    delete ret.updatedAt
    
    delete ret.timeWindow?.realtime?.allowLogin
    delete ret.authentication?.login?.email?.allowedDomains
  }
  
  return res.json(ret)
})
router.get('/:id/announcements', roleBasedAuthen({ guest: false }), populateExam, (req, res, next) => {
  const exam = req.exam
  const { announcements } = exam
  if (exam.timeWindow.mode !== 'realtime')
    return res.json(jsonResponse('failed', 'ไม่สามารถเรียกดูประกาศของการสอบประเภทนี้ได้'))
  
  const isThisExamPersonnel = String(req.user?._id) === String(exam.owner)

  if (!req.fromAdmin || !isThisExamPersonnel) {
    let ret = []
    if (announcements.length > 0)
      ret.push(announcements[announcements.length - 1].content)
  
    res.json(jsonResponse('ok', { announcements: ret }))
  } else {
    exam.populate('announcements.creator', (err, exam) => {
      if (err) res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในการโหลดข้อมูลประกาศ'))
      res.json(jsonResponse('ok', { announcements: exam.announcements }))
    })
  }
})
router.post('/:id/announcements', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  const exam = req.exam
  const { content } = req.body
  if (exam.timeWindow.mode !== 'realtime')
    return res.json(jsonResponse('failed', 'ไม่สามารถเพิ่มประกาศให้การสอบประเภทนี้ได้'))
  
  if (!content)
    return res.json(jsonResponse('failed', 'รูปแบบเนื้อหาประกาศไม่ถูกต้อง'))

  try {
    exam.announcements.push({
      content: content,
      creator: req.user._id
    })
    await exam.save()

    getExamNsp(exam._id).to('testtaker').emit('examAnnouncement', content)

    return res.json(jsonResponse('ok', 'ประกาศถึงผู้เข้าสอบเรียบร้อยแล้ว'))
  } catch (err) {
    return res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในการประกาศถึงผู้เข้าสอบ'))
  }
})

router.use('/:id/form', form)
router.use('/:id/testers', testers)

router.post('/:id/attempt', authenticate, populateExam, async (req, res, next) => {
  try {
    const { _id: examId, authentication, timeWindow, maxAttempts = 1 } = req.exam
    const { _id: userId, email, info } = req.user

    const { mode, realtime, schedule } = timeWindow
    if (mode === 'schedule') {
      const startDate = schedule?.startDate
      const endDate = schedule?.endDate
      if (startDate && endDate && !dayjs().isBetween(startDate, endDate, '[]'))
        return res.json(jsonResponse('failed', 'ขณะนี้ยังไม่ถึงเวลาเข้าสอบ'))
    } else if (mode === 'realtime') {
      if (!realtime.allowLogin)
        return res.json(jsonResponse('failed', realtime.status === 'started' ? 'ขณะนี้ไม่อนุญาตให้เข้าห้องสอบเพิ่มเติมแล้ว' : 'ขณะนี้ยังไม่อนุญาตให้เข้าห้องสอบ'))
    }
    
    const allowedDomains = authentication?.login?.email?.allowedDomains || []
    const userDomain = email.split('@')[1]
    if (allowedDomains.length > 0 && !allowedDomains.includes(userDomain)) 
      return res.json(jsonResponse('failed', `คุณไม่สามารถใช้อีเมล @${userDomain} เข้าสอบได้`))

    let lastAttempt = await getLastAttempt(examId, userId, { notCompleted: true })
    if (!lastAttempt) {
      const currentAttempts = await getCompletedAttemptsCount(examId, userId)
      if (currentAttempts >= maxAttempts)
        return res.json(jsonResponse('failed', `คุณทำการสอบครบตามจำนวนสูงสุดที่ทำได้แล้ว (${maxAttempts} ครั้ง/คน)`))

      const newAttempt = new Attempt({
        exam: examId,
        user: userId
      })
      lastAttempt = await newAttempt.save()
    }

    if (lastAttempt.status === 'terminated')
      return res.json(jsonResponse('failed', 'คุณถูกเชิญออกจากห้องสอบแล้ว ไม่สามารถกลับเข้ามาได้อีก'))

    const { displayName, photoURL } = info
    getExamNsp(examId).to('proctor').emit('newTester', {
      _id: lastAttempt._id,
      name: displayName,
      avatar: photoURL,
      status: lastAttempt.status,
      lastSnapshot: lastAttempt?.snapshot,
      idCheck: lastAttempt.idCheck
    })

    const socketToken = jwt.sign({ id: lastAttempt._id, userId, role: 'testtaker' }, JWT_SOCKET_SECRET)
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
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/startProctor', adminAuthen, populateExam, async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    const socketToken = jwt.sign({ id: userId, userId, role: 'proctor' }, JWT_SOCKET_SECRET)
    return res.json(jsonResponse('ok', {
      socketToken
    }))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/start', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam

    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'started')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งเริ่มการสอบนี้ได้'))
  
    exam.announcements = []

    exam.timeWindow.realtime.status = 'started'
    exam.timeWindow.realtime.allowLogin = true
    exam.timeWindow.realtime.startedAt = new Date()
    await exam.save()

    getExamNsp(exam._id).emit('examStatus', 'started')
    getExamNsp(exam._id).to('proctor').emit('examAllowLogin', true)

    return res.json(jsonResponse('ok', 'สั่งเริ่มการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/stop', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam

    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'stopped')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งยุติการสอบนี้ได้'))

    
    exam.timeWindow.realtime.status = 'stopped'
    exam.timeWindow.realtime.allowLogin = false
    exam.timeWindow.realtime.stoppedAt = new Date()
    await exam.save()

    getExamNsp(exam._id).emit('examStatus', 'stopped')
    getExamNsp(exam._id).to('proctor').emit('examAllowLogin', false)

    return res.json(jsonResponse('ok', 'สั่งยุติการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/allowLogin', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam
    const { allow } = req.body

    if (typeof allow !== 'boolean') 
      return res.json(jsonResponse('failed', 'Access Denied.'))

    if (exam.timeWindow.mode !== 'realtime')
      return res.json(jsonResponse('failed', `ไม่สามารถตั้งค่า${allow ? '' : 'ไม่'}อนุญาตการเข้าห้องสอบนี้ได้`))
  
    exam.timeWindow.realtime.allowLogin = allow
    await exam.save()

    getExamNsp(exam._id).to('proctor').emit('examAllowLogin', allow)

    return res.json(jsonResponse('ok', `ตั้ง${allow ? '' : 'ไม่'}อนุญาตการเข้าห้องสอบแล้ว`))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.post('/:id/update', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam

    let updates = req.body

    const timeWindowMode = updates?.timeWindow?.mode
    if (timeWindowMode && timeWindowMode !== 'schedule') 
      updates.announcements = []
    
    updates.updatedAt = Date.now()
    await Exam.updateOne({ _id: exam._id }, dot.dot(updates))

    return res.json(jsonResponse('ok', 'อัปเดตข้อมูลการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

export default router
