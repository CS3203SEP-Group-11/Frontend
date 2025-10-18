import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import SearchAndFilter from '../SearchAndFilter';

describe('SearchAndFilter', () => {
  const categories = ['Design', 'Development'];

  test('debounces search input before triggering onSearch', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    try {
      render(<SearchAndFilter onSearch={onSearch} />);
      const searchInput = screen.getByPlaceholderText('Search courses...');

      fireEvent.change(searchInput, { target: { value: 'react' } });
      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1); // reach 300ms debounce
      });
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('react');
    } finally {
      vi.useRealTimers();
    }
  });

  test('updates filters and allows reset', () => {
    const onFilter = vi.fn();

    render(<SearchAndFilter onFilter={onFilter} categories={categories} />);

    expect(onFilter).toHaveBeenCalledWith({ category: null, level: null });

    const [categorySelect, levelSelect] = screen.getAllByRole('combobox');

    fireEvent.change(categorySelect, { target: { value: 'Design' } });
    expect(onFilter).toHaveBeenLastCalledWith({ category: 'Design', level: null });
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();

    fireEvent.change(levelSelect, { target: { value: 'Intermediate' } });
    expect(onFilter).toHaveBeenLastCalledWith({ category: 'Design', level: 'Intermediate' });

    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(onFilter).toHaveBeenLastCalledWith({ category: null, level: null });
    expect(categorySelect.value).toBe('All Categories');
    expect(levelSelect.value).toBe('All Levels');
    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument();
  });

  test('renders provided categories as options', () => {
    render(<SearchAndFilter categories={categories} />);

    categories.forEach((category) => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
    });
  });
});
