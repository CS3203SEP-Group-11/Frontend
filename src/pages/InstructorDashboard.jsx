import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '../components/instructor/Sidebar';
import DashboardContent from '../components/instructor/DashboardContent';
import CoursesContent from '../components/instructor/CoursesContent';
import CreateCourseContent from '../components/instructor/CreateCourseContent';
import SubmissionsContent from '../components/instructor/SubmissionsContent';
import ProfileContent from '../components/instructor/ProfileContent';
import { useTheme } from '../App';
import { instructorUser, courses } from '../data/dummyData';

const InstructorDashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filter instructor's courses
  const instructorCourses = courses.filter(course => 
    instructorUser.createdCourses?.includes(course.id)
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'courses':
        return <CoursesContent setActiveTab={setActiveTab} />;
      case 'create':
        return <CreateCourseContent />;
      case 'submissions':
        return <SubmissionsContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <DashboardContent />;
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

export default InstructorDashboard
