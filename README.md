# LearnHub - Online Learning Platform

A modern, responsive online learning platform built with React and Tailwind CSS. Features a clean, elegant design similar to popular platforms like Coursera and Udemy.

## 🚀 Features

### Landing Page

- **Hero Section** with compelling headline and call-to-action buttons
- **Featured Courses** showcase with course cards displaying ratings, instructors, and pricing
- **Benefits Section** highlighting key platform advantages
- **Pricing Plans** with monthly/yearly toggle and feature comparisons
- **Testimonials Carousel** from successful students
- **Responsive Footer** with navigation links and social media icons

### Student Dashboard

- **Sidebar Navigation** (Dashboard, My Courses, Certificates, Profile, Logout)
- **Welcome Section** with personalized greeting and user avatar
- **Course Progress** with visual progress bars and "Continue Learning" buttons
- **Search & Filter** functionality for courses
- **Pagination** for course listings
- **Upcoming Lessons** with scheduled dates and quick join buttons
- **Certificates Section** with downloadable certificates
- **Profile Settings** with user preferences

### Instructor Dashboard

- **Comprehensive Analytics** showing total students, courses, and earnings
- **Course Management** with performance metrics and revenue tracking
- **Create Course** interface with file upload and detailed form fields
- **Student Submissions** review system with filtering and grading options
- **Instructor Profile** with bio and teaching information

### UI Components

- **Course Cards** with hover animations and progress indicators
- **Modal System** for course previews and detailed views
- **Progress Bars** with gradient styling and percentage display
- **Search & Filter** with real-time filtering and category selection
- **Pagination** with smart page number display
- **Breadcrumb Navigation** for improved user experience

### Design Features

- **Dark Mode Toggle** with smooth transitions
- **Responsive Design** optimized for desktop, tablet, and mobile
- **Hover Animations** for interactive elements
- **Tech-forward Color Palette** with blue and purple gradients
- **Clean Typography** with proper hierarchy and spacing

## 🛠️ Technical Stack

- **React 19** with functional components and hooks
- **Tailwind CSS 4** for styling and responsive design
- **React Router DOM** for client-side routing
- **Lucide React** for consistent iconography
- **Vite** for fast development and building

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📱 Navigation

### Main Routes

- `/` - Landing page with course showcase and pricing
- `/student-dashboard` - Student learning dashboard
- `/instructor-dashboard` - Instructor management interface

### Key Features Navigation

1. **Landing Page**

   - Click "Start Learning" or "Get Started" to go to student dashboard
   - Click course preview buttons to see detailed course information
   - Toggle between monthly/yearly pricing
   - Navigate testimonials with arrow buttons or dots

2. **Student Dashboard**

   - Use sidebar to switch between Dashboard, Courses, Certificates, and Profile
   - Search and filter courses in the "My Courses" section
   - Click "Continue Learning" to resume course progress
   - Download certificates from the Certificates section

3. **Instructor Dashboard**
   - Monitor performance metrics on the main dashboard
   - Create new courses with the "Create Course" button
   - Review student submissions in the Submissions tab
   - Edit profile information in the Profile section

## 🎨 Customization

### Colors

The platform uses a blue and purple color scheme defined in Tailwind classes:

- Primary: `blue-600` (#2563eb)
- Secondary: `purple-600` (#7c3aed)
- Accent: `indigo-600` (#4f46e5)

### Typography

- Headlines: Bold, large sizes (text-2xl to text-4xl)
- Body text: Regular weight with good contrast
- UI elements: Medium weight for emphasis

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 📊 Dummy Data

The application includes comprehensive dummy data for demonstration:

- **6 Sample Courses** across different categories
- **3 Student Testimonials** with ratings and photos
- **3 Pricing Plans** with feature comparisons
- **User Profiles** for both students and instructors
- **Certificates** and **Assignment Submissions**

## 🔧 Features Implementation

### Search Functionality

- Real-time search across course titles, instructors, and categories
- Debounced input for performance optimization
- Clear search with visual feedback

### Filtering System

- Category-based filtering
- Difficulty level filtering
- Combined search and filter capabilities
- Clear filter options

### Dark Mode

- System-wide dark mode toggle
- Persistent preference storage
- Smooth color transitions
- Consistent styling across all components

### Animations

- Hover effects on cards and buttons
- Page transition animations
- Loading states and micro-interactions
- Smooth carousel transitions

## 🚀 Future Enhancements

Potential features that could be added:

- Video player integration for course content
- Real-time chat/messaging system
- Advanced analytics and reporting
- Payment integration
- Email notifications
- Social learning features
- Mobile app development
- API integration for backend services

## 📝 License

This project is for educational and demonstration purposes. Feel free to use it as a starting point for your own learning platform.

## 🤝 Contributing

This is a demonstration project, but feedback and suggestions are welcome for educational purposes.

---

**Note**: This is a frontend-only application with dummy data. In a production environment, you would need to integrate with a backend API for user authentication, course management, payment processing, and data persistence.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
