import { Star, Clock, Users, BookOpen, Layers, Award, Languages, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ 
  course, 
  onCourseSelect = null,
  className = "",
  viewMode = "grid" // "grid" or "list"
}) => {
  const navigate = useNavigate();
  
  const {
    id,
    title,
    description,
    category,
    language,
    enrollmentCount,
    priceAmount,
    priceCurrency,
    duration,
    ratingAverage,
    ratingCount,
    level,
    thumbnailUrl,
  } = course

  const handleCourseClick = () => {
    if (onCourseSelect) {
      onCourseSelect(course);
    } else {
      navigate(`/course/${id}`);
    }
  };

  const isListView = viewMode === "list" || className.includes("flex-row")

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer group ${isListView ? 'flex flex-row' : ''} ${className}`}
      onClick={handleCourseClick}
    >
      {/* Course Image */}
      <div className={`relative ${isListView ? 'w-24 sm:w-32 md:w-40 flex-shrink-0' : ''}`}>
        <img
          src={thumbnailUrl}
          alt={title}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isListView ? 'w-full h-24 sm:h-32 md:h-40' : 'w-full h-28 sm:h-32'}`}
        />
        {/* Level Badge */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span
            className={`px-2 py-1 text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1 ${
              level === 'BEGINNER'
                ? 'bg-green-600'
                : level === 'INTERMEDIATE'
                ? 'bg-yellow-500'
                : level === 'ADVANCED'
                ? 'bg-red-600'
                : 'bg-gray-500'
            }`}
          >
            <Layers className="w-3 h-3" />
            {level}
          </span>
        </div>
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-2 sm:p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 fill-primary-600" />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className={`${isListView ? 'flex-1 p-3 sm:p-4 flex flex-col justify-between' : 'p-3 sm:p-4'}`}>
        <div className={isListView ? 'flex-1' : ''}>
          <div className={isListView ? 'flex justify-between items-start mb-2' : ''}>
            <div className={isListView ? 'flex-1 mr-4' : ''}>
              <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${isListView ? 'text-sm sm:text-base mb-1' : 'text-base sm:text-lg mb-1 sm:mb-2'} line-clamp-2`}>
                {title}
              </h3>
              {isListView && (
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {category}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    {language}
                  </span>
                </div>
              )}
            </div>
            {isListView && (
              <div className="text-right flex-shrink-0">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {priceAmount ? `${priceCurrency} ${priceAmount}` : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{ratingAverage}</span>
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 ml-1" />
                </div>
              </div>
            )}
          </div>
          
          {!isListView && (
            <>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 sm:mb-3 line-clamp-2">
                {description}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {category}
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {language}
                </span>
              </div>
            </>
          )}
          
    
          <div className={`flex items-center text-sm text-gray-500 dark:text-gray-400 ${isListView ? 'gap-4 flex-wrap' : 'justify-between mb-2 sm:mb-3'}`}>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{enrollmentCount} enrolled</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{duration}h</span>
            </div>
          </div>
          
          {!isListView && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{ratingAverage !== null ? ratingAverage : 'N/A'}</span>
                <Award className="w-4 h-4 text-primary-500 ml-1" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {priceAmount ? `${priceCurrency} ${priceAmount}` : 'Free'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
