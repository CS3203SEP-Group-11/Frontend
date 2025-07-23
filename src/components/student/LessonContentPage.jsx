import { useState } from 'react';
import { ArrowLeft, Play, Pause, Download, FileText, Video, HelpCircle, CheckCircle, X, RotateCcw } from 'lucide-react';

const LessonContentPage = ({ lesson, course, onBack, onComplete }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleQuizAnswer = (questionId, answerIndex) => {
    if (!quizSubmitted) {
      setSelectedQuizAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  const submitQuiz = () => {
    if (!lesson.content.questions) return;
    
    let correct = 0;
    lesson.content.questions.forEach(question => {
      if (selectedQuizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    setQuizScore(correct);
    setQuizSubmitted(true);
    setShowExplanations(true);
    
    // Auto-complete if score is 80% or higher
    if (correct / lesson.content.questions.length >= 0.8) {
      onComplete && onComplete(lesson);
    }
  };

  const resetQuiz = () => {
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setShowExplanations(false);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'quiz':
        return <HelpCircle className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'assignment':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderVideoContent = () => (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden aspect-video">
        <iframe
          src={lesson.content.videoUrl}
          title={lesson.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isVideoPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <span className="text-gray-600 dark:text-gray-400">{lesson.duration}</span>
        </div>
        <button
          onClick={() => onComplete && onComplete(lesson)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Complete</span>
        </button>
      </div>

      {/* Transcript & Notes */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Transcript</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {lesson.content.transcript}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {lesson.content.notes}
          </p>
        </div>
      </div>
    </div>
  );

  const renderTextContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: lesson.content.textContent.replace(/\n/g, '<br>').replace(/```javascript(.*?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">$1</code>').replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>').replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
          }}
        />
      </div>

      {lesson.content.codeExamples && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Code Examples</h3>
          <div className="space-y-4">
            {lesson.content.codeExamples.map((example, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{example.title}</h4>
                </div>
                <div className="bg-gray-900 p-4">
                  <code className="text-green-400 text-sm font-mono">{example.code}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onComplete && onComplete(lesson)}
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz Questions</h3>
          {quizSubmitted && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Score: {quizScore}/{lesson.content.questions.length} 
                ({Math.round((quizScore / lesson.content.questions.length) * 100)}%)
              </span>
              <button
                onClick={resetQuiz}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {lesson.content.questions.map((question, questionIndex) => (
            <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                {questionIndex + 1}. {question.question}
              </h4>
              
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedQuizAnswers[question.id] === optionIndex;
                  const isCorrect = optionIndex === question.correctAnswer;
                  const showResult = quizSubmitted;
                  
                  let buttonClass = "w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors ";
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
                    } else {
                      buttonClass += "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
                    }
                  } else {
                    if (isSelected) {
                      buttonClass += "bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-700 text-primary-800 dark:text-primary-200";
                    } else {
                      buttonClass += "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300";
                    }
                  }
                  
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleQuizAnswer(question.id, optionIndex)}
                      disabled={quizSubmitted}
                      className={buttonClass}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-current' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-current"></div>}
                          {showResult && isCorrect && !isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-red-600" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {showExplanations && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!quizSubmitted && (
          <div className="flex justify-end mt-6">
            <button
              onClick={submitQuiz}
              disabled={Object.keys(selectedQuizAnswers).length < lesson.content.questions.length}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPdfContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-16 h-20 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{lesson.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{lesson.content.summary}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">File Size:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{lesson.content.fileSize}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Pages:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{lesson.content.pages}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Format:</span>
                <span className="ml-2 text-gray-900 dark:text-white">PDF</span>
              </div>
            </div>

            <button
              onClick={() => {
                // In a real app, this would trigger a download
                console.log('Downloading PDF:', lesson.content.pdfUrl);
                onComplete && onComplete(lesson);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contents</h4>
        <ul className="space-y-2">
          {lesson.content.sections.map((section, index) => (
            <li key={index} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
              <span>{section}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderAssignmentContent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Assignment Instructions</h3>
        <div 
          className="prose dark:prose-invert max-w-none mb-6"
          dangerouslySetInnerHTML={{ 
            __html: lesson.content.instructions.replace(/\n/g, '<br>').replace(/```javascript(.*?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>').replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mb-3">$1</h1>').replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mb-2 mt-4">$1</h2>')
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Starter Code</h4>
        <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {lesson.content.starterCode}
          </pre>
        </div>
      </div>

      {lesson.content.hints && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Hints</h4>
          <ul className="space-y-2">
            {lesson.content.hints.map((hint, index) => (
              <li key={index} className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onComplete && onComplete(lesson)}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Complete</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return renderVideoContent();
      case 'text':
        return renderTextContent();
      case 'quiz':
        return renderQuizContent();
      case 'pdf':
        return renderPdfContent();
      case 'assignment':
        return renderAssignmentContent();
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
            {getLessonIcon(lesson.type)}
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

      {/* Lesson Description */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300">{lesson.description}</p>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default LessonContentPage;
