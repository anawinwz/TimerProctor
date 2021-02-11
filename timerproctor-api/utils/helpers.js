import io from '../index_socketio'
import { ioNamespace } from './const'

export const jsonResponse = (status = 'ok', payload) => {
  if (!payload) return { status }
  if (typeof payload === 'string') return { status, message: payload }
  return { status, payload }
}

export const getExamIdFromSocket = socket => {
  const { name } = socket.nsp
  return name.match(ioNamespace)[1]
}

export const getExamNsp = examId => io.of(`/exams/${examId}`)

export const convertAttemptToTester = attempt => {
  const { _id, user, lastSnapshot, status, idCheck } = attempt
  const { info: { displayName, photoURL } } = user
  return {
    _id,
    name: displayName,
    avatar: photoURL,
    status,
    ...(lastSnapshot && {
      lastSnapshot: {
        url: lastSnapshot.evidence?.url
      }
    }),
    idCheck: idCheck
  }
}
