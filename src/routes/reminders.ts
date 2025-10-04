import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createReminder, exportIcs, listReminders, updateReminder } from '../controllers/remindersController';
const router = Router();

router.use(requireAuth);
router.get('/', listReminders);
router.post('/', createReminder);
router.patch('/:id', updateReminder);
router.get('/export/ics', exportIcs);

export default router;
