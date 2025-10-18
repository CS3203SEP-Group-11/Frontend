import { render, screen, fireEvent } from '@testing-library/react';
import FileUploader from '../FileUploader';

// Mock uploadFile API to avoid real network
vi.mock('../../api/files', () => ({
  uploadFile: vi.fn(async (file, type) => ({ id: '123', url: 'https://cdn.example.com/' + file.name, type }))
}));

describe('FileUploader', () => {
  const allowedTypes = ['IMAGE', 'PDF'];

  test('renders label and type buttons (when multiple allowed)', () => {
    render(<FileUploader allowedTypes={allowedTypes} label="Upload Material" />);
    expect(screen.getByText('Upload Material')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PDF/i })).toBeInTheDocument();
  });

  test('selects a file and shows selected file section', () => {
    render(<FileUploader allowedTypes={allowedTypes} />);

    const dropArea = screen.getByText(/Drag & drop a file here/i).closest('div[role]') || screen.getByText(/Drag & drop a file here/i).parentElement;

    const file = new File(['hello'], 'photo.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');

    // Simulate selecting file through the hidden input
    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);

    expect(screen.getByText('Selected File')).toBeInTheDocument();
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  test('shows error for invalid file type (PDF expected)', () => {
    render(<FileUploader allowedTypes={allowedTypes} />);

    // Switch to PDF type button
    fireEvent.click(screen.getByRole('button', { name: /PDF/i }));

    const badFile = new File(['%PDF'], 'notpdf.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [badFile] });
    fireEvent.change(input);

    expect(screen.getByText(/valid PDF/i)).toBeInTheDocument();
  });
});
