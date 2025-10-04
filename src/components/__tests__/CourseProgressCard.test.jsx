import { render, screen, fireEvent } from '@testing-library/react';
import CourseProgressCard from '../CourseProgressCard';

const baseCourse = {
  title: 'React Fundamentals',
  instructor: 'Jane Doe',
  rating: 4.7,
  students: 12345,
  price: 49.99,
  duration: '10h 30m',
  level: 'Beginner',
  image: 'https://placehold.co/300x200',
  description: 'Learn the basics of React including hooks and component patterns.',
};

describe('CourseProgressCard', () => {
  test('renders course info (grid view)', () => {
    render(<CourseProgressCard course={baseCourse} />);
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText(/Learn the basics/)).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  test('calls onCourseSelect when clicked', () => {
    const onCourseSelect = vi.fn();
    render(<CourseProgressCard course={baseCourse} onCourseSelect={onCourseSelect} />);
    fireEvent.click(screen.getByText('React Fundamentals'));
    expect(onCourseSelect).toHaveBeenCalledWith(baseCourse);
  });

  test('shows progress elements when showProgress true and progress > 0', () => {
    const courseWithProgress = { ...baseCourse, progress: 40 };
    const onContinue = vi.fn();
    render(<CourseProgressCard course={courseWithProgress} showProgress onContinue={onContinue} />);
    // There may be multiple '40%' (circular progress + progress label); ensure at least one present
    const progressEls = screen.getAllByText((content) => content.replace(/\s/g,'') === '40%');
    expect(progressEls.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Continue Learning')).toBeInTheDocument();
  });

  test('list view renders condensed layout', () => {
    render(<CourseProgressCard course={baseCourse} viewMode="list" />);
    // In list mode description text is truncated/not present by class usage; ensure title still there
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });
});
