import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await axios.get('/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        fetchOrders();
    }, []);

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {orders.length > 0 ? orders.map(order => (
                    <div key={order._id} className="p-4 border rounded-lg shadow-lg bg-white">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Order #{order._id}</h2>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">Date:</span>
                            <span>{(new Date(order.createdAt)).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">Customer:</span>
                            <span>{order.name} ({order.email})</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium">Status:</span>
                            <span className={order.paid ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {order.paid ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-4 border rounded-lg shadow-lg bg-white text-center">
                        <p>No orders available</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
