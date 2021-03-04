import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    user: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['invited', 'accepted', 'rejected'],
      default: 'invited'
    },
    invitedAt: { type: Date, default: Date.now },
    respondedAt: Date
  }
)

export default mongoose.model('Proctoring', schema)
