import { useState, useEffect, useRef } from 'react';
import { Save, X, Video, FileText, Text, FileQuestionMark } from 'lucide-react';
import QuizBuilder from './QuizBuilder';
import FileUploader from '../FileUploader';
import { updateLesson } from '../../api/lesson';
import VideoPlayer from '../VideoPlayer';
import { createCompleteQuiz, getQuizDataById, deleteQuizById } from '../../api/quiz';

const EditLessonContent = ({ lesson, onSave, onCancel }) => {
  const fileUploaderRef = useRef();
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'TEXT',
    order: 1,
    status: 'DRAFT',
    textContent: '',
    contentUrl: null,
    contentId: null,
    quizId: null,
  });
  const [quizData, setQuizData] = useState(null); // UI-only draft data
  const [selectedFile, setSelectedFile] = useState(null); // UI-only selected file
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        contentType: lesson.contentType || 'TEXT',
        order: lesson.order || 1,
        status: lesson.status || 'DRAFT',
        textContent: lesson.textContent || '',
        contentUrl: lesson.contentUrl ?? null,
        contentId: lesson.contentId ?? null,
        quizId: lesson.quizId ?? null,
      });
      fetchQuizData(lesson.quizId);
      setSelectedFile(null);
    }
  }, [lesson]);

  const fetchQuizData = async (quizId) => {
    try {
      const data = await getQuizDataById(quizId);
      setQuizData(data);
    } catch (error) {
      console.error('Failed to fetch quiz data:', error);
      setQuizData(null);
    }
  };

  // Compute preview URL for VIDEO/PDF from selected file or existing contentUrl
  useEffect(() => {
    if (formData.contentType !== 'VIDEO' && formData.contentType !== 'PDF') {
      setPreviewUrl(null);
      return;
    }
    let url = null;
    if (selectedFile) {
      url = URL.createObjectURL(selectedFile);
    } else if (formData.contentUrl) {
      url = formData.contentUrl;
    }
    setPreviewUrl(url);
    return () => {
      if (url && selectedFile) URL.revokeObjectURL(url);
    };
  }, [selectedFile, formData.contentUrl, formData.contentType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSaving(true);

    try {
      // Prepare base payload
      const payload = {
        title: formData.title,
        contentType: formData.contentType,
        order: Number(formData.order) || 1,
        status: formData.status,
        textContent: formData.contentType === 'TEXT' ? (formData.textContent || '') : null,
        contentUrl: formData.contentType !== 'TEXT' ? (formData.contentUrl ?? null) : null,
        contentId: formData.contentType !== 'TEXT' ? (formData.contentId ?? null) : null,
        quizId: formData.contentType === 'QUIZ' ? (formData.quizId ?? null) : null,
      };

      // Upload file first for VIDEO/PDF if a new file is selected
      if ((formData.contentType === 'VIDEO' || formData.contentType === 'PDF') && fileUploaderRef.current?.getSelectedFile()) {
        const uploaded = await fileUploaderRef.current.uploadFile();
        payload.contentUrl = uploaded?.fileUrl || null;
        payload.contentId = uploaded?.id || null;
      }
      if (lesson?.id) payload.id = lesson.id;
      if (lesson?.courseId) payload.courseId = lesson.courseId;

      if (formData.contentType === 'QUIZ' && quizData) {
        quizData.lessonId = lesson.id;

        // If editing existing lesson with a quiz, delete the old quiz first
        if (lesson.quizId !== null) {
          deleteQuizById(lesson.quizId);
        }
        
        const createdQuiz = await createCompleteQuiz(quizData);
        payload.quizId = createdQuiz.id || null;
      }

      onSave && onSave(payload);

    } catch (err) {
      setSubmitError(err.message || 'Failed to save lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file || null);
  };

  const handleQuizChange = (quizData) => {
    setQuizData(quizData || null);
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
            {['TEXT', 'VIDEO', 'PDF', 'QUIZ'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('contentType', type)}
                className={`p-4 border rounded-lg transition-all ${
                  formData.contentType === type
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
          {formData.contentType === 'TEXT' && (
            <div>
              <textarea
                value={formData.textContent}
                onChange={(e) => handleChange('textContent', e.target.value)}
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
          {formData.contentType === 'VIDEO' && (
            <div>
              <FileUploader
                ref={fileUploaderRef}
                allowedTypes={['VIDEO']}
                onFileSelect={handleFileSelect}
                label=""
              />
              {previewUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </label>
                  <VideoPlayer
                    src={previewUrl}
                    className="w-full max-h-[480px]"
                    disableDownload
                    disableRightClick
                  />
                </div>
              )}
            </div>
          )}

          {/* PDF Content */}
          {formData.contentType === 'PDF' && (
            <div>
              <FileUploader
                ref={fileUploaderRef}
                allowedTypes={['PDF']}
                onFileSelect={handleFileSelect}
                label=""
              />
              {previewUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </label>
                  <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUIZ Content */}
          {formData.contentType === 'QUIZ' && (
            <div>
              <QuizBuilder 
                initialQuizData={quizData}
                onQuizChange={handleQuizChange}
              />
            </div>
          )}
          
        </div>

        {/* Form Actions */}
        {submitError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {submitError}
          </div>
        )}
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
            disabled={isSaving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Lesson'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLessonContent;