// auth.routes.js
import express from 'express';
const router = express.Router();
import signUp from '../controllers/auth.controller.js';

router.route("/sign-up").post(signUp)
export default router;
 