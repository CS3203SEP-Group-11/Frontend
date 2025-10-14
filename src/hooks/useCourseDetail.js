import { useState, useEffect } from 'react';
import { getCourseById } from '../api/course';
import { getInstructorById } from '../api/user';

const COURSE_CACHE_KEY = 'course_detail_cache_v1';
const CACHE_TTL = 3 * 60 * 1000;

const courseDetailCache = {
  get(courseId) {
    try {
      const cached = localStorage.getItem(`${COURSE_CACHE_KEY}_${courseId}`);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      
      if (Date.now() - timestamp > CACHE_TTL) {
        this.clear(courseId);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Error reading course detail cache:', error);
      return null;
    }
  },

  set(courseId, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`${COURSE_CACHE_KEY}_${courseId}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error setting course detail cache:', error);
    }
  },

  clear(courseId) {
    try {
      localStorage.removeItem(`${COURSE_CACHE_KEY}_${courseId}`);
    } catch (error) {
      console.warn('Error clearing course detail cache:', error);
    }
  }
};

export const useCourseDetail = (courseId) => {
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = async (useCache = true) => {
    try {
      setError(null);
      
      // Try to get from cache first
      if (useCache && courseId) {
        const cachedData = courseDetailCache.get(courseId);
        if (cachedData) {
          setCourse(cachedData.course);
          setInstructor(cachedData.instructor);
          setLoading(false);
          
          // Still fetch fresh data in background
          try {
            const freshCourseData = await getCourseById(courseId);
            const freshInstructorData = await getInstructorById(freshCourseData.instructorId);
            
            setCourse(freshCourseData);
            setInstructor(freshInstructorData);
            courseDetailCache.set(courseId, {
              course: freshCourseData,
              instructor: freshInstructorData
            });
          } catch (bgError) {
            console.warn('Background refresh failed:', bgError);
          }
          return;
        }
      }
      
      // No cache, fetch fresh data
      if (!courseId) return;
      
      setLoading(true);
      const courseData = await getCourseById(courseId);
      const instructorData = await getInstructorById(courseData.instructorId);
      
      setCourse(courseData);
      setInstructor(instructorData);
      courseDetailCache.set(courseId, {
        course: courseData,
        instructor: instructorData
      });
      
    } catch (err) {
      console.error('Failed to fetch course:', err);
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const refreshCourse = () => {
    if (courseId) {
      courseDetailCache.clear(courseId);
      fetchCourseData(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  return {
    course,
    instructor,
    loading,
    error,
    refreshCourse
  };
};