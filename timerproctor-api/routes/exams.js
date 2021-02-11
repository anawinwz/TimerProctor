import { Router } from 'express'
import jwt from 'jsonwebtoken'
import dot from 'dot-object'
import axios from 'axios'

import dayjs from '../utils/dayjs'

import { JWT_GAPPS_SECRET, JWT_SOCKET_SECRET } from '../config'

import Exam from '../models/exam'
import User from '../models/user'
import Attempt from '../models/attempt'
import { adminAuthen, authenticate } from '../middlewares/authentication'
import { onlyExamOwner, populateExam } from '../middlewares/exam'
import { jsonResponse, getExamNsp, convertAttemptToTester } from '../utils/helpers'
import { getDataFromHTML, toForm } from '../utils/gform'

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
      exam.populate('owner', (err, exam) => {
        if (err)
          return res.json(jsonResponse('error', `มีผู้สร้างการสอบจากฟอร์มนี้ใน TimerProctor ไปแล้ว\r\nกรุณาติดต่ออาจารย์เจ้าของการสอบเพื่อรับเชิญเป็นกรรมการฯ`))

        if (exam.owner.email === ownerEmail)
          return res.json(jsonResponse('error', `คุณเคยสร้างการสอบจากฟอร์มนี้ไปแล้ว\r\nตรวจสอบได้ที่ [การสอบของฉัน] ใน TimerProctor`))

        return res.json(jsonResponse('error', `มีผู้สร้างการสอบจากฟอร์มนี้ใน TimerProctor ไปแล้ว\r\nกรุณาติดต่ออาจารย์เจ้าของการสอบ (${exam.owner.email}) เพื่อรับเชิญเป็นกรรมการฯ`))
      })     
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
    const { _id: examId, authentication, timeWindow } = req.exam
    const { _id: userId, email, info } = req.user

    const { mode, schedule } = timeWindow
    if (mode === 'schedule') {
      const startDate = schedule?.startDate
      const endDate = schedule?.endDate
      if (startDate && endDate && !dayjs().isBetween(startDate, endDate, '[]'))
        return res.json(jsonResponse('failed', 'ขณะนี้ยังไม่ถึงเวลาเข้าสอบ'))
    }
    
    const allowedDomains = authentication?.login?.email?.allowedDomains || []
    const userDomain = email.split('@')[1]
    if (allowedDomains.length > 0 && !allowedDomains.includes(userDomain)) 
      return res.json(jsonResponse('failed', `คุณไม่สามารถใช้อีเมล @${userDomain} เข้าสอบได้`))

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

router.get('/:id/form', populateExam, async (req, res, next) => {
  const { linked = {} } = req.exam
  const { provider, publicURL, cached } = linked
  if (provider !== 'gforms' || !publicURL)
    return res.json(jsonResponse('failed', 'Access Denied.'))

  if (!cached?.data || Date.now() - cached?.updatedAt > 30 * 60) {
    const response = await axios.get(publicURL)
    if (response.status !== 200) throw new Error(`HTTP Status: ${response.status}`)

    const html = response.data
    const data = getDataFromHTML(html)
    const form = toForm(data)
    
    await Exam.findOneAndUpdate({ _id: req.exam._id }, {
      'linked.cached': {
        updatedAt: Date.now(),
        data: form
      }
    }).exec()

    return res.json(jsonResponse('ok', form))
  } else {
    const form = cached.data
    return res.json(jsonResponse('ok', form))
  }
})

router.post('/:id/form/submit', populateExam, async (req, res, next) => {
  const { body, exam } = req

  const { linked } = exam
  const { publicURL, cached } = linked

  if (!cached || !cached.data) return res.json(jsonResponse('failed'))
  const { data: { sections } } = cached

  const submitURL = publicURL.replace('/viewform', '/formResponse')

  const submitParams = new URLSearchParams()
  for (const [key, value] of Object.entries(body)) {
    if (key.match(/^answer_\d+$/)) {
      const entry = key.replace('answer_', 'entry.')
      if (Array.isArray(value)) {
        value.map(v => submitParams.append(entry, v))
      } else if (typeof value === 'object' && value !== null) {
        for (const [k, v] of Object.entries(value)) {
          submitParams.append(`${entry}_${k}`, v)
        }
      } else {
        submitParams.append(entry, value)
      }
    }
  }
  submitParams.append('pageHistory', [...Array(sections.length).keys()])

  console.log(submitParams)

  axios.post(submitURL, submitParams, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then(result => {
    const { status } = result
    if (status == 200) {
      res.json(jsonResponse('ok'))
    } else {
      console.log('GForms Error(then):', status)
      res.json(jsonResponse('failed'))
    }
  })
  .catch(err => {
    console.log('GForms Error(catch):', err.status)
    res.json(jsonResponse('failed'))
  })
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

router.get('/:id/testers', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  const { status } = req.query
  if (status && !['all', 'loggedin', 'authenticating', 'authenticated', 'started', 'completed'].includes(status))
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
    .populate('lastSnapshot')

    const testers = attempts.map(convertAttemptToTester)
      .reduce((acc, tester) => {
        const { _id } = tester
        return { ...acc, [_id]: tester }
      })

    return res.json(jsonResponse('ok', { testers }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/testers/count', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam
    const results = await Attempt.aggregate([
      { $match: { exam: exam._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    let counts = {}
    let total = 0
    for (const group of results) {
      counts[group._id] = group.count
      total += group.count
    }
    counts.all = total

    return res.json(jsonResponse('ok', { counts } ))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการนับจำนวนผู้เข้าสอบ'))
  }
})

router.get('/:id/testers/:testerId', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam
    const attempt = await Attempt.findOne({
      _id: req.params.testerId,
      exam: exam._id
    })
    .populate('user')
    .populate('lastSnapshot')

    if (!attempt) return res.json(jsonResponse('error', 'ไม่พบผู้เข้าสอบดังกล่าว'))

    const tester = convertAttemptToTester(attempt)
    return res.json(jsonResponse('ok', tester))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

router.get('/:id/start', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
  try {
    const exam = req.exam

    if (exam.timeWindow.mode !== 'realtime' || exam.timeWindow.realtime.status === 'started')
      return res.json(jsonResponse('failed', 'ไม่สามารถสั่งเริ่มการสอบนี้ได้'))
    
    getExamNsp(exam._id).to('testtaker').emit('examStatus', 'started')
  
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

    getExamNsp(exam._id).to('testtaker').emit('examStatus', 'stopped')
    
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

    let updates = req.body

    updates.updatedAt = Date.now()
    await Exam.updateOne({ _id: exam._id }, dot.dot(updates))

    return res.json(jsonResponse('ok', 'อัปเดตข้อมูลการสอบแล้ว'))
  } catch (err) {
    console.log(err)
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})

export default router
