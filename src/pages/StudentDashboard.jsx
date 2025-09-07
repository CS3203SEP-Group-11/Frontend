import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '../components/student/Sidebar';
import DashboardContent from '../components/student/DashboardContent';
import CoursesContent from '../components/student/CoursesContent';
import CertificatesContent from '../components/student/CertificatesContent';
import ProfileContent from '../components/student/ProfileContent';
import CourseDetailPage from '../components/student/CourseDetailPage';
import LessonContentPage from '../components/student/LessonContentPage';
import NotificationContent from '../components/student/NotificationContent';
import { useTheme } from '../App'
import { 
  currentUser, 
  courses
} from '../data/dummyData'

const StudentDashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ category: null, level: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const coursesPerPage = 6

  // Filter user's enrolled courses
  const enrolledCourses = courses.filter(course => 
    currentUser.enrolledCourses.includes(course.id)
  )

  // Apply search and filters
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !filters.category || course.category === filters.category
    const matchesLevel = !filters.level || course.level === filters.level
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage)

  // Get unique categories from enrolled courses
  const categories = [...new Set(enrolledCourses.map(course => course.category))]

  // Filter completed courses
  const completedCourses = enrolledCourses.filter(course => 
    currentUser.completedCourses.includes(course.id)
  )

  // Filter in-progress courses
  const inProgressCourses = enrolledCourses.filter(course => 
    !currentUser.completedCourses.includes(course.id) && course.progress > 0
  )

  // Filter not started courses
  const notStartedCourses = enrolledCourses.filter(course => 
    !currentUser.completedCourses.includes(course.id) && course.progress === 0
  )

  const continueLearning = (course) => {
    console.log('Continue learning:', course.title);
    setSelectedCourse(course);
    // This would typically navigate to the course player
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToCoursesDetail = () => {
    setSelectedLesson(null);
  };

  const handleLessonComplete = (lesson) => {
    console.log('Lesson completed:', lesson.title);
    // In a real app, this would update the lesson completion status
    // and possibly navigate to the next lesson
  };

  const renderContent = () => {
    // If a lesson is selected, show the lesson content page
    if (selectedLesson && selectedCourse) {
      return (
        <LessonContentPage
          lesson={selectedLesson}
          course={selectedCourse}
          onBack={handleBackToCoursesDetail}
          onComplete={handleLessonComplete}
        />
      );
    }

    // If a course is selected, show the course detail page
    if (selectedCourse) {
      return (
        <CourseDetailPage
          course={selectedCourse}
          onBack={handleBackToCourses}
          onLessonSelect={handleLessonSelect}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContent
            inProgressCourses={inProgressCourses}
            completedCourses={completedCourses}
            enrolledCourses={enrolledCourses}
            onCourseSelect={handleCourseSelect}
          />
        );
      case 'courses':
        return (
          <CoursesContent
            paginatedCourses={paginatedCourses}
            filteredCourses={filteredCourses}
            enrolledCourses={enrolledCourses}
            inProgressCourses={inProgressCourses}
            completedCourses={completedCourses}
            notStartedCourses={notStartedCourses}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSearchTerm={setSearchTerm}
            setFilters={setFilters}
            categories={categories}
            navigate={navigate}
            filters={filters}
            searchTerm={searchTerm}
            continueLearning={continueLearning}
            onCourseSelect={handleCourseSelect}
          />
        );
      case 'certificates':
        return <CertificatesContent setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfileContent />;
      case 'notifications':
        return <NotificationContent />;
      default:
        return (
          <DashboardContent
            inProgressCourses={inProgressCourses}
            completedCourses={completedCourses}
            enrolledCourses={enrolledCourses}
            onCourseSelect={handleCourseSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedCourse={setSelectedCourse}
          setSelectedLesson={setSelectedLesson}
        />
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
            <Menu className="w-6 h-6" />
          </button>
        </div>

          {/* Page Content */}
          <main className="p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
