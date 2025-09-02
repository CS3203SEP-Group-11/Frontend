import { useState } from 'react';
import { Plus, Trash2, Edit3, Video, FileText, Text, FileQuestionMark, ArrowUp, ArrowDown } from 'lucide-react';
import EditLessonContent from './EditLessonContent';

const LessonManager = ({ courseId, initialLessons = [] }) => {
  const [lessons, setLessons] = useState(initialLessons);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: 'New Lesson',
      type: 'VIDEO',
      duration: 0,
      order: lessons.length + 1,
      status: 'draft'
    };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    setEditingLesson(newLesson);
    setIsEditing(true);
  };

  const onEditLesson = (lessonId, isNewLesson = false) => {
    const lesson = lessons.find(l => l.id === lessonId);
    setEditingLesson(lesson);
    setIsEditing(true);
  };

  const handleSaveLesson = (lessonData) => {
    const updatedLessons = lessons.map(lesson =>
      lesson.id === editingLesson.id
        ? { ...lesson, ...lessonData }
        : lesson
    );
    setLessons(updatedLessons);
    setIsEditing(false);
    setEditingLesson(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingLesson(null);
  };

  const removeLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
      setLessons(updatedLessons);
    }
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
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
      case 'TEXT': return <Text className="w-5 h-5 text-green-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'QUIZ': return <FileQuestionMark className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getContentTypeBadge = (type) => {
    const styles = {
      VIDEO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      TEXT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      PDF: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      QUIZ: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return styles[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Show EditLessonContent when editing */}
      {isEditing && (
        <EditLessonContent
          lesson={editingLesson}
          onSave={handleSaveLesson}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Show lesson manager when not editing */}
      {!isEditing && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Lessons</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Lesson Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Content Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {lessons.map((lesson, index) => (
                      <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {index + 1}
                            </span>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => moveLesson(lesson.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveLesson(lesson.id, 'down')}
                                disabled={index === lessons.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {getLessonIcon(lesson.type)}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {lesson.title || 'Untitled Lesson'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContentTypeBadge(lesson.type)}`}>
                            {lesson.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            lesson.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {lesson.status || 'draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onEditLesson(lesson.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => removeLesson(lesson.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Footer */}
          {lessons.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  Total: {lessons.length} lessons
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Published: {lessons.filter(l => l.status === 'published').length} • 
                  Draft: {lessons.filter(l => l.status === 'draft' || !l.status).length}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LessonManager;