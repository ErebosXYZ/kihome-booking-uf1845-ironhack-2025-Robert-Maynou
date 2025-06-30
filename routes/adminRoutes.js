import express from 'express';
import { getNewApartment, postNewApartment } from '../controllers/adminControllers.js';
const router = express.Router();



router.get("/apartment/new", getNewApartment);

router.post("/apartment", postNewApartment);

export default router;