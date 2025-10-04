import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';

const renderBreadcrumb = (props) =>
  render(
    <BrowserRouter>
      <Breadcrumb {...props} />
    </BrowserRouter>
  );

describe('Breadcrumb', () => {
  test('renders home navigation link', () => {
    renderBreadcrumb({ items: [] });

    expect(screen.getByLabelText(/home/i)).toBeInTheDocument();
  });

  test('renders breadcrumb items with and without links', () => {
    const items = [
      { label: 'Courses', href: '/courses' },
      { label: 'Design Basics' },
    ];

    renderBreadcrumb({ items });

    expect(screen.getByRole('link', { name: 'Courses' })).toBeInTheDocument();
    expect(screen.getByText('Design Basics')).toBeInTheDocument();
  });
});
