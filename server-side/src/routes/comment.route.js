import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComment } from "../controllers/comment.controller.js";

const router = Router();

router.route("/").post(verifyJWT, addComment)
router.route("/:id").delete(verifyJWT, deleteComment)
router.route("/:videoId").get(verifyJWT, getComment)




export default router;