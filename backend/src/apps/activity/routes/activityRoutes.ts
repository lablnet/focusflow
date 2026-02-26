import { Router } from 'express';
import { storeLog, getLogs } from '../controllers/activityController';
import { authMiddleware } from '../../auth/middleware/authMiddleware';
import validateRequest from '../../../middleware/validateRequest';
import { storeLogValidator } from '../validators/activityValidator';

const router = Router();

router.post('/', authMiddleware, validateRequest(storeLogValidator), storeLog);

router.get('/', authMiddleware, getLogs);

export default router;
