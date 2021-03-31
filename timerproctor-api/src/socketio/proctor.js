import Attempt from '../models/attempt'
import Proctoring from '../models/proctoring'
import { getExamIdFromSocket, getExamNsp } from '../utils/helpers'

export default (socket, user = {}) => {
  const socketInfo = socket?.request?.decoded_token
  const examId = getExamIdFromSocket(socket)

  socket.on('disconnect', async reason => {
    if (!socketInfo?.userId) return false

    const proctoring = await Proctoring.findOne({ user: socketInfo.userId, exam: examId })
    if (!proctoring) return false

    proctoring.socketId = undefined
    proctoring.save((err, proctoring) => {
      if (err) return false

      getExamNsp(examId).to('proctor').emit('proctorUpdate', {
        id: proctoring._id,
        updates: {
          online: false
        }
      })
      getExamNsp(examId).to('owner').emit('proctorUpdate', {
        id: proctoring._id,
        updates: {
          socketId: undefined
        }
      })
    })
  })

  socket.on('idCheckResponse', async (data, callback) => {
    const { id, mode, reason } = data
    if (!['accept', 'reject'].includes(mode))
      return callback({ err: true })
    
    try {
      let attempt = await Attempt.findById(id)
      if (!attempt) return callback({ err: true, errMessage: 'ไม่พบข้อมูลผู้เข้าสอบที่ต้องการ' })

      const socketId = attempt.socketId
      if (!socketId) return callback({ err: true })

      if (attempt.idCheck.accepted === true) 
        return callback({ err: true, errMessage: 'ผู้เข้าสอบดังกล่าวได้รับการอนุมัติไปก่อนหน้านี้แล้ว' })

      const accepted = mode === 'accept'
      const rejectReason = !accepted ? (reason || 'ไม่ระบุเหตุผล') : ''
      attempt.status = accepted ? 'authenticated' : 'loggedin'
      attempt.idCheck.accepted = accepted
      attempt.idCheck.reason = rejectReason
      attempt.idCheck.checker = socketInfo.userId
      attempt.idCheck.checkedAt = Date.now()
      attempt = await attempt.save() 
      
      getExamNsp(examId).to(socketId).emit('idCheckResponse', { accepted, reason: rejectReason })
      getExamNsp(examId).to('proctor').emit('testerUpdate', {
        id: id,
        updates: {
          status: attempt.status,
          idCheck: attempt.idCheck
        }
      })
      callback({ err: false })
    } catch (err) {
      console.log(err)
      callback({ err: true })
    }
  })
}
