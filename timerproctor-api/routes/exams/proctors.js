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
          { status: qStatus } :
          { status: { $nin: ['cancelled'] } }
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
    .lean()
    .populate('user', '_id info email')

    const proctors = results.reduce((acc, proctor) => {
      const { _id, user = {}, status } = proctor
      if (status !== 'accepted')
        delete user.info
      
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
      const proctor = results[0]
      const { status } = proctor

      if (['invited', 'accepted'].includes(status)) {
        return res.json(jsonResponse(
          'failed',
          status === 'invited' ?
            'คุณเคยเชิญบุคคลนี้ไปแล้ว แต่ยังไม่มีการตอบรับ/ปฏิเสธ' :
            'บุคคลนี้กำลังเป็นกรรมการคุมสอบอยู่แล้ว'
        ))
      } else {
        await Proctoring.updateOne({ _id: proctor._id }, {
          $set: {
            status: 'invited',
            invitedAt: Date.now(),
            respondedAt: undefined,
            cancelledAt: undefined
          }
        })

        if (notify) {
        }
        
        return res.json(jsonResponse('ok', `ส่งคำเชิญไปยัง [${email}] ${notify ? 'พร้อมอีเมลแจ้งเตือน' : ''}อีกครั้งเรียบร้อยแล้ว`))
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
    } else if (String(proctorUser._id) === String(exam.owner)) {
      return res.json(jsonResponse('failed', 'ไม่สามารถเชิญอาจารย์เจ้าของการสอบเป็นกรรมการฯ ได้'))
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

router.delete('/:proctorId', adminAuthen, populateExam, onlyExamOwner, async (req, res) => {
  const { proctorId } = req.params
  try {
    const proctoring = await Proctoring.findOne({
      _id: proctorId,
      exam: req.exam._id,
      status: { $in: ['invited', 'accepted'] }
    })

    if (!proctoring)
      return res.json(jsonResponse('failed', 'ไม่พบสิทธิ์การคุมสอบที่ต้องการยกเลิก'))
    
    proctoring.status = 'cancelled'
    proctoring.cancelledAt = Date.now()
    await proctoring.save()

    return res.json(jsonResponse('ok', 'ยกเลิกสิทธิ์การคุมสอบดังกล่าวเรียบร้อยแล้ว'))
  } catch {
    res.json(jsonResponse('failed', 'เกิดข้อผิดพลาดในระบบยกเลิกสิทธิ์คุมสอบ'))
  }
})

export default router
