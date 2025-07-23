import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ""
}) => {
  const pages = []
  const maxVisiblePages = 5
  const isMobile = window.innerWidth < 640 // Simple mobile detection

  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  // On mobile, show fewer pages
  if (isMobile) {
    const mobileMaxPages = 3
    startPage = Math.max(1, currentPage - Math.floor(mobileMaxPages / 2))
    endPage = Math.min(totalPages, startPage + mobileMaxPages - 1)
    
    if (endPage - startPage + 1 < mobileMaxPages) {
      startPage = Math.max(1, endPage - mobileMaxPages + 1)
    }
  }

  // Generate page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center space-x-1 sm:space-x-2 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* First page - hide on mobile if not adjacent */}
      {startPage > 1 && !isMobile && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-gray-400 dark:text-gray-600 px-1 text-sm sm:text-base">...</span>
          )}
        </>
      )}

      {/* Current page indicator on mobile */}
      {isMobile && (
        <span className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400">
          {currentPage} / {totalPages}
        </span>
      )}

      {/* Page numbers - hide on mobile, show only adjacent pages */}
      {!isMobile && pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base ${
            page === currentPage
              ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600 shadow-md'
              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page - hide on mobile if not adjacent */}
      {endPage < totalPages && !isMobile && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-400 dark:text-gray-600 px-1 text-sm sm:text-base">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 sm:p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Jump to page input on mobile */}
      {isMobile && totalPages > 5 && (
        <div className="flex items-center space-x-1 ml-2">
          <span className="text-xs text-gray-500">Go to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page)
                }
              }
            }}
            className="w-12 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-center"
          />
        </div>
      )}
    </div>
  )
}

export default Pagination
