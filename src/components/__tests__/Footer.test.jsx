import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderFooter = () =>
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );

describe('Footer', () => {
  test('displays brand messaging', () => {
    renderFooter();

    expect(screen.getByText('LevelUp')).toBeInTheDocument();
    expect(screen.getByText(/empowering learners worldwide/i)).toBeInTheDocument();
  });

  test('renders navigation sections and links', () => {
    const { container } = renderFooter();

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(container.querySelectorAll('a[href="#"]').length).toBeGreaterThan(0);
  });

  test('shows footer policy links', () => {
    renderFooter();

    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
  });
});
