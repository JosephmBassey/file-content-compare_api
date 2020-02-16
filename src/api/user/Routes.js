import express from 'express';
import controller from './Controllers'
var router = express.Router();

router.post('/user/login', controller.userLogin);
router.post('/user/logout', controller.userLogout);
export default router;