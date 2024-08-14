// auth.routes.js
import express from 'express';
const router = express.Router();
import { signIn, signUp } from '../controllers/auth.controller.js';

router.route("/sign-up").post(signUp)

router.route("/sign-in").post(signIn)
export default router;
 