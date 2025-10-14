import { useState, useEffect } from 'react';
import { getAllCourses } from '../api/course';
import { courseCache } from '../utils/courseCache';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async (useCache = true) => {
    try {
      setError(null);
      
      // Try to get from cache first if useCache is true
      if (useCache) {
        const cachedCourses = courseCache.get();
        if (cachedCourses) {
          setCourses(cachedCourses);
          setLoading(false);
          
          // Still fetch fresh data in background
          try {
            const freshCourses = await getAllCourses();
            setCourses(freshCourses);
            courseCache.set(freshCourses);
          } catch (bgError) {
            console.warn('Background refresh failed:', bgError);
          }
          return;
        }
      }
      
      // No cache or cache disabled, fetch fresh data
      setLoading(true);
      const freshCourses = await getAllCourses();
      setCourses(freshCourses);
      courseCache.set(freshCourses);
      
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const refreshCourses = () => {
    courseCache.clear();
    fetchCourses(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    refreshCourses,
    setCourses
  };
};