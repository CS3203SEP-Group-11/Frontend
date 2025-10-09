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
import { useAuth } from '../context/AuthContext'
import { currentUser, courses } from '../data/dummyData'

const StudentDashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)

  // Fallback (dummy) data, used by components if API is unavailable
  const enrolledCoursesFallback = courses.filter(course => 
    currentUser.enrolledCourses.includes(course.id)
  )
  const completedCoursesFallback = enrolledCoursesFallback.filter(course => 
    currentUser.completedCourses.includes(course.id)
  )
  const inProgressCoursesFallback = enrolledCoursesFallback.filter(course => 
    !currentUser.completedCourses.includes(course.id) && course.progress > 0
  )

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
            onCourseSelect={handleCourseSelect}
            fallbackEnrolledCourses={enrolledCoursesFallback}
            fallbackCompletedCourses={completedCoursesFallback}
            fallbackInProgressCourses={inProgressCoursesFallback}
          />
        );
      case 'courses':
        return (
          <CoursesContent 
            onCourseSelect={handleCourseSelect}
            fallbackEnrolledCourses={enrolledCoursesFallback}
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
            onCourseSelect={handleCourseSelect}
            fallbackEnrolledCourses={enrolledCoursesFallback}
            fallbackCompletedCourses={completedCoursesFallback}
            fallbackInProgressCourses={inProgressCoursesFallback}
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
