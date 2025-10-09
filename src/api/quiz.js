import api from './axios.js';

// Create a new quiz (step 1)
export const createQuiz = async (quizMetadata) => {
  try {
    const response = await api.post('/assessments/quizzes', quizMetadata);
    console.log('Creating quiz with data:', quizMetadata);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// Add questions to a quiz (step 2)
export const addQuestionToQuiz = async (quizId, questionData) => {
  try {
    console.log('Adding question to quiz:', quizId, questionData);
    const response = await api.post(`/assessments/quizzes/${quizId}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error adding question to quiz:', error);
    throw error;
  }
};

// Save complete quiz (handles both steps)
export const createCompleteQuiz = async (quizData) => {
  try {
    // Step 1: Create quiz
    const { questions, ...quizMetadata } = quizData;
    const createdQuiz = await createQuiz(quizMetadata);
    const quizId = createdQuiz.id;

    console.log('Created quiz with ID:', quizId);

    // Step 2: Add questions one by one
    const savedQuestions = [];
    for (const question of questions) {
      const savedQuestion = await addQuestionToQuiz(quizId, question);
      savedQuestions.push(savedQuestion);
    }

    return {
      ...createdQuiz,
      questions: savedQuestions
    };
  } catch (error) {
    console.error('Error saving complete quiz:', error);
    throw error;
  }
};


export const getQuizById = async (quizId) => {
  try {
    const response = await api.get(`/assessments/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

export const getQuestionsByQuizId = async (quizId) => {
  try {
    const response = await api.get(`/assessments/quizzes/${quizId}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions by quiz ID:', error);
    throw error;
  }
};

export const getQuizDataById = async (quizId) => {
  try {
    const quiz = await getQuizById(quizId);
    const questions = await getQuestionsByQuizId(quizId);
    const quizData = {...quiz, questions};
    console.log(quizData);

    return quizData;
  } catch (error) {
    console.error('Error fetching quiz data by ID:', error);
    throw error;
  }
};


export const deleteQuizById = async (quizId) => {
  try {
    const response = await api.delete(`/assessments/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz by ID:', error);
    throw error;
  }
};