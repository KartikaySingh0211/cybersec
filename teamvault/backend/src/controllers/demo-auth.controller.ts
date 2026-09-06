import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class DemoAuthController {
  // SECURELENS-DEMO-VULN: API2-BROKEN-AUTH
  // Intentionally vulnerable demo endpoint: trusts client-controlled user ID parameter
  // and issues an authenticated session token without any credential or password verification.
  public static async impersonate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({
          message: 'Demo Authentication Vulnerability: Missing userId query parameter',
        });
        return;
      }

      const user = await AuthService.findUserById(userId);
      if (!user) {
        res.status(404).json({
          message: `User not found with ID: ${userId}`,
        });
        return;
      }

      // VULNERABILITY: Directly creates a valid JWT for the requested user without authenticating credentials
      const token = AuthService.generateToken(user);

      res.status(200).json({
        message: 'EDUCATIONAL DEMO: Authenticated via identity parameter bypass',
        vulnerability: 'API2: Broken Authentication',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Impersonation failed', error: error.message });
    }
  }
}
