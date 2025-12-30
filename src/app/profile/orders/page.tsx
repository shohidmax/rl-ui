"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Order Status Mapping for Tabs
const TABS = [
    { label: "All", value: "all" },
    { label: "To Pay", value: "Pending" }, // Assuming Pending = Unpaid
    { label: "To Ship", value: "Processing" },
    { label: "To Receive", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
];

export default function MyOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (user?.email) {
            fetchOrders(user.email);
        }
    }, [user]);

    const fetchOrders = async (email: string) => {
        try {
            const data = await apiClient.get<any[]>(`/orders?email=${email}`);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = activeTab === "all"
        ? orders
        : orders.filter(o => o.status === activeTab);

    return (
        <div className="bg-white shadow-sm rounded-lg min-h-[600px]">
            {/* Tabs Header */}
            <div className="flex border-b px-6">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={cn(
                            "px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
                            activeTab === tab.value
                                ? "border-cyan-500 text-cyan-500"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="p-6 space-y-4">
                {loading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                            🛒
                        </div>
                        <p>No orders found.</p>
                        <Button variant="link" asChild className="text-cyan-500 mt-2">
                            <Link href="/products">Go Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-3 mb-3 text-sm">
                                <div className="text-gray-500">
                                    Order <span className="text-gray-800 font-medium">#{order.id}</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    Placed on {new Date(order.date).toLocaleDateString()}
                                </div>
                                <div className="uppercase font-semibold text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                    {order.status}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    {order.products.map((p: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded border"></div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Total Encl. VAT</p>
                                    <p className="text-lg font-bold text-cyan-600">৳ {order.amount}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/profile/orders/${order.id}`}>MANAGE</Link>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
