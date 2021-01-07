import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['login', 'authenticate', 'attempt', 'completed']
    },
    idCheck: {
      accepted: { type: Boolean, default: false },
      reason: { type: String, default: '' },
      checker: { type: Schema.Types.ObjectId, ref: 'User' },
      checkedAt: { type: Date }
    }
  }
)

export default mongoose.model('Attempt', schema)
