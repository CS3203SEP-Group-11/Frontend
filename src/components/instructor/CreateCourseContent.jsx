import { useRef, useState, useEffect } from "react";
import FileUploader from "../FileUploader";
import { getAllCategories, createCourse } from "../../api/course";

const CreateCourseContent = () => {
  const fileUploaderRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set some default categories if API fails
      setCategories([]);
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
    // Delay hiding suggestions to allow for clicking
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Upload file if one is selected
      let uploadedFileData = null;
      if (fileUploaderRef.current?.getSelectedFile()) {
        console.log('Uploading file...');
        uploadedFileData = await fileUploaderRef.current.uploadFile();
        console.log('File uploaded successfully:', uploadedFileData);
      }

      // Collect form data
      const formData = new FormData(e.target);
      
      // Parse tags from comma-separated string
      const tagsString = formData.get('tags') || '';
      const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      // Format data according to API structure
      const courseData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: categoryInput, // Use state value directly
        tags: tags,
        language: formData.get('language') || 'English',
        thumbnailUrl: uploadedFileData?.fileUrl || null,
        thumbnailId: uploadedFileData?.id || null,
        priceAmount: parseFloat(formData.get('price')),
        priceCurrency: "USD",
        level: formData.get('level').toUpperCase(),
        duration: parseInt(formData.get('duration'))
      };

      console.log('Course data to submit:', courseData);
      
      // Make API call to create course
      await createCourse(courseData);
      
      alert('Course created successfully!');
      
      // Reset form and state
      e.target.reset();
      setCategoryInput('');
      setShowSuggestions(false);
      if (fileUploaderRef.current) {
        fileUploaderRef.current.clearFile();
      }
      
    } catch (error) {
      console.error('Error creating course:', error);
      setSubmitError(error.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title *</label>
              <input 
                name="title"
                type="text" 
                placeholder="Enter course title" 
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

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="e.g., JavaScript, React, Frontend"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select 
                name="language"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a language</option>
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
              placeholder="Describe what students will learn in this course" 
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
                placeholder="99.99" 
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level *</label>
              <select 
                name="level"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration *</label>
              <input 
                name="duration"
                type="text" 
                placeholder="e.g., 40 hours" 
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              />
            </div>
          </div>
          <div>
            <FileUploader
              ref={fileUploaderRef}
              lockedTypes={['DOCX','PDF','VIDEO']}
              label="Course Thumbnail"
              className="w-full"
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseContent;
