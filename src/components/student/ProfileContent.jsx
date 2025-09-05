import Breadcrumb from '../Breadcrumb';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { updateUserById } from '../../api/user';
import { getMySubscriptions } from '../../api/subscriptions';

const ProfileContent = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState('');

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
  }, [user]);

  useEffect(() => {
    const loadSubs = async () => {
      setSubsLoading(true);
      setSubsError('');
      try {
        const data = await getMySubscriptions();
        setSubscriptions(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        setSubsError(e.message || 'Failed to load subscriptions');
      } finally {
        setSubsLoading(false);
      }
    };
    loadSubs();
  }, []);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        console.log('Image uploaded:', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        firstName,
        lastName,
      };
      if (previewImage) {
        payload.profileImageUrl = previewImage;
      }
      await updateUserById(user.id, payload);
      await refreshUser();
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
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
            {firstName && lastName ? `${firstName} ${lastName}` : 'User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
          <button 
            onClick={handleImageUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={saving}
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            disabled={saving}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
          <input 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            disabled={saving}
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
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Subscription Plans</h3>
        {subsLoading && (
          <p className="text-gray-600 dark:text-gray-400">Loading subscriptions...</p>
        )}
        {subsError && (
          <p className="text-red-600">{subsError}</p>
        )}
        {!subsLoading && !subsError && (
          subscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{sub.plan?.name || sub.planName || 'Plan'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} dark:${sub.status === 'ACTIVE' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                      {sub.status || 'ACTIVE'}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>Price: {sub.plan?.price?.amount ? `${sub.plan.price.amount} ${sub.plan.price.currency || ''}` : (sub.price ? `${sub.price}` : '—')}</p>
                    {sub.start_date && <p>Started: {new Date(sub.start_date).toLocaleDateString()}</p>}
                    {sub.end_date && <p>Ends: {new Date(sub.end_date).toLocaleDateString()}</p>}
                    {sub.next_billing_date && <p>Next Billing: {new Date(sub.next_billing_date).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">You have no active subscriptions.</p>
          )
        )}
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button 
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          disabled={saving}
        >Cancel</button>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleSave}
          disabled={saving}
        >{saving ? 'Saving...' : 'Save Changes'}</button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  </div>
  );
};

export default ProfileContent;
