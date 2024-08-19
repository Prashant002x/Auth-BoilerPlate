
import { verifyJWT } from '../middleware/auth.middleware.js';
import express from 'express';
const router = express.Router();
import { signIn, signUp ,google, signOut} from '../controllers/auth.controller.js';

router.route("/sign-up").post(signUp)

router.route("/sign-in").post(signIn)

router.route("/google").post(google)
router.route("/sign-out").get(verifyJWT,signOut)
export default router;
 