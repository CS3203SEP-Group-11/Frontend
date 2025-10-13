import Breadcrumb from '../Breadcrumb';
import { User, Crown, DollarSign, CreditCard, BadgeCheck, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { updateUserById } from '../../api/user';
import { getMySubscriptions, cancelMySubscription } from '../../api/subscriptions';
import { submitInstructorApplication, getMyLatestInstructorApplication } from '../../api/instructorApplication';
import Modal from '../Modal';

const ProfileContent = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    experienceYears: '',
    bio: '',
    expertise: '',
  });
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Store initial values for cancel
  const initialUser = useRef({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profileImageUrl: user?.profileImageUrl || null,
  });

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setPreviewImage(null);
    initialUser.current = {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profileImageUrl: user?.profileImageUrl || null,
    };
  }, [user]);

  useEffect(() => {
    const loadSubs = async () => {
      setSubsLoading(true);
      setSubsError('');
      try {
        const userSubscriptionData = await getMySubscriptions();
        setSubscription(userSubscriptionData || null);
      } catch (e) {
        setSubsError(e.message || 'Failed to load subscriptions');
      } finally {
        setSubsLoading(false);
      }
    };
    loadSubs();
  }, []);

  useEffect(() => {
    // Fetch latest application if user is not INSTRUCTOR or ADMIN
    if (user?.role?.toUpperCase() === 'USER') {
      setAppLoading(true);
      getMyLatestInstructorApplication()
        .then(latest => setApplicationStatus(latest?.status || null))
        .catch(() => setApplicationStatus(null))
        .finally(() => setAppLoading(false));
    }
  }, [user]);

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

  const handleCancel = () => {
    setFirstName(initialUser.current.firstName);
    setLastName(initialUser.current.lastName);
    setPreviewImage(null); // revert to original profile image
  };

  const handleInstructorFormChange = (e) => {
    const { name, value } = e.target;
    setInstructorForm(f => ({ ...f, [name]: value }));
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    setAppLoading(true);
    setAppError('');
    try {
      const payload = {
        experienceYears: instructorForm.experienceYears ? Number(instructorForm.experienceYears) : null,
        bio: instructorForm.bio,
        expertise: instructorForm.expertise,
      };
      await submitInstructorApplication(payload);
      const latest = await getMyLatestInstructorApplication();
      setApplicationStatus(latest?.status || 'PENDING');
      setApplicationSubmitted(true);
      setShowInstructorForm(false);
    } catch (err) {
      setAppError(err.message || 'Failed to submit application');
    } finally {
      setAppLoading(false);
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
            <div className="flex items-center text-gray-600 dark:text-gray-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading subscriptions...</span>
            </div>
          )}
          {subsError && (
            <p className="text-red-600">{subsError}</p>
          )}
          {!subsLoading && !subsError && (
            subscription ? (
              <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 max-w-xl shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Current Plan</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{subscription.planName || subscription.plan?.name || 'Plan'}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    ACTIVE
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {(() => {
                          const amount = Number(subscription.amount);
                          const currency = (subscription.currency || '').toUpperCase();
                          try {
                            return isFinite(amount) && currency
                              ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
                              : `${subscription.amount} ${currency}`.trim();
                          } catch {
                            return `${subscription.amount} ${currency}`.trim();
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Billing</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Auto-renewal enabled</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={async () => {
                      if (!subscription?.subscriptionId) return;
                      if (!confirm('Are you sure you want to cancel your subscription?')) return;
                      try {
                        setCancelLoading(true);
                        await cancelMySubscription(subscription.subscriptionId);
                        setSubscription(null);
                        alert('Subscription canceled.');
                      } catch (err) {
                        alert(err?.message || 'Failed to cancel subscription');
                      } finally {
                        setCancelLoading(false);
                      }
                    }}
                    disabled={cancelLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                  >
                    <XCircle className="w-4 h-4" />
                    {cancelLoading ? 'Canceling...' : 'Cancel Subscription'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">You have no active subscriptions.</p>
            )
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Become an Instructor</h3>
          {appLoading ? (
            <p>Loading application status...</p>
          ) : applicationStatus === 'PENDING' ? (
            <p className="text-yellow-600">Your application is pending review.</p>
          ) : applicationStatus === 'APPROVED' ? (
            <p className="text-green-600">You are now an instructor!</p>
          ) : applicationSubmitted ? (
            <p className="text-yellow-600">Application submitted.</p>
          ) : (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setShowInstructorForm(true)}
            >Apply for Instructor</button>
          )}
        </div>
        <Modal isOpen={showInstructorForm} onClose={() => setShowInstructorForm(false)} title="Instructor Application">
          <form onSubmit={handleInstructorSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <input
                name="experienceYears"
                type="number"
                min={0}
                value={instructorForm.experienceYears}
                onChange={handleInstructorFormChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={instructorForm.bio}
                onChange={handleInstructorFormChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expertise (comma separated)</label>
              <input
                name="expertise"
                value={instructorForm.expertise}
                onChange={handleInstructorFormChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g. React, Node.js, Data Science"
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowInstructorForm(false)}
                disabled={appLoading}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={appLoading}
              >Submit Application</button>
            </div>
            {appError && <p className="text-red-600 mt-2">{appError}</p>}
          </form>
        </Modal>
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={saving}
            onClick={handleCancel}
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

