import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await UserService.getProfile(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
  }

  // SECURELENS-DEMO-VULN: API3-BOPLA
  // Intentionally vulnerable: accepts arbitrary unvalidated JSON properties from req.body
  // allowing a standard user to escalate privileges (e.g. role: 'ADMIN', isAdmin: true).
  public static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // VULNERABILITY: req.body is not filtered or allowlisted
      // Remediated by SecureLens: Allowlist safe properties to prevent BOPLA privilege escalation
      const safeUpdate: Record<string, any> = {};
      if (req.body.name !== undefined) safeUpdate.name = req.body.name;
      if (req.body.email !== undefined) safeUpdate.email = req.body.email;

      const updatedUser = await UserService.updateProfileVulnerable(userId, safeUpdate);
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update user profile', error: error.message });
    }
  }
}
