import { Router } from 'express';
import { DemoAuthController } from '../controllers/demo-auth.controller';

const router = Router();

// SECURELENS-DEMO-VULN: API2-BROKEN-AUTH
router.get('/impersonate', DemoAuthController.impersonate);

export default router;
