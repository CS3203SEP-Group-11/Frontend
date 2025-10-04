import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import LessonContentPage from '../student/LessonContentPage';

const mockVideoLesson = {
  id: 1,
  title: 'Introduction to React',
  type: 'video',
  duration: '15 minutes',
  content: {
    videoUrl: 'https://www.youtube.com/embed/test',
    transcript: 'This is a test transcript',
    notes: 'These are test notes'
  }
};

const mockQuizLesson = {
  id: 2,
  title: 'React Quiz',
  type: 'quiz',
  duration: '20 minutes',
  content: {
    questions: [
      {
        id: 1,
        question: 'What is React?',
        options: ['Library', 'Framework', 'Language', 'Database'],
        correctAnswer: 0,
        explanation: 'React is a JavaScript library'
      }
    ]
  }
};

const mockCourse = {
  id: 1,
  title: 'React Course'
};

describe('LessonContentPage Component', () => {
  const mockOnBack = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders video lesson correctly', () => {
    render(
      <LessonContentPage 
        lesson={mockVideoLesson}
        course={mockCourse}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('15 minutes')).toBeInTheDocument();
    expect(screen.getByText('These are test notes')).toBeInTheDocument();
  });

  test('renders quiz lesson correctly', () => {
    render(
      <LessonContentPage 
        lesson={mockQuizLesson}
        course={mockCourse}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('React Quiz')).toBeInTheDocument();
    expect(screen.getByText(/What is React\?/)).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
  });

  test('handles quiz answer selection', () => {
    render(
      <LessonContentPage 
        lesson={mockQuizLesson}
        course={mockCourse}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const firstOption = screen.getByText('Library');
    fireEvent.click(firstOption);
    
    // Check if option is selected (button should have selected styling)
    expect(firstOption.closest('button')).toHaveClass('bg-primary-100');
  });

  test('submits quiz when all questions are answered', () => {
    render(
      <LessonContentPage 
        lesson={mockQuizLesson}
        course={mockCourse}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    // Select an answer
    const firstOption = screen.getByText('Library');
    fireEvent.click(firstOption);
    
    // Submit quiz
    const submitButton = screen.getByText('Submit Quiz');
    fireEvent.click(submitButton);
    
    // Check if quiz is submitted (score should be displayed)
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(
      <LessonContentPage 
        lesson={mockVideoLesson}
        course={mockCourse}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    // Get the first button which should be the back button (arrow icon)
    const buttons = screen.getAllByRole('button');
    const backButton = buttons[0]; // First button should be the back button
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('calls onComplete when mark complete button is clicked', () => {
    render(
      <LessonContentPage 
        lesson={mockVideoLesson}
        course={mockCourse}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    const completeButton = screen.getByText('Mark Complete');
    fireEvent.click(completeButton);
    
    expect(mockOnComplete).toHaveBeenCalledWith(mockVideoLesson);
  });
});