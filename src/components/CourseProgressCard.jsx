import { Clock, Play } from 'lucide-react'

const CourseProgressCard = ({ 
  course, 
  showProgress = false, 
  onContinue = null,
  onCourseSelect = null,
  className = "",
}) => {
  const {
    title = 'Untitled Course',
    image = '/api/placeholder/400/200',
    progress = 0
  } = course || {}

  // Normalize progress: round to integer and clamp between 0 and 100
  const progressNumber = Number(progress ?? 0)
  const normalizedProgress = Math.min(
    100,
    Math.max(0, Number.isFinite(progressNumber) ? Math.round(progressNumber) : 0)
  )

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer group ${className}`}
      onClick={() => onCourseSelect && onCourseSelect(course)}
    >
      {/* Course Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-28 sm:h-32"
        />
        {showProgress && (
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
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - normalizedProgress / 100)}`}
                    className="text-primary-600 transition-all duration-300"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                  {normalizedProgress}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className={'p-3 sm:p-4'}>
        <div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {title}
              </h3>
            </div>

            {showProgress ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{normalizedProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${normalizedProgress}%` }}
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
              <div></div>
            )}
        </div>
      </div>
    </div>
  )
}

export default CourseProgressCard