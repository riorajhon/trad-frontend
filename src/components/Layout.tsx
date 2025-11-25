import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, LogOut, User, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { api } from '@/lib/api';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadWalletValue();
    
    // Update portfolio value every minute
    const interval = setInterval(loadWalletValue, 60000);
    return () => clearInterval(interval);
  }, []);

  const [portfolioValue, setPortfolioValue] = useState(0);
  const [cryptoPrices, setCryptoPrices] = useState<any>({});

  const loadUser = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    if (userId) {
      try {
        const result = await api.getUserById(userId, token || undefined);
        if (result.success) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Failed to load user');
      }
    }
  };

  const loadWalletValue = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    if (userId) {
      try {
        // Get wallet
        const walletResult = await api.getWallet(userId, token || undefined);
        
        if (walletResult.success) {
          // Get current crypto prices
          const pricesResponse = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd'
          );
          const prices = await pricesResponse.json();
          
          const priceMap: any = {
            BTC: prices.bitcoin?.usd || 0,
            ETH: prices.ethereum?.usd || 0,
            BNB: prices.binancecoin?.usd || 0,
            SOL: prices.solana?.usd || 0,
            XRP: prices.ripple?.usd || 0,
            USDT: 1
          };
          
          setCryptoPrices(priceMap);
          
          // Calculate total portfolio value
          const balances = walletResult.data.balances;
          let total = 0;
          
          Object.keys(balances).forEach(symbol => {
            const amount = balances[symbol] || 0;
            const price = priceMap[symbol] || 0;
            total += amount * price;
          });
          
          setPortfolioValue(total);
        }
      } catch (error) {
        console.error('Failed to load wallet value');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">TradingBot Pro</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered Trading Assistant</p>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/trading')}
                  className="text-sm"
                >
                  Trading
                </Button>
                {(user?.canAccessTodos || user?.role === 'admin') && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/todos')}
                    className="text-sm"
                  >
                    Todos
                  </Button>
                )}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right mr-4 hidden lg:block">
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
                <p className="text-lg font-bold text-profit">
                  ${portfolioValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <span className="font-bold">TradingBot Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered trading platform for modern traders.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</li>
                <li className="hover:text-foreground cursor-pointer" onClick={() => navigate('/trading')}>Trading</li>
                <li className="hover:text-foreground cursor-pointer">Security</li>
                <li className="hover:text-foreground cursor-pointer">Roadmap</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">About</li>
                <li className="hover:text-foreground cursor-pointer">Blog</li>
                <li className="hover:text-foreground cursor-pointer">Careers</li>
                <li className="hover:text-foreground cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer" onClick={() => navigate('/privacy')}>Privacy</li>
                <li className="hover:text-foreground cursor-pointer" onClick={() => navigate('/terms')}>Terms</li>
                <li className="hover:text-foreground cursor-pointer" onClick={() => navigate('/disclaimer')}>Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TradingBot Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
