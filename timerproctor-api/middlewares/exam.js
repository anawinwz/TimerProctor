import Exam from '../models/exam'

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
