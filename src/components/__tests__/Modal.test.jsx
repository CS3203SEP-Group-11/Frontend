import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  test('does not render when closed', () => {
    const { container } = render(<Modal isOpen={false} title="Test" onClose={() => {}}>Content</Modal>);
    expect(container.querySelector('h3')).toBeFalsy();
  });

  test('renders title and children when open', () => {
    render(<Modal isOpen title="My Modal" onClose={() => {}}>Body content</Modal>);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  test('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn();
    render(<Modal isOpen title="Modal" onClose={onClose}>Body</Modal>);
    fireEvent.click(document.querySelector('.fixed.inset-0.bg-black'));
    expect(onClose).toHaveBeenCalled();
  });
});
