import { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, Video, Text, FileQuestionMark, CheckCircle } from 'lucide-react';
import VideoPlayer from '../VideoPlayer';
import { markLessonCompleted } from '../../api/enrollment';
import { getQuizDataById, getUserQuizAttempts, createQuizAttempt, submitQuizAttempt } from '../../api/quiz';
import { useAuth } from '../../context/AuthContext';

const LessonContentPage = ({ lesson, course, onBack, enrollmentId }) => {
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionId }
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [isLocallyCompleted, setIsLocallyCompleted] = useState(!!lesson?.isCompleted);
  const { user } = useAuth()

  const handleQuizAnswer = (questionId, optionId) => {
    if (!quizSubmitted) {
      setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    }
  };

  useEffect(() => {
    console.log('Lesson content:', lesson);
  }, [lesson]);

  // Auto-load quiz data when opening a QUIZ lesson
  useEffect(() => {
    const ct = String(lesson?.contentType || lesson?.type || '').toUpperCase();
    if (ct === 'QUIZ' && lesson?.quizId) {
      getQuizData();
      // reset attempt state when switching lessons
      setAttemptStarted(false);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizAttempts([]);
      setIsLocallyCompleted(!!lesson?.isCompleted);
    }
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

  const startAttempt = async () => {
    const userQuizAttempts = await getUserQuizAttempts(lesson.quizId, user.id);
    if (userQuizAttempts && userQuizAttempts.length >= quizData.attemptLimit) {
      alert('You have reached the maximum number of attempts for this quiz.');
      return;
    }
    const newAttempt = await createQuizAttempt(lesson.quizId, user.id);
    setCurrentAttempt(newAttempt);
    setAttemptStarted(true);
  }

  const submitQuiz = async () => {
    if (!quizData?.questions?.length) return;
    const submission = {
      quizId: quizData.id,
      lessonId: quizData.lessonId,
      userId: user?.id,
      attemptedAt: new Date().toISOString(),
      responses: quizData.questions.map(q => ({
        questionId: q.id,
        selectedOptionId: selectedAnswers[q.id] || null,
      })),
    };
    await submitQuizAttempt(quizData.id, currentAttempt.id, submission.responses);
    setQuizSubmitted(true);
    setAttemptStarted(false);
    // Refresh attempts and completion state after submission
    await getQuizData();
  };

  const getQuizData = async () => {
    const quizData = await getQuizDataById(lesson.quizId);
    setQuizData(quizData);
    if (user?.id) {
      try {
        const userQuizAttempts = await getUserQuizAttempts(lesson.quizId, user.id);
        console.log('User quiz attempts:', userQuizAttempts);
        setQuizAttempts(Array.isArray(userQuizAttempts) ? userQuizAttempts : []);
        if (userQuizAttempts && userQuizAttempts.length > 0) {
          setCurrentAttempt(userQuizAttempts[userQuizAttempts.length - 1]);
        } else {
          setCurrentAttempt(null);
        }
        // If any attempt has passed, mark this lesson as completed
        const hasPassed = Array.isArray(userQuizAttempts) && userQuizAttempts.some(a => a.passed === true);
        if (hasPassed) {
          setIsLocallyCompleted(true);
          if (enrollmentId && !lesson?.isCompleted) {
            try {
              await markLessonCompleted(enrollmentId, lesson.id);
            } catch (err) {
              console.error('Failed to auto-mark lesson complete after passing quiz', err);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load quiz attempts', e);
        setQuizAttempts([]);
        setCurrentAttempt(null);
      }
    } else {
      setQuizAttempts([]);
      setCurrentAttempt(null);
    }
    console.log('Loaded quiz data:', quizData);
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
        {!quizData ? (
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Passing Score:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quizData.passingScore}%</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Time Limit:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quizData.timeLimit} min</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Attempt Limit:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quizData.attemptLimit}</span>
              </div>
            </div>
            {!attemptStarted && Array.isArray(quizAttempts) && quizAttempts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Attempts ({quizAttempts.length})</h3>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Attempt #</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Passed</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Score</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Started</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {quizAttempts.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.attemptNumber ?? '-'}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{a.status ?? '-'}</span>
                          </td>
                          <td className="px-3 py-2">
                            {a.passed === true ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Yes</span>
                            ) : a.passed === false ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">No</span>
                            ) : (
                              <span className="text-gray-600 dark:text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.score ?? '-'}</td>
                          <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.startedAt ? new Date(a.startedAt).toLocaleString() : '-'}</td>
                          <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.completedAt ? new Date(a.completedAt).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {!attemptStarted ? (
              <div className="flex justify-end">
                <button
                  onClick={startAttempt}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Attempt Quiz
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {quizData.questions.map((q, idx) => (
                    <div key={q.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">{idx + 1}. {q.questionText}</h4>
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const checked = selectedAnswers[q.id] === opt.id;
                          return (
                            <label key={opt.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${checked ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                checked={checked}
                                onChange={() => handleQuizAnswer(q.id, opt.id)}
                                className="form-radio text-primary-600"
                              />
                              <span className="text-gray-900 dark:text-gray-100">{opt.optionText}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={submitQuiz}
                    disabled={quizSubmitted || quizData.questions.some(q => !selectedAnswers[q.id])}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answers
                  </button>
                </div>
              </>
            )}
          </div>
        )}
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
        {(lesson.isCompleted || isLocallyCompleted) && (
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
