import express from 'express';
import authMiddleware from '../middlewares/auth'
import controller from './Controllers'
var router = express.Router();
router.post('/content', controller.compareContent);
router.get('/content', controller.getAllContent);
router.put('/content/:id', controller.recheckContent);
router.get('/content/:id', controller.getSingleContent);
router.delete('/content/:id', controller.deleteContent);
export default router;