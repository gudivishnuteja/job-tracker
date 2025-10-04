import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createDocument, deleteDocument, listDocuments } from '../controllers/documentsController';
const router = Router();

router.use(requireAuth);
router.get('/', listDocuments);
router.post('/', createDocument);
router.delete('/:id', deleteDocument);

export default router;
