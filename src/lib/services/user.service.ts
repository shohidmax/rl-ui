import { User, IUser } from '@/lib/models';
import dbConnect from '@/lib/db';

export class UserService {
    static async createUser(data: Partial<IUser>) {
        await dbConnect();
        // basic check for existing user
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            throw new Error('User already exists');
        }
        const user = await User.create(data);
        return user;
    }

    static async findUserByEmail(email: string) {
        await dbConnect();
        return User.findOne({ email });
    }

    static async getAllUsers() {
        await dbConnect();
        return User.find({}).sort({ createdAt: -1 });
    }

    static async updateRole(userId: string, role: string) {
        await dbConnect();
        return User.findByIdAndUpdate(userId, { role }, { new: true });
    }

    static async deleteUser(userId: string) {
        await dbConnect();
        return User.findByIdAndDelete(userId);
    }
}
