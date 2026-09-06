import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export class AuthService {
  private static jwtSecret = process.env.JWT_SECRET || 'demo-secret-key-teamvault-2025';

  public static generateToken(user: IUser): string {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
  }

  public static async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    };
  }

  public static async findUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}
