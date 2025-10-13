import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import { getAllCourses } from '../api/course'

const LandingPage = () => {
  const navigate = useNavigate()
  const [featuredCourses, setFeaturedCourses] = useState([])
  
  useEffect(() => {
      const fetchCourses = async () => {
        try {
          const data = await getAllCourses();
          setFeaturedCourses(data);
        } catch (err) {
          console.error('Failed to fetch courses:', err.message);
        }
      };
      fetchCourses();
    }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span
                className="inline-block animate-fade-in"
                style={{ animationDuration: '1.2s' }}
              >
                Master New Skills 📖🎓📈
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Transform Your Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Join thousands of learners advancing their careers with our expert-led courses. 
              Learn at your own pace, earn verified certificates, and unlock new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose LevelUp?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Learn at Your Pace",
                description: "Study anytime, anywhere with lifetime access to course materials"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Verified Certificates",
                description: "Earn industry-recognized certificates to boost your career"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Instructors",
                description: "Learn from industry professionals with real-world experience"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Comprehensive Content",
                description: "Access to thousands of hours of high-quality video content"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600 dark:text-primary-400">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover our most popular courses designed to help you master in-demand skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="relative">
                <CourseCard 
                  course={course} 
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
