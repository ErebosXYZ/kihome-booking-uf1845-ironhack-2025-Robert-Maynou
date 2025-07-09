import express from 'express';
// import checkAdminKey from '../config/checkAdminKey.js';
import { deleteApartment, getEditApartment, getNewApartment, postEditApartment, postNewApartment, showAllReservations } from '../controllers/adminControllers.js';
const router = express.Router();

// router.use(checkAdminKey);

router.get("/apartment/new", getNewApartment);

router.post("/apartment", postNewApartment);

router.get("/apartment/:id/edit", getEditApartment);

router.post("/apartment/:id/edit", postEditApartment);

router.post("/apartment/:id/delete", deleteApartment);

router.get("/reservations", showAllReservations);


export default router;