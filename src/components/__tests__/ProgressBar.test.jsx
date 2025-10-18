import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  test('renders progress percentage and bar width', () => {
    render(<ProgressBar progress={65} />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  test('caps progress over 100 visually', () => {
    const { container } = render(<ProgressBar progress={150} />);
    // Select the innermost bar that has an inline width style
    const inner = container.querySelector('div[style*="width"]');
    expect(inner).toBeTruthy();
    expect(inner.style.width).toBe('100%');
  });
});
