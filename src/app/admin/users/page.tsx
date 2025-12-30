'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, UserCog } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { format } from 'date-fns';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'editor' | 'user';
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await apiClient.get<User[]>('/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast({
                title: "Error",
                description: "Failed to load users.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            await apiClient.put('/users', {
                userId,
                action: 'update_role',
                role: newRole
            });

            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole as any } : u));

            toast({
                title: "Success",
                description: "User role updated successfully.",
            });
        } catch (error) {
            console.error("Failed to update role:", error);
            toast({
                title: "Error",
                description: "Failed to update user role.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await apiClient.put('/users', {
                userId,
                action: 'delete_user'
            }); // Using PUT with action as per our API design, or usually DELETE method

            setUsers(users.filter(u => u._id !== userId));

            toast({
                title: "Success",
                description: "User deleted successfully.",
            });
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast({
                title: "Error",
                description: "Failed to delete user.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage user roles and permissions.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{users.length} Total Users</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={user.role}
                                            onValueChange={(value) => handleRoleUpdate(user._id, value)}
                                            disabled={user._id === currentUser?._id} // Prevent changing own role effectively self-lockout risk
                                        >
                                            <SelectTrigger className="w-[130px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={user._id === currentUser?._id}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
