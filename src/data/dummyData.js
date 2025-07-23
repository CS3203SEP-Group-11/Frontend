// Dummy data for the learning platform

export const courses = [
  {
    id: 1,
    title: "Complete React Development Course",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 2847,
    price: 89.99,
    duration: "42 hours",
    level: "Intermediate",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
    description: "Master React from basics to advanced concepts with hands-on projects.",
    progress: 65,
    lessons: 156,
    completedLessons: 102
  },
  {
    id: 2,
    title: "Python for Data Science",
    instructor: "Dr. Michael Chen",
    rating: 4.9,
    students: 5642,
    price: 99.99,
    duration: "38 hours",
    level: "Beginner",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop",
    description: "Learn Python programming and data analysis with real-world projects.",
    progress: 23,
    lessons: 89,
    completedLessons: 20
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Emma Wilson",
    rating: 4.7,
    students: 3291,
    price: 79.99,
    duration: "28 hours",
    level: "Beginner",
    category: "Design",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=200&fit=crop",
    description: "Design beautiful and functional user interfaces and experiences.",
    progress: 100,
    lessons: 67,
    completedLessons: 67
  },
  {
    id: 4,
    title: "Machine Learning Masterclass",
    instructor: "Prof. Alex Kumar",
    rating: 4.9,
    students: 1829,
    price: 129.99,
    duration: "55 hours",
    level: "Advanced",
    category: "AI & ML",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
    description: "Deep dive into machine learning algorithms and applications.",
    progress: 0,
    lessons: 124,
    completedLessons: 0
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    instructor: "Lisa Rodriguez",
    rating: 4.6,
    students: 4156,
    price: 69.99,
    duration: "32 hours",
    level: "Intermediate",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
    description: "Master digital marketing strategies for modern businesses.",
    progress: 45,
    lessons: 78,
    completedLessons: 35
  },
  {
    id: 6,
    title: "Cloud Computing with AWS",
    instructor: "David Park",
    rating: 4.8,
    students: 2134,
    price: 109.99,
    duration: "46 hours",
    level: "Intermediate",
    category: "Cloud Computing",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
    description: "Build and deploy applications on Amazon Web Services.",
    progress: 12,
    lessons: 98,
    completedLessons: 12
  }
];

export const featuredCourses = courses.slice(0, 3);

export const testimonials = [
  {
    id: 1,
    name: "Jennifer Adams",
    role: "Software Developer",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    text: "This platform completely transformed my career. The React course helped me land my dream job as a frontend developer.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "Data Analyst",
    company: "DataFlow Inc",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "The Python for Data Science course was exactly what I needed. Clear explanations and practical projects made learning enjoyable.",
    rating: 5
  },
  {
    id: 3,
    name: "Amanda Chen",
    role: "UX Designer",
    company: "Design Studio",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Amazing instructors and well-structured content. I've recommended this platform to all my colleagues.",
    rating: 5
  }
];

export const certificates = [
  {
    id: 1,
    courseTitle: "UI/UX Design Fundamentals",
    issuedDate: "2024-12-15",
    certificateId: "CERT-UX-2024-001",
    instructor: "Emma Wilson"
  },
  {
    id: 2,
    courseTitle: "Complete React Development Course",
    issuedDate: "2024-11-28",
    certificateId: "CERT-REACT-2024-002",
    instructor: "Sarah Johnson"
  }
];

export const upcomingLessons = [
  {
    id: 1,
    courseTitle: "Python for Data Science",
    lessonTitle: "Working with Pandas DataFrames",
    scheduledDate: "2025-01-20",
    duration: "45 minutes"
  },
  {
    id: 2,
    courseTitle: "Digital Marketing Strategy",
    lessonTitle: "Social Media Analytics",
    scheduledDate: "2025-01-22",
    duration: "35 minutes"
  }
];

export const instructorStats = {
  totalStudents: 15847,
  totalCourses: 6,
  totalEarnings: 47532.45,
  monthlyGrowth: 12.5
};

export const recentSubmissions = [
  {
    id: 1,
    studentName: "John Doe",
    courseName: "Complete React Development Course",
    assignmentTitle: "Build a Todo App",
    submittedDate: "2025-01-18",
    status: "pending"
  },
  {
    id: 2,
    studentName: "Jane Smith",
    courseName: "Python for Data Science",
    assignmentTitle: "Data Visualization Project",
    submittedDate: "2025-01-17",
    status: "graded"
  },
  {
    id: 3,
    studentName: "Mike Johnson",
    courseName: "UI/UX Design Fundamentals",
    assignmentTitle: "Mobile App Wireframe",
    submittedDate: "2025-01-16",
    status: "pending"
  }
];

// Detailed lessons for each course
export const courseLessons = {
  1: [ // React Development Course
    {
      id: 1,
      title: "Introduction to React",
      duration: "12 minutes",
      type: "video",
      isCompleted: true,
      description: "Understanding the basics of React and setting up your development environment.",
      content: {
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        transcript: "Welcome to React development! In this lesson, we'll cover the fundamentals of React and how to set up your development environment.",
        notes: "React is a JavaScript library for building user interfaces. It allows you to create reusable UI components."
      }
    },
    {
      id: 2,
      title: "JSX Fundamentals",
      duration: "18 minutes",
      type: "video",
      isCompleted: true,
      description: "Learn JSX syntax and how to write JavaScript in your HTML-like code.",
      content: {
        videoUrl: "https://www.youtube.com/embed/7fPXI_MnBOY",
        transcript: "JSX is a syntax extension for JavaScript that looks similar to HTML.",
        notes: "JSX allows you to write HTML-like syntax in your JavaScript code, making it easier to create React components."
      }
    },
    {
      id: 3,
      title: "Components and Props",
      duration: "25 minutes",
      type: "video",
      isCompleted: true,
      description: "Creating reusable components and passing data through props.",
      content: {
        videoUrl: "https://www.youtube.com/embed/9D1x7-2FmTA",
        transcript: "Components are the building blocks of React applications. Props allow you to pass data between components.",
        notes: "Always remember that props are read-only and should never be modified directly in the component."
      }
    },
    {
      id: 4,
      title: "State Management",
      duration: "30 minutes",
      type: "text",
      isCompleted: false,
      description: "Understanding React state and how to manage component data.",
      content: {
        textContent: `
# State Management in React

State is one of the most important concepts in React. It allows components to store and manage data that can change over time.

## What is State?

State is a JavaScript object that stores a component's dynamic data and determines the component's behavior. When state changes, the component re-renders to reflect those changes.

## Using useState Hook

The useState hook is the most common way to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Key Rules for State

1. State is immutable - never modify state directly
2. Use setState function to update state
3. State updates may be asynchronous
4. State updates are merged
        `,
        codeExamples: [
          {
            title: "Basic Counter Example",
            code: "const [count, setCount] = useState(0);"
          },
          {
            title: "String State Example", 
            code: "const [name, setName] = useState('');"
          }
        ]
      }
    },
    {
      id: 5,
      title: "Event Handling Quiz",
      duration: "15 minutes",
      type: "quiz",
      isCompleted: false,
      description: "Test your knowledge of handling user interactions and events in React components.",
      content: {
        questions: [
          {
            id: 1,
            question: "Which of the following is the correct way to handle a click event in React?",
            options: [
              "onClick='handleClick()'",
              "onClick={handleClick}",
              "onClick={handleClick()}",
              "onclick={handleClick}"
            ],
            correctAnswer: 1,
            explanation: "In React, event handlers are passed as references to functions, not called immediately."
          },
          {
            id: 2,
            question: "What is the first parameter passed to React event handlers?",
            options: [
              "The target element",
              "The event object",
              "The component state",
              "The component props"
            ],
            correctAnswer: 1,
            explanation: "React event handlers receive a SyntheticEvent object as their first parameter."
          },
          {
            id: 3,
            question: "How do you prevent the default behavior of an event in React?",
            options: [
              "event.preventDefault()",
              "event.stopPropagation()",
              "return false",
              "event.cancel()"
            ],
            correctAnswer: 0,
            explanation: "Use event.preventDefault() to prevent the default behavior of an event."
          }
        ]
      }
    },
    {
      id: 6,
      title: "React Hooks Reference Guide",
      duration: "Download",
      type: "pdf",
      isCompleted: false,
      description: "Comprehensive reference guide for React hooks with examples and best practices.",
      content: {
        pdfUrl: "/docs/react-hooks-guide.pdf",
        fileSize: "2.4 MB",
        pages: 24,
        summary: "This comprehensive guide covers all essential React hooks including useState, useEffect, useContext, useReducer, and custom hooks. Includes practical examples and best practices.",
        sections: [
          "Introduction to Hooks",
          "useState Hook",
          "useEffect Hook", 
          "useContext Hook",
          "useReducer Hook",
          "Custom Hooks",
          "Best Practices",
          "Common Patterns"
        ]
      }
    },
    {
      id: 7,
      title: "Practice Exercise: Counter App",
      duration: "45 minutes",
      type: "assignment",
      isCompleted: false,
      description: "Build a simple counter application using React hooks.",
      content: {
        instructions: `
# Counter App Assignment

Build a counter application that demonstrates your understanding of React state and event handling.

## Requirements

1. Create a counter that starts at 0
2. Add buttons to increment and decrement the counter
3. Add a reset button to set counter back to 0
4. Display the current count
5. Style the component using CSS or inline styles

## Bonus Features

- Add a step size input (increment/decrement by custom amount)
- Add validation to prevent negative numbers
- Add a maximum count limit
- Include animations for count changes

## Submission

Submit your completed component code and a screenshot of the working application.
        `,
        starterCode: `
import React, { useState } from 'react';

function Counter() {
  // Add your state here
  
  // Add your event handlers here
  
  return (
    <div>
      {/* Add your JSX here */}
    </div>
  );
}

export default Counter;
        `,
        hints: [
          "Use useState to manage the counter value",
          "Remember to use functional updates when the new state depends on the previous state",
          "Consider extracting event handlers into separate functions for better readability"
        ]
      }
    },
    {
      id: 8,
      title: "useEffect Hook - Side Effects",
      duration: "40 minutes",
      type: "video",
      isCompleted: false,
      description: "Managing side effects and lifecycle methods with useEffect.",
      content: {
        videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
        transcript: "The useEffect hook allows you to perform side effects in functional components.",
        notes: "useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount in class components."
      }
    },
    {
      id: 9,
      title: "Conditional Rendering",
      duration: "25 minutes",
      type: "text",
      isCompleted: false,
      description: "Learn different techniques for conditional rendering in React.",
      content: {
        textContent: `
# Conditional Rendering in React

Conditional rendering in React works the same way conditions work in JavaScript. Use JavaScript operators like if or the conditional operator to create elements representing the current state.

## Basic Conditional Rendering

\`\`\`javascript
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign up.</h1>;
}
\`\`\`

## Using the Ternary Operator

\`\`\`javascript
function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}
\`\`\`

## Logical && Operator

\`\`\`javascript
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>You have {unreadMessages.length} unread messages.</h2>
      }
    </div>
  );
}
\`\`\`
        `,
        codeExamples: [
          {
            title: "Inline If with Logical && Operator",
            code: "{unreadMessages.length > 0 && <h2>You have messages.</h2>}"
          },
          {
            title: "Inline If-Else with Conditional Operator",
            code: "{isLoggedIn ? <LogoutButton /> : <LoginButton />}"
          }
        ]
      }
    },
    {
      id: 10,
      title: "Lists and Keys",
      duration: "30 minutes",
      type: "video",
      isCompleted: false,
      description: "Rendering lists and understanding the importance of keys in React.",
      content: {
        videoUrl: "https://www.youtube.com/embed/0sasRxl35_8",
        transcript: "Keys help React identify which items have changed, are added, or are removed.",
        notes: "Keys should be stable, predictable, and unique. Avoid using array indices as keys when the order might change."
      }
    },
    {
      id: 11,
      title: "Forms and Controlled Components",
      duration: "35 minutes",
      type: "video",
      isCompleted: false,
      description: "Handling user input with forms and controlled components.",
      content: {
        videoUrl: "https://www.youtube.com/embed/7Vo_VCcWupQ",
        transcript: "Controlled components are form elements whose values are controlled by React state.",
        notes: "Always use controlled components for form inputs to maintain single source of truth."
      }
    },
    {
      id: 12,
      title: "React Forms Quiz",
      duration: "20 minutes",
      type: "quiz",
      isCompleted: false,
      description: "Test your understanding of React forms and controlled components.",
      content: {
        questions: [
          {
            id: 1,
            question: "What is a controlled component in React?",
            options: [
              "A component that controls other components",
              "A form element whose value is controlled by React state",
              "A component with error boundaries",
              "A component that uses useEffect"
            ],
            correctAnswer: 1,
            explanation: "A controlled component is a form element whose value is controlled by React state, making React the single source of truth."
          },
          {
            id: 2,
            question: "Why should you provide a key prop when rendering lists?",
            options: [
              "To make the code more readable",
              "To improve performance and help React identify changes",
              "It's required by React",
              "To prevent memory leaks"
            ],
            correctAnswer: 1,
            explanation: "Keys help React identify which items have changed, are added, or are removed, improving performance during re-renders."
          }
        ]
      }
    },
    {
      id: 13,
      title: "Component Lifecycle",
      duration: "45 minutes",
      type: "text",
      isCompleted: false,
      description: "Understanding React component lifecycle and useEffect equivalents.",
      content: {
        textContent: `
# React Component Lifecycle

Understanding the component lifecycle is crucial for building effective React applications.

## Class Component Lifecycle Methods

### Mounting
- constructor()
- componentDidMount()

### Updating  
- componentDidUpdate()
- getSnapshotBeforeUpdate()

### Unmounting
- componentWillUnmount()

## Functional Component Equivalents with useEffect

\`\`\`javascript
// componentDidMount
useEffect(() => {
  // This runs after component mounts
}, []);

// componentDidUpdate
useEffect(() => {
  // This runs after every update
});

// componentWillUnmount
useEffect(() => {
  return () => {
    // Cleanup function - runs before component unmounts
  };
}, []);
\`\`\`

## Common Patterns

### Fetching Data
\`\`\`javascript
useEffect(() => {
  fetchData().then(setData);
}, []);
\`\`\`

### Subscribing to Events
\`\`\`javascript
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
\`\`\`
        `
      }
    },
    {
      id: 14,
      title: "Props vs State Assignment",
      duration: "30 minutes",
      type: "assignment",
      isCompleted: false,
      description: "Create components that demonstrate the difference between props and state.",
      content: {
        instructions: `
# Props vs State Assignment

Create a parent and child component that demonstrates the proper use of props and state.

## Requirements

1. Create a Parent component that manages state
2. Create a Child component that receives props
3. Demonstrate data flow from parent to child
4. Show how child can communicate back to parent
5. Include at least one form input

## Components to Build

### UserProfile (Parent)
- Manages user data in state
- Passes data to child components
- Handles form submissions

### UserDisplay (Child)  
- Receives user data via props
- Displays user information
- Includes edit functionality

## Bonus
- Add validation for form inputs
- Include loading states
- Add error handling
        `,
        starterCode: `
import React, { useState } from 'react';

function UserProfile() {
  // Add your state management here
  
  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

function UserDisplay({ user, onEdit }) {
  return (
    <div>
      {/* Display user information */}
    </div>
  );
}

export { UserProfile, UserDisplay };
        `,
        hints: [
          "State belongs in the parent component",
          "Props are passed down from parent to child",
          "Use callback functions to communicate from child to parent",
          "Remember that props are read-only"
        ]
      }
    },
    {
      id: 15,
      title: "React Router Basics",
      duration: "50 minutes",
      type: "video",
      isCompleted: false,
      description: "Navigation and routing in React applications using React Router.",
      content: {
        videoUrl: "https://www.youtube.com/embed/Law7wfdg_ls",
        transcript: "React Router enables navigation and routing in single-page React applications.",
        notes: "React Router provides declarative routing for React applications, allowing you to build single-page applications with multiple views."
      }
    },
    {
      id: 16,
      title: "Final Project: Todo App",
      duration: "2 hours",
      type: "assignment",
      isCompleted: false,
      description: "Build a complete todo application using all the concepts learned in this course.",
      content: {
        instructions: `
# Final Project: Todo Application

Build a fully functional todo application that demonstrates all the React concepts covered in this course.

## Core Features

1. Add new todos
2. Mark todos as complete/incomplete
3. Delete todos
4. Filter todos (All, Active, Completed)
5. Edit existing todos
6. Clear all completed todos

## Technical Requirements

- Use functional components with hooks
- Implement proper state management
- Use controlled components for forms
- Implement proper key props for lists
- Include conditional rendering
- Use useEffect for side effects
- Implement proper component structure

## Advanced Features (Bonus)

- Local storage persistence
- Todo categories/tags
- Due dates for todos
- Search functionality
- Drag and drop reordering
- Dark/light theme toggle

## Submission Requirements

1. Working application code
2. README with setup instructions
3. Screenshots of the application
4. Brief explanation of your approach
        `,
        starterCode: `
import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Add your implementation here
  
  return (
    <div className="todo-app">
      {/* Your todo app JSX */}
    </div>
  );
}

export default TodoApp;
        `,
        hints: [
          "Start with basic add/delete functionality",
          "Use array methods like filter() and map() for managing todos",
          "Consider using a unique ID for each todo",
          "Break down the app into smaller components",
          "Use localStorage for persistence"
        ]
      }
    }
  ],
  2: [ // Python for Data Science
    {
      id: 1,
      title: "Python Basics",
      duration: "20 minutes",
      type: "video",
      isCompleted: true,
      description: "Introduction to Python syntax and basic programming concepts.",
      content: {
        videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
        transcript: "Python is a high-level, interpreted programming language with dynamic semantics.",
        notes: "Python's simple syntax makes it ideal for beginners and powerful for advanced users."
      }
    },
    {
      id: 2,
      title: "Working with Data Types",
      duration: "15 minutes",
      type: "video",
      isCompleted: true,
      description: "Understanding different data types in Python.",
      content: {
        videoUrl: "https://www.youtube.com/embed/ppsCxnNm-JI",
        transcript: "Python has several built-in data types including integers, floats, strings, lists, tuples, and dictionaries.",
        notes: "Understanding data types is fundamental to effective Python programming."
      }
    },
    {
      id: 3,
      title: "Introduction to NumPy",
      duration: "28 minutes",
      type: "video",
      isCompleted: false,
      description: "Getting started with NumPy for numerical computing.",
      content: {
        videoUrl: "https://www.youtube.com/embed/QUT1VHiLmmI",
        transcript: "NumPy is the fundamental package for scientific computing with Python.",
        notes: "NumPy provides support for large, multi-dimensional arrays and matrices."
      }
    },
    {
      id: 4,
      title: "Data Analysis with Pandas",
      duration: "40 minutes",
      type: "video",
      isCompleted: false,
      description: "Learn to manipulate and analyze data using Pandas library.",
      content: {
        videoUrl: "https://www.youtube.com/embed/vmEHCJofslg",
        transcript: "Pandas is a powerful data manipulation and analysis library for Python.",
        notes: "Pandas provides data structures like DataFrame and Series for efficient data analysis."
      }
    },
    {
      id: 5,
      title: "Data Visualization",
      duration: "35 minutes",
      type: "video",
      isCompleted: false,
      description: "Creating charts and graphs with Matplotlib and Seaborn.",
      content: {
        videoUrl: "https://www.youtube.com/embed/UO98lJQ3QGI",
        transcript: "Data visualization is crucial for understanding and communicating data insights.",
        notes: "Matplotlib and Seaborn are powerful libraries for creating various types of plots and charts."
      }
    },
    {
      id: 6,
      title: "Python Lists and Dictionaries",
      duration: "30 minutes",
      type: "text",
      isCompleted: false,
      description: "Deep dive into Python's most important data structures.",
      content: {
        textContent: `
# Python Lists and Dictionaries

Understanding lists and dictionaries is essential for Python programming.

## Lists

Lists are ordered, mutable collections that can store different data types.

\`\`\`python
# Creating lists
fruits = ['apple', 'banana', 'orange']
numbers = [1, 2, 3, 4, 5]
mixed = ['hello', 42, True, 3.14]

# List methods
fruits.append('grape')
fruits.remove('banana')
fruits.sort()
\`\`\`

## Dictionaries

Dictionaries store key-value pairs and are unordered collections.

\`\`\`python
# Creating dictionaries
student = {
    'name': 'John',
    'age': 25,
    'grades': [85, 90, 78]
}

# Accessing values
print(student['name'])
student['email'] = 'john@email.com'
\`\`\`

## List Comprehensions

\`\`\`python
# Traditional way
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]
\`\`\`
        `,
        codeExamples: [
          {
            title: "List Slicing",
            code: "numbers[1:4]  # Returns [2, 3, 4]"
          },
          {
            title: "Dictionary Comprehension",
            code: "{k: v**2 for k, v in {'a': 1, 'b': 2}.items()}"
          }
        ]
      }
    },
    {
      id: 7,
      title: "Pandas Quiz",
      duration: "25 minutes",
      type: "quiz",
      isCompleted: false,
      description: "Test your knowledge of Pandas data manipulation techniques.",
      content: {
        questions: [
          {
            id: 1,
            question: "Which method is used to read a CSV file in Pandas?",
            options: [
              "pd.load_csv()",
              "pd.read_csv()",
              "pd.import_csv()",
              "pd.open_csv()"
            ],
            correctAnswer: 1,
            explanation: "pd.read_csv() is the standard method for reading CSV files into a Pandas DataFrame."
          },
          {
            id: 2,
            question: "What does the .head() method do in Pandas?",
            options: [
              "Returns the first row only",
              "Returns the first 5 rows by default",
              "Returns the column headers",
              "Returns the last 5 rows"
            ],
            correctAnswer: 1,
            explanation: "The .head() method returns the first 5 rows of a DataFrame by default, but you can specify a different number."
          },
          {
            id: 3,
            question: "How do you select a specific column from a DataFrame?",
            options: [
              "df.column_name or df['column_name']",
              "df.get('column_name')",
              "df.select('column_name')",
              "df.column('column_name')"
            ],
            correctAnswer: 0,
            explanation: "You can select a column using either dot notation (df.column_name) or bracket notation (df['column_name'])."
          }
        ]
      }
    },
    {
      id: 8,
      title: "Data Cleaning Techniques",
      duration: "45 minutes",
      type: "assignment",
      isCompleted: false,
      description: "Learn essential data cleaning techniques for real-world datasets.",
      content: {
        instructions: `
# Data Cleaning Assignment

Work with a messy dataset to practice essential data cleaning techniques.

## Dataset

You'll work with a sample sales dataset that contains:
- Missing values
- Duplicate entries
- Inconsistent formatting
- Outliers

## Tasks

1. **Load and Explore**
   - Load the dataset using Pandas
   - Examine the shape, columns, and data types
   - Identify missing values and duplicates

2. **Handle Missing Data**
   - Identify patterns in missing data
   - Decide on appropriate strategies (drop, fill, interpolate)
   - Implement your chosen strategies

3. **Remove Duplicates**
   - Identify duplicate rows
   - Remove duplicates while preserving important data

4. **Data Type Conversion**
   - Convert dates to datetime format
   - Ensure numeric columns are properly typed
   - Handle categorical data

5. **Handle Outliers**
   - Identify outliers using statistical methods
   - Decide whether to remove or cap outliers

## Deliverables

- Cleaned dataset
- Jupyter notebook with your process
- Summary of changes made
        `,
        starterCode: `
import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('sales_data.csv')

# Start your analysis here
print("Dataset shape:", df.shape)
print("\\nColumn info:")
print(df.info())
print("\\nMissing values:")
print(df.isnull().sum())
        `,
        hints: [
          "Use df.info() and df.describe() to understand your data",
          "Consider the business context when deciding how to handle missing values",
          "Use df.duplicated() to find duplicate rows",
          "Visualize data distributions before handling outliers"
        ]
      }
    },
    {
      id: 9,
      title: "Machine Learning Fundamentals",
      duration: "55 minutes",
      type: "video",
      isCompleted: false,
      description: "Introduction to machine learning concepts and scikit-learn.",
      content: {
        videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
        transcript: "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience.",
        notes: "Understanding the different types of machine learning (supervised, unsupervised, reinforcement) is crucial for choosing the right approach."
      }
    },
    {
      id: 10,
      title: "Final Project: Data Analysis Pipeline",
      duration: "3 hours",
      type: "assignment",
      isCompleted: false,
      description: "Build a complete data analysis pipeline from raw data to insights.",
      content: {
        instructions: `
# Final Project: Complete Data Analysis Pipeline

Create a comprehensive data analysis project that demonstrates all skills learned in this course.

## Project Requirements

1. **Data Collection**
   - Use a real-world dataset (suggestions provided)
   - Document data sources and collection methods

2. **Data Cleaning and Preparation**
   - Handle missing values appropriately
   - Remove or handle outliers
   - Create new features if needed

3. **Exploratory Data Analysis**
   - Generate descriptive statistics
   - Create meaningful visualizations
   - Identify patterns and relationships

4. **Data Analysis**
   - Answer specific business questions
   - Use appropriate statistical methods
   - Draw actionable insights

5. **Presentation**
   - Create a clear, professional report
   - Include executive summary
   - Provide recommendations

## Suggested Datasets

- Customer sales data
- Housing prices
- Stock market data
- Social media analytics
- Healthcare data (anonymized)

## Technical Requirements

- Use Pandas for data manipulation
- Use Matplotlib/Seaborn for visualization
- Include statistical analysis
- Follow best practices for code organization
- Document your process thoroughly

## Deliverables

1. Jupyter notebook with complete analysis
2. Clean, documented code
3. Professional presentation slides
4. Written report (2-3 pages)
5. Dataset and any additional files
        `,
        starterCode: `
# Data Analysis Pipeline Template

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Step 1: Data Loading and Initial Exploration
def load_and_explore_data(file_path):
    """Load dataset and perform initial exploration"""
    df = pd.read_csv(file_path)
    
    print("Dataset Overview:")
    print(f"Shape: {df.shape}")
    print(f"\\nColumns: {list(df.columns)}")
    print(f"\\nData Types:\\n{df.dtypes}")
    print(f"\\nMissing Values:\\n{df.isnull().sum()}")
    
    return df

# Step 2: Data Cleaning
def clean_data(df):
    """Perform data cleaning operations"""
    # Add your cleaning logic here
    return df

# Step 3: Exploratory Data Analysis
def perform_eda(df):
    """Generate visualizations and statistics"""
    # Add your EDA code here
    pass

# Step 4: Analysis and Insights
def analyze_data(df):
    """Perform specific analysis and generate insights"""
    # Add your analysis code here
    pass

# Main execution
if __name__ == "__main__":
    # Load your dataset
    df = load_and_explore_data('your_dataset.csv')
    
    # Clean the data
    df_clean = clean_data(df)
    
    # Perform EDA
    perform_eda(df_clean)
    
    # Generate insights
    analyze_data(df_clean)
        `,
        hints: [
          "Start with a clear research question or business problem",
          "Spend adequate time on data exploration before analysis",
          "Create visualizations that tell a story",
          "Always validate your findings",
          "Think about the practical implications of your insights"
        ]
      }
    }
  ],
  3: [ // UI/UX Design Fundamentals
    {
      id: 1,
      title: "Design Principles",
      duration: "25 minutes",
      type: "video",
      isCompleted: true,
      description: "Understanding the fundamental principles of good design."
    },
    {
      id: 2,
      title: "Color Theory",
      duration: "18 minutes",
      type: "video",
      isCompleted: true,
      description: "How to use colors effectively in your designs."
    },
    {
      id: 3,
      title: "Typography Basics",
      duration: "22 minutes",
      type: "video",
      isCompleted: true,
      description: "Choosing and using fonts to enhance your designs."
    },
    {
      id: 4,
      title: "User Research Methods",
      duration: "30 minutes",
      type: "video",
      isCompleted: true,
      description: "Methods for understanding your users and their needs."
    },
    {
      id: 5,
      title: "Wireframing and Prototyping",
      duration: "40 minutes",
      type: "video",
      isCompleted: true,
      description: "Creating wireframes and interactive prototypes."
    }
  ],
  5: [ // Machine Learning Basics
    {
      id: 1,
      title: "What is Machine Learning?",
      duration: "15 minutes",
      type: "video",
      isCompleted: false,
      description: "Introduction to machine learning concepts and applications."
    },
    {
      id: 2,
      title: "Types of Machine Learning",
      duration: "20 minutes",
      type: "video",
      isCompleted: false,
      description: "Understanding supervised, unsupervised, and reinforcement learning."
    },
    {
      id: 3,
      title: "Linear Regression",
      duration: "35 minutes",
      type: "video",
      isCompleted: false,
      description: "Your first machine learning algorithm - linear regression."
    },
    {
      id: 4,
      title: "Classification Algorithms",
      duration: "45 minutes",
      type: "video",
      isCompleted: false,
      description: "Learn about different classification techniques."
    }
  ],
  6: [ // Digital Marketing Essentials
    {
      id: 1,
      title: "Digital Marketing Overview",
      duration: "18 minutes",
      type: "video",
      isCompleted: true,
      description: "Understanding the digital marketing landscape."
    },
    {
      id: 2,
      title: "Social Media Marketing",
      duration: "25 minutes",
      type: "video",
      isCompleted: true,
      description: "Leveraging social media platforms for marketing."
    },
    {
      id: 3,
      title: "Content Marketing Strategy",
      duration: "30 minutes",
      type: "video",
      isCompleted: false,
      description: "Creating and distributing valuable content to attract customers."
    },
    {
      id: 4,
      title: "Email Marketing",
      duration: "22 minutes",
      type: "video",
      isCompleted: false,
      description: "Building and nurturing relationships through email campaigns."
    }
  ]
};

export const pricingPlans = [
  {
    id: 1,
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Limited access to selected courses",
      "Introductory quizzes",
      "Basic course completion certificates",
      "Access to community forums"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Basic",
    price: { monthly: 29, yearly: 290 },
    features: [
      "Access to 5 premium courses per month",
      "Downloadable resources",
      "Standard completion certificates",
      "Community support"
    ],
    popular: false
  },
  {
    id: 3,
    name: "Pro",
    price: { monthly: 49, yearly: 490 },
    features: [
      "Access to all courses",
      "Verified certificates",
      "Community support",
      "Priority support",
      "1-on-1 mentoring sessions"
    ],
    popular: true
  },
];

export const currentUser = {
  id: 1,
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  role: "student", // or "instructor"
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  enrolledCourses: [1, 2, 3, 5, 6],
  completedCourses: [3],
  certificates: [1, 2]
};

export const instructorUser = {
  id: 2,
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  role: "instructor",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  createdCourses: [1],
  totalStudents: 2847,
  totalEarnings: 12543.78
};
