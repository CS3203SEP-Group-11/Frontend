import { BookOpen, Award, TrendingUp, User } from 'lucide-react';
import CourseProgressCard from '../CourseProgressCard';
import { useAuth } from '../../context/AuthContext';
import { getAllCourses } from '../../api/course';
import { useState, useEffect } from 'react';

const DashboardContent = ({ onCourseSelect, fallbackEnrolledCourses = [], fallbackCompletedCourses = [], fallbackInProgressCourses = [] }) => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState(fallbackEnrolledCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getAllCourses();
      setEnrolledCourses(coursesData || fallbackEnrolledCourses || []);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      // Fall back to dummy data silently
      setEnrolledCourses(fallbackEnrolledCourses || []);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  // Filter completed courses
  const completedCourses = (enrolledCourses && enrolledCourses.length > 0
    ? enrolledCourses
    : fallbackEnrolledCourses).filter(course => course.progress === 100);

  // Filter in-progress courses
  const inProgressCourses = (enrolledCourses && enrolledCourses.length > 0
    ? enrolledCourses
    : fallbackEnrolledCourses).filter(course => course.progress > 0 && course.progress < 100);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Loading...</h1>
              <p className="text-primary-100">Fetching your courses</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Error Loading Dashboard</h1>
              <p className="text-primary-100">{error}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Courses</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchEnrolledCourses}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user?.firstName || ''}
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}!
            </h1>
            <p className="text-primary-100">Ready to continue your learning journey?</p>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{enrolledCourses.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCourses.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Certificates Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCourses.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inProgressCourses.slice(0, 2).map((course) => (
              <CourseProgressCard key={course.id} course={course} showProgress={true} onCourseSelect={onCourseSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;