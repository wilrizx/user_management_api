import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateInput } from '../utils/validation.js';

const router = express.Router();

router.post('/register', validateInput, register);
router.post('/login', validateInput, login);

export default router;
