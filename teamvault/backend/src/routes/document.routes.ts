import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, DocumentController.getDocuments);
router.post('/', authenticateJWT, DocumentController.createDocument);
router.get('/demo-directory', authenticateJWT, DocumentController.getAllDemoDocuments);

// SECURELENS-DEMO-VULN: API1-BOLA
router.get('/:id', authenticateJWT, DocumentController.getDocumentById);

export default router;
