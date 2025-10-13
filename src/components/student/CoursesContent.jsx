import CourseProgressCard from '../CourseProgressCard';
import ErrorBoundary from '../ErrorBoundary';
import Breadcrumb from '../Breadcrumb';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserEnrollmentsWithCourse } from '../../api/enrollment';
import { useNavigate } from 'react-router-dom';

const CoursesContent = ({ onCourseSelect, fallbackEnrolledCourses = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(fallbackEnrolledCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Removed search/filter/pagination for simplified view

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const enrollmentData = await getUserEnrollmentsWithCourse(user.id);
      setEnrolledCourses(enrollmentData);
      setError('');
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setEnrolledCourses(fallbackEnrolledCourses || []);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  // Filter completed courses (use status or progressPercentage)
  const completedCourses = enrolledCourses.filter(course => 
    course.status === 'COMPLETED' || course.progressPercentage === 100
  );

  // Filter in-progress courses: include 0% up to 99%
  const inProgressCourses = enrolledCourses.filter(course => {
    const pct = typeof course.progressPercentage === 'number' ? course.progressPercentage : 0;
    return pct >= 0 && pct < 100;
  });

  // Filter not started courses
  const notStartedCourses = enrolledCourses.filter(course => 
    course.progressPercentage === 0
  );

  const continueLearning = (course) => {
    onCourseSelect(course);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Breadcrumb items={[{ label: 'My Courses' }]} />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Breadcrumb items={[{ label: 'My Courses' }]} />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
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
    <Breadcrumb items={[{ label: 'My Courses' }]} />
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Browse More Courses</button>
    </div>
    <div className="space-y-8">
      {inProgressCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">In Progress ({inProgressCourses.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <ErrorBoundary key={`error-boundary-progress-${course.courseId || course.id}`}>
                <CourseProgressCard
                  key={course.courseId || course.id}
                  course={{
                    ...course,
                    image: course.thumbnailUrl || course.thumbnail,
                    progress: course.progressPercentage ?? 0,
                  }}
                  showProgress={true}
                  onContinue={continueLearning}
                  onCourseSelect={onCourseSelect}
                />
              </ErrorBoundary>
            ))}
          </div>
        </div>
      )}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Completed ({completedCourses.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <ErrorBoundary key={`error-boundary-completed-${course.courseId || course.id}`}>
                <CourseProgressCard
                  key={course.courseId || course.id}
                  course={{
                    ...course,
                    image: course.thumbnailUrl || course.thumbnail,
                    progress: course.progressPercentage ?? 0,
                  }}
                  showProgress={true}
                  onCourseSelect={onCourseSelect}
                />
              </ErrorBoundary>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default CoursesContent;
