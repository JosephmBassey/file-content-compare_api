import express from 'express';
import authMiddleware from '../middlewares/auth'
import controller from './Controllers'
var router = express.Router();
router.post('/content', authMiddleware, controller.compareContent);
router.get('/content', authMiddleware, controller.getAllContent);
router.put('/content/:id', authMiddleware, controller.recheckContent);
router.get('/content/:id', authMiddleware, controller.getSingleContent);
router.delete('/content/:id', authMiddleware, controller.deleteContent);
export default router;