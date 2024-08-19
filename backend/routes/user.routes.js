import { Router } from "express";
import { updateUser ,test ,deleteUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/").get(test);

router.route("/update/:id").put(verifyJWT,updateUser)
router.route("/delete/:id").delete(verifyJWT, deleteUser);


export default router;
