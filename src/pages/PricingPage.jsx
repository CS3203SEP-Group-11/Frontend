import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { pricingPlans } from '../data/dummyData';
import StripeCheckout from '../components/StripeCheckout';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  // For sandbox testing without backend fetching:
  const [showCheckout, setShowCheckout] = useState(false);
  const [testClientSecret, setTestClientSecret] = useState(null);
  const TEST_PUBLISHABLE_KEY = 'pk_test_51S3ctMFGozbXG9BSYpIPuklvUDXaoIKx6WINucV0M8wEfhMRV3rkSoRLs71reoMmeVFCxHJM2NrC1oNV2zgQgp6S00njcZSjhM'; // replace with your test pk
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Select the perfect plan for your learning journey.
          </p>

          {/* Toggle between Monthly/Yearly */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${!isYearly ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isYearly ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Yearly
            </span>
            
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl shadow-lg border-2 p-8 transition-transform duration-300 bg-white dark:bg-gray-800 w-80 mx-auto border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600`}
              >
                <div className="flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {plan.name} {plan.name === "Pro" ? '💎' : '🚀'} {isYearly && plan.name === "Pro" && <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">Save 20%</span>}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/{isYearly ? 'year' : 'month'}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      if (plan.name === 'Free') {
                        navigate('/courses');
                      } else {
                        // Set your test client_secret here to open the modal
                        // Example: 'pi_12345_secret_67890'
                        setTestClientSecret('pi_3SD63LFGozbXG9BS0beqALqI_secret_sZOOjv4ftbEFkIo3m6aW8tr4h');
                        setShowCheckout(true);
                      }
                    }}
                    className={`mt-auto w-full py-3 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Start 7-Day Free Trial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {showCheckout && (
        <StripeCheckout
          clientSecret={testClientSecret}
          publishableKey={TEST_PUBLISHABLE_KEY}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            navigate('/courses');
          }}
        />
      )}
    </div>
  );
};

export default PricingPage;