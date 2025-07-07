import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


// Falta validar que sigui un email 

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, validate: {
        validator: function (value) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(value);
        },
        message: 'La contraseña debe tener mayúsculas, minúsculas, números y un carácter especial.'
    } },
  email: { type: String, required: true, unique: true }
});


// Hash password abans de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Mètode per comparar password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);