import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Activity, AlertTriangle } from 'lucide-react';

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50 bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-bold text-white">TradingBot Pro</span>
            </div>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-3xl text-white">Risk Disclaimer</CardTitle>
            </div>
            <p className="text-gray-400 text-sm">Last updated: January 1, 2025</p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 font-semibold">
                ⚠️ IMPORTANT: Please read this disclaimer carefully before using TradingBot Pro
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Trading Risks</h2>
              <p>
                Trading cryptocurrencies, stocks, forex, and other financial instruments involves
                substantial risk of loss and is not suitable for every investor. The high degree of
                leverage can work against you as well as for you. Before deciding to trade, you should
                carefully consider your investment objectives, level of experience, and risk appetite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">No Financial Advice</h2>
              <p>
                TradingBot Pro is a software tool and does not provide financial, investment, or
                trading advice. All trading signals, recommendations, and information provided by
                the platform are for informational purposes only and should not be construed as
                professional financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Past Performance</h2>
              <p>
                Past performance is not indicative of future results. Historical returns, expected
                returns, and probability projections are provided for informational purposes only
                and may not reflect actual future performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Automated Trading Risks</h2>
              <p>
                Automated trading systems can experience technical failures, connectivity issues,
                or unexpected market conditions that may result in losses. You should:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Monitor your automated trading strategies regularly</li>
                <li>Set appropriate stop-loss and take-profit levels</li>
                <li>Never invest more than you can afford to lose</li>
                <li>Understand the risks of leverage and margin trading</li>
                <li>Keep your account credentials secure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">No Guarantees</h2>
              <p>
                We make no representations or warranties regarding the accuracy, reliability, or
                completeness of any information provided through TradingBot Pro. We do not guarantee
                any specific results or profits from using our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Market Volatility</h2>
              <p>
                Financial markets can be extremely volatile. Prices can change rapidly and
                unpredictably. You may lose some or all of your invested capital. Only trade with
                money you can afford to lose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Regulatory Compliance</h2>
              <p>
                It is your responsibility to ensure that your use of TradingBot Pro complies with
                all applicable laws and regulations in your jurisdiction. Trading may be restricted
                or prohibited in certain countries.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Seek Professional Advice</h2>
              <p>
                Before making any investment decisions, you should consult with a qualified financial
                advisor who can assess your individual circumstances and provide personalized advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Acknowledgment</h2>
              <p>
                By using TradingBot Pro, you acknowledge that you have read, understood, and agree
                to this disclaimer. You accept full responsibility for your trading decisions and
                any resulting profits or losses.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Disclaimer;
