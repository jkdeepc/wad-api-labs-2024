import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// 定义密码验证的正则表达式
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;

// 创建用户模型
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // 使用正则表达式验证密码
        return passwordRegex.test(v);
      },
      message: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.'
    }
  }
});

export default mongoose.model('User', UserSchema);
