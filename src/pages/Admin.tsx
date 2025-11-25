import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Trash2, ArrowLeft, Gift } from 'lucide-react';
import Layout from '@/components/Layout';
import { User } from '@/types/user';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [airdropUserId, setAirdropUserId] = useState<string | null>(null);
  const [airdropAmount, setAirdropAmount] = useState('');
  const [airdropSymbol, setAirdropSymbol] = useState('ETH');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    if (!userId) {
      navigate('/signin');
      return;
    }

    try {
      // Get current user to check if admin
      const userResult = await api.getUserById(userId, token || undefined);
      
      if (!userResult.success || userResult.data.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin permissions',
          variant: 'destructive'
        });
        navigate('/profile');
        return;
      }

      setCurrentUser(userResult.data);
      loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify admin access',
        variant: 'destructive'
      });
      navigate('/profile');
    }
  };

  const loadUsers = async () => {
    const token = localStorage.getItem('userToken');
    
    try {
      const result = await api.getAllUsers(100, token || undefined);
      
      if (result.success) {
        setUsers(result.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem('userToken');
    const user = users.find(u => u.uid === userId);
    
    try {
      const result = await api.updateUserRole(
        userId,
        newRole,
        user.isActive,
        token || undefined
      );

      if (result.success) {
        setUsers(users.map(u => u.uid === userId ? result.data : u));
        toast({
          title: 'Success',
          description: 'User role updated successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update role',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    const token = localStorage.getItem('userToken');
    const user = users.find(u => u.uid === userId);
    
    try {
      const result = await api.updateUserRole(
        userId,
        user.role,
        isActive,
        token || undefined
      );

      if (result.success) {
        setUsers(users.map(u => u.uid === userId ? result.data : u));
        toast({
          title: 'Success',
          description: `User ${isActive ? 'activated' : 'deactivated'} successfully`
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update status',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    const token = localStorage.getItem('userToken');
    
    try {
      const result = await api.deleteUser(deleteUserId, token || undefined);

      if (result.success) {
        setUsers(users.filter(u => u.uid !== deleteUserId));
        toast({
          title: 'Success',
          description: 'User deleted successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete user',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleAirdrop = async () => {
    if (!airdropUserId || !airdropAmount) return;
    
    const token = localStorage.getItem('userToken');
    const amount = parseFloat(airdropAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const result = await api.airdrop(airdropUserId, airdropSymbol, amount, token || undefined);

      if (result.success) {
        toast({
          title: 'Airdrop Successful',
          description: `${amount} ${airdropSymbol} sent to user`
        });
        setAirdropUserId(null);
        setAirdropAmount('');
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to send airdrop',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send airdrop',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/ipaddresses')}>
              View IP Addresses
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user roles and permissions. Total users: {users.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono">
                          {user.password || '••••••'}
                        </code>
                      </TableCell>
                      <TableCell>{user.displayName || '-'}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono">
                          {user.ipAddress || '-'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.uid, value)}
                          disabled={user.uid === currentUser?.uid}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={(checked) => handleStatusChange(user.uid, checked)}
                            disabled={user.uid === currentUser?.uid}
                          />
                          <span className="text-sm">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAirdropUserId(user.uid)}
                          >
                            <Gift className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteUserId(user.uid)}
                            disabled={user.uid === currentUser?.uid}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete User Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove their data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Airdrop Dialog */}
      <AlertDialog open={!!airdropUserId} onOpenChange={() => setAirdropUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <AlertDialogTitle>Send Airdrop</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Send cryptocurrency to user's wallet
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cryptocurrency</Label>
              <Select value={airdropSymbol} onValueChange={setAirdropSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                  <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                  <SelectItem value="USDT">USDT - Tether</SelectItem>
                  <SelectItem value="BNB">BNB - Binance Coin</SelectItem>
                  <SelectItem value="SOL">SOL - Solana</SelectItem>
                  <SelectItem value="XRP">XRP - Ripple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={airdropAmount}
                onChange={(e) => setAirdropAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setAirdropUserId(null);
              setAirdropAmount('');
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAirdrop}>
              Send Airdrop
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
