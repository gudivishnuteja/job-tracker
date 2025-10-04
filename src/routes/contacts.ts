import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createContact, listContacts, updateContact } from '../controllers/contactsController';
const router = Router();

router.use(requireAuth);
router.get('/', listContacts);
router.post('/', createContact);
router.patch('/:id', updateContact);

export default router;
