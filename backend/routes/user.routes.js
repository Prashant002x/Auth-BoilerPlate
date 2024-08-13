import { Router } from "express";
import print from "../controllers/user.controller.js";

const router = Router();

// Handle GET requests to `/` path relative to this router
router.route('/').get(print);

// Handle GET requests to `/yeah` path relative to this router
router.route('/yeah').get(async (req, res) => {
    res.json({
        message: "HELL yeah You are Learning",
    });
});

export default router;
