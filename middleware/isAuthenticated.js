export const authTest = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Debe iniciar sesión con un usuario registrado' );
     res.redirect('/login');
};
