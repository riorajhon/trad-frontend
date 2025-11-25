import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Plus, Trash2, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Todos = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    }
  }, [currentUser, currentWeekStart]);

  const checkAuth = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    if (!userId) {
      navigate('/signin');
      return;
    }

    try {
      const result = await api.getUserById(userId, token || undefined);
      if (result.success) {
        // Check if user has todo access or is admin
        if (!result.data.canAccessTodos && result.data.role !== 'admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access the todo list',
            variant: 'destructive'
          });
          navigate('/dashboard');
          return;
        }
        setCurrentUser(result.data);
      }
    } catch (error) {
      console.error('Failed to load user');
      navigate('/signin');
    }
  };

  const loadUsers = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const result = await api.getAllUsers(100, token || undefined);
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const loadTodos = async () => {
    const token = localStorage.getItem('userToken');
    const weekDates = getWeekDates();
    const startDate = weekDates[0];
    const endDate = weekDates[weekDates.length - 1];

    try {
      const result = await api.getTodos(startDate, endDate, token || undefined);
      if (result.success) {
        setTodos(result.data);
      }
    } catch (error) {
      console.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleAddTodo = async () => {
    if (!newTask || selectedUsers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please enter a task and select at least one person',
        variant: 'destructive'
      });
      return;
    }

    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    try {
      const result = await api.createTodo(
        selectedDate,
        newTask,
        selectedUsers,
        userId || '',
        token || undefined
      );

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Task added successfully'
        });
        setShowAddDialog(false);
        setNewTask('');
        setSelectedDate('');
        setSelectedUsers([]);
        loadTodos();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive'
      });
    }
  };

  const handleToggleCompletion = async (todoId: string, userId: string) => {
    const token = localStorage.getItem('userToken');

    try {
      const result = await api.toggleTodoCompletion(todoId, userId, token || undefined);
      if (result.success) {
        loadTodos();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    const token = localStorage.getItem('userToken');

    try {
      const result = await api.deleteTodo(todoId, token || undefined);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Task deleted successfully'
        });
        loadTodos();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive'
      });
    }
  };

  const getTodosForDate = (date: string) => {
    return todos.filter(todo => todo.date === date);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    return user?.displayName || user?.email || 'Unknown';
  };

  const weekDates = getWeekDates();

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
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo List</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Tasks</CardTitle>
                <CardDescription>Manage and track tasks across the week</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-4">
                  {new Date(weekDates[0]).toLocaleDateString()} - {new Date(weekDates[6]).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {weekDates.map(date => (
                      <th key={date} className="border p-2 bg-muted text-left min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedDate(date);
                              setShowAddDialog(true);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {weekDates.map(date => (
                      <td key={date} className="border p-2 align-top min-h-[300px] bg-background">
                        <div className="space-y-2">
                          {getTodosForDate(date).map(todo => (
                            <div key={todo.id} className="p-3 rounded-lg bg-card border">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium flex-1">{todo.task}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDeleteTodo(todo.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="space-y-1">
                                {todo.assignedTo.map((userId: string) => {
                                  const isCompleted = todo.completedBy?.includes(userId);
                                  return (
                                    <div
                                      key={userId}
                                      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-1 rounded"
                                      onClick={() => handleToggleCompletion(todo.id, userId)}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                                        {getUserName(userId)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a task for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task</Label>
              <Input
                placeholder="Enter task description"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto space-y-2">
                {users.map(user => (
                  <div key={user.uid} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.uid}
                      checked={selectedUsers.includes(user.uid)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.uid]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.uid));
                        }
                      }}
                    />
                    <label htmlFor={user.uid} className="text-sm cursor-pointer">
                      {user.displayName || user.email}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTodo}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Todos;
