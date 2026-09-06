import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// SECURELENS-DEMO-VULN: API5-BFLA
router.get('/users', authenticateJWT, AdminController.getUsers);

// SECURELENS-DEMO-VULN: API5-BFLA
router.get('/statistics', authenticateJWT, AdminController.getStatistics);

export default router;
