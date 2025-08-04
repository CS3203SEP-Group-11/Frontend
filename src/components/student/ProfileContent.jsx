import Breadcrumb from '../Breadcrumb';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRef, useState } from 'react';

const ProfileContent = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Show preview of uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        // Here you would typically upload the file to your server
        console.log('Image uploaded:', e.target.result);
        // Example: updateUserProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
  <div className="space-y-8">
    <Breadcrumb items={[{ label: 'Profile Settings' }]} />
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-6 mb-8">
        {previewImage || user?.profileImageUrl ? (
          <img 
            src={previewImage || user.profileImageUrl} 
            alt={`${user?.firstName} ${user?.lastName}`} 
            className="w-24 h-24 rounded-full object-cover" 
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
          <button 
            onClick={handleImageUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Change Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
          <input 
            type="text" 
            defaultValue={user?.firstName || ''} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
          <input 
            type="text" 
            defaultValue={user?.lastName || ''} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input 
            type="email" 
            defaultValue={user?.email || ''} 
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed opacity-60" 
            disabled
            readOnly
          />
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed opacity-60" disabled />
            <span className="ml-2 text-gray-700 dark:text-gray-300 opacity-60">Email notifications for new courses</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed opacity-60" disabled />
            <span className="ml-2 text-gray-700 dark:text-gray-300 opacity-60">Reminder notifications for lessons</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed opacity-60" disabled />
            <span className="ml-2 text-gray-700 dark:text-gray-300 opacity-60">Marketing emails</span>
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
};

export default ProfileContent;
