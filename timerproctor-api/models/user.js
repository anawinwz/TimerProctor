import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    firebaseUID: String,
    email: String,
    info: {
      displayName: String,
      photoURL: String,
      lastUpdated: { type: Date, default: Date.now }
    }
  }
)

export default mongoose.model('User', schema)
