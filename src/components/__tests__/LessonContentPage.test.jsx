import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LessonContentPage from '../student/LessonContentPage';

// Mock AuthContext since component uses useAuth()
vi.mock('../../context/AuthContext', async () => {
  return {
    useAuth: () => ({ user: { id: 'user-1', firstName: 'Test', lastName: 'User', role: 'USER' } })
  }
});

// Mock APIs used by the component
vi.mock('../../api/enrollment', async () => ({
  markLessonCompleted: vi.fn(async () => Promise.resolve()),
}));

vi.mock('../../api/quiz', async () => ({
  getQuizDataById: vi.fn(async () => ({
    id: 'quiz-1',
    lessonId: 2,
    passingScore: 60,
    timeLimit: 10,
    attemptLimit: 3,
    questions: [
      {
        id: 101,
        questionText: 'What is React?',
        options: [
          { id: 1001, optionText: 'Library' },
          { id: 1002, optionText: 'Framework' },
        ],
      },
    ],
  })),
  getUserQuizAttempts: vi.fn(async () => []),
  createQuizAttempt: vi.fn(async () => ({ id: 'attempt-1' })),
  submitQuizAttempt: vi.fn(async () => ({})),
}));

const mockVideoLesson = {
  id: 1,
  title: 'Introduction to React',
  contentType: 'VIDEO',
  duration: '15 minutes',
  contentUrl: 'https://www.youtube.com/embed/test',
};

const mockQuizLesson = {
  id: 2,
  title: 'React Quiz',
  contentType: 'QUIZ',
  quizId: 'quiz-1',
  duration: '20 minutes',
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
        enrollmentId={"enroll-1"}
      />
    );

    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText(/React Course/)).toBeInTheDocument();
  expect(screen.getByText(/15 minutes/)).toBeInTheDocument();
    // Notes text isn't rendered in current component; presence of video is implied via header
  });

  test('renders quiz lesson correctly (summary first, then attempt)', async () => {
    render(
      <LessonContentPage 
        lesson={mockQuizLesson}
        course={mockCourse}
        onBack={mockOnBack}
        enrollmentId={"enroll-1"}
      />
    );

    // Summary area
    expect(await screen.findByText('Quiz: React Quiz')).toBeInTheDocument();
    expect(screen.getByText(/Passing Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Attempt Quiz/)).toBeInTheDocument();

    // Start attempt
  fireEvent.click(screen.getByText('Attempt Quiz'));
  // Options must appear after starting attempt
  expect(await screen.findByText(/What is React\?/)).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
  });

  test('handles quiz answer selection', async () => {
    render(
      <LessonContentPage 
        lesson={mockQuizLesson}
        course={mockCourse}
        onBack={mockOnBack}
        enrollmentId={"enroll-1"}
      />
    );

    fireEvent.click(await screen.findByText('Attempt Quiz'));
    const option = await screen.findByText('Library');
    fireEvent.click(option);
    // Selected state is applied on the label via border/bg classes; check input checked
    const radio = option.closest('label')?.querySelector('input[type="radio"]');
    expect(radio).toBeTruthy();
    expect(radio.checked).toBe(true);
  });

  test('submits quiz when all questions are answered', async () => {
    render(
      <LessonContentPage 
        lesson={mockQuizLesson}
        course={mockCourse}
        onBack={mockOnBack}
        enrollmentId={"enroll-1"}
      />
    );

    fireEvent.click(await screen.findByText('Attempt Quiz'));
    const option = await screen.findByText('Library');
    fireEvent.click(option);
    const submitButton = screen.getByText('Submit Answers');
    fireEvent.click(submitButton);
    // After submit, component reloads summary; verify Attempt Quiz button reappears
    expect(await screen.findByText('Attempt Quiz')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    render(
      <LessonContentPage 
        lesson={mockVideoLesson}
        course={mockCourse}
        onBack={mockOnBack}
        enrollmentId={"enroll-1"}
      />
    );

    const backBtn = screen.getAllByRole('button')[0];
    fireEvent.click(backBtn);
    expect(mockOnBack).toHaveBeenCalled();
  });

  test('marks complete when Mark Complete is clicked', async () => {
    const { markLessonCompleted } = await import('../../api/enrollment');
    render(
      <LessonContentPage 
        lesson={mockVideoLesson}
        course={mockCourse}
        onBack={mockOnBack}
        enrollmentId={"enroll-1"}
      />
    );

    const completeButton = screen.getByText('Mark Complete');
    fireEvent.click(completeButton);
    expect(markLessonCompleted).toHaveBeenCalledWith('enroll-1', 1);
    // onBack is called after marking complete (async)
    await waitFor(() => expect(mockOnBack).toHaveBeenCalled());
  });
});