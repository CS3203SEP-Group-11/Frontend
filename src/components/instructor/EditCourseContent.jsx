import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import FileUploader from '../FileUploader';
import LessonManager from './LessonManager';

import { getCourseById, updateCourse, updateCourseStatus, getAllCategories } from '../../api/course';
import { deleteFile } from '../../api/files';

const EditCourseContent = ({ courseId, onBack }) => {
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [lessons, setLessons] = useState([]);
  const fileUploaderRef = useRef();

  // Form states
  const [categoryInput, setCategoryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      fetchCategories();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
      setCategoryInput(courseData.category || '');
      
      // Initialize lessons from course data or create sample structure
      setLessons(courseData.lessons || [
        {
          id: 1,
          title: 'Introduction to the Course',
          description: 'Overview of what you will learn',
          type: 'video',
          duration: 10,
          order: 1
        }
      ]);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to fetch course data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        'Web Development',
        'Data Science',
        'Design',
        'AI & ML',
        'Marketing',
        'Cloud Computing'
      ]);
    }
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);
    
    if (value.trim()) {
      const filtered = categories.filter(category => {
        const categoryName = typeof category === 'string' ? category : category.name;
        return categoryName.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCategory = (category) => {
    const categoryName = typeof category === 'string' ? category : category.name;
    setCategoryInput(categoryName);
    setShowSuggestions(false);
  };

  const handleCategoryBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Upload new thumbnail if selected
      let uploadedFileData = null;
      if (fileUploaderRef.current?.getSelectedFile()) {
        uploadedFileData = await fileUploaderRef.current.uploadFile();
        
        // Delete old thumbnail if it exists and a new one was uploaded
        if (uploadedFileData && course?.thumbnailId) {
          try {
            await deleteFile(course.thumbnailId);
            console.log('Old thumbnail deleted successfully');
          } catch (err) {
            console.warn('Failed to delete old thumbnail:', err.message);
            // Don't fail the whole operation if old image deletion fails
          }
        }
      }

      const formData = new FormData(e.target);
      
      // Parse tags
      const tagsString = formData.get('tags') || '';
      const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      // Prepare updated course data
      const updatedCourseData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: categoryInput,
        tags: tags,
        language: formData.get('language'),
        thumbnailUrl: uploadedFileData?.fileUrl || course.thumbnailUrl,
        thumbnailId: uploadedFileData?.id || course.thumbnailId,
        priceAmount: parseFloat(formData.get('price')),
        priceCurrency: "USD",
        level: formData.get('level').toUpperCase(),
        duration: parseInt(formData.get('duration')),
        lessons: lessons // Include lessons in the course data
      };

      await updateCourse(courseId, updatedCourseData);
      
      // Update local state
      setCourse(prev => ({ ...prev, ...updatedCourseData }));
      
      alert('Course updated successfully!');
      
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleBackToLessons = () => {
    setEditingLessonId(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      
      await updateCourseStatus(courseId, newStatus);
      
      // Update the course status in local state
      setCourse(prev => ({ ...prev, status: newStatus }));
      
      alert(`Course status updated to ${newStatus.toLowerCase()}`);
      
    } catch (err) {
      console.error('Error updating course status:', err);
      alert(err.message || 'Failed to update course status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loading Course...</h1>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Error Loading Course</h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchCourseData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Course</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'details'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
              activeTab === 'lessons'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span>Lessons</span>
            <span className={`w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center ${
              activeTab === 'lessons'
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
            }`}>
              {lessons.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Status Information */}
      {updatingStatus && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Updating course status...
          </p>
        </div>
      )}

      {/* Course Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSaveCourse} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title *</label>
                <input 
                  name="title"
                  type="text" 
                  defaultValue={course.title}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="category"
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
                    onFocus={() => categoryInput.trim() && setShowSuggestions(true)}
                    onBlur={handleCategoryBlur}
                    placeholder="Type to search categories or enter new one"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  
                  {showSuggestions && filteredCategories.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCategories.map((category, index) => {
                        const categoryName = typeof category === 'string' ? category : category.name;
                        return (
                          <div
                            key={index}
                            onMouseDown={() => selectCategory(category)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                          >
                            {categoryName}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={course.tags?.join(', ') || ''}
                  placeholder="e.g., JavaScript, React, Frontend"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language *</label>
                <select 
                  name="language"
                  defaultValue={course.language}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Description *</label>
              <textarea 
                name="description"
                rows={4} 
                defaultValue={course.description}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($) *</label>
                <input 
                  name="price"
                  type="number" 
                  step="0.01"
                  min="0"
                  defaultValue={course.price?.amount || 0}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level *</label>
                <select 
                  name="level"
                  defaultValue={course.level?.toLowerCase()}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (hours) *</label>
                <input 
                  name="duration"
                  type="number" 
                  min="1"
                  defaultValue={course.duration}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Course Status Selector */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={course.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(course.status)}`}>
                {course.status}
              </span>
            </div>

            {/* Status Guide */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded text-xs font-medium">
                    DRAFT
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Course is being prepared and not visible to students
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded text-xs font-medium">
                    PUBLISHED
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Course is live and available for student enrollment
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded text-xs font-medium">
                    ARCHIVED
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Course is hidden from catalog but accessible to enrolled students
                  </span>
                </div>
              </div>
            </div>

            <div>
              <FileUploader
                ref={fileUploaderRef}
                allowedTypes={['IMAGE']}
                label="Course Thumbnail (leave empty to keep current)"
                className="w-full"
              />
              {course.thumbnailUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current thumbnail:</p>
                  <img src={course.thumbnailUrl} alt="Current thumbnail" className="w-32 h-20 object-cover rounded-lg" />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Note: Uploading a new image will replace the current thumbnail
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <LessonManager
          courseId={courseId}
          initialLessons={lessons}
        />
      )}
    </div>
  );
};

export default EditCourseContent;
