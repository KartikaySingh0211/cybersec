import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// SECURELENS-DEMO-VULN: API5-BFLA
router.get('/users', authenticateJWT, requireAdmin, AdminController.getUsers);

// SECURELENS-DEMO-VULN: API5-BFLA
router.get('/statistics', authenticateJWT, requireAdmin, AdminController.getStatistics);

export default router;
