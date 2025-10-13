import { ArrowLeft, Play, CheckCircle, Clock, FileText, Video, Text, FileQuestionMark } from 'lucide-react';
import ProgressBar from '../ProgressBar';
import { useEffect, useState } from 'react';
import { getLessonsByCourseId } from '../../api/lesson';
import { requestForCertificate } from '../../api/enrollment';

const CourseDetailPage = ({ course, onBack, onLessonSelect }) => {
  const [lessons, setLessons] = useState([]); // Replace with API data
  const [certificateRequested, setCertificateRequested] = useState(false);
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  useEffect(() => {
    fetchLessons();
  }, [course]);

  const fetchLessons = async () => {
    const courseKey = course?.courseId || course?.id;
    if (!courseKey) {
      setLessons([]);
      return;
    }
    const lessonsData = await getLessonsByCourseId(courseKey);
    console.log('Fetched lessons:', lessonsData);
    const completedIds = new Set((course?.completedLessons || []).map(String));
    const normalized = (lessonsData || []).map((lesson) => ({
      ...lesson,
      isCompleted: completedIds.has(String(lesson.id)),
    }));
    setLessons(normalized);
  }

  const handleCertificateRequest = async () => {
    try {
      const enrollmentId = course?.id || course?.enrollmentId;
      if (!enrollmentId) {
        alert('Unable to request certificate: missing enrollment ID.');
        return;
      }
      await requestForCertificate(enrollmentId);
      setCertificateRequested(true);
      alert('Certificate request submitted successfully.');
    } catch (err) {
      console.error('Failed to request certificate', err);
      alert(
        (err && err.message) || 'Failed to request certificate. Please try again later.'
      );
    }
  }

  const getLessonIcon = (type) => {
    const t = String(type || '').toUpperCase();
    switch (t) {
      case 'VIDEO':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'TEXT':
        return <Text className="w-4 h-4 text-green-500" />;
      case 'PDF':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'QUIZ':
        return <FileQuestionMark className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Details</h1>
      </div>

      {/* Course Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
              <p className="font-semibold text-gray-900 dark:text-white">{Math.round(progressPercentage)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Lessons</p>
              <p className="font-semibold text-gray-900 dark:text-white">{completedLessons}/{lessons.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-gray-900 dark:text-white">{course.duration}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
              <p className="font-semibold text-gray-900 dark:text-white">{course.level}</p>
            </div>
          </div>

          <div className="mb-4">
            <ProgressBar progress={Math.round(progressPercentage)} />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{lessons.length} lessons</p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                !lesson.isCompleted && index > 0 && !lessons[index - 1].isCompleted 
                  ? 'opacity-60 cursor-not-allowed' 
                  : ''
              }`}
              onClick={() => {
                if (lesson.isCompleted || index === 0 || lessons[index - 1].isCompleted) {
                  onLessonSelect && onLessonSelect(lesson);
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {lesson.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                        {getLessonIcon(lesson.contentType || lesson.type)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{lesson.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getLessonIcon(lesson.contentType || lesson.type)}
                    <span className="capitalize">{lesson.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {String(course?.status).toUpperCase() === 'COMPLETED' && (
          <button
            onClick={handleCertificateRequest}
            disabled={certificateRequested}
            className={`px-6 py-3 rounded-lg transition-colors font-medium text-white ${
              certificateRequested
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title={certificateRequested ? 'Certificate already requested' : 'Request Certificate'}
          >
            {certificateRequested ? 'Certificate Requested' : 'Request Certificate'}
          </button>
        )}
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
};

export default CourseDetailPage;
