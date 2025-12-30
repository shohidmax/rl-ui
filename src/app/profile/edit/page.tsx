"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
}

export default function EditProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        gender: '',
        birthday: ''
    });

    useEffect(() => {
        if (user?.email) {
            fetchProfile(user.email);
        }
    }, [user]);

    const fetchProfile = async (email: string) => {
        try {
            const data = await apiClient.get<UserProfile>(`/profile?email=${email}`);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                gender: data.gender || '',
                birthday: data.birthday || ''
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenderChange = (value: string) => {
        setFormData({ ...formData, gender: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.put('/profile', formData);
            toast({
                title: "Profile Updated",
                description: "Your profile information has been updated successfully.",
            });
            router.push('/profile');
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-6 shadow-sm rounded-lg">
            <h1 className="text-xl font-bold mb-6 text-gray-800">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                            name="email"
                            value={formData.email}
                            readOnly
                            className="bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400">Email cannot be changed.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                        <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Birthday</label>
                        <Input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Gender</label>
                        <Select onValueChange={handleGenderChange} value={formData.gender}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" className="px-8 bg-cyan-500 hover:bg-cyan-600" disabled={loading}>
                        {loading ? "SAVING..." : "SAVE CHANGES"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
