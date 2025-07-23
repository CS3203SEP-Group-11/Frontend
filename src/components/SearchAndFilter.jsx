import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

const SearchAndFilter = ({ 
  onSearch, 
  onFilter, 
  placeholder = "Search courses...",
  categories = [],
  levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'],
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  useEffect(() => {
    if (onFilter) {
      onFilter({
        category: selectedCategory === 'All Categories' ? null : selectedCategory,
        level: selectedLevel === 'All Levels' ? null : selectedLevel
      })
    }
  }, [selectedCategory, selectedLevel, onFilter])

  const clearSearch = () => {
    setSearchTerm('')
  }

  const resetFilters = () => {
    setSelectedCategory('All Categories')
    setSelectedLevel('All Levels')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar and Filters in One Line */}
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-8 sm:pl-10 pr-10 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-primary-300 dark:hover:border-primary-600 text-sm sm:text-base"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center group"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors group-hover:scale-110" />
            </button>
          )}
        </div>

        {/* Inline Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="min-w-0 sm:min-w-[180px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-primary-300 dark:hover:border-primary-600 text-sm sm:text-base"
            >
              <option>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="min-w-0 sm:min-w-[150px]">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-primary-300 dark:hover:border-primary-600 text-sm sm:text-base"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedCategory !== 'All Categories' || selectedLevel !== 'All Levels') && (
            <button
              onClick={resetFilters}
              className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-all duration-200 whitespace-nowrap hover:scale-105 active:scale-95"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilter
