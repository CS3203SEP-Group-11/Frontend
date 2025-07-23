const ProgressBar = ({ 
  progress, 
  className = "", 
  showPercentage = true,
  size = "medium" 
}) => {
  const sizeClasses = {
    small: "h-1",
    medium: "h-2",
    large: "h-3"
  }

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full transition-all duration-300 ease-out ${sizeClasses[size]}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
