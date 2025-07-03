import express from 'express';
import { getEditApartment, getNewApartment, postEditApartment, postNewApartment } from '../controllers/adminControllers.js';
const router = express.Router();



router.get("/apartment/new", getNewApartment);

router.post("/apartment", postNewApartment);

router.get("/apartment/:id/edit", getEditApartment);

router.post("/apartment/:id/edit", postEditApartment);


export default router;