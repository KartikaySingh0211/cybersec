import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authenticateJWT, UserController.getProfile);

// SECURELENS-DEMO-VULN: API3-BOPLA
router.patch('/profile', authenticateJWT, UserController.updateProfile);

export default router;
