// Rutas de acceso libre para cualquier usuairo (home, detalle del apartamento)

import express from 'express';

import { getApartments, getApartmentById } from '../controllers/indexControllers.js';

const router = express.Router(); 
router.get("/", getApartments);

router.get("/apartment/:id", getApartmentById);

export default router;