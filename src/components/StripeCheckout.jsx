import { useEffect, useMemo, useState, Suspense } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// Utility function to check Stripe connectivity
const checkStripeConnectivity = async () => {
  try {
    // Instead of making a HEAD request to Stripe.js, check if Stripe is globally available
    if (window.Stripe) {
      console.log('Stripe.js is loaded globally');
      return true;
    }
    
    // If not globally available, assume connectivity is OK and let the fallback handle loading
    console.log('Stripe.js not globally loaded, assuming connectivity is OK');
    return true;
  } catch (error) {
    console.warn('Stripe connectivity check failed:', error);
    return false;
  }
};

function PaymentForm({ onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pricing?payment=return`,
      },
      redirect: 'if_required',
    });
    setLoading(false);

    if (error) {
      setMessage(error.message || 'Something went wrong.');
      return;
    }

    if (paymentIntent) {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment successful!');
          onSuccess?.(paymentIntent);
          break;
        case 'requires_action':
          setMessage('Additional authentication required…');
          break;
        case 'processing':
          setMessage('Payment is processing…');
          break;
        default:
          setMessage(`Status: ${paymentIntent.status}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs', wallets: { link: 'never' } }} />
      {message && (
        <div className="text-sm text-red-600 dark:text-red-400">{message}</div>
      )}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Pay'}
        </button>
      </div>
    </form>
  );
}

export default function StripeCheckout({ clientSecret, onClose, onSuccess }) {
  const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const [stripeError, setStripeError] = useState(null);
  const [connectivityChecked, setConnectivityChecked] = useState(false);
  
  // Validate Stripe publishable key
  useEffect(() => {
    if (!pk) {
      setStripeError('Stripe publishable key is not configured. Please check your environment variables.');
      setConnectivityChecked(true);
      return;
    }
    
    if (!pk.startsWith('pk_')) {
      setStripeError('Invalid Stripe publishable key format. Key should start with "pk_".');
      setConnectivityChecked(true);
      return;
    }
    
    const checkConnectivity = async () => {
      const isConnected = await checkStripeConnectivity();
      if (!isConnected) {
        setStripeError('Unable to connect to payment service. Please check your network connection.');
      }
      setConnectivityChecked(true);
    };
    
    checkConnectivity();
  }, [pk]);
  
  // Use the globally loaded Stripe with better error handling
  const stripePromise = useMemo(() => {
    if (!connectivityChecked || stripeError || !pk) return null;
    
    try {
      if (window.Stripe) {
        console.log('Using globally loaded Stripe with key:', pk.substring(0, 10) + '...');
        return Promise.resolve(window.Stripe(pk));
      }
      // Fallback to dynamic loading if global Stripe is not available
      console.log('Falling back to dynamic Stripe loading');
      return import('@stripe/stripe-js').then(({ loadStripe }) => loadStripe(pk));
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      setStripeError('Failed to initialize payment system: ' + error.message);
      return Promise.reject(error);
    }
  }, [pk, connectivityChecked, stripeError]);
  
  const options = useMemo(() => ({
    clientSecret,
    appearance: { 
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
      }
    },
    loader: 'auto',
  }), [clientSecret]);

  // Helpers to format amount nicely
  const isZeroDecimal = (currency) => {
    const zeroDecimals = new Set(['BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG','RWF','UGX','VND','VUV','XAF','XOF','XPF']);
    return zeroDecimals.has((currency || '').toUpperCase());
  };

  const formatAmount = (amount, currency) => {
    const value = isZeroDecimal(currency) ? amount : amount / 100;
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: (currency || 'USD').toUpperCase() }).format(value);
    } catch {
      return `${value} ${currency?.toUpperCase() || ''}`.trim();
    }
  };

  function PaymentSummary() {
    const stripe = useStripe();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentIntent, setPaymentIntent] = useState(null);

    useEffect(() => {
      let active = true;
      const load = async () => {
        if (!stripe || !clientSecret) return;
        setLoading(true);
        try {
          const res = await stripe.retrievePaymentIntent(clientSecret);
          if (!active) return;
          if (res.error) {
            console.error('Stripe PaymentIntent error:', res.error);
            setError(res.error.message || 'Failed to load payment details');
          } else if (res.paymentIntent) {
            setPaymentIntent(res.paymentIntent);
          } else {
            setError('No payment intent received');
          }
        } catch (err) {
          if (!active) return;
          console.error('Error retrieving payment intent:', err);
          setError('Network error while loading payment details');
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => { active = false; };
    }, [stripe, clientSecret]);

    if (loading) {
      return <div className="mb-3 text-sm text-gray-500">Loading total…</div>;
    }
    if (error) {
      return <div className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</div>;
    }
    if (!paymentIntent) return null;

    const total = formatAmount(paymentIntent.amount, paymentIntent.currency);

    return (
      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/60 text-left">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">{total}</span>
        </div>
        {paymentIntent.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{paymentIntent.description}</div>
        )}
      </div>
    );
  }

  if (!connectivityChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Initializing payment system...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <p className="text-sm text-red-600 dark:text-red-400">Missing client secret. Please provide a valid client secret.</p>
          <div className="mt-4 text-right">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (stripeError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Error</h3>
          <p className="text-sm text-red-600 dark:text-red-400">{stripeError}</p>
          <div className="mt-4 text-right">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to initialize payment system</p>
          <div className="mt-4 text-right">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complete your payment</h3>
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        }>
          <Elements stripe={stripePromise} options={options}>
            <PaymentSummary />
            <PaymentForm onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        </Suspense>
      </div>
    </div>
  );
}
