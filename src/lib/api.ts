// API configuration and helper functions
const API_BASE_URL = 'https://trad-backend.onrender.com/api';
const IP_API_BASE_URL = 'https://api-server-oj5h.onrender.com/api';

export const api = {
  // Auth endpoints
  signup: async (email: string, password: string, displayName?: string) => {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });
    return response.json();
  },

  signin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // User endpoints
  getUserById: async (id: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/user/${id}`, { headers });
    return response.json();
  },

  updateUser: async (id: string, data: any, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getAllUsers: async (limit?: number, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const url = limit ? `${API_BASE_URL}/user?limit=${limit}` : `${API_BASE_URL}/user`;
    const response = await fetch(url, { headers });
    return response.json();
  },

  // Wallet endpoints
  getWallet: async (userId: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/wallet/${userId}`, { headers });
    return response.json();
  },

  executeTrade: async (userId: string, symbol: string, type: 'buy' | 'sell', amount: number, price: number, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/wallet/trade`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, symbol, type, amount, price })
    });
    return response.json();
  },

  getTransactions: async (userId: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/wallet/${userId}/transactions`, { headers });
    return response.json();
  },

  updateUserRole: async (id: string, role: string, isActive: boolean, canAccessTodos?: boolean, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const body: any = { role, isActive };
    if (canAccessTodos !== undefined) body.canAccessTodos = canAccessTodos;
    
    const response = await fetch(`${API_BASE_URL}/user/${id}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
    return response.json();
  },

  deleteUser: async (id: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'DELETE',
      headers
    });
    return response.json();
  },

  airdrop: async (userId: string, symbol: string, amount: number, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ userId, symbol, amount })
    });
    return response.json();
  },

  // Todo endpoints
  createTodo: async (date: string, task: string, assignedTo: string[], userId: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ date, task, assignedTo, userId })
    });
    return response.json();
  },

  getTodos: async (startDate?: string, endDate?: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = `${API_BASE_URL}/todos${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, { headers });
    return response.json();
  },

  updateTodo: async (id: string, data: any, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  toggleTodoCompletion: async (id: string, userId: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/todos/${id}/complete`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  deleteTodo: async (id: string, token?: string) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers
    });
    return response.json();
  },

  // IP Address endpoints
  getIpAddresses: async (limit?: number) => {
    const url = limit ? `${IP_API_BASE_URL}/ipaddresses?limit=${limit}` : `${IP_API_BASE_URL}/ipaddresses`;
    const response = await fetch(url);
    return response.json();
  },

  deleteIpAddress: async (id: string) => {
    const response = await fetch(`${IP_API_BASE_URL}/ipaddresses/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
