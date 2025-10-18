import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders pagination controls correctly', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    expect(prevButton).toBeDisabled();
  });

  test('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const nextButton = screen.getByRole('button', { name: /next page/i });
    expect(nextButton).toBeDisabled();
  });

  test('calls onPageChange when page number is clicked', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const pageButton = screen.getByText('2');
    fireEvent.click(pageButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange when next button is clicked', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('highlights current page', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-primary-600');
  });
});
