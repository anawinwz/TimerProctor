import { Router } from 'express'
import Proctoring from '../models/proctoring'
import { adminAuthen } from '../middlewares/authentication'
import { jsonResponse, getFirstValidationErrMessage, determineExamStatus } from '../utils/helpers'

const router = Router()

router.get('/', adminAuthen, async (req, res) => {
  try {
    const proctorings = await Proctoring.find({
      user: req.user._id,
      status: { $nin: ['rejected', 'cancelled'] }
    }, { user: 0 })
    .lean()
    .populate('exam', 'name owner timeWindow createdAt updatedAt')
    .populate('exam.owner')

    const exams = proctorings.map(proctoring => ({
      proctoring: {
        id: proctoring._id,
        status: proctoring.status,
        invitedAt: proctoring.invitedAt,
        respondedAt: proctoring.respondedAt
      },
      ...proctoring.exam,
      status: determineExamStatus(proctoring.exam)
    }))
    return res.json(jsonResponse('ok', { proctorings: exams } ))
  } catch {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในการโหลดรายชื่อการคุมสอบ'))
  }
})

router.patch('/:id', adminAuthen, async (req, res) => {
  const { id } = req.params

  const { status: newStatus } = req.body
  if (!id || !newStatus || !['accepted', 'rejected'].includes(newStatus))
      return res.json(jsonResponse('failed', 'Access Denied.'))

  try {
    const proctoring = await Proctoring.findOne({
      _id: id,
      user: req.user._id
    })

    if (!proctoring)
      return res.json(jsonResponse('failed', 'ไม่พบการคุมสอบที่ต้องการตอบรับ/ปฏิเสธ'))

    const { status } = proctoring
    if (status !== 'invited')
      return res.json(jsonResponse('failed', `คุณ${status === 'accepted' ? 'ตอบรับ':'ปฏิเสธ'}การคุมสอบนี้ไปแล้ว`))
    
    proctoring.status = newStatus
    proctoring.respondedAt = Date.now()
    await proctoring.save()

    res.json(jsonResponse('ok', `${newStatus === 'accepted' ? 'ตอบรับ':'ปฏิเสธ'}การคุมสอบนี้สำเร็จ!`))
  } catch (err) {
    if (err.name === 'ValidationError') 
      return res.json(jsonResponse('failed', getFirstValidationErrMessage(err.errors)))
    
    res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในระบบตอบรับ/ปฏิเสธการคุมสอบ'))
  }
})

export default router
