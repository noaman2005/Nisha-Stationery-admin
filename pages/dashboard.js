import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        recentProducts: [],
    });

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await axios.get('/api/dashboard');
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }

        fetchDashboardData();
    }, []);

    return (
        <Layout>
            <div className="flex items-center justify-between mb-3 p-1">
                <div className="flex items-center gap-4">
                    <img
                        src={session?.user?.image}
                        alt="User Image"
                        className="w-12 h-12 rounded-full border border-gray-300"
                    />
                    <span className="text-lg font-medium text-red-900">{session?.user?.name}</span>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
                    <p className="text-3xl font-bold text-emerald-600">{dashboardData.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
                    <p className="text-3xl font-bold text-emerald-600">{dashboardData.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
                    <p className="text-3xl font-bold text-emerald-600">₹{(dashboardData.totalRevenue / 100).toFixed(2)}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-lg">
                        <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Recipient</th>
                            <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dashboardData.recentOrders.map(order => (
                            <tr key={order._id} className="border-t">
                                <td className="py-3 px-4">{(new Date(order.createdAt)).toLocaleString()}</td>
                                <td className="py-3 px-4">{order.name} ({order.email})</td>
                                <td className={`py-3 px-4 ₹{order.paid ? 'text-green-600' : 'text-red-600'}`}>
                                    {order.paid ? 'Paid' : 'Pending'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Products</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-lg">
                        <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">Product Name</th>
                            <th className="py-3 px-4 text-left">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dashboardData.recentProducts.map(product => (
                            <tr key={product._id} className="border-t">
                                <td className="py-3 px-4">{product.title}</td>
                                <td className="py-3 px-4">₹{(product.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
