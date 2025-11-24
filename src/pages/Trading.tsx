import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Position {
  symbol: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

const Trading = () => {
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState('bitcoin');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [balance] = useState(10000);
  
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  // Fetch real market data from CoinGecko
  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple&order=market_cap_desc&sparkline=false'
      );
      const data = await response.json();
      setMarketData(data);
      
      // Update current price for selected pair
      const selected = data.find((coin: MarketData) => coin.id === selectedPair);
      if (selected) {
        setCurrentPrice(selected.current_price);
        setPriceChange(selected.price_change_percentage_24h);
      }
      
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch market data',
        variant: 'destructive'
      });
    }
  };

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update current price when selected pair changes
  useEffect(() => {
    const selected = marketData.find((coin) => coin.id === selectedPair);
    if (selected) {
      setCurrentPrice(selected.current_price);
      setPriceChange(selected.price_change_percentage_24h);
    }
  }, [selectedPair, marketData]);

  const handlePlaceOrder = () => {
    if (!amount || (orderType === 'limit' && !price)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const orderPrice = orderType === 'market' ? currentPrice : parseFloat(price);
    const orderAmount = parseFloat(amount);
    const total = orderPrice * orderAmount;

    if (tradeType === 'buy' && total > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough funds',
        variant: 'destructive'
      });
      return;
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: getSymbolDisplay(selectedPair),
      type: tradeType,
      amount: orderAmount,
      price: orderPrice,
      total: total,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    setTrades([newTrade, ...trades]);
    
    // Update positions
    if (tradeType === 'buy') {
      const existingPosition = positions.find(p => p.symbol === getSymbolDisplay(selectedPair));
      if (existingPosition) {
        const newAmount = existingPosition.amount + orderAmount;
        const newAvgPrice = ((existingPosition.avgPrice * existingPosition.amount) + (orderPrice * orderAmount)) / newAmount;
        setPositions(positions.map(p => 
          p.symbol === getSymbolDisplay(selectedPair)
            ? { ...p, amount: newAmount, avgPrice: newAvgPrice, currentPrice: orderPrice }
            : p
        ));
      } else {
        setPositions([...positions, {
          symbol: getSymbolDisplay(selectedPair),
          amount: orderAmount,
          avgPrice: orderPrice,
          currentPrice: orderPrice,
          pnl: 0,
          pnlPercent: 0
        }]);
      }
    }
    
    toast({
      title: 'Order Placed',
      description: `${tradeType.toUpperCase()} ${orderAmount} ${selectedPair} at $${orderPrice.toFixed(2)}`
    });

    // Reset form
    setAmount('');
    setPrice('');
  };

  const getSymbolDisplay = (coinId: string) => {
    const symbolMap: { [key: string]: string } = {
      'bitcoin': 'BTC/USD',
      'ethereum': 'ETH/USD',
      'binancecoin': 'BNB/USD',
      'solana': 'SOL/USD',
      'ripple': 'XRP/USD'
    };
    return symbolMap[coinId] || coinId.toUpperCase();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Market Overview */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Live Trading</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">${balance.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total P&L</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-500">+$225.25</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Open Positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{positions.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>24h Volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">$21.4K</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Pairs */}
          <Card>
            <CardHeader>
              <CardTitle>Live Markets</CardTitle>
              <CardDescription>Real-time cryptocurrency prices</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading market data...
                </div>
              ) : (
                <div className="space-y-2">
                  {marketData.map((coin) => (
                    <div
                      key={coin.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedPair === coin.id
                          ? 'bg-primary/10 border border-primary'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedPair(coin.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{getSymbolDisplay(coin.id)}</span>
                          <div className="text-xs text-muted-foreground">{coin.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">${coin.current_price.toLocaleString()}</div>
                          <div className={`text-sm flex items-center gap-1 justify-end ${
                            coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trading Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{getSymbolDisplay(selectedPair)}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <Badge variant={priceChange >= 0 ? 'default' : 'destructive'}>
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    24h Change
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="data-[state=active]:bg-green-500">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-red-500">Sell</TabsTrigger>
                </TabsList>

                <TabsContent value={tradeType} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Order Type</Label>
                    <Select value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {orderType === 'limit' && (
                    <div className="space-y-2">
                      <Label>Price (USDT)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Amount ({getSymbolDisplay(selectedPair).split('/')[0]})</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total (USDT)</Label>
                    <Input
                      type="text"
                      value={amount && (orderType === 'market' ? currentPrice : parseFloat(price || '0')) 
                        ? ((orderType === 'market' ? currentPrice : parseFloat(price)) * parseFloat(amount)).toFixed(2)
                        : '0.00'}
                      disabled
                    />
                  </div>

                  <Button
                    className="w-full"
                    variant={tradeType === 'buy' ? 'default' : 'destructive'}
                    onClick={handlePlaceOrder}
                  >
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {getSymbolDisplay(selectedPair).split('/')[0]}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Positions & History */}
        <Tabs defaultValue="positions">
          <TabsList>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Avg Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.symbol}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell>{position.amount}</TableCell>
                        <TableCell>${position.avgPrice.toLocaleString()}</TableCell>
                        <TableCell>${position.currentPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                            ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Close</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{new Date(trade.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.amount}</TableCell>
                        <TableCell>${trade.price.toLocaleString()}</TableCell>
                        <TableCell>${trade.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{trade.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Trading;
