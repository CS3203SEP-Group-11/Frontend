import { useState } from 'react';
import { Plus, Trash2, FileQuestionMark, CheckCircle, XCircle } from 'lucide-react';

const QuizBuilder = ({ initialQuizData, onQuizChange }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    questions: [
      {
        id: 1,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ],
    ...initialQuizData
  });

  const updateQuiz = (newQuizData) => {
    setQuizData(newQuizData);
    onQuizChange && onQuizChange(newQuizData);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
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
      const updatedQuiz = {
        ...quizData,
        questions: quizData.questions.filter(q => q.id !== questionId)
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

  const updateQuestionOption = (questionId, optionIndex, value) => {
    const updatedQuiz = {
      ...quizData,
      questions: quizData.questions.map(q =>
        q.id === questionId 
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    };
    updateQuiz(updatedQuiz);
  };

  const setCorrectAnswer = (questionId, optionIndex) => {
    updateQuestion(questionId, 'correctAnswer', optionIndex);
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
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
                  placeholder="Enter your question here..."
                  required
                />
              </div>

              {/* Question Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Type
                </label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              {/* Answer Options */}
              {question.type === 'multiple-choice' && (
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
                            question.correctAnswer === optIndex
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-gray-400 hover:text-green-500'
                          }`}
                          title={question.correctAnswer === optIndex ? 'Correct answer' : 'Mark as correct'}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* True/False Options */}
              {question.type === 'true-false' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correct Answer
                  </label>
                  <div className="flex space-x-4">
                    {['True', 'False'].map((answer, idx) => (
                      <label key={answer} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}-answer`}
                          checked={question.correctAnswer === idx}
                          onChange={() => setCorrectAnswer(question.id, idx)}
                          className="sr-only"
                        />
                        <div
                          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                            question.correctAnswer === idx
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {question.correctAnswer === idx ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">{answer}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
                  placeholder="Provide an explanation for the correct answer..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Summary */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Quiz Summary</h4>
        <div className="text-sm text-yellow-700 dark:text-yellow-300">
          <p>Total Questions: {quizData.questions.length}</p>
          <p>Questions with Answers: {quizData.questions.filter(q => q.question.trim()).length}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
