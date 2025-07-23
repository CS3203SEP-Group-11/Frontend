import { instructorUser } from '../../data/dummyData';

const ProfileContent = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Profile</h1>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-6 mb-8">
        <img src={instructorUser.avatar} alt={instructorUser.name} className="w-24 h-24 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{instructorUser.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{instructorUser.email}</p>
          <p className="text-gray-500 dark:text-gray-500">Instructor since 2022</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Change Photo</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <input type="text" defaultValue={instructorUser.name} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input type="email" defaultValue={instructorUser.email} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      </div>
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
        <textarea rows={4} placeholder="Tell students about yourself, your experience, and what you're passionate about teaching..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
      </div>
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
      </div>
    </div>
  </div>
);

export default ProfileContent;
