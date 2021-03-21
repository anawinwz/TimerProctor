import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    revoked: Date,
    replacedByToken: String
  }
)

schema.virtual('expired').get(function() {
  return Date.now() >= this.expires
})

schema.virtual('active').get(function() {
  return !this.revoked && !this.isExpired
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
    delete ret.id
    delete ret.user
  }
})

export default mongoose.model('RefreshToken', schema)
