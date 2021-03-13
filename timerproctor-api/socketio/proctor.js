import Attempt from '../models/attempt'
import { getExamIdFromSocket, getExamNsp } from '../utils/helpers'

export default (socket, user = {}) => {
  const socketInfo = socket?.attempt
  const examId = getExamIdFromSocket(socket)
  socket.on('idCheckResponse', async (data, callback) => {
    const { id, mode, reason } = data
    if (!['accept', 'reject'].includes(mode))
      return callback({ err: true })
    
    try {
      let attempt = await Attempt.findById(id)
      const socketId = attempt.socketId
      if (!socketId) return callback({ err: true })

      const accepted = mode === 'accept'
      const rejectReason = !accepted ? (reason || 'ไม่ระบุเหตุผล') : ''
      if (accepted) attempt.status = 'authenticated'
      attempt.idCheck.accepted = accepted
      attempt.idCheck.reason = rejectReason
      attempt.idCheck.checker = user._id
      attempt.idCheck.checkedAt = Date.now()
      attempt = await attempt.save() 
      
      getExamNsp(examId).to(socketId).emit('idCheckResponse', { accepted, reason: rejectReason })
      getExamNsp(examId).to('proctor').emit('testerUpdate', {
        id: socketId,
        updates: {
          status: attempt.status,
          idCheck: attempt.idCheck
        }
      })
      callback({ err: false, update: {} })
    } catch (err) {
      console.log(err)
      callback({ err: true })
    }
  })
}
