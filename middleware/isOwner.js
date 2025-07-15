import { Apartment } from "../models/Apartment.model.js"

export const isOwner = async (req, res, next) => {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).send('Apartamento no encontrado');
    if (req.user.role === 'admin' || apartment.owner.equals(req.user._id)) return next();
    res.status(403).send('No tienes acceso a este apartamento');
}