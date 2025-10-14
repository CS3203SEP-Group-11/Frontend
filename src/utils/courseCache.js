const CACHE_KEY = 'courses_cache_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const courseCache = {
  // Get cached courses
  get() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_TTL) {
        this.clear();
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Error reading course cache:', error);
      return null;
    }
  },

  // Set courses in cache
  set(courses) {
    try {
      const cacheData = {
        data: courses,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error setting course cache:', error);
    }
  },

  // Clear cache
  clear() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Error clearing course cache:', error);
    }
  },

  // Check if cache exists and is valid
  isValid() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return false;
      
      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp < CACHE_TTL;
    } catch (error) {
      return false;
    }
  }
};