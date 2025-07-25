import { User } from '../models/User.model.js'
import passport from 'passport';
import { checkAdminKey } from '../middleware/checkAdminKey.js'


export const renderRegister = (req, res) => res.render('register.ejs');
export const renderLogin = (req, res) => res.render('login.ejs', { messages: req.flash()});

export const register = async (req, res) => {
  try {
    const { username, password, email, role, admin_key } = req.body;

    // Comprovació clau només si vol registrar-se com admin
    if (role === 'admin') {
      if (!checkAdminKey(admin_key)) {
        return res.render('register.ejs', {
          error: 'Clave de administrador incorrecta',
        });
      }
    }

    // Crear usuari (sigui del rol que sigui)
    await User.create({ username, password, email, role });

    console.log({ username, password, email, role });

    req.flash('success', 'Usuario registrado correctamente');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register.ejs', {
      error: 'Error al registrar el usuario',
    });
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