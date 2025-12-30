
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Shield, Trash2, Edit2, Users, Search, X, Check, Loader2, ArrowUpDown } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    language: z.string().default("en"),
    subscriptionStatus: z.string().default("active"),
    wooCommerceSubscriptionId: z.string().optional(),
    isSleepCustomer: z.boolean().default(false),
    isDigitalDetoxCustomer: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface User {
    id: string;
    email: string;
    username: string;
    language: string;
    subscriptionStatus: string;
    wooCommerceSubscriptionId: string | null;
    streakCount: number;
    totalPoints: number;
    recoveryUser: boolean;
    expressUpgradeEnabled: boolean;
    isSleepCustomer: boolean;
    isDigitalDetoxCustomer: boolean;
    createdAt: string | null;
}

export default function AdminUserManagement() {
    const { toast } = useToast();
    const { user: authUser, isLoading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    // Fetch all users - only when authenticated
    const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery<User[]>({
        queryKey: ['/api/admin/users'],
        queryFn: async () => {
            console.log('[AdminUserManagement] Fetching users list...');
            const res = await apiRequest('GET', '/api/admin/users');
            const data = await res.json();
            console.log('[AdminUserManagement] Received', data.length, 'users');
            return data;
        },
        enabled: !!authUser && !authLoading, // Only fetch when user is authenticated
        retry: 1, // Retry once on failure
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            language: "en",
            subscriptionStatus: "active",
            wooCommerceSubscriptionId: "",
            isSleepCustomer: false,
            isDigitalDetoxCustomer: false,
        },
    });

    const editForm = useForm<Partial<User>>({
        defaultValues: {},
    });

    // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: async (data: FormValues) => {
            const res = await apiRequest("POST", "/api/admin/users", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "User Created",
                description: "The user has been successfully added to the database.",
            });
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create user",
                variant: "destructive",
            });
        },
    });

    // Update user mutation
    const updateUserMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
            const res = await apiRequest("PUT", `/api/admin/users/${id}`, data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "User Updated",
                description: "User details have been updated successfully.",
            });
            setEditingUser(null);
            queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update user",
                variant: "destructive",
            });
        },
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "User Deleted",
                description: "User has been permanently removed.",
            });
            setDeletingUser(null);
            queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete user",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: FormValues) => {
        createUserMutation.mutate(data);
    };

    const handleEditSave = () => {
        if (!editingUser) return;
        updateUserMutation.mutate({
            id: editingUser.id,
            data: editForm.getValues(),
        });
    };

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users by createdAt
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const toggleSort = () => {
        setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            active: "default",
            lifetime: "default",
            "on-hold": "secondary",
            cancelled: "destructive",
            expired: "destructive",
            pending: "outline",
        };

        const badgeContent = status === "lifetime" ? (
            <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 fill-yellow-400 text-yellow-600" />
                Lifetime
            </span>
        ) : (
            status
        );

        return (
            <Badge
                variant={variants[status] || "outline"}
                className={status === "lifetime" ? "bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-900 border-amber-300 hover:bg-amber-100" : ""}
            >
                {badgeContent}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <Tabs defaultValue="list" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User List
                    </TabsTrigger>
                    <TabsTrigger value="create" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </TabsTrigger>
                </TabsList>

                {/* User List Tab */}
                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-6 w-6 text-primary" />
                                    <CardTitle>All Users</CardTitle>
                                </div>
                                <Badge variant="secondary">{users.length} users</Badge>
                            </div>
                            <CardDescription>
                                Manage all registered users. Search, edit, or delete users.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by email or username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Users Table */}
                            {authLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Checking authentication...</p>
                                </div>
                            ) : !authUser ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                                    <Shield className="h-12 w-12 opacity-50" />
                                    <p>Please sign in to access user management.</p>
                                </div>
                            ) : usersError ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-destructive">
                                    <X className="h-12 w-12 opacity-50" />
                                    <p className="font-medium">Failed to load users</p>
                                    <p className="text-sm text-muted-foreground">{(usersError as Error).message}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] })}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            ) : usersLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Loading users...</p>
                                </div>
                            ) : (
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={toggleSort}
                                                        className="hover:bg-transparent px-0 font-semibold"
                                                    >
                                                        Created At
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Lang</TableHead>
                                                <TableHead>Main Module</TableHead>
                                                <TableHead>Points</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                                                        {searchTerm ? "No users match your search" : "No users found"}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                sortedUsers.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="font-medium">{user.email}</TableCell>
                                                        <TableCell>{user.username}</TableCell>
                                                        <TableCell>{getStatusBadge(user.subscriptionStatus)}</TableCell>
                                                        <TableCell className="uppercase">{user.language || 'en'}</TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-1 flex-wrap">
                                                                {user.isSleepCustomer && (
                                                                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">Sleep</Badge>
                                                                )}
                                                                {user.isDigitalDetoxCustomer && (
                                                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Detox</Badge>
                                                                )}
                                                                {!user.isSleepCustomer && !user.isDigitalDetoxCustomer && (
                                                                    <Badge variant="outline">Default</Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{user.totalPoints || 0}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        setEditingUser(user);
                                                                        editForm.reset(user);
                                                                    }}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={() => setDeletingUser(user)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Create User Tab */}
                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-6 w-6 text-primary" />
                                <CardTitle>Add New User</CardTitle>
                            </div>
                            <CardDescription>
                                Add new users directly to the database. They can sign in immediately using their email.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="user@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="username" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Language</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select language" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="en">English</SelectItem>
                                                        <SelectItem value="de">German</SelectItem>
                                                        <SelectItem value="fr">French</SelectItem>
                                                        <SelectItem value="pt">Portuguese</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="subscriptionStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subscription Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="lifetime">Lifetime Access</SelectItem>
                                                            <SelectItem value="on-hold">On Hold</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                            <SelectItem value="expired">Expired</SelectItem>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="wooCommerceSubscriptionId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>WooCommerce Subscription ID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optional (e.g. 12345)" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="isSleepCustomer"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Sleep Customer
                                                    </FormLabel>
                                                    <CardDescription>
                                                        Sending the SleepWaves welcome email instead of the standard one.
                                                    </CardDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isDigitalDetoxCustomer"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Digital Detox Customer
                                                    </FormLabel>
                                                    <CardDescription>
                                                        Mental Health module access.
                                                    </CardDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                        <p><strong>Note:</strong> If Status is "Active" but no Subscription ID is provided, the user will be considered "Grandfathered" (Lifetime Access).</p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={createUserMutation.isPending}
                                    >
                                        {createUserMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" /> Add User
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user details for {editingUser?.email}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={editForm.watch("email") || ""}
                                onChange={(e) => editForm.setValue("email", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input
                                value={editForm.watch("username") || ""}
                                onChange={(e) => editForm.setValue("username", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select
                                value={editForm.watch("language") || "en"}
                                onValueChange={(val) => editForm.setValue("language", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="de">German</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="pt">Portuguese</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Subscription Status</Label>
                            <Select
                                value={editForm.watch("subscriptionStatus") || "active"}
                                onValueChange={(val) => editForm.setValue("subscriptionStatus", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="lifetime">Lifetime Access</SelectItem>
                                    <SelectItem value="on-hold">On Hold</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Recovery User</Label>
                            <Switch
                                checked={editForm.watch("recoveryUser") || false}
                                onCheckedChange={(val) => editForm.setValue("recoveryUser", val)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Express Upgrade</Label>
                            <Switch
                                checked={editForm.watch("expressUpgradeEnabled") || false}
                                onCheckedChange={(val) => editForm.setValue("expressUpgradeEnabled", val)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Sleep Customer</Label>
                            <Switch
                                checked={editForm.watch("isSleepCustomer") || false}
                                onCheckedChange={(val) => editForm.setValue("isSleepCustomer", val)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Digital Detox Customer</Label>
                            <Switch
                                checked={editForm.watch("isDigitalDetoxCustomer") || false}
                                onCheckedChange={(val) => editForm.setValue("isDigitalDetoxCustomer", val)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSave} disabled={updateUserMutation.isPending}>
                            {updateUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Check className="h-4 w-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{deletingUser?.email}</strong>? This action cannot be undone and will also remove them from Firebase Authentication.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingUser(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletingUser && deleteUserMutation.mutate(deletingUser.id)}
                            disabled={deleteUserMutation.isPending}
                        >
                            {deleteUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
