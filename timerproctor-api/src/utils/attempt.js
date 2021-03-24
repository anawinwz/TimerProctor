import Attempt from '../models/attempt'
import AttemptEvent from '../models/attemptEvent'
import { getExamNsp } from './helpers'

export const deleteAllAttempts = async (examId, statuses = []) => {
  const attempts = await Attempt.find({
    exam: examId,
    ...(statuses.length > 0 && { status: { $in: statuses } })
  })

  const affected = attempts.length
  for (const { _id, status, socketId } of attempts) {
    await AttemptEvent.deleteMany({ attempt: _id })

    if (!['completed', 'terminated'].includes(status) && socketId)
      getExamNsp(examId).to(socketId).emit('terminated', 'ข้อมูลการสอบถูกลบออก')

    await Attempt.deleteOne({ _id: _id })
  }
  return affected
}

export const getCompletedAttemptsCount = async (examId, userId) => {
  const results = await Attempt.aggregate([
    { $match: { exam: examId, user: userId, status: 'completed' } },
    {
      $group: {
        _id: '$user',
        count: { $sum: 1 }
      }
    }
  ])

  if (!results || results.length === 0) return 0
  else return results[0].count
}

export const getLastAttempt = async (examId, userId, options = {}) => {
  if (!examId || !userId) return null

  const { notCompleted = false, createIfNotFound = false } = options

  let lastAttempt = await Attempt.findOne({
    exam: examId,
    user: userId,
    ...(notCompleted ? { status: { $ne: 'completed' } } : {})
  }).sort({ $natural: -1 })

  if (lastAttempt) return lastAttempt
  else if (createIfNotFound) {
    const newAttempt = new Attempt({
      exam: examId,
      user: userId
    })
    lastAttempt = await newAttempt.save()
    return lastAttempt
  }
  else return null
}

export const convertEventToSnapshot = event => (event ? {
  url: event.evidence?.url,
  timestamp: event.timestamp
} : null)

export const convertAttemptToTester = attempt => {
  const { _id, user, lastSnapshot, status, idCheck } = attempt
  const { info: { displayName, photoURL } } = user
  return {
    _id,
    name: displayName,
    avatar: photoURL,
    status,
    ...(lastSnapshot && {
      lastSnapshot: convertEventToSnapshot(lastSnapshot)
    }),
    idCheck: idCheck
  }
}
