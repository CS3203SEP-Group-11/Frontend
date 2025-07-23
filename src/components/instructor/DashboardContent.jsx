import { Users, TrendingUp, BookOpen, DollarSign, FileText, Eye } from 'lucide-react';
import { instructorUser, instructorStats, courses, recentSubmissions } from '../../data/dummyData';

const DashboardContent = () => {
  const instructorCourses = courses.filter(course => instructorUser.createdCourses?.includes(course.id));
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <img src={instructorUser.avatar} alt={instructorUser.name} className="w-16 h-16 rounded-full object-cover border-2 border-white" />
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {instructorUser.name}!</h1>
            <p className="text-purple-100">Ready to inspire more learners today?</p>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{instructorStats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+{instructorStats.monthlyGrowth}% this month</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{instructorStats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${instructorStats.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentSubmissions.filter(s => s.status === 'pending').length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Course Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Performance</h2>
        <div className="space-y-4">
          {instructorCourses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={course.image} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{course.students} students enrolled</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{course.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="font-semibold text-gray-900 dark:text-white">${(course.students * course.price).toLocaleString()}</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Submissions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
          <button className="text-primary-600 dark:text-primary-400 hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {recentSubmissions.slice(0, 3).map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{submission.assignmentTitle}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">by {submission.studentName} • {submission.courseName}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">Submitted {new Date(submission.submittedDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>{submission.status}</span>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
