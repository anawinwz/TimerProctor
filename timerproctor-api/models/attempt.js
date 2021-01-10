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
    idCheck: {
      photoURL: { type: String, default: '' },
      accepted: { type: Boolean, default: false },
      reason: { type: String, default: '' },
      checker: { type: Schema.Types.ObjectId, ref: 'User' },
      checkedAt: { type: Date }
    }
  }
)

export default mongoose.model('Attempt', schema)
