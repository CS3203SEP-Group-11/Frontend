import { useState } from 'react';
import { Plus, Trash2, Edit3, Video, FileText, Text, FileQuestionMark } from 'lucide-react';

const LessonManager = ({ courseId, initialLessons = [], onLessonsChange }) => {
  const [lessons, setLessons] = useState(initialLessons);

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: '',
      description: '',
      type: 'video',
      duration: 0,
      order: lessons.length + 1
    };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    onLessonsChange && onLessonsChange(updatedLessons);
  };

  const updateLesson = (lessonId, field, value) => {
    const updatedLessons = lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
    onLessonsChange && onLessonsChange(updatedLessons);
  };

  const removeLesson = (lessonId) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
    setLessons(updatedLessons);
    onLessonsChange && onLessonsChange(updatedLessons);
  };

  const moveLesson = (lessonId, direction) => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === lessons.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedLessons = [...lessons];
    [updatedLessons[currentIndex], updatedLessons[newIndex]] = [updatedLessons[newIndex], updatedLessons[currentIndex]];
    
    // Update order numbers
    updatedLessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });

    setLessons(updatedLessons);
    onLessonsChange && onLessonsChange(updatedLessons);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-4 h-4 text-blue-500" />;
      case 'TEXT': return <Text className="w-4 h-4 text-green-500" />;
      case 'PDF': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'QUIZ': return <FileQuestionMark className="w-4 h-4 text-yellow-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTotalDuration = () => {
    return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Lessons</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {lessons.length} lessons
          </p>
        </div>
        <button 
          onClick={addLesson}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lesson</span>
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No lessons yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start building your course by adding lessons</p>
          <button 
            onClick={addLesson}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add First Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    {getLessonIcon(lesson.type)}
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">{lesson.type}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Move buttons */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveLesson(lesson.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveLesson(lesson.id, 'down')}
                      disabled={index === lessons.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeLesson(lesson.id)}
                    className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    title="Delete lesson"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                    placeholder="Enter lesson title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content Type
                  </label>
                  <select
                    value={lesson.type}
                    onChange={(e) => updateLesson(lesson.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="VIDEO">VIDEO</option>
                    <option value="TEXT">TEXT</option>
                    <option value="PDF">PDF</option>
                    <option value="QUIZ">QUIZ</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={lesson.description}
                    onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                    placeholder="Enter lesson description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={lesson.status || 'draft'}
                      onChange={(e) => updateLesson(lesson.id, 'status', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lesson preview/summary */}
              {lesson.title && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Lesson {index + 1}: {lesson.title}
                    </span>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{lesson.duration || 0} min</span>
                      <span className={`px-2 py-1 rounded-full ${
                        lesson.status === 'published' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {lesson.status || 'draft'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {lessons.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Course Structure Summary
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonManager;
