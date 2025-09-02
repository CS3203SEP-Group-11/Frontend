import { useState, useEffect, useRef } from 'react';
import { Save, X, Video, FileText, Text, FileQuestionMark } from 'lucide-react';
import QuizBuilder from './QuizBuilder';
import FileUploader from '../FileUploader';

const EditLessonContent = ({ lesson, onSave, onCancel }) => {
  const fileUploaderRef = useRef();
  const [formData, setFormData] = useState({
    title: '',
    type: 'VIDEO',
    order: 1,
    status: 'DRAFT',
    content: '',
    fileUrl: '',
    quizData: null,
    uploadedFile: null
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        type: lesson.type || 'VIDEO',
        order: lesson.order || 1,
        status: lesson.status || 'DRAFT',
        content: lesson.content || '',
        fileUrl: lesson.fileUrl || '',
        quizData: lesson.quizData || null,
        uploadedFile: lesson.uploadedFile || null
      });
    }
  }, [lesson]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      uploadedFile: file,
      fileName: file?.name || ''
    }));
  };

  const handleQuizChange = (quizData) => {
    setFormData(prev => ({
      ...prev,
      quizData: quizData
    }));
  };

  const getLessonTypeIcon = (type) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
      case 'TEXT': return <Text className="w-5 h-5 text-green-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'QUIZ': return <FileQuestionMark className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {lesson?.id ? 'Edit Lesson' : 'Create New Lesson'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lesson Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter lesson title"
            required
          />
        </div>

        {/* Lesson Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lesson Type
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['VIDEO', 'TEXT', 'PDF', 'QUIZ'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('type', type)}
                className={`p-4 border rounded-lg transition-all ${
                  formData.type === type
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {getLessonTypeIcon(type)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lesson Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => handleChange('order', parseInt(e.target.value) || 1)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            {['DRAFT', 'PUBLISHED'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    formData.status === status
                      ? status === 'PUBLISHED'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">{status}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Content Section - Conditional based on lesson type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lesson Content
          </label>
          
          {/* TEXT Content */}
          {formData.type === 'TEXT' && (
            <div>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
                placeholder="Enter your lesson content here..."
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                You can use this area to write detailed lesson content, instructions, or explanations.
              </p>
            </div>
          )}

          {/* VIDEO Content */}
          {formData.type === 'VIDEO' && (
            <div>
              <FileUploader
                ref={fileUploaderRef}
                allowedTypes={['VIDEO']}
                onFileSelect={handleFileSelect}
                label=""
              />
            </div>
          )}

          {/* PDF Content */}
          {formData.type === 'PDF' && (
            <div>
              <FileUploader
                ref={fileUploaderRef}
                allowedTypes={['PDF']}
                onFileSelect={handleFileSelect}
                label=""
              />
            </div>
          )}

          {/* QUIZ Content */}
          {formData.type === 'QUIZ' && (
            <div>
              <QuizBuilder 
                initialQuizData={formData.quizData}
                onQuizChange={handleQuizChange}
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Lesson</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLessonContent;