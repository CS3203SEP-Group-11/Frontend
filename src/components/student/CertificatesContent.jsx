import { Award } from 'lucide-react';
import Breadcrumb from '../Breadcrumb';
import { certificates } from '../../data/dummyData';

const CertificatesContent = ({ setActiveTab }) => (
  <div className="space-y-8">
    <Breadcrumb items={[{ label: 'Certificates' }]} />
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
      <p className="text-gray-600 dark:text-gray-400">{certificates.length} certificates earned</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certificates.map((cert) => (
        <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Download</button>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{cert.courseTitle}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Instructor: {cert.instructor}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">ID: {cert.certificateId}</p>
        </div>
      ))}
    </div>
    {certificates.length === 0 && (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No certificates yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Complete courses to earn your first certificate</p>
        <button onClick={() => setActiveTab('courses')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">View My Courses</button>
      </div>
    )}
  </div>
);

export default CertificatesContent;
