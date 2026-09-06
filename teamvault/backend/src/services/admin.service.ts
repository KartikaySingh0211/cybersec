import { User } from '../models/User';
import { Document } from '../models/Document';

export class AdminService {
  public static async getAllUsers(): Promise<any[]> {
    return User.find().select('-password').sort({ createdAt: -1 });
  }

  public static async getStatistics(): Promise<any> {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });
    const totalDocuments = await Document.countDocuments();

    return {
      systemStatus: 'OPERATIONAL',
      totalUsers,
      totalAdmins,
      totalDocuments,
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
