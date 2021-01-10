import Attempt from '../models/attempt'
import AttemptEvent from '../models/attemptEvent'
import { getExamIdFromSocket, getExamNsp } from '../utils/helpers'

export default (socket, user = {}) => {
  const socketInfo = socket?.attempt
  const examId = getExamIdFromSocket(socket)

  socket.on('idCheck', async (data, callback) => {
    const { image, timestamp } = data
    if (!socketInfo || !image || !timestamp) {
      return callback({ err: true })
    }
    try {
      let attempt = await Attempt.findById(socketInfo.id)
      attempt.idCheck.photoURL = image
      attempt.idCheck.timestamp = timestamp
      attempt.idCheck.accepted = false
      attempt.idCheck.reason = ''
      attempt.idCheck.checker = ''
      attempt.idCheck.checkedAt = null
      attempt = await attempt.save()

      getExamNsp(examId).to('proctor').emit('idCheckRequest', {
        id: socketInfo.id,
        socketId: socket.id,
        photoURL: image,
        timestamp: timestamp
      })
      callback({ err: false })
    } catch {
      callback({ err: true })
    }
  })

  socket.on('snapshot', async (data, callback) => {
    const { image, facesCount, timestamp } = data
    if (!socketInfo || !image || !facesCount || !timestamp) {
      return callback({ err: true })
    }

    const newEvent = new AttemptEvent({
      attempt: socketInfo.id,
      timestamp,
      type: 'snapshot',
      info: { facesCount },
      evidence: {
        type: 'photo',
        url: image
      }
    })

    newEvent.save(async (err, newEvent) => {
      if (err) return callback({ err: true })

      getExamNsp(examId).to('proctor').emit('newSnapshot', {
        id: socketInfo.id,
        url: image
      })
      callback({ err: false })
      
      try {
        let attempt = await Attempt.findById(socketInfo.id)
        attempt.lastSnapshot = newEvent._id
        await attempt.save()
      } catch {}
    })
  })

  socket.on('signal', (data, callback) => {
    const { type, timestamp } = data
    let newEvent = new AttemptEvent({
      attempt: socketInfo.id,
      timestamp,
      type
    })

    switch (type) {
      case 'window':
        newEvent.info = {
          windowEvent: data.event,
          timeDiff: data.diff
        }
        break
      case 'face':
        newEvent.info = { facesCount: data.facesCount }
        break
    }

    newEvent.save((err, newEvent) => {
      if (err) return callback({ err: true })

      getExamNsp(examId).to('proctor').emit('newEvent', newEvent)
      callback({ err: false })
    })
  })
}
