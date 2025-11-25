import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
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

interface IpAddressRecord {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
  createdAt?: string;
  [key: string]: any;
}

const IpAddresses = () => {
  const [ipAddresses, setIpAddresses] = useState<IpAddressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadIpAddresses();
  }, []);

  const loadIpAddresses = async () => {
    try {
      const result = await api.getIpAddresses(50);
      
      if (result.data) {
        setIpAddresses(result.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load IP addresses',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load IP addresses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadIpAddresses();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const result = await api.deleteIpAddress(deleteId);

      if (result.success) {
        setIpAddresses(ipAddresses.filter(ip => ip.id !== deleteId));
        toast({
          title: 'Success',
          description: 'IP address record deleted successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete IP address',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete IP address',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
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
          <h1 className="text-3xl font-bold">IP Addresses</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Server Check Records</CardTitle>
            <CardDescription>
              IP addresses from server checks. Total records: {ipAddresses.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipAddresses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No IP address records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    ipAddresses.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          <code className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono">
                            {record.ipAddress || '-'}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {record.userAgent || '-'}
                        </TableCell>
                        <TableCell>
                          {formatDate(record.timestamp)}
                        </TableCell>
                        <TableCell>
                          {formatDate(record.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteId(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the IP address record
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IpAddresses;
