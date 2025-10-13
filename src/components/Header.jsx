import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, User, LogOut, GraduationCap, Menu, X, ShoppingCart, Bell, Crown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../App'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth';
import { useCart } from '../context/CartContext'
import { getInAppNotifications } from '../api/notification';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { items: cartItems } = useCart()
  const cartItemsCount = cartItems.length
  const userMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    if (!user?.id) return;
    
    try {
      const notifications = await getInAppNotifications(user.id);
      const unread = notifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount();
      
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, user?.id])

  // Listen for notification read events
  useEffect(() => {
    const handleNotificationRead = () => {
      fetchUnreadCount();
    };

    window.addEventListener('notificationRead', handleNotificationRead);
    return () => {
      window.removeEventListener('notificationRead', handleNotificationRead);
    };
  }, [user?.id])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
    }
    setIsUserMenuOpen(false)
  }

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo-levelup.svg" 
              alt="LevelUp" 
              className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              LevelUp
            </span>
          </Link>          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 font-medium"
            >
              Courses
            </Link>
            {!user?.isSubscribed && (
            <Link 
            to="/pricing" 
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 font-medium"
            >
            Pricing
            </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <button
                  onClick={() => navigate('/student-dashboard?tab=notifications')}
                  className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Cart Button */}
                <div className="relative">
                  <button
                    onClick={() => navigate('/cart')}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm"
                    aria-label="Shopping Cart"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="relative p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <User className="w-5 h-5 text-white" />
                    {user?.isSubscribed && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1 shadow-lg">
                        <Crown className="w-3 h-3 text-yellow-900" />
                      </div>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">
                        {user?.profileImageUrl && (
                          <img
                            src={user.profileImageUrl}
                            alt={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white mx-auto"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                          {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          {user?.email || ''}
                        </p>
                        {user?.isSubscribed && (
                          <div className="mt-2 flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-full">
                            <Crown className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Premium Member</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate('/student-dashboard')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Student Dashboard</span>
                      </button>

                      {user?.role === 'INSTRUCTOR' && (
                        <button
                          onClick={() => {
                            navigate('/instructor-dashboard')
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Instructor Dashboard</span>
                        </button>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              to="/pricing" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
