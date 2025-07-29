import { BookOpen, Award, TrendingUp, Play, Calendar } from 'lucide-react';
import CourseCard from '../CourseCard';
import { currentUser, courses, certificates } from '../../data/dummyData';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { getUserSession } from '../../utils/sessionUser';

const DashboardContent = ({ inProgressCourses, completedCourses, enrolledCourses, onCourseSelect }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserSession();
    setCurrentUser(user);
    console.log('Current User:', user);
    if (!user) {
      console.error('No user session found. Redirecting to login.');
      navigate('/login'); // Assuming you have a navigate function available
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser?.avatar || '/default-avatar.png'}
            alt={currentUser?.name || 'User'}
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
          />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {currentUser?.firstName || 'User'}!
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
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
              <CourseCard key={course.id} course={course} showProgress={true} onCourseSelect={onCourseSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;