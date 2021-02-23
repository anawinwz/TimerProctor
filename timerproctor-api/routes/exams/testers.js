import { Router } from 'express'

import { adminAuthen } from '../../middlewares/authentication'
import { onlyExamOwner, populateExam } from '../../middlewares/exam'
import { populateAttempt } from '../../middlewares/attempt'

import Attempt from '../../models/attempt'
import AttemptEvent from '../../models/attemptEvent'

import { jsonResponse } from '../../utils/helpers'
import { convertAttemptToTester, convertEventToSnapshot } from '../../utils/attempt'

const router = Router({ mergeParams: true })

router.get('/', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
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

router.get('/count', adminAuthen, populateExam, onlyExamOwner, async (req, res, next) => {
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

router.get('/:testerId', adminAuthen, populateExam, onlyExamOwner, populateAttempt, async (req, res, next) => {
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

router.get('/:testerId/snapshots', adminAuthen, populateExam, onlyExamOwner, populateAttempt, async (req, res, next) => {
  try {
    const { snapshots } = await req.attempt.populate('snapshots')
    return res.json(jsonResponse('ok', {
      snapshots: snapshots.map(event => convertEventToSnapshot(event))
    }))
  } catch {
    return res.json(jsonResponse('error', 'ไม่สามารถเรียกรายการภาพสุ่มบันทึกระหว่างสอบได้'))
  }
})

router.get('/:testerId/events', adminAuthen, populateExam, onlyExamOwner, populateAttempt, async (req, res, next) => {
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
