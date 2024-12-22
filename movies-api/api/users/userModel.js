import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value),
      message: 'Password must be at least 8 characters long, including uppercase, lowercase letters, and numbers.',
    },
  },
});

export default mongoose.model('User', UserSchema);
