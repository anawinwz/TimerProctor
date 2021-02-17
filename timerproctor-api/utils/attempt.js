import Attempt from '../models/attempt'

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