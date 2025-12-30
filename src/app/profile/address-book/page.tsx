"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Address {
    _id?: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postcode?: string;
    isDefaultShipping: boolean;
    isDefaultBilling: boolean;
}

export default function AddressBookPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newAddress, setNewAddress] = useState<Address>({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        isDefaultShipping: false,
        isDefaultBilling: false
    });

    useEffect(() => {
        if (user?.email) {
            fetchAddresses(user.email);
        }
    }, [user]);

    const fetchAddresses = async (email: string) => {
        try {
            // Re-using profile endpoint which returns full user object including addressBook
            const data = await apiClient.get<any>(`/profile?email=${email}`);
            setAddresses(data.addressBook || []);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!user?.email) return;

        try {
            // For simplicity, we appeal the new address to the existing list and save the whole list
            // In a real app, API might support POST /api/profile/address
            const updatedAddresses = [...addresses, newAddress];

            await apiClient.put('/profile', {
                email: user.email,
                addressBook: updatedAddresses
            });

            setAddresses(updatedAddresses);
            setIsAdding(false);
            setNewAddress({
                fullName: '',
                phone: '',
                address: '',
                city: '',
                postcode: '',
                isDefaultShipping: false,
                isDefaultBilling: false
            });
            toast({ title: "Success", description: "Address added successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save address", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!user?.email) return;
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            await apiClient.put('/profile', {
                email: user.email,
                addressBook: updatedAddresses
            });
            setAddresses(updatedAddresses);
            toast({ title: "Deleted", description: "Address removed." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete address", variant: "destructive" });
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm rounded-lg min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Address Book</h1>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-cyan-500 hover:bg-cyan-600">
                        <Plus className="w-4 h-4 mr-2" />
                        ADD NEW ADDRESS
                    </Button>
                )}
            </div>

            {isAdding ? (
                <form onSubmit={handleSaveAddress} className="max-w-xl mx-auto space-y-4 border p-6 rounded-lg bg-gray-50">
                    <h2 className="font-semibold mb-4">Add New Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Full Name</label>
                            <Input required value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Phone</label>
                            <Input required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium">Address</label>
                        <Input required value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Pstcode</label>
                            <Input value={newAddress.postcode} onChange={e => setNewAddress({ ...newAddress, postcode: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium">City/Region</label>
                            <Input required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={newAddress.isDefaultShipping} onChange={e => setNewAddress({ ...newAddress, isDefaultShipping: e.target.checked })} />
                            Default Shipping
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={newAddress.isDefaultBilling} onChange={e => setNewAddress({ ...newAddress, isDefaultBilling: e.target.checked })} />
                            Default Billing
                        </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={loading} className="bg-cyan-500 text-white">SAVE</Button>
                        <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>CANCEL</Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-0">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-3">Full Name</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Postcode</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3"></th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {addresses.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No addresses found.</td></tr>
                            )}
                            {addresses.map((addr, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium">{addr.fullName}</td>
                                    <td className="px-4 py-4 text-gray-600 max-w-xs">{addr.address}</td>
                                    <td className="px-4 py-4 text-gray-600">{addr.postcode}</td>
                                    <td className="px-4 py-4 text-gray-600">{addr.phone}</td>
                                    <td className="px-4 py-4">
                                        {addr.isDefaultShipping && <Badge variant="secondary" className="mr-1 text-[10px] bg-green-100 text-green-700">DEFAULT SHIPPING</Badge>}
                                        {addr.isDefaultBilling && <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">DEFAULT BILLING</Badge>}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-cyan-500"><Edit2 className="w-4 h-4" /></Button> */}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-500" onClick={() => handleDelete(idx)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
