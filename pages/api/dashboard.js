import mongooseConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();

    try {
        // Fetch total number of products
        const totalProducts = await Product.countDocuments();

        // Fetch total number of orders
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const orders = await Order.find().select('line_items');
        const totalRevenue = orders.reduce((total, order) => {
            return total + order.line_items.reduce((orderTotal, item) => {
                return orderTotal + (item.price_data?.unit_amount || 0) * item.quantity;
            }, 0);
        }, 0);

        // Fetch recent orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        // Fetch recent products
        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
            recentProducts,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
