import { Plus } from 'lucide-react';
import { instructorUser, courses } from '../../data/dummyData';

const CoursesContent = ({ setActiveTab }) => {
  const instructorCourses = courses.filter(course => instructorUser.createdCourses?.includes(course.id));
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        <button onClick={() => setActiveTab('create')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create New Course</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {instructorCourses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{course.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.students}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="font-semibold text-gray-900 dark:text-white">${(course.students * course.price).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Edit Course</button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Analytics</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesContent;
