import { useState, useEffect } from 'react';
import { submitInstructorApplication, getMyLatestInstructorApplication } from '../../api/instructorApplication';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ApplyInstructorForm() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ experienceYears: '', bio: '', expertise: '' });
  const [submitting, setSubmitting] = useState(false);
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyLatestInstructorApplication();
        setLatest(data);
      } catch (e) {
        setLatest(null);
      }
    })();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
        bio: form.bio,
        expertise: form.expertise, // comma-separated
      };
      const res = await submitInstructorApplication(payload);
      setSuccess('Application submitted successfully.');
      setLatest(res);
    } catch (err) {
      setError(err.message || 'Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return <div className="p-4 bg-yellow-50 border rounded">Please log in to apply.</div>;
  }

  // If there is already a submitted application, show its status and details
  if (latest) {
    if (latest.status === 'APPROVED') {
      return (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                🎉 Congratulations! You are now an Instructor!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your application has been approved and you can now create and manage courses.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div><strong>Approved on:</strong> {latest.updatedAt ? new Date(latest.updatedAt).toLocaleDateString() : '-'}</div>
              <div><strong>Bio:</strong> {latest.bio}</div>
              <div><strong>Expertise:</strong> {latest.expertise}</div>
              <div><strong>Experience Years:</strong> {latest.experienceYears}</div>
            </div>
          </div>
        </div>
      );
    }

    if (latest.status === 'PENDING') {
      return (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                Application Under Review
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Your instructor application is being reviewed by our team. We'll notify you once a decision is made.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div><strong>Submitted on:</strong> {latest.createdAt ? new Date(latest.createdAt).toLocaleDateString() : '-'}</div>
              <div><strong>Bio:</strong> {latest.bio}</div>
              <div><strong>Expertise:</strong> {latest.expertise}</div>
              <div><strong>Experience Years:</strong> {latest.experienceYears}</div>
            </div>
          </div>
        </div>
      );
    }

    if (latest.status === 'REJECTED') {
      return (
        <div className="space-y-4">
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                  Application Not Approved
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Your instructor application was not approved. You may submit a new application with updated information.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div><strong>Previous Application:</strong></div>
                <div><strong>Bio:</strong> {latest.bio}</div>
                <div><strong>Expertise:</strong> {latest.expertise}</div>
                <div><strong>Experience Years:</strong> {latest.experienceYears}</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You can submit a new application below with improved qualifications.
            </p>
          </div>
          {error && <div className="p-2 bg-red-50 text-red-700 border rounded">{error}</div>}
          {success && <div className="p-2 bg-green-50 text-green-700 border rounded">{success}</div>}
        </div>
      );
    }

    // For any other status, show basic info
    return (
      <div className="space-y-4">
        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium mb-1">Application Status: <span className="font-bold">{latest.status}</span></div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Submitted at: {latest.createdAt ? new Date(latest.createdAt).toLocaleString() : '-'}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bio: {latest.bio}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expertise: {latest.expertise}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Experience Years: {latest.experienceYears}</div>
        </div>
        {error && <div className="p-2 bg-red-50 text-red-700 border rounded">{error}</div>}
        {success && <div className="p-2 bg-green-50 text-green-700 border rounded">{success}</div>}
      </div>
    );
  }

  // Otherwise, show the application form
  return (
    <div className="space-y-4">
      {error && <div className="p-2 bg-red-50 text-red-700 border rounded">{error}</div>}
      {success && <div className="p-2 bg-green-50 text-green-700 border rounded">{success}</div>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm mb-1">Years of Experience</label>
          <input name="experienceYears" type="number" min={0} value={form.experienceYears} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea name="bio" rows={4} value={form.bio} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Expertise (comma separated)</label>
          <input name="expertise" value={form.expertise} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-600 text-white rounded disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Apply to be an Instructor'}
        </button>
      </form>
    </div>
  );
}
