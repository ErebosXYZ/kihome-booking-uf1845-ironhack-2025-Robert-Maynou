import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '../models/User.model.js';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    const match = await user.comparePassword(password);
    if (!match) return done(null, false, { message: 'Contraseña incorrecta' });
    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

