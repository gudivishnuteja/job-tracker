import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createApplication, listApplications, updateApplication } from '../controllers/applicationsController';
const router = Router();

router.use(requireAuth);
router.get('/', listApplications);
router.post('/', createApplication);
router.patch('/:id', updateApplication);

export default router;
