import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import SearchAndFilter from '../components/SearchAndFilter'
import Pagination from '../components/Pagination'
import Breadcrumb from '../components/Breadcrumb'
import { courses } from '../data/dummyData'
import { Grid, List, Filter, SortDesc, SortAsc } from 'lucide-react'

const CoursesPage = () => {
  const navigate = useNavigate()
  const [filteredCourses, setFilteredCourses] = useState(courses)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ category: null, level: null })
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 12

  // Get unique categories from courses
  const categories = ['All Categories', ...new Set(courses.map(course => course.category))]

  // Filter and sort courses
  useEffect(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = !filters.category || course.category === filters.category
      const matchesLevel = !filters.level || course.level === filters.level
      
      return matchesSearch && matchesCategory && matchesLevel
    })

    // Sort courses
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'students':
          aValue = a.students
          bValue = b.students
          break
        case 'duration':
          aValue = parseInt(a.duration)
          bValue = parseInt(b.duration)
          break
        default:
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCourses(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage)

  const handleEnrollment = (course) => {
    console.log('Enrolling in course:', course.title)
    // Navigate to course details or enrollment page
    navigate('/student-dashboard')
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Discover thousands of courses from expert instructors. Learn new skills, 
            advance your career, and achieve your goals with our comprehensive learning platform.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchAndFilter
            onSearch={setSearchTerm}
            onFilter={setFilters}
            categories={categories}
            placeholder="Search courses, instructors, or topics..."
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Showing {startIndex + 1}-{Math.min(startIndex + coursesPerPage, filteredCourses.length)} of {filteredCourses.length} courses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Sort Options */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-primary-300 dark:hover:border-primary-600"
              >
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="students">Students</option>
                <option value="duration">Duration</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {paginatedCourses.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mb-8'
                : 'space-y-2 sm:space-y-3 mb-8'
            }>
              {paginatedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onContinue={() => handleEnrollment(course)}
                  viewMode={viewMode}
                  className={viewMode === 'list' ? 'flex flex-row h-24 sm:h-32' : ''}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilters({ category: null, level: null })
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default CoursesPage
