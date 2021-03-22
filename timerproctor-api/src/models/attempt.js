import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      default: 'loggedin',
      enum: ['loggedin', 'authenticating', 'authenticated', 'started', 'completed', 'terminated']
    },
    socketId: String,
    snapshots: [{ type: Schema.Types.ObjectId, ref: 'AttemptEvent' }],
    lastSnapshot: { type: Schema.Types.ObjectId, ref: 'AttemptEvent' },
    idCheck: {
      photoURL: { type: String, default: '' },
      timestamp: { type: Date },
      accepted: { type: Boolean },
      reason: { type: String, default: '' },
      checker: { type: Schema.Types.ObjectId, ref: 'User' },
      checkedAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now },
    startedAt: Date,
    completedAt: Date
  }
)

export default mongoose.model('Attempt', schema)
