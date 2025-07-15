import express from 'express';
import { deleteApartment, getEditApartment, getNewApartment, postEditApartment, postNewApartment, showAllReservations } from '../controllers/adminControllers.js';
import { isAdmin } from '../middleware/isAdmin.js';
const router = express.Router();


router.get("/apartment/new", isAdmin, getNewApartment);

router.post("/apartment", isAdmin, postNewApartment);

router.get("/apartment/:id/edit", isAdmin, getEditApartment);

router.post("/apartment/:id/edit", isAdmin, postEditApartment);

router.post("/apartment/:id/delete", isAdmin, deleteApartment);

router.get("/reservations", isAdmin, showAllReservations);


export default router;