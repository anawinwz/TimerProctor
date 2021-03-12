import Attempt from '../models/attempt'
import AttemptEvent from '../models/attemptEvent'
import { getExamIdFromSocket, getExamNsp } from '../utils/helpers'

export default (socket, user = {}) => {
  const socketInfo = socket?.attempt
  const examId = getExamIdFromSocket(socket)

  socket.on('disconnect', reason => {
    const newEvent = new AttemptEvent({
      attempt: socketInfo.id,
      timestamp: Date.now(),
      type: 'socket',
      info: {
        socketEvent: {
          name: 'disconnect',
          info: reason
        }
      }
    })
    newEvent.save((err, newEvent) => {
      if (err) return false
      
      let toSend = newEvent.toJSON()
      delete toSend._id
      delete toSend.attempt

      getExamNsp(examId).to('proctor').emit('newEvent', {
        id: socketInfo.id,
        event: toSend
      })
    })
  })

  socket.on('idCheck', async (data, callback) => {
    const { image, timestamp } = data
    if (!socketInfo || !image || !timestamp) {
      console.log('[idCheck] data incomplete:', socketInfo, image, timestamp)
      return callback({ err: true })
    }
    try {
      let attempt = await Attempt.findById(socketInfo.id)
      attempt.status = 'authenticating'
      attempt.idCheck.photoURL = image
      attempt.idCheck.timestamp = timestamp
      attempt.idCheck.accepted = false
      attempt.idCheck.reason = ''
      attempt.idCheck.checker = undefined
      attempt.idCheck.checkedAt = undefined
      attempt = await attempt.save()

      getExamNsp(examId).to('proctor').emit('idCheckRequest', {
        id: socketInfo.id,
        socketId: socket.id,
        photoURL: image,
        timestamp: timestamp
      })
      callback({ err: false })
    } catch (err) {
      console.log('[idCheck] unhandled err:', err)
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
        url: image,
        timestamp: timestamp
      })

      let toSend = newEvent.toJSON()
      delete toSend._id
      delete toSend.attempt
      getExamNsp(examId).to('proctor').emit('newEvent', {
        id: socketInfo.id,
        event: toSend
      })
      callback({ err: false })
      
      try {
        let attempt = await Attempt.findById(socketInfo.id)
        attempt.snapshots = [...attempt.snapshots, newEvent._id]
        attempt.lastSnapshot = newEvent._id
        await attempt.save()
      } catch {}
    })
  })

  socket.on('start', async (callback) => {
    try {
      let attempt = await Attempt.findById(socketInfo.id)
      attempt.status = 'started'
      attempt = await attempt.save()

      getExamNsp(examId).to('proctor').emit('testerStatus', { id: socketInfo.id, status: 'started' })
    } catch {}
  })

  socket.on('fail', async (callback) => {
    try {
      let attempt = await Attempt.findById(socketInfo.id)
      attempt.status = 'completed'
      attempt = await attempt.save()

      getExamNsp(examId).to('proctor').emit('testerStatus', { id: socketInfo.id, status: 'completed' })
    } catch {}
  })

  socket.on('complete', async (callback) => {
    try {
      let attempt = await Attempt.findById(socketInfo.id)
      attempt.status = 'completed'
      attempt = await attempt.save()

      getExamNsp(examId).to('proctor').emit('testerStatus', { id: socketInfo.id, status: 'completed' })
    } catch {}
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

      let toSend = newEvent.toJSON()
      delete toSend._id
      delete toSend.attempt
      getExamNsp(examId).to('proctor').emit('newEvent', {
        id: socketInfo.id,
        event: toSend
      })
      callback({ err: false })
    })
  })
}
