import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import QuizBuilder from '../instructor/QuizBuilder';

const mockQuizData = {
  title: 'Test Quiz',
  description: 'Test Description',
  passingScore: 70,
  timeLimit: 30,
  attemptLimit: 3,
  questions: [
    {
      id: 1,
      questionText: 'What is React?',
      order: 1,
      options: [
        { optionText: 'A library', isCorrect: true },
        { optionText: 'A framework', isCorrect: false },
        { optionText: 'A language', isCorrect: false },
        { optionText: 'A database', isCorrect: false }
      ]
    }
  ]
};

describe('QuizBuilder Component', () => {
  const mockOnQuizChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders quiz builder form correctly', () => {
    render(
      <QuizBuilder 
        initialQuizData={mockQuizData} 
        onQuizChange={mockOnQuizChange} 
      />
    );

    expect(screen.getByDisplayValue('Test Quiz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('70')).toBeInTheDocument();
  });

  test('updates quiz title when input changes', () => {
    render(
      <QuizBuilder 
        initialQuizData={mockQuizData} 
        onQuizChange={mockOnQuizChange} 
      />
    );

    const titleInput = screen.getByDisplayValue('Test Quiz');
    fireEvent.change(titleInput, { target: { value: 'Updated Quiz Title' } });
    
    expect(mockOnQuizChange).toHaveBeenCalled();
  });

  test('adds new question when add button is clicked', () => {
    render(
      <QuizBuilder 
        initialQuizData={mockQuizData} 
        onQuizChange={mockOnQuizChange} 
      />
    );

    const addButton = screen.getByText('Add Question');
    fireEvent.click(addButton);
    
    expect(mockOnQuizChange).toHaveBeenCalled();
  });

  test('displays question correctly', () => {
    render(
      <QuizBuilder 
        initialQuizData={mockQuizData} 
        onQuizChange={mockOnQuizChange} 
      />
    );

    expect(screen.getByDisplayValue('What is React?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A library')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A framework')).toBeInTheDocument();
  });

  test('marks correct answer when option is selected', () => {
    render(
      <QuizBuilder 
        initialQuizData={mockQuizData} 
        onQuizChange={mockOnQuizChange} 
      />
    );

    const correctButtons = screen.getAllByTitle(/mark as correct/i);
    fireEvent.click(correctButtons[1]); // Click second option
    
    expect(mockOnQuizChange).toHaveBeenCalled();
  });

  test('removes question when delete button is clicked', () => {
    const multiQuestionData = {
      ...mockQuizData,
      questions: [
        ...mockQuizData.questions,
        {
          id: 2,
          questionText: 'Second Question',
          order: 2,
          options: [
            { optionText: 'Option 1', isCorrect: true },
            { optionText: 'Option 2', isCorrect: false },
            { optionText: 'Option 3', isCorrect: false },
            { optionText: 'Option 4', isCorrect: false }
          ]
        }
      ]
    };

    window.confirm = vi.fn(() => true);

    render(
      <QuizBuilder 
        initialQuizData={multiQuestionData} 
        onQuizChange={mockOnQuizChange} 
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete question');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnQuizChange).toHaveBeenCalled();
  });
});