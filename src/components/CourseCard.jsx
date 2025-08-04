import { Star, Clock, Users, Play } from 'lucide-react'

const CourseCard = ({ 
  course, 
  showProgress = false, 
  onContinue = null,
  onCourseSelect = null,
  className = "",
  viewMode = "grid" // "grid" or "list"
}) => {
  const {
    title,
    instructor,
    rating,
    students,
    price,
    duration,
    level,
    image,
    description,
    progress = 0
  } = course

  const isListView = viewMode === "list" || className.includes("flex-row")

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer group ${className}`}
      onClick={() => onCourseSelect && onCourseSelect(course)}
    >
      {/* Course Image */}
      <div className={`relative ${isListView ? 'w-20 sm:w-32 flex-shrink-0' : ''}`}>
        <img
          src={image}
          alt={title}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isListView ? 'w-full h-full' : 'w-full h-28 sm:h-32'}`}
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full shadow-lg">
            {level}
          </span>
        </div>
        {showProgress && progress > 0 && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200 dark:text-gray-600"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                    className="text-primary-600 transition-all duration-300"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className={`${isListView ? 'flex-1 flex items-center justify-between p-2 sm:p-4' : 'p-3 sm:p-4'}`}>
        {isListView ? (
          // Linear List Layout
          <>
            <div className="flex-1 min-w-0 pr-2 sm:pr-4">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                by {instructor}
              </p>
            </div>
            
            <div className="hidden sm:flex items-center space-x-3 lg:space-x-6 flex-shrink-0 ml-2 mr-2 sm:ml-4">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">{rating}</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                <span className="text-xs sm:text-sm text-gray-500">{students.toLocaleString()}</span>
              </div>
              
              <div className="hidden lg:flex items-center space-x-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                <span className="text-xs sm:text-sm text-gray-500">{duration}</span>
              </div>
              
              <span className="hidden xl:inline px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                {level}
              </span>
            </div>
              
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                ${price}
              </span>
              <button className="px-2 py-1 sm:px-4 sm:py-2 bg-primary-600 text-white text-xs sm:text-sm rounded-lg hover:bg-primary-700 transition-all duration-200 hover:scale-105 active:scale-95">
                Enroll
              </button>
            </div>
          </>
        ) : (
          // Grid Layout (existing structure)
          <div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 sm:mb-3 line-clamp-2">
                {description}
              </p>

              <div className="">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                  <span className="truncate">by {instructor}</span>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">{duration}</span>
                      <span className="sm:hidden">{duration.split(' ')[0]}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">{students.toLocaleString()}</span>
                      <span className="sm:hidden">{Math.round(students/1000)}k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showProgress && progress > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {onContinue && (
                  <button
                    onClick={() => onContinue(course)}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Continue Learning</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  ${price}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onContinue) onContinue(course)
                  }}
                  className="bg-primary-600 text-white py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-primary-700 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
                >
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCard
