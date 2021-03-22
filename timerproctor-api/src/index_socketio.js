import { Server } from 'socket.io'
import server from './index_http'

import { JWT_SOCKET_SECRET } from './config'

import AttemptEvent from './models/attemptEvent'

import { corsOrigin, ioNamespace } from './utils/const'

import { jwtAuthorize, validateRole } from './socketio/middlewares/authentication'
import { getExamNsp } from './utils/helpers'
import bindSocketListener from './socketio'

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"]
  }
})

export default io

export const ioExam = io.of(ioNamespace)

io.use((_, next) => next(new Error('Access Denied.')))

ioExam.use(jwtAuthorize({
  secret: JWT_SOCKET_SECRET,
  decodedPropertyName: 'decoded_token',
}))
ioExam.use(validateRole)

ioExam.on('connection', async socket => {
  const { examId = '', userId = '', role = '', isExamOwner = false } = socket.request 
  if (role === 'testtaker') {
    const { attempt = {} } = socket.request

    const oldSocketId = attempt.socketId
    const oldSocket = socket.nsp?.sockets?.[oldSocketId]
    if (oldSocket) oldSocket.disconnect(true)

    attempt.socketId = socket.id
    await attempt.save()
    
    const newEvent = new AttemptEvent({
      attempt: id,
      timestamp: Date.now(),
      type: 'socket',
      info: {
        socketEvent: {
          name: 'authorized'
        }
      }
    })
    newEvent.save((err, newEvent) => {
      if (err) return false
      
      let toSend = newEvent.toJSON()
      delete toSend._id
      delete toSend.attempt

      getExamNsp(examId).to('proctor').emit('newEvent', {
        id: id,
        event: toSend
      })
    })
  } else if (role === 'proctor') {
    if (isExamOwner) {
    } else {
      const { proctoring } = socket.request
      
      const oldSocketId = proctoring.socketId
      const oldSocket = socket.nsp?.sockets?.[oldSocketId]
      if (oldSocket) oldSocket.disconnect(true)

      proctoring.socketId = socket.id
      await proctoring.save()

      getExamNsp(examId).to('proctor').emit('proctorUpdate', {
        id: proctoring._id,
        updates: {
          online: true
        }
      })
      getExamNsp(examId).to('owner').emit('proctorUpdate', {
        id: proctoring._id,
        updates: {
          socketId: socket.id
        }
      })
    }
  }
  
  socket.join(role)
  if (isExamOwner) {
    socket.join('owner')
    console.log(`[socket.io] An owner ${userId} connected to ${examId}.`)
  }
  
  bindSocketListener(socket, role)
  console.log(`[socket.io] A ${role} ${userId} connected to ${examId}.`)
})