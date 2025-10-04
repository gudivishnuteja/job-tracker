import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createJob, deleteJob, listJobs, updateJob } from '../controllers/jobsController';
const router = Router();

router.use(requireAuth);
router.get('/', listJobs);
router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
