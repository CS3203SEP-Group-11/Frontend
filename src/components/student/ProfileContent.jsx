import Breadcrumb from '../Breadcrumb';
import { currentUser } from '../../data/dummyData';

const ProfileContent = () => (
  <div className="space-y-8">
    <Breadcrumb items={[{ label: 'Profile Settings' }]} />
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-6 mb-8">
        <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Change Photo</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <input type="text" defaultValue={currentUser.name} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input type="email" defaultValue={currentUser.email} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Email notifications for new courses</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Reminder notifications for lessons</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Marketing emails</span>
          </label>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
      </div>
    </div>
  </div>
);

export default ProfileContent;
