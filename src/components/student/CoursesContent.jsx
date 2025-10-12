import { BookOpen } from 'lucide-react';
import CourseProgressCard from '../CourseProgressCard';
import ErrorBoundary from '../ErrorBoundary';
import Pagination from '../Pagination';
import SearchAndFilter from '../SearchAndFilter';
import Breadcrumb from '../Breadcrumb';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCourses } from '../../api/course';
import { useNavigate } from 'react-router-dom';

const CoursesContent = ({ onCourseSelect, fallbackEnrolledCourses = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(fallbackEnrolledCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: null, level: null });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

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

  // Apply search and filters
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || course.category === filters.category;
    const matchesLevel = !filters.level || course.level === filters.level;
    
    //
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  // Get unique categories from enrolled courses
  const categories = [...new Set(enrolledCourses.map(course => course.category).filter(Boolean))];

  // Get unique levels from enrolled courses  
  const levels = ['All Levels', ...new Set(enrolledCourses.map(course => course.level).filter(Boolean))];
  
  

  // Filter completed courses
  const completedCourses = enrolledCourses.filter(course => 
    course.progress === 100
  );

  // Filter in-progress courses
  const inProgressCourses = enrolledCourses.filter(course => 
    course.progress > 0 && course.progress < 100
  );

  // Filter not started courses
  const notStartedCourses = enrolledCourses.filter(course => 
    course.progress === 0
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
          <SearchAndFilter onSearch={setSearchTerm} onFilter={setFilters} categories={categories} levels={levels} placeholder="Search your courses..." />
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
          <SearchAndFilter onSearch={setSearchTerm} onFilter={setFilters} categories={categories} levels={levels} placeholder="Search your courses..." />
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
      <SearchAndFilter onSearch={setSearchTerm} onFilter={setFilters} categories={categories} levels={levels} placeholder="Search your courses..." />
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <p>Showing {paginatedCourses.length} of {filteredCourses.length} courses</p>
      {filteredCourses.length !== enrolledCourses.length && (
        <button onClick={() => { setSearchTerm(''); setFilters({ category: null, level: null }); setCurrentPage(1); }} className="text-primary-600 dark:text-primary-400 hover:underline">Clear all filters</button>
      )}
    </div>
    {paginatedCourses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCourses.map((course) => (
          <ErrorBoundary key={`error-boundary-${course.id}`}>
            <CourseProgressCard key={course.id} course={course} showProgress={true} onContinue={continueLearning} onCourseSelect={onCourseSelect} />
          </ErrorBoundary>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{searchTerm || filters.category || filters.level ? "Try adjusting your search or filters" : "You haven't enrolled in any courses yet"}</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Browse Courses</button>
      </div>
    )}
    {totalPages > 1 && (
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-8" />
    )}
    {!searchTerm && !filters.category && !filters.level && (
      <div className="space-y-8">
        {inProgressCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">In Progress ({inProgressCourses.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.slice(0, 3).map((course) => (
                <ErrorBoundary key={`error-boundary-progress-${course.id}`}>
                  <CourseProgressCard key={course.id} course={course} showProgress={true} onContinue={continueLearning} onCourseSelect={onCourseSelect} />
                </ErrorBoundary>
              ))}
            </div>
          </div>
        )}
        {completedCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Completed ({completedCourses.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.slice(0, 3).map((course) => (
                <ErrorBoundary key={`error-boundary-completed-${course.id}`}>
                  <CourseProgressCard key={course.id} course={course} showProgress={true} onCourseSelect={onCourseSelect} />
                </ErrorBoundary>
              ))}
            </div>
          </div>
        )}
        {notStartedCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Not Started ({notStartedCourses.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notStartedCourses.slice(0, 3).map((course) => (
                <ErrorBoundary key={`error-boundary-notstarted-${course.id}`}>
                  <CourseProgressCard key={course.id} course={course} showProgress={false} onCourseSelect={onCourseSelect} />
                </ErrorBoundary>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default CoursesContent;
