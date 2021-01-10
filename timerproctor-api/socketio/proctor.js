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
      attempt.idCheck.accepted = accepted
      attempt.idCheck.reason = rejectReason
      attempt.idCheck.checker = user._id
      attempt.idCheck.checkedAt = Date.now()
      await attempt.save() 
      
      getExamNsp(examId).to(socketId).emit('idCheckResponse', { accepted, reason: rejectReason })
      callback({ err: false })
    } catch {
      callback({ err: true })
    }
  })
}
