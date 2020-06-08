import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds: number = 10;
const schema = mongoose.Schema;
const userSchema = new schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.hashPassword = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
}

userSchema.methods.comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
}

export default mongoose.model('users', userSchema);