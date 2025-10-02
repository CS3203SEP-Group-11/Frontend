import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import StripeCheckout from '../components/StripeCheckout';
import { buySubscriptionPlan } from '../api/payments';
import { getSubscriptionPlans } from '../api/subscriptions';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  // For sandbox testing without backend fetching:
  const [showCheckout, setShowCheckout] = useState(false);
  const [testClientSecret, setTestClientSecret] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    const planId = isYearly ? apiAnnual?.id : apiMonthly?.id;
    if (!planId) return;
    try {
      setSubscribing(true);
      const { clientSecret } = await buySubscriptionPlan(planId);
      setTestClientSecret(clientSecret);
      setShowCheckout(true);
    } catch (err) {
      console.error("Payment error:", err);
      setSubscribing(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const plans = await getSubscriptionPlans();
      setPlanData(plans);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  // Helpers to pick API paid plans and features
  const apiMonthly = useMemo(() => (planData || []).find(p => p.billingCycle === 'MONTHLY' && p.isActive), [planData]);
  const apiAnnual = useMemo(() => (planData || []).find(p => p.billingCycle === 'ANNUAL' && p.isActive), [planData]);
  const paidAmount = isYearly
    ? (apiAnnual?.amount ?? null)
    : (apiMonthly?.amount ?? null);
  const toTitle = (s = '') => {
    const t = s.replace(/_/g, ' ');
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  // Free plan defined locally with the same feature structure as Pro
  const FREE_FEATURES = useMemo(() => ({
    max_downloads: 'limited',
    support_level: 'basic',
    community_access: true,
    access_all_courses: false,
    download_resources: false,
  }), []);

  const freeFeaturesArray = useMemo(() => (
    Object.entries(FREE_FEATURES).map(([k, v]) => `${toTitle(k)}: ${typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}`)
  ), [FREE_FEATURES]);

  const paidFeaturesArray = useMemo(() => {
    const feats = apiMonthly?.features || apiAnnual?.features;
    if (!feats) return [];
    return Object.entries(feats).map(([k, v]) => `${toTitle(k)}: ${typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}`);
  }, [apiMonthly, apiAnnual]);

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

          {/* Pricing Cards: Free and Paid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Card */}
            <div className="flex flex-col justify-between rounded-2xl shadow-lg border-2 p-8 transition-transform duration-300 bg-white dark:bg-gray-800 w-80 mx-auto border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600">
              <div className="flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free 🚀</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                  <span className="text-gray-500 dark:text-gray-400">/{isYearly ? 'year' : 'month'}</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {freeFeaturesArray.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/courses')}
                  className={`mt-auto w-full py-3 rounded-lg font-semibold transition-colors ${
                    'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Paid Card (Pro) */}
            <div className="flex flex-col justify-between rounded-2xl shadow-lg border-2 p-8 transition-transform duration-300 bg-white dark:bg-gray-800 w-80 mx-auto border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600">
              <div className="flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pro 💎</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">${paidAmount ?? '--'}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{isYearly ? 'year' : 'month'}</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {paidFeaturesArray.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handlePayment}
                  disabled={subscribing}
                  className="mt-auto w-full py-3 rounded-lg font-semibold transition-colors bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {subscribing ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showCheckout && (
        <StripeCheckout
          clientSecret={testClientSecret}
          onClose={() => { setShowCheckout(false); setSubscribing(false); }}
          onSuccess={() => {
            setShowCheckout(false);
            setSubscribing(false);
            navigate('/courses');
          }}
        />
      )}
    </div>
  );
};

export default PricingPage;