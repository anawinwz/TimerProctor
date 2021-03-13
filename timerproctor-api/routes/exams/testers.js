import { Router } from 'express'

import { authenticate, adminAuthen } from '../../middlewares/authentication'
import { onlyExamPersonnel, populateExam } from '../../middlewares/exam'
import { populateAttempt } from '../../middlewares/attempt'

import Attempt from '../../models/attempt'
import AttemptEvent from '../../models/attemptEvent'

import { jsonResponse, getExamNsp } from '../../utils/helpers'
import { createSocketToken } from '../../utils/token'
import {
  convertAttemptToTester,
  convertEventToSnapshot,
  getCompletedAttemptsCount,
  getLastAttempt
} from '../../utils/attempt'

const router = Router({ mergeParams: true })

router.get('/', adminAuthen, populateExam, onlyExamPersonnel, async (req, res) => {
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
      }, {})

    return res.json(jsonResponse('ok', { testers }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})
router.get('/count', adminAuthen, populateExam, onlyExamPersonnel, async (req, res) => {
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
router.post('/', authenticate, populateExam, async (req, res) => {
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

    lastAttempt = await lastAttempt.populate('lastSnapshot').execPopulate()
    const { displayName, photoURL } = info
    getExamNsp(examId).to('proctor').emit('newTester', {
      _id: lastAttempt._id,
      name: displayName,
      avatar: photoURL,
      status: lastAttempt.status,
      lastSnapshot: convertEventToSnapshot(lastAttempt?.lastSnapshot),
      idCheck: lastAttempt.idCheck
    })

    const { status, idCheck } = lastAttempt
    const socketToken = createSocketToken(lastAttempt._id, userId, 'testtaker')
    
    return res.json(jsonResponse('ok', {
      socketToken,
      status,
      idCheck: {
        accepted: idCheck.accepted,
        reason: idCheck.reason
      }
    }))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบการขอเข้าห้องสอบ'))
  }
})

router.get('/:testerId', adminAuthen, populateExam, onlyExamPersonnel, populateAttempt, async (req, res) => {
  try {
    const attempt = await req.attempt
      .populate('user')
      .populate('lastSnapshot')
      .populate('idCheck.checker')
      .execPopulate()

    const tester = convertAttemptToTester(attempt.toJSON())
    return res.json(jsonResponse('ok', tester))
  } catch (err) {
    return res.json(jsonResponse('error', 'ไม่สามารถตรวจสอบข้อมูลผู้เข้าสอบได้'))
  }
})

router.patch('/:testerId/status', adminAuthen, populateExam, onlyExamPersonnel, populateAttempt, async (req, res) => {
  const { status, reason = '' } = req.body
  if (!status || ['authenticating', 'authenticated', 'started'].includes(status))
    return res.json(jsonResponse('failed', 'ค่าสถานะที่ต้องการเปลี่ยนไม่ถูกต้อง'))

  const attempt = req.attempt
  if (attempt.status !== 'started')
    return res.json(jsonResponse('failed', 'ไม่สามารถเปลี่ยนแปลงสถานะของผู้เข้าสอบรายนี้ได้'))
  
  if (attempt.status === status)
    return res.json(jsonResponse('failed', 'ผู้เข้าสอบรายนี้อยู่ในสถานะดังกล่าวอยู่แล้ว'))
  

  const socketId = attempt.socketId
  try {
    attempt.status = status
    attempt.socketId = undefined
    await attempt.save()
  } catch {
    return res.json(jsonResponse('error', 'ไม่สามารถบันทึกค่าสถานะใหม่ให้กับผู้เข้าสอบรายนี้ได้'))
  }

  try {
    if (status === 'terminated') {
      getExamNsp(req.exam._id).to(socketId).emit('terminated', reason, () => {
        getExamNsp(req.exam._id)?.[socketId]?.disconnect(true)
      })
      getExamNsp(req.exam._id).to('proctor').emit('testerUpdate', { id: attempt._id, updates: { status: 'terminated' } })
    }
  } catch {}

  return res.json(jsonResponse('ok', 'เปลี่ยนสถานะของผู้เข้าสอบเรียบร้อยแล้ว'))
})

router.get('/:testerId/snapshots', adminAuthen, populateExam, onlyExamPersonnel, populateAttempt, async (req, res) => {
  try {
    const { snapshots } = await req.attempt.populate('snapshots').execPopulate()
    return res.json(jsonResponse('ok', {
      snapshots: snapshots.map(event => convertEventToSnapshot(event))
    }))
  } catch {
    return res.json(jsonResponse('error', 'ไม่สามารถเรียกรายการภาพสุ่มบันทึกระหว่างสอบได้'))
  }
})

router.get('/:testerId/events', adminAuthen, populateExam, onlyExamPersonnel, populateAttempt, async (req, res) => {
  try {
    const attempt = req.attempt
    const { type } = req.query
    
    const events = await AttemptEvent.find({
      attempt: attempt._id,
      ...(type ? { type } : {})
    }, { attempt: 0 }).map(event => {
      delete event._id
      delete event.attempt
      return event
    })

    return res.json(jsonResponse('ok', { events: events }))
  } catch (err) {
    return res.json(jsonResponse('error', 'ไม่สามารถเรียกรายการเหตุการณ์ของผู้เข้าสอบได้'))
  }
})

export default router
