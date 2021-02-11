import Attempt from '../models/attempt'
import { jsonResponse } from '../utils/helpers'

export const populateAttempt = async (req, res, next) => {
  try {
    const exam = req.exam
    const attempt = await Attempt.findOne({
      _id: req.params.testerId,
      exam: exam._id
    })
    console.log(req.params.testerId)
    if (!attempt) return res.json(jsonResponse('error', 'ไม่พบผู้เข้าสอบดังกล่าว'))
    req.attempt = attempt
    return next()
  } catch {
    return res.json(jsonResponse('failed', 'ไม่สามารถตรวจสอบข้อมูลผู้เข้าสอบได้'))
  }
}
