import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Tag, Clock, User, Star } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { buyCourses } from '../api/payments'

const ShoppingCartPage = () => {
  const navigate = useNavigate()
  const { items: cartItems, removeFromCart } = useCart()

  // No quantity for courses; one per course

  const calculateSubtotal = () => {
  return cartItems.reduce((total, item) => total + (item.price?.amount || 0), 0)
  }

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => 
  total + (((item.originalPrice?.amount || 0) - (item.price?.amount || 0))), 0
    )
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return subtotal
  }

  const handleCheckout = () => {
    const courseIds = cartItems.map(item => item.id);
    const paymentData = buyCourses(courseIds);
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any courses to your cart yet.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Courses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Course Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              <Link 
                                to={`/course/${item.courseId}`}
                                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              >
                                {item.title}
                              </Link>
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {item.instructor}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {item.duration}h
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                {item.rating.average} ({item.rating.count})
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.level === 'BEGINNER' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : item.level === 'INTERMEDIATE'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {item.level}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              ${item.price.amount}
                            </span>
                            {item.originalPrice.amount > item.price.amount && (
                              <span className="text-sm text-gray-500 line-through">
                                ${item.originalPrice.amount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                {/* Tax removed */}
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Savings</span>
                    <span className="font-medium">
                      -${calculateSavings().toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Checkout</span>
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  7-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ShoppingCartPage
