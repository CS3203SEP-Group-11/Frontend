import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext, useMemo } from 'react'
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PricingPage from './pages/PricingPage'
import ShoppingCartPage from './pages/ShoppingCartPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute, { GuestOnlyRoute } from './routes/ProtectedRoute'

// Theme Context for dark mode
const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const themeValue = useMemo(() => ({
    isDarkMode,
    toggleTheme
  }), [isDarkMode])

  return (
    <ThemeContext.Provider value={themeValue}>
      <AuthProvider>
        <div className={isDarkMode ? 'dark' : ''}>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={
                  <GuestOnlyRoute>
                    <LoginPage />
                  </GuestOnlyRoute>
                } />
                <Route path="/signup" element={
                  <GuestOnlyRoute>
                    <SignupPage />
                  </GuestOnlyRoute>
                } />
                <Route path="/forgot-password" element={
                  <GuestOnlyRoute>
                    <ForgotPasswordPage />
                  </GuestOnlyRoute>
                } />

                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/course/:id" element={<CourseDetailPage />} />

                <Route path="/student-dashboard" element={
                  <ProtectedRoute allowedRoles={["USER", "INSTRUCTOR"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/instructor-dashboard" element={
                  <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/pricing" element={<PricingPage />} />
              </Routes>
            </Router>
          </div>
        </div>
      </AuthProvider>
    </ThemeContext.Provider>
  )
}

export default App
