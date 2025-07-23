import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 overflow-x-auto">
      <Link 
        to="/" 
        className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded"
        aria-label="Home"
      >
        <Home className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600" />
          {item.href ? (
            <Link 
              to={item.href}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 active:scale-95 px-1 py-0.5 rounded whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium px-1 py-0.5 whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
