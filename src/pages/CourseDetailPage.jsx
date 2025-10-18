import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Crown,
  BookOpen, 
  Languages, 
  Layers, 
  Award, 
  Star,
  ShoppingCart,
  CreditCard,
  Calendar,
  Globe,
  Tag,
  Mail,
  ExternalLink,
  Linkedin,
  RefreshCw
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb'
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { buyCourses, enrollToCoursesWithSubscription } from '../api/payments';
import StripeCheckout from '../components/StripeCheckout';
import { useCourseDetail } from '../hooks/useCourseDetail';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, instructor, loading, error, refreshCourse } = useCourseDetail(id);
  const { addToCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: course?.title || 'Course Details', href: `/course/${id}` }
  ]

  const handleBuyNow = async () => {
    if (!course || checkingOut) return;

    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/course/${id}` } });
      return;
    }
    
    if (!course.priceAmount) {
      navigate('/courses');
      return;
    }
    setCheckoutError(null);
    setCheckingOut(true);
    try {
      const res = await buyCourses([course.id]);
      const secret = res?.clientSecret;
      if (!secret) throw new Error('No client secret returned');
      setClientSecret(secret);
      setShowCheckout(true);
    } catch (e) {
      setCheckoutError(e?.message || 'Failed to start checkout');
    } finally {
      setCheckingOut(false);
    }
  };

  const enrollsWithSubscription = async () => {
    if (!course || checkingOut) return;
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/course/${id}` } });
      return;
    }
    setCheckoutError(null);
    try {
      await enrollToCoursesWithSubscription([course.id]);
      navigate('/courses');
    } catch (e) {
      setCheckoutError(e?.message || 'Failed to enroll with subscription');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleAddToCart = () => {
    if (!course) return;
    const cartItem = {
      id: course.id, // unique id for cart
      courseId: course.id,
      title: course.title,
      instructor: instructor?.instructorName || 'Unknown Instructor',
      price: { amount: Number(course.priceAmount || 0), currency: course.priceCurrency || 'USD' },
      originalPrice: { amount: Number(course.originalPriceAmount || course.priceAmount || 0), currency: course.priceCurrency || 'USD' },
      thumbnailUrl: course.thumbnailUrl,
      duration: course.duration || 0,
      rating: { average: course.ratingAverage || 0, count: course.ratingCount || 0 },
      level: course.level || 'BEGINNER',
      quantity: 1,
    };
    addToCart(cartItem);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Course</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/courses')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h2>
            <button
              onClick={() => navigate('/courses')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <button
            onClick={refreshCourse}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh course data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                <div className="relative">
                  <img
                    src={course.thumbnailUrl || 'https://via.placeholder.com/800x400?text=Course+Image'}
                    alt={course.title}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"/>
                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-2 ${
                        course.level === 'BEGINNER'
                          ? 'bg-green-600'
                          : course.level === 'INTERMEDIATE'
                          ? 'bg-yellow-500'
                          : course.level === 'ADVANCED'
                          ? 'bg-red-600'
                          : 'bg-gray-500'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      {course.level || 'GENERAL'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.category || 'General'}
                    </span>
                    {course.tags && course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {course.title || 'Course Title'}
                  </h1>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {course.description || 'Course description not available.'}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{course.enrollmentCount || 0}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{course.duration || 'N/A'}h</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Languages className="w-5 h-5 text-primary-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Language</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{course.language || 'English'}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {course.ratingAverage ? `${course.ratingAverage} (${course.ratingCount || 0})` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructor</h3>
                    <div className="flex items-start space-x-4">
                      <img
                        src={instructor?.profileImageUrl || 'https://via.placeholder.com/100x100?text=I'}
                        alt={instructor?.instructorName || 'Instructor'}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-lg mb-2">
                          {instructor?.instructorName || 'Unknown Instructor'}
                        </p>
                        
                        {/* Bio */}
                        {instructor?.bio && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                            {instructor.bio}
                          </p>
                        )}

                        {/* Expertise */}
                        {instructor?.expertise && instructor.expertise.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expertise</p>
                            <div className="flex flex-wrap gap-2">
                              {instructor.expertise.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact Details */}
                        {instructor?.contactDetails && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact</p>
                            <div className="flex flex-wrap gap-4">
                              {instructor.contactDetails.email && (
                                <a
                                  href={`mailto:${instructor.contactDetails.email}`}
                                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                >
                                  <Mail className="w-4 h-4" />
                                  <span>Email</span>
                                </a>
                              )}
                              {instructor.contactDetails.linkedin && (
                                <a
                                  href={instructor.contactDetails.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                >
                                  <Linkedin className="w-4 h-4" />
                                  <span>LinkedIn</span>
                                </a>
                              )}
                              {instructor.contactDetails.website && (
                                <a
                                  href={instructor.contactDetails.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span>Website</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Course Curriculum */}
              {course.curriculum && course.curriculum.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Curriculum</h3>
                  <div className="space-y-4">
                    {course.curriculum.map((section, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900 dark:text-white">{section.title || `Section ${index + 1}`}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{section.lessons || 0} lessons</span>
                              <span>{section.duration || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.priceAmount ? (
                      `${course.priceCurrency || 'USD'} ${course.priceAmount}`
                    ) : (
                      'Free'
                    )}
                  </div>
                  {course.priceAmount && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">One-time payment</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  {!user?.isSubscribed ? (
                    <button
                      onClick={handleBuyNow}
                      disabled={checkingOut}
                      className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                        checkingOut ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>{checkingOut ? 'Preparing payment…' : (course.priceAmount ? 'Buy Now' : 'Enroll Free')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={enrollsWithSubscription}
                      className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Crown className="w-5 h-5" />
                      <span>Enroll</span>
                    </button>
                  )}

                  {checkoutError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{checkoutError}</p>
                  )}

                  {course.priceAmount && (
                    <button
                      onClick={handleAddToCart}
                      className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Lifetime access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Available worldwide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCheckout && clientSecret && (
        <StripeCheckout
          clientSecret={clientSecret}
          onClose={() => {
            setShowCheckout(false);
            setClientSecret(null);
          }}
          onSuccess={() => {
            setShowCheckout(false);
            setClientSecret(null);
            navigate('/courses');
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default CourseDetailPage;