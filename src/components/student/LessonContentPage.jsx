import { use, useEffect, useState } from 'react';
import { ArrowLeft, Play, Pause, Download, FileText, Video, Text, FileQuestionMark, CheckCircle, X, RotateCcw } from 'lucide-react';
import VideoPlayer from '../VideoPlayer';
import { markLessonCompleted } from '../../api/enrollment';
import { getQuizDataById } from '../../api/quiz';
import { useAuth } from '../../context/AuthContext';
import { getUserQuizAttempts } from '../../api/quiz';

const LessonContentPage = ({ lesson, course, onBack, enrollmentId }) => {
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const { user } = useAuth()

  const handleQuizAnswer = (questionId, answerIndex) => {
    if (!quizSubmitted) {
      setSelectedQuizAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  useEffect(() => {
    console.log('Lesson content:', lesson);
  }, [lesson]);

  const markAsComplete = async () => {
    try {
      console.log('Marking lesson complete:', { enrollmentId, lessonId: lesson.id });
      if (!enrollmentId) {
        console.warn('Missing enrollmentId; cannot mark lesson complete.');
      } else {
        await markLessonCompleted(enrollmentId, lesson.id);
      }
      console.log('Lesson marked as complete:', lesson.title);
      onBack && onBack();
    } catch (e) {
      console.error('Failed to mark lesson as complete', e);
    }
  };

  const submitQuiz = () => {
    // if (!lesson.content.questions) return;
    
    // let correct = 0;
    // lesson.content.questions.forEach(question => {
    //   if (selectedQuizAnswers[question.id] === question.correctAnswer) {
    //     correct++;
    //   }
    // });
    
    // setQuizScore(correct);
    // setQuizSubmitted(true);
    // setShowExplanations(true);
    
    // // Auto-complete if score is 80% or higher
    // if (correct / lesson.content.questions.length >= 0.8) {
    //   markAsComplete();
    // }
  };

  const getQuizData = async () => {
    const quizData = await getQuizDataById(lesson.quizId);
    setQuizData(quizData);
    const userQuizAttempts = await getUserQuizAttempts(user.id, lesson.quizId);
    setQuizAttempts(userQuizAttempts);

    if (userQuizAttempts.length >= quizData.attemptLimit) {
      alert('You have reached the maximum number of attempts for this quiz.');
      return;
    }

    console.log('Fetched quiz data:', quizData);
  };

  const resetQuiz = () => {
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setShowExplanations(false);
  };

  const getLessonIcon = (type) => {
    const t = String(type || '').toUpperCase();
    switch (t) {
      case 'VIDEO':
        return <Video className="w-5 h-5" />;
      case 'TEXT':
        return <Text className="w-5 h-5" />;
      case 'PDF':
        return <FileText className="w-5 h-5" />;
      case 'QUIZ':
        return <FileQuestionMark className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderVideoContent = () => (
    <div className="space-y-6">
      {/* Video Controls */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">  
        <VideoPlayer src={lesson.contentUrl} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={markAsComplete}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Complete</span>
        </button>
      </div>
    </div>
  );

  const renderTextContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: (lesson?.content?.textContent || lesson?.textContent || '').replace(/\n/g, '<br>').replace(/```javascript(.*?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">$1</code>').replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>').replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
          }}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={markAsComplete}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Complete</span>
        </button>
      </div>
    </div>
  );

  const renderQuizContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quiz: {lesson.title}</h2>
        <button onClick={getQuizData} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Load Quiz Data</button>
      </div>
    </div>  
  );

  const renderPdfContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          <span className="font-semibold text-gray-900 dark:text-white">{lesson.title}</span>
        </div>
        <div className="mt-4">
          <a
            href={lesson.contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Open PDF</span>
          </a>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={markAsComplete}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Complete</span>
        </button>
      </div>
    </div>
  );

  
  const renderContent = () => {
    const ct = String(lesson.contentType || lesson.type || '').toUpperCase();
    switch (ct) {
      case 'VIDEO':
        return renderVideoContent();
      case 'TEXT':
        return renderTextContent();
      case 'QUIZ':
        return renderQuizContent();
      case 'PDF':
        return renderPdfContent();
      default:
        return <div>Content type not supported</div>;
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
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            {getLessonIcon(lesson.contentType || lesson.type)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {course.title} • {lesson.duration}
            </p>
          </div>
        </div>
        {lesson.isCompleted && (
          <div className="ml-auto">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default LessonContentPage;
