// auth.routes.js
import express from 'express';
const router = express.Router();
import { signIn, signUp ,google} from '../controllers/auth.controller.js';

router.route("/sign-up").post(signUp)

router.route("/sign-in").post(signIn)

router.route("/google").post(google)
export default router;
 