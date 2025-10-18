import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CourseCard from '../CourseCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCourse = {
  id: 1,
  title: 'React Development Course',
  description: 'Learn React from basics to advanced',
  category: 'Web Development',
  language: 'English',
  enrollmentCount: 1500,
  priceAmount: 99.99,
  priceCurrency: 'USD',
  duration: '40 hours',
  ratingAverage: 4.8,
  ratingCount: 250,
  level: 'Intermediate',
  thumbnailUrl: 'https://example.com/image.jpg',
};

const MockWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('CourseCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders course information correctly', () => {
    render(
      <MockWrapper>
        <CourseCard course={mockCourse} />
      </MockWrapper>
    );

    expect(screen.getByText('React Development Course')).toBeInTheDocument();
    expect(screen.getByText('Learn React from basics to advanced')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText(/40 hours/)).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText(/1500/)).toBeInTheDocument();
  });

  test('displays price correctly', () => {
    render(
      <MockWrapper>
        <CourseCard course={mockCourse} />
      </MockWrapper>
    );

    expect(screen.getByText(/USD 99\.99/)).toBeInTheDocument();
  });

  test('navigates to course detail when clicked', () => {
    render(
      <MockWrapper>
        <CourseCard course={mockCourse} />
      </MockWrapper>
    );

    const courseCard = screen.getByText('React Development Course').closest('div');
    fireEvent.click(courseCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/course/1');
  });

  test('calls onCourseSelect when provided', () => {
    const mockOnCourseSelect = vi.fn();
    
    render(
      <MockWrapper>
        <CourseCard course={mockCourse} onCourseSelect={mockOnCourseSelect} />
      </MockWrapper>
    );

    const courseCard = screen.getByText('React Development Course').closest('div');
    fireEvent.click(courseCard);
    
    expect(mockOnCourseSelect).toHaveBeenCalledWith(mockCourse);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('renders in list view when specified', () => {
    render(
      <MockWrapper>
        <CourseCard course={mockCourse} viewMode="list" />
      </MockWrapper>
    );

    // Look for the main container with list view styling
    const courseCard = screen.getByText('React Development Course').closest('[class*="flex"]');
    expect(courseCard).toBeInTheDocument();
  });
});
