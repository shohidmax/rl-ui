import { Product, IProduct } from '@/lib/models';
import dbConnect from '@/lib/db';
// import { FilterQuery } from 'mongoose'; // causing issues

export class ProductService {
    static async getProducts(filter: any = {}) {
        await dbConnect();
        const products = await Product.find(filter).sort({ createdAt: -1 });
        return products;
    }

    static async createProduct(data: Partial<IProduct>) {
        await dbConnect();
        const product = await Product.create(data);
        return product;
    }

    static async getProductById(id: string) {
        await dbConnect();
        const product = await Product.findOne({ id });
        return product;
    }

    static async updateProduct(id: string, data: Partial<IProduct>) {
        await dbConnect();
        const product = await Product.findOneAndUpdate({ id }, data, { new: true });
        return product;
    }

    static async deleteProduct(id: string) {
        await dbConnect();
        const result = await Product.findOneAndDelete({ id });
        return result;
    }
}
