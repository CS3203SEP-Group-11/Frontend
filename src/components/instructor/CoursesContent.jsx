import { Plus, Edit, Users, Star, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyCourses } from '../../api/course';

const CoursesContent = ({ setActiveTab, onEditCourse }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getMyCourses();
      setCourses(coursesData || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (courseId) => {
    if (onEditCourse) {
      onEditCourse(courseId);
    } else {
      console.log('Edit course:', courseId);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      DRAFT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.DRAFT}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <button onClick={() => setActiveTab('create')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Course</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <button onClick={() => setActiveTab('create')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Course</span>
          </button>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Courses</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchMyCourses}
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        <button onClick={() => setActiveTab('create')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create New Course</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start by creating your first course</p>
          <button 
            onClick={() => setActiveTab('create')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              {/* Course Thumbnail */}
              <div className="relative">
                <img 
                  src={course.thumbnailUrl || 'https://via.placeholder.com/400x200?text=No+Image'} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(course.status)}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Enrollments */}
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enrollments</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {course.enrollmentCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {course.rating?.average ? course.rating.average.toFixed(1) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{course.price?.amount || 0} {course.price?.currency || 'USD'}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="mt-6 pt-4">
                  <button 
                    onClick={() => handleEditCourse(course.id)}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesContent;
