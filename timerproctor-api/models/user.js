import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    email: String,
    authentication: {
      provider: { type: String, enum: ['temp', 'google'] },
      uid: String,
    }
  }
)

export default mongoose.model('User', schema)
