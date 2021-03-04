import { Router } from 'express'

import { adminAuthen } from '../../middlewares/authentication'
import { onlyExamOwner, populateExam } from '../../middlewares/exam'

import User from '../../models/user'
import Proctoring from '../../models/proctoring'

import { jsonResponse } from '../../utils/helpers'

const router = Router({ mergeParams: true })

router.get('/', adminAuthen, populateExam, async (req, res) => {
  const { qStatus } = req.query
  if (qStatus && !['all', 'invited', 'accepted', 'rejected'].includes(qStatus))
    return res.json(jsonResponse('error', 'Invalid request.'))
  
  const exam = req.exam
  const user = req.user
  const isExamOwner = String(exam.owner) === String(user._id)
  try {  
    const results = await Proctoring.find(
      {
        exam: exam._id, 
        ...(qStatus && qStatus !== 'all' ? 
          { status: qStatus } : {}
        )
      }, 
      {
        exam: 0,
        ...(isExamOwner ? {} : {
          invitedAt: 0,
          respondedAt: 0
        })
      }
    )
    .populate('user', '_id info email')

    const proctors = results.toJSON().reduce((acc, proctor) => {
      const { _id, user, status } = proctor
      return {
        ...acc,
        [_id]: { ...user, status }
      }
    }, {})

    return res.json(jsonResponse('ok', { proctors }))
  } catch (err) {
    return res.json(jsonResponse('error', 'เกิดข้อผิดพลาดในระบบ'))
  }
})
router.post('/', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
  const exam = req.exam
  const { email, notify = false } = req.body

  try {
    const results = await Proctoring.aggregate([
      { '$match': { exam: exam._id } },
      { '$project': { exam: 0 } },
      {
        '$lookup': {
          'from': 'users', 
          'localField': 'user', 
          'foreignField': '_id', 
          'as': 'user'
        }
      },
      { '$unwind': { 'path': '$user' } },
      {
        '$match': { 'user.email': email }
      }
    ])

    if (results.length > 0) {
      const { status } = results[0]

      if (status !== 'rejected') {
        return res.json(jsonResponse(
          'failed',
          status === 'invited' ?
            'คุณเคยเชิญบุคคลนี้ไปแล้ว แต่ยังไม่มีการตอบรับ/ปฏิเสธ' :
            'บุคคลนี้กำลังเป็นกรรมการคุมสอบอยู่แล้ว'
        ))
      }
    }
  } catch {
    return res.json(jsonResponse('failed', 'ไม่สามารถตรวจสอบสถานะของบุคคลนี้ได้'))
  }

  try {
    let proctorUser = await User.findOne({ email: email })
    if (!proctorUser) {
      const newUser = new User({ email: email })
      proctorUser = await newUser.save()
    }

    const proctor = new Proctoring({
      exam: exam._id,
      user: proctorUser._id
    })
    await proctor.save()

    if (notify) {
    }

    return res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] ${notify ? 'พร้อมอีเมลแจ้งเตือน' : ''}เรียบร้อยแล้ว`))
  } catch {
    return res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในการเชิญบุคคลนี้'))
  }
})

export default router
