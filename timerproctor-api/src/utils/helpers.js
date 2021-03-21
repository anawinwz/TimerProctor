import Proctoring from '../models/proctoring'

import io from '../index_socketio'
import { ioNamespace } from './const'
import dayjs from './dayjs'

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

export const determineExamStatus = (exam = {}) => {
  const { createdAt, updatedAt, timeWindow } = exam
  if (!updatedAt || updatedAt === createdAt)
    return 'unset'

  const { mode, realtime,  schedule } = timeWindow
  if (mode === 'realtime') return realtime.status
  else if (mode === 'schedule') {
    const startDate = schedule?.startDate
    const endDate = schedule?.endDate
    if (startDate && endDate) {
      if (dayjs().isBefore(startDate)) return 'pending'
      if (dayjs().isAfter(endDate)) return 'stopped'
      return 'started'
    } else {
      return 'unset'
    }
  }
}

export const isExamProctor = async (examId, userId) => {
  const proctoring = await Proctoring.findOne({
    exam: examId,
    user: userId,
    status: 'accepted'
  })

  return proctoring ? true : false
}

export const isEmail = (str = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
