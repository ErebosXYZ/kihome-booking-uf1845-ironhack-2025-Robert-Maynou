import { Router } from 'express';
import { renderRegister, renderLogin, register, login, logout } from '../controllers/authControllers.js';

const router = Router();

router.get('/register', renderRegister);
router.post('/register', register);
router.get('/login', renderLogin);
router.post('/login', login);
router.post('/logout', logout);

export default router;