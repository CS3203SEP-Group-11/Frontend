import { User, Users, BookOpen, DollarSign, Eye } from 'lucide-react';
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import { getMyCourses } from '../../api/course';

const DashboardContent = () => {
  const { user } = useAuth();
  const [coursesData, setCoursesData] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0); // Placeholder value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const coursesData = await getMyCourses();
      setCoursesData(coursesData || []);
      setTotalCourses(coursesData.length);
      setTotalStudents(
        coursesData.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0)
      );
      const earnings = coursesData.reduce((acc, course) => {
        const courseEarnings = (course.enrollmentCount || 0) * (course.priceAmount || 0) * 0.8;
        return acc + courseEarnings;
      }, 0);
      setTotalEarnings(earnings);
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
            <p className="text-primary-100">Ready to inspire more learners today?</p>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalEarnings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Course Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Performance</h2>
        <div className="space-y-4">
          {coursesData.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={course.thumbnailUrl} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{course.enrollmentCount} students enrolled</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.ratingAverage || "N/A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.priceCurrency} {(course.enrollmentCount * course.priceAmount * (0.8)).toLocaleString()}</p>
                </div>
                <button 
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={() => window.location.href = `/course/${course.id}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
