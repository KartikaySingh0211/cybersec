import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  // SECURELENS-DEMO-VULN: API5-BFLA
  // Intentionally vulnerable: authenticated user check is present, but NO role verification is performed.
  // Standard users (role === 'USER') can access administrative endpoints and inspect all users.
  public static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      // VULNERABILITY: Missing check: if (req.user?.role !== 'ADMIN') return 403;
      const users = await AdminService.getAllUsers();
      res.status(200).json({
        message: 'Admin user list retrieved successfully',
        vulnerability: 'API5: BFLA active - unprivileged user accessed administrative records',
        users,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch admin users', error: error.message });
    }
  }

  // SECURELENS-DEMO-VULN: API5-BFLA
  // Intentionally vulnerable: accessible to any authenticated user regardless of their role.
  public static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      // VULNERABILITY: Missing check: if (req.user?.role !== 'ADMIN') return 403;
      const stats = await AdminService.getStatistics();
      res.status(200).json({
        message: 'Admin system statistics retrieved',
        vulnerability: 'API5: BFLA active - unprivileged user accessed administrative metrics',
        statistics: stats,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch admin statistics', error: error.message });
    }
  }
}
