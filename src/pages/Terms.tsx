import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Activity } from 'lucide-react';

const Terms = () => {
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
            <CardTitle className="text-3xl text-white">Terms of Service</CardTitle>
            <p className="text-gray-400 text-sm">Last updated: January 1, 2025</p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using TradingBot Pro, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to these terms, please do not
                use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily access TradingBot Pro for personal, non-commercial
                use only. This is the grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current
                information. Failure to do so constitutes a breach of the Terms. You are responsible
                for safeguarding your password and for all activities under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Trading Risks</h2>
              <p>
                Trading involves substantial risk of loss. You acknowledge that you are solely
                responsible for your trading decisions and that TradingBot Pro is not liable for
                any losses incurred through the use of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Service Availability</h2>
              <p>
                We do not guarantee that our service will be available at all times. We may experience
                hardware, software, or other problems that could lead to interruptions, delays, or
                errors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
              <p>
                In no event shall TradingBot Pro or its suppliers be liable for any damages arising
                out of the use or inability to use the service, even if we have been notified of the
                possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for any
                reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any
                changes by updating the "Last updated" date of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to:
                <br />
                <a href="mailto:legal@tradingbotpro.com" className="text-primary hover:underline">
                  legal@tradingbotpro.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
