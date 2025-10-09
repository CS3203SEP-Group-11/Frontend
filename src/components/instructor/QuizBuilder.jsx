import { useState, useEffect } from 'react';
import { Plus, Trash2, FileQuestionMark, CheckCircle } from 'lucide-react';

const QuizBuilder = ({ initialQuizData, onQuizChange }) => {

  const defaultQuizData = {
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: 30,
    attemptLimit: 3,
    questions: [
      {
        id: 1,
        questionText: '',
        order: 1,
        options: [
          { optionText: '', isCorrect: true },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }
    ]
  };

  const [quizData, setQuizData] = useState(
    initialQuizData && initialQuizData !== null 
      ? initialQuizData 
      : defaultQuizData
  );

  // Update state when initialQuizData changes (for cases where data loads after component mounts)
  useEffect(() => {
    console.log('useEffect triggered - initialQuizData:', initialQuizData);
    if (initialQuizData && initialQuizData !== null) {
      setQuizData(initialQuizData);
    }
  }, [initialQuizData]);

  // Debug current quiz data state
  console.log('Current quizData state:', quizData);

  const updateQuiz = (newQuizData) => {
    setQuizData(newQuizData);
    onQuizChange && onQuizChange(newQuizData);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionText: '',
      order: quizData.questions.length + 1,
      options: [
        { optionText: '', isCorrect: true },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    };
    const updatedQuiz = {
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    };
    updateQuiz(updatedQuiz);
  };

  const removeQuestion = (questionId) => {
    if (quizData.questions.length <= 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this question?')) {
      const filteredQuestions = quizData.questions.filter(q => q.id !== questionId);
      // Reorder remaining questions
      const reorderedQuestions = filteredQuestions.map((q, index) => ({
        ...q,
        order: index + 1
      }));
      const updatedQuiz = {
        ...quizData,
        questions: reorderedQuestions
      };
      updateQuiz(updatedQuiz);
    }
  };

  const updateQuestion = (questionId, field, value) => {
    const updatedQuiz = {
      ...quizData,
      questions: quizData.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    };
    updateQuiz(updatedQuiz);
  };

  const updateQuestionOption = (questionId, optionIndex, optionText) => {
    const updatedQuiz = {
      ...quizData,
      questions: quizData.questions.map(q =>
        q.id === questionId 
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? { ...opt, optionText } : opt) }
          : q
      )
    };
    updateQuiz(updatedQuiz);
  };

  const setCorrectAnswer = (questionId, optionIndex) => {
    const updatedQuiz = {
      ...quizData,
      questions: quizData.questions.map(q =>
        q.id === questionId 
          ? { ...q, options: q.options.map((opt, idx) => ({ ...opt, isCorrect: idx === optionIndex })) }
          : q
      )
    };
    updateQuiz(updatedQuiz);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quiz Title
        </label>
        <input
          type="text"
          value={quizData.title}
          onChange={(e) => updateQuiz({ ...quizData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter quiz title"
          required
        />
      </div>

      {/* Quiz Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quiz Description
        </label>
        <textarea
          value={quizData.description}
          onChange={(e) => updateQuiz({ ...quizData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
          placeholder="Enter quiz description"
        />
      </div>

      {/* Quiz Settings Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Passing Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Passing Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={quizData.passingScore}
            onChange={(e) => updateQuiz({ ...quizData, passingScore: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="70"
            required
          />
        </div>

        {/* Time Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={quizData.timeLimit}
            onChange={(e) => updateQuiz({ ...quizData, timeLimit: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="30"
            required
          />
        </div>

        {/* Attempt Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attempt Limit
          </label>
          <input
            type="number"
            min="1"
            value={quizData.attemptLimit}
            onChange={(e) => updateQuiz({ ...quizData, attemptLimit: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="3"
            required
          />
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Questions</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-6">
          {quizData.questions.map((question, qIndex) => (
            <div key={question.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileQuestionMark className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Question {qIndex + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question
                </label>
                <textarea
                  value={question.questionText}
                  onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
                  placeholder="Enter your question here..."
                  required
                />
              </div>

              {/* Answer Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer Options
                </label>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(question.id, optIndex)}
                        className={`p-1 rounded-full transition-colors ${
                          option.isCorrect
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                        title={option.isCorrect ? 'Correct answer' : 'Mark as correct'}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Summary */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Quiz Summary</h4>
        <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <p>Total Questions: {quizData.questions.length}</p>
          <p>Questions with Answers: {quizData.questions.filter(q => q.questionText.trim()).length}</p>
          <p>Passing Score: {quizData.passingScore}%</p>
          <p>Time Limit: {quizData.timeLimit} minutes</p>
          <p>Attempt Limit: {quizData.attemptLimit} attempts</p>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
