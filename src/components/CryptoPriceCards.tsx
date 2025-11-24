import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  chart_prices?: [number, number][];
}

const CryptoPriceCards = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [timeRange, setTimeRange] = useState<'1' | '7' | '30' | '90' | '365'>('7');

  const fetchCryptoData = async () => {
    try {
      // Fetch market data with sparkline
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple&order=market_cap_desc&sparkline=true&price_change_percentage=24h'
      );
      const data = await response.json();
      
      // Fetch detailed chart data for selected crypto and time range
      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=usd&days=${timeRange}`
      );
      const chartData = await chartResponse.json();
      
      // Add chart data to the selected crypto
      const updatedData = data.map((crypto: CryptoData) => {
        if (crypto.id === selectedCrypto) {
          return {
            ...crypto,
            chart_prices: chartData.prices
          };
        }
        return crypto;
      });
      
      setCryptoData(updatedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedCrypto, timeRange]);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    const days = parseInt(timeRange);
    
    if (days === 1) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days <= 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (days <= 30) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedCryptoData = cryptoData.find(c => c.id === selectedCrypto);

  if (!selectedCryptoData) return null;

  const isPositive = selectedCryptoData.price_change_percentage_24h >= 0;
  
  // Use chart_prices if available, otherwise fallback to sparkline
  const priceData = selectedCryptoData.chart_prices || 
    selectedCryptoData.sparkline_in_7d.price.map((price, index) => [Date.now() - (168 - index) * 3600000, price]);
  
  const prices = priceData.map(([_, price]) => price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  const chartData = priceData.map(([timestamp, price]) => ({
    price: price,
    timestamp: timestamp,
    time: timestamp
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Cryptocurrency Prices</h2>
        <p className="text-sm text-muted-foreground">Live market data • Updates every minute</p>
      </div>

      {/* Crypto Selector */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {cryptoData.map((crypto) => (
            <Button
              key={crypto.id}
              variant={selectedCrypto === crypto.id ? 'default' : 'outline'}
              onClick={() => setSelectedCrypto(crypto.id)}
              className="flex items-center gap-2"
            >
              <span className="font-semibold">{crypto.symbol.toUpperCase()}</span>
              <span className={`text-xs ${
                crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </span>
            </Button>
          ))}
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={timeRange === '1' ? 'default' : 'outline'}
            onClick={() => setTimeRange('1')}
          >
            1D
          </Button>
          <Button
            size="sm"
            variant={timeRange === '7' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7')}
          >
            7D
          </Button>
          <Button
            size="sm"
            variant={timeRange === '30' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30')}
          >
            1M
          </Button>
          <Button
            size="sm"
            variant={timeRange === '90' ? 'default' : 'outline'}
            onClick={() => setTimeRange('90')}
          >
            3M
          </Button>
          <Button
            size="sm"
            variant={timeRange === '365' ? 'default' : 'outline'}
            onClick={() => setTimeRange('365')}
          >
            1Y
          </Button>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{selectedCryptoData.symbol.toUpperCase()}</span>
              <span className="text-muted-foreground text-lg">
                {selectedCryptoData.name}
              </span>
            </div>
            <div className={`flex items-center gap-2 text-lg ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {Math.abs(selectedCryptoData.price_change_percentage_24h).toFixed(2)}%
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="text-5xl font-bold">
                ${selectedCryptoData.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Current Price (USD)
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatXAxis}
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    ticks={[0, 42, 84, 126, 167]}
                  />
                  <YAxis
                    tickFormatter={formatYAxis}
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    domain={[minPrice * 0.995, maxPrice * 1.005]}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`,
                      'Price'
                    ]}
                    labelFormatter={(timestamp: number) => {
                      const date = new Date(timestamp);
                      return date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#22c55e' : '#ef4444'}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              {timeRange === '1' ? '24-hour' : 
               timeRange === '7' ? '7-day' : 
               timeRange === '30' ? '30-day' : 
               timeRange === '90' ? '90-day' : 
               '1-year'} price trend • Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoPriceCards;
