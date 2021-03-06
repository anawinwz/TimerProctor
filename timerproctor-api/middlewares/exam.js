import Exam from '../models/exam'
import Proctoring from '../models/proctoring'

import { jsonResponse } from '../utils/helpers'
import dayjs from '../utils/dayjs'

export const populateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
    if (!exam) return res.json(jsonResponse('failed', 'ไม่พบข้อมูลการสอบดังกล่าว'))
    req.exam = exam
    return next()
  } catch {
    return res.json(jsonResponse('failed', 'ไม่สามารถตรวจสอบข้อมูลการสอบได้'))
  }
}

export const onlyExamOwner = (req, res, next) => {
  if (String(req.exam.owner) === String(req.user._id)) return next()
  return res.json(jsonResponse('failed', 'Access Denied.'))
}

export const onlyExamProctors = async (req, res, next) => {
  const proctoring = await Proctoring.findOne({
    exam: req.exam._id,
    user: req.user._id,
    status: 'accepted'
  })

  if (proctoring) return next()
  return res.json(jsonResponse('failed', 'Access Denied.'))
}

export const onlyExamPersonnel = async (req, res, next) => {
  if (String(req.exam.owner) === String(req.user._id)) return next()
  
  const proctoring = await Proctoring.findOne({
    exam: req.exam._id,
    user: req.user._id,
    status: 'accepted'
  })

  if (proctoring) return next()
  return res.json(jsonResponse('failed', 'Access Denied.'))
}

export const onlyDuringExam = async (req, res, next) => {
  const { timeWindow } = req.exam
  const { mode, realtime, schedule } = timeWindow
  
  let isStarted = false
  switch (mode) {
    case 'realtime': isStarted = realtime.status === 'started'; break
    case 'schedule': isStarted = dayjs().isBetween(schedule.startAt, schedule.endDate, '[]'); break
  }

  if (isStarted) return next()
  return res.json(jsonResponse('failed', 'ขณะนี้ยังไม่ถึงเวลาเข้าสอบ'))
}
