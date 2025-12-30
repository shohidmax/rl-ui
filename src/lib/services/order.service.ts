import { Order, IOrder } from '@/lib/models';
import dbConnect from '@/lib/db';

export class OrderService {
    static async getOrders(filter: any = {}) {
        await dbConnect();
        const orders = await Order.find(filter).sort({ createdAt: -1 });
        return orders;
    }

    static async getOrderById(id: string) {
        await dbConnect();
        // Try finding by _id first, then by custom id if needed
        // Assuming 'id' field in schema is the public ID
        const order = await Order.findOne({ id });
        return order;
    }

    static async createOrder(data: Partial<IOrder>) {
        await dbConnect();
        const order = await Order.create(data);
        return order;
    }

    static async updateOrder(id: string, data: Partial<IOrder>) {
        await dbConnect();
        const order = await Order.findOneAndUpdate({ id }, data, { new: true });
        return order;
    }

    static async deleteOrder(id: string) {
        await dbConnect();
        const order = await Order.findOneAndDelete({ id });
        return order;
    }
}
