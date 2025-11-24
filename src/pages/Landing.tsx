import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Shield, Zap, BarChart3, Lock } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');
    
    if (userId && token) {
      // User is already signed in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50 bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TradingBot Pro</h1>
                <p className="text-xs text-gray-400">AI-Powered Trading Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/signin')} className="text-white">
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Trade Smarter with
            <span className="text-primary"> AI-Powered</span> Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Automate your trading strategy with advanced algorithms, real-time signals, 
            and comprehensive market analysis.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8">
              Start Trading Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/signin')} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose TradingBot Pro?
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to succeed in automated trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-white">Real-Time Signals</CardTitle>
              <CardDescription className="text-gray-400">
                Get instant trading signals powered by advanced AI algorithms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-white">Advanced Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive charts and performance metrics at your fingertips
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-white">Automated Trading</CardTitle>
              <CardDescription className="text-gray-400">
                Set it and forget it with fully automated trading strategies
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-white">Secure & Reliable</CardTitle>
              <CardDescription className="text-gray-400">
                Bank-level security with Firebase authentication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-white">Risk Management</CardTitle>
              <CardDescription className="text-gray-400">
                Built-in risk controls to protect your investments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-white">24/7 Monitoring</CardTitle>
              <CardDescription className="text-gray-400">
                Never miss an opportunity with round-the-clock market monitoring
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust TradingBot Pro for their automated trading needs.
            </p>
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8">
              Create Free Account
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <span className="font-bold text-white">TradingBot Pro</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered trading platform for modern traders.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
                <li>Roadmap</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/privacy')}>Privacy</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/terms')}>Terms</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/disclaimer')}>Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TradingBot Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
