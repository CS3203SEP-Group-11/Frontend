import { BookOpen } from 'lucide-react';
import CourseProgressCard from '../CourseProgressCard';
import Pagination from '../Pagination';
import SearchAndFilter from '../SearchAndFilter';
import Breadcrumb from '../Breadcrumb';

const CoursesContent = ({
  paginatedCourses,
  filteredCourses,
  enrolledCourses,
  inProgressCourses,
  completedCourses,
  notStartedCourses,
  totalPages,
  currentPage,
  setCurrentPage,
  setSearchTerm,
  setFilters,
  categories,
  navigate,
  filters,
  searchTerm,
  continueLearning,
  onCourseSelect
}) => (
  <div className="space-y-8">
    <Breadcrumb items={[{ label: 'My Courses' }]} />
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Browse More Courses</button>
    </div>
    <SearchAndFilter onSearch={setSearchTerm} onFilter={setFilters} categories={categories} placeholder="Search your courses..." />
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <p>Showing {paginatedCourses.length} of {filteredCourses.length} courses</p>
      {filteredCourses.length !== enrolledCourses.length && (
        <button onClick={() => { setSearchTerm(''); setFilters({ category: null, level: null }); setCurrentPage(1); }} className="text-primary-600 dark:text-primary-400 hover:underline">Clear all filters</button>
      )}
    </div>
    {paginatedCourses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCourses.map((course) => (
          <CourseProgressCard key={course.id} course={course} showProgress={true} onContinue={continueLearning} onCourseSelect={onCourseSelect} />
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
                <CourseProgressCard key={course.id} course={course} showProgress={true} onContinue={continueLearning} onCourseSelect={onCourseSelect} />
              ))}
            </div>
          </div>
        )}
        {completedCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Completed ({completedCourses.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.slice(0, 3).map((course) => (
                <CourseProgressCard key={course.id} course={course} showProgress={true} onCourseSelect={onCourseSelect} />
              ))}
            </div>
          </div>
        )}
        {notStartedCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Not Started ({notStartedCourses.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notStartedCourses.slice(0, 3).map((course) => (
                <CourseProgressCard key={course.id} course={course} showProgress={false} onCourseSelect={onCourseSelect} />
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

export default CoursesContent;
