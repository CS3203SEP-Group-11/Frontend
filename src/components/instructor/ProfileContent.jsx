import { User, UserRoundPen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyInstructorProfile, updateMyInstructorProfile } from '../../api/user';

const ProfileContent = () => {
  const { user } = useAuth();
  const [instructorProfile, setInstructorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    instructorName: '',
    contactDetails: {
      email: '',
      linkedin: '',
      website: ''
    },
    expertise: [],
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const profile = await getMyInstructorProfile();
    setInstructorProfile(profile);
    if (profile) {
      setFormData({
        instructorName: profile.instructorName || '',
        contactDetails: {
          email: profile.contactDetails?.email || '',
          linkedin: profile.contactDetails?.linkedin || '',
          website: profile.contactDetails?.website || ''
        },
        expertise: profile.expertise || [],
        bio: profile.bio || ''
      });
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleExpertiseChange = (value) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      expertise: skills
    }));
  };

  const handleSave = async () => {
    try {
      await updateMyInstructorProfile(formData);
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile
    if (instructorProfile) {
      setFormData({
        instructorName: instructorProfile.instructorName || '',
        contactDetails: {
          email: instructorProfile.contactDetails?.email || '',
          linkedin: instructorProfile.contactDetails?.linkedin || '',
          website: instructorProfile.contactDetails?.website || ''
        },
        expertise: instructorProfile.expertise || [],
        bio: instructorProfile.bio || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Profile</h1>
        {!isEditing && (
           <button onClick={() => setIsEditing(true)} 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <UserRoundPen className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-6 mb-8">
        {instructorProfile?.profileImageUrl ? (
          <img
            src={instructorProfile.profileImageUrl}
            alt={instructorProfile?.instructorName || ''}
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
          />
          ) : (
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{instructorProfile?.instructorName}</h2>
          <p className="text-gray-600 dark:text-gray-400">{instructorProfile?.contactDetails.email}</p>
          <p className="text-gray-500 dark:text-gray-500">Instructor since {instructorProfile?.createdAt ? new Date(instructorProfile.createdAt).getFullYear() : ''}</p>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Details</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">LinkedIn:</span>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.contactDetails.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value, 'contactDetails')}
                    className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="LinkedIn URL"
                  />
                ) : (
                  instructorProfile?.contactDetails?.linkedin && (
                    <a
                      href={instructorProfile.contactDetails.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      {instructorProfile.contactDetails.linkedin}
                    </a>
                  )
                )}
              </div>
              
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Website:</span>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.contactDetails.website}
                    onChange={(e) => handleInputChange('website', e.target.value, 'contactDetails')}
                    className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Website URL"
                  />
                ) : (
                  instructorProfile?.contactDetails?.website && (
                    <a
                      href={instructorProfile.contactDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      {instructorProfile.contactDetails.website}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expertise</h3>
            {isEditing ? (
              <input
                type="text"
                value={formData.expertise.join(', ')}
                onChange={(e) => handleExpertiseChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter skills separated by commas"
              />
            ) : (
              <ul className="flex flex-wrap gap-2">
                {instructorProfile?.expertise?.map((skill, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
          <textarea
            rows={4}
            value={isEditing ? formData.bio : (instructorProfile?.bio || '')}
            onChange={isEditing ? (e) => handleInputChange('bio', e.target.value) : undefined}
            readOnly={!isEditing}
            placeholder="Tell students about yourself, your experience, and what you're passionate about teaching..."
            className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              !isEditing ? 'cursor-default' : ''
            }`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;