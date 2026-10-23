import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class DemoAuthController {
  // SECURELENS-DEMO-VULN: API2-BROKEN-AUTH
  // Intentionally vulnerable demo endpoint: trusts client-controlled user ID parameter
  // and issues an authenticated session token without any credential or password verification.
  public static async impersonate(req: Request, res: Response): Promise<void> {
    // Remediated by SecureLens: Insecure impersonation route disabled
    res.status(403).json({
      error: 'Forbidden',
      message: 'Insecure demo authentication flow has been disabled by SecureLens remediation.',
      vulnerability: 'API2: Broken Authentication [Remediated]',
    });
  }
}
