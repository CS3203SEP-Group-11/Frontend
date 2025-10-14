import { useEffect, useMemo, useState } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

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
  
  // Use the globally loaded Stripe instead of loadStripe
  const stripePromise = useMemo(() => {
    if (window.Stripe) {
      return Promise.resolve(window.Stripe(pk));
    }
    // Fallback to dynamic loading if global Stripe is not available
    return import('@stripe/stripe-js').then(({ loadStripe }) => loadStripe(pk));
  }, [pk]);
  
  const options = useMemo(() => ({
    clientSecret,
    appearance: { theme: 'stripe' },
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
        const res = await stripe.retrievePaymentIntent(clientSecret);
        if (!active) return;
        if (res.error) {
          setError(res.error.message || 'Failed to load total');
        } else {
          setPaymentIntent(res.paymentIntent);
        }
        setLoading(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complete your payment</h3>
        <Elements stripe={stripePromise} options={options}>
          <PaymentSummary />
          <PaymentForm onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
}
