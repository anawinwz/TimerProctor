import { Router } from 'express'
import jwt from 'jsonwebtoken'
import dot from 'dot-object'

import { JWT_GAPPS_SECRET } from '../../config'

import { adminAuthen, roleBasedAuthen } from '../../middlewares/authentication'
import { onlyExamOwner, onlyExamPersonnel, populateExam } from '../../middlewares/exam'

import form from './form'
import testers from './testers'
import proctors from './proctors'

import Exam from '../../models/exam'
import User from '../../models/user'

import dayjs from '../../utils/dayjs'
import { jsonResponse, getExamNsp, getFirstValidationErrMessage, isExamProctor } from '../../utils/helpers'
import { createSocketToken } from '../../utils/token'
import { ValidationError } from '../../utils/error'

dot.keepArray = true

const router = Router()

router.get('/', adminAuthen, async (req, res) => {
  try {
    const exams = await Exam.find(
      { owner: req.user._id },
      {
        name: 1,
        timeWindow: 1,
        createdAt: 1,
        updatedAt: 1
      }
    )
    return res.json(jsonResponse('ok', { exams: exams }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการโหลดรายชื่อการสอบ'))
  }
})

router.post('/create', async (req, res) => {
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

      exam.populate('owner', 'email', (err, exam) => {
        if (err)
          return res.json(jsonResponse('error', `มีผู้สร้างการสอบจากฟอร์มนี้ใน TimerProctor ไปแล้ว\r\nกรุณาติดต่ออาจารย์เจ้าของการสอบเพื่อรับเชิญเป็นกรรมการฯ`))

        return res.json(jsonResponse('error', `มีผู้สร้างการสอบจากฟอร์มนี้ใน TimerProctor ไปแล้ว\r\nกรุณาติดต่ออาจารย์เจ้าของการสอบ (${exam.owner.email}) เพื่อรับเชิญเป็นกรรมการฯ`))
      })     
    }
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการสร้างการสอบ'))
  }
  
})

router.post('/updateLinked', async (req, res) => {
  try {
    const { token } = req.body
    const payload = jwt.verify(token, JWT_GAPPS_SECRET)
    if (!payload) {
      return jsonResponse('error', 'Access Denied.')
    }

    const { provider, id, settings } = payload

    const exam = await Exam.findOne({
      'linked.provider': provider,
      'linked.id': id
    })

    if (!exam) {
      return res.json(jsonResponse('error', 'ไม่พบการสอบที่เชื่อมโยงกับฟอร์มนี้ กรุณา [สร้างเป็นการสอบของฉัน] ก่อน'))
    } else {
      let updates = {
        linked: {
          settings: {}
        }
      }
      const {
        autofillEmail,
        autofillEmailField,
        autofillTesterID,
        autofillTesterIDField
      } = settings

      updates.linked.settings.autofill = {
        email: autofillEmail || false,
        testerId: autofillTesterID || false
      }
      updates.linked.settings.autofillFields = {
        email: autofillEmailField || '',
        testerId: autofillTesterIDField || ''
      }

      
      await Exam.updateOne({ _id: exam._id }, dot.dot(updates), { runValidators: true })
      return res.json(jsonResponse('ok'))
    }
  } catch (err) {
    if (err.name === 'ValidationError') 
      return res.json(jsonResponse('failed', getFirstValidationErrMessage(err.errors)))
      
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่าฟอร์มการสอบ'))
  }
})

router.get('/:id', roleBasedAuthen({ guest: true }), populateExam, async (req, res) => {
  const exam = req.exam
  
  let ret = exam.toJSON()
  delete ret.linked?.cached?.data

  const isThisExamPersonnel = req.fromAdmin && (
    String(req.user._id) === String(exam.owner) ||
    await isExamProctor(exam.id, req.user._id)
  )

  if (!req.fromAdmin) {
    delete ret.announcements

    delete ret.owner
    delete ret.linked
    delete ret.maxAttempts
    delete ret.createdAt
    delete ret.updatedAt
    
    delete ret.timeWindow?.realtime?.allowLogin
    delete ret.authentication?.login?.email?.allowedDomains
  } else if (!isThisExamPersonnel) {
    return res.json(jsonResponse('failed', 'คุณไม่มีสิทธิ์เข้าถึงการสอบนี้'))
  }
  
  return res.json(jsonResponse('ok', { exam: ret }))
})
router.patch('/:id', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
  try {
    const exam = req.exam

    let updates = req.body

    const { mode: timeWindowMode, schedule } = updates?.timeWindow || {}
    if (timeWindowMode) {
      if (timeWindowMode === 'schedule') {
        const { startDate, endDate } = schedule || {}
        if (!startDate)
          throw new ValidationError('timeWindow.schedule.startDate', 'ต้องระบุวัน-เวลาเริ่มการสอบ')
        if (!endDate)
          throw new ValidationError('timeWindow.schedule.endDate', 'ต้องระบุวัน-เวลาสิ้นสุดการสอบ')

        if (!dayjs(startDate).isBefore(endDate))
          throw new ValidationError('timeWindow.schedule.startDate', 'วัน-เวลาเริ่มต้องเกิดขึ้นก่อนวัน-เวลาสิ้นสุดการสอบ')
      } else {
        updates.announcements = []
      }
    }

    
    updates.updatedAt = Date.now()
    await Exam.updateOne({ _id: exam._id }, dot.dot(updates), { runValidators: true })

    return res.json(jsonResponse('ok', 'อัปเดตข้อมูลการสอบแล้ว'))
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.json(jsonResponse('failed', getFirstValidationErrMessage(err.errors)))
    } else {
      console.log(err)
      return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบอัปเดตข้อมูลการสอบ'))
    }
    
  }
})

router.get('/:id/announcements', roleBasedAuthen({ guest: false }), populateExam, async (req, res) => {
  const exam = req.exam
  const { announcements } = exam
  if (exam.timeWindow.mode !== 'realtime')
    return res.json(jsonResponse('failed', 'ไม่สามารถเรียกดูประกาศของการสอบประเภทนี้ได้'))
  
  const isThisExamPersonnel = req.fromAdmin && (
    String(req.user._id) === String(exam.owner) ||
    await isExamProctor(exam.id, req.user._id)
  )

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
router.post('/:id/announcements', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
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
    if (err.name === 'ValidationError') {
      return res.json(jsonResponse('failed', getFirstValidationErrMessage(err.errors)))
    }
    
    return res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในการประกาศถึงผู้เข้าสอบ'))
  }
})

router.use('/:id/form', form)
router.use('/:id/testers', testers)
router.use('/:id/proctors', proctors)

router.post('/:id/startProctor', adminAuthen, populateExam, onlyExamPersonnel, async (req, res) => {
  try {
    const { _id: userId } = req.user
    const socketToken = createSocketToken(userId, userId, 'proctor')

    return res.json(jsonResponse('ok', {
      socketToken
    }))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.put('/:id/status', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
  try {
    const { status } = req.body
    const exam = req.exam

    if (!['started', 'stopped'].includes(status))
      return res.json(jsonResponse('failed', 'ข้อมูลสถานะไม่ถูกต้อง'))

    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === status)
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งเริ่มการสอบนี้ได้'))
  
    const newAllowLogin = status === 'started' ? true : false

    exam.timeWindow.realtime.status = status
    exam.timeWindow.realtime.allowLogin = newAllowLogin
    if (status === 'started') {
      exam.timeWindow.realtime.startedAt = new Date()
      exam.announcements = []
    }
    await exam.save()

    getExamNsp(exam._id).emit('examStatus', status)
    getExamNsp(exam._id).to('proctor').emit('examAllowLogin', newAllowLogin)

    return res.json(jsonResponse('ok', `สั่ง${status === 'started' ? 'เริ่ม':'สิ้นสุด'}การสอบแล้ว`))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบตั้งค่าสถานะการสอบ'))
  }
})

router.put('/:id/allowLogin', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
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
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบตั้งค่าอนุญาตการเข้าห้องสอบ'))
  }
})

export default router
