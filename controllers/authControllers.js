import User from '../models/User.model.js';
import passport from 'passport';

export const renderRegister = (req, res) => res.render('register.ejs');
export const renderLogin = (req, res) => res.render('login.ejs');

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    await User.create({ username, password });
    res.redirect('/login');
  } catch (err) {
    res.render('register.ejs', { error: 'Error al registrar el usuario' });
  }
};

export const login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

export const logout = (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
};