import express from 'express';
import { deleteApartment, getEditApartment, getNewApartment, postEditApartment, postNewApartment } from '../controllers/adminControllers.js';
const router = express.Router();



router.get("/apartment/new", getNewApartment);

router.post("/apartment", postNewApartment);

router.get("/apartment/:id/edit", getEditApartment);

router.post("/apartment/:id/edit", postEditApartment);

router.post("/apartment/:id/delete", deleteApartment);


export default router;