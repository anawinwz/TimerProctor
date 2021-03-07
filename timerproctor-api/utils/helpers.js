import Proctoring from '../models/proctoring'

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

export const getFirstValidationErrMessage = errors => errors[Object.keys(errors)[0]].message

export const isExamProctor = async (examId, userId) => {
  const proctoring = await Proctoring.findOne({
    exam: examId,
    user: userId,
    status: 'accepted'
  })

  return proctoring ? true : false
}
