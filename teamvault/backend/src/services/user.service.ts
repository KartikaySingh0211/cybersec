import { User, IUser } from '../models/User';

export class UserService {
  public static async getProfile(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }

  // SECURELENS-DEMO-VULN: API3-BOPLA
  // Directly updates user document with arbitrary caller-supplied properties (req.body)
  // without allowlisting or field filtering, enabling privilege escalation (e.g., role, isAdmin).
  public static async updateProfileVulnerable(userId: string, updateData: any): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: false }
    ).select('-password');

    return updatedUser;
  }
}
