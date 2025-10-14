import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import Breadcrumb from '../Breadcrumb';
import { getMyCertificates } from '../../api/enrollment';

const CertificatesContent = ({ setActiveTab }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyCertificates();
        if (!mounted) return;
        const normalized = Array.isArray(data) ? data : [];
        setCertificates(normalized);
        setError('');
      } catch (err) {
        console.error('Failed to load certificates', err);
        if (!mounted) return;
        setError(err?.message || 'Failed to load certificates');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDownload = (url) => {
    if (!url) return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error('Failed to open certificate URL', e);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Certificates' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-gray-600 dark:text-gray-400">{loading ? 'Loading…' : `${certificates.length} certificates earned`}</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, idx) => (
            <div key={cert.publicId || idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => handleDownload(cert.certificateUrl)}
                  disabled={!cert.certificateUrl}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm text-white ${cert.certificateUrl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Download
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{cert.courseTitle || 'Untitled Course'}</h3>
              {cert.publicId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {cert.publicId}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No certificates yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Complete courses to earn your first certificate</p>
          {typeof setActiveTab === 'function' && (
            <button onClick={() => setActiveTab('courses')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">View My Courses</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificatesContent;
