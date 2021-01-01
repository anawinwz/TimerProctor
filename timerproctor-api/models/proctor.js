import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['invited', 'accepted', 'rejected'] }
  }
)

export default mongoose.model('Proctor', schema)