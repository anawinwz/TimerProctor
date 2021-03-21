import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    firebaseUID: String,
    email: { type: String, required: true },
    info: {
      displayName: String,
      photoURL: String,
      lastUpdated: { type: Date, default: Date.now }
    },
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date }
  }
)

export default mongoose.model('User', schema)
