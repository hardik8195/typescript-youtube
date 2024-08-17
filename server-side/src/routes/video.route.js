import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addvideo,
    updatevideo,
    deletevideo,
    getvideo,
    sub,
    trend,
    random,
    addView,
    getbyTags,
    getbySearch,
    save,
    history
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/').post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), verifyJWT, addvideo);
router.route('/:id').put(verifyJWT, updatevideo);
router.route('/:id').delete(verifyJWT, deletevideo);
router.route('/find/:id').get(getvideo);
router.route('/add-view').put(addView);
router.route('/random').get(random);
router.route('/sub').get(verifyJWT,sub);
router.route('/trend').get(trend);
router.route('/tags').get(verifyJWT, getbyTags);
router.route('/search').get(getbySearch);
router.route('/save').get(verifyJWT,save)
router.route('/history').get(verifyJWT,history)
export default router