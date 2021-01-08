import Exam from '../models/exam'
import { jsonResponse } from '../utils/helpers'

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

export const onlyExamOwner = async (req, res, next) => {
  if (req.user._id !== req.exam.owner) return next()
  return res.json(jsonResponse('failed', 'Access Denied.'))
}
