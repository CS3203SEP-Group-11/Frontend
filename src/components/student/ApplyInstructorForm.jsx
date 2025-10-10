import { useState, useEffect } from 'react';
import { submitInstructorApplication, getMyLatestInstructorApplication } from '../../api/instructorApplication';
import { useAuth } from '../../context/AuthContext';

export default function ApplyInstructorForm() {
  const { isLoggedIn } = useAuth();
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
        // ignore
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

  return (
    <div className="space-y-4">
      {latest && (
        <div className="p-3 border rounded bg-gray-50">
          <div className="text-sm">Latest status: <span className="font-medium">{latest.status}</span></div>
          <div className="text-xs text-gray-600">Submitted at: {latest.createdAt ? new Date(latest.createdAt).toLocaleString() : '-'}</div>
        </div>
      )}
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
