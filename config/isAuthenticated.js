export const authTest = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).send('Debes estar registrado como usuario');
};