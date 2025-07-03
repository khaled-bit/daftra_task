import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`/api/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            if (error.response?.status === 403) {
                setError('You are not authorized to view this order');
            } else if (error.response?.status === 404) {
                setError('Order not found');
            } else {
                setError('Failed to fetch order details');
            }
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-indigo-100 text-indigo-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-8">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    if (!order) {
        return (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                Order not found
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Order Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-gray-600 text-sm">Order Number:</span>
                            <p className="font-medium">{order.order_number}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">Status:</span>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">Order Date:</span>
                            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">Total Amount:</span>
                            <p className="text-xl font-bold text-blue-600">${order.total_amount}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-gray-600 text-sm">Name:</span>
                            <p className="font-medium">{order.name}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">Email:</span>
                            <p className="font-medium">{order.email}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">Phone:</span>
                            <p className="font-medium">{order.phone}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">Address:</span>
                            <p className="font-medium">{order.address}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {item.product?.image && (
                                                <img
                                                    className="h-10 w-10 rounded mr-4"
                                                    src={item.product.image}
                                                    alt={item.title}
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </div>
                                                {item.product?.description && (
                                                    <div className="text-sm text-gray-500">
                                                        {item.product.description.substring(0, 50)}...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                        ${item.unit_price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                        ${item.total_price}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold text-gray-900">
                                    Total:
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-bold text-blue-600">
                                    ${order.total_amount}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails; 