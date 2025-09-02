
import { useState, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../api/files';
import { Image, Video, FileText, File, Upload, X } from 'lucide-react';

const FILE_TYPE_OPTIONS = [
  {
    label: 'Image',
    value: 'IMAGE',
    icon: Image,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'] },
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  {
    label: 'Video',
    value: 'VIDEO',
    icon: Video,
    accept: { 'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'] },
    maxSize: 100 * 1024 * 1024 // 100MB
  },
  {
    label: 'PDF',
    value: 'PDF',
    icon: FileText,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 25 * 1024 * 1024 // 25MB
  },
  {
    label: 'DOCX',
    value: 'DOCX',
    icon: File,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 25 * 1024 * 1024 // 25MB
  },
];

const FileUploader = forwardRef(({
  allowedTypes = [],
  onFileSelect,
  label = 'Upload File',
  className = '',
}, ref) => {
  // Available file types (excluding locked ones)
  const availableTypes = useMemo(
    () => FILE_TYPE_OPTIONS.filter(opt => allowedTypes.includes(opt.value)),
    [allowedTypes]
  );

  // State
  const [fileType, setFileType] = useState(availableTypes[0]?.value || 'IMAGE');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();

  // Get selected file type config
  const selectedFileTypeConfig = useMemo(
    () => FILE_TYPE_OPTIONS.find(opt => opt.value === fileType),
    [fileType]
  );

  // Expose upload method to parent via ref
  useImperativeHandle(ref, () => ({
    uploadFile: async () => {
      if (!selectedFile) return null;
      
      setIsUploading(true);
      setError('');
      
      try {
        const result = await uploadFile(selectedFile, fileType);
        setIsUploading(false);
        return { ...result, originalFile: selectedFile };
      } catch (err) {
        setIsUploading(false);
        setError(err.message || 'Failed to upload file');
        throw err;
      }
    },
    getSelectedFile: () => selectedFile,
    getFileType: () => fileType,
    clearFile: () => {
      setSelectedFile(null);
      setError('');
      if (inputRef.current) inputRef.current.value = '';
      if (onFileSelect) onFileSelect(null);
    }
  }));

  // File validation
  const validateFile = (file) => {
    if (!selectedFileTypeConfig) {
      setError('No file type selected');
      return false;
    }

    // Check file size
    if (file.size > selectedFileTypeConfig.maxSize) {
      const maxSizeMB = (selectedFileTypeConfig.maxSize / (1024 * 1024)).toFixed(0);
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    // Check file type based on extension and MIME type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    switch (fileType) {
      case 'IMAGE':
        if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file');
          return false;
        }
        break;
      case 'VIDEO':
        if (!file.type.startsWith('video/')) {
          setError('Please select a valid video file');
          return false;
        }
        break;
      case 'PDF':
        if (fileExtension !== 'pdf' || file.type !== 'application/pdf') {
          setError('Please select a valid PDF file');
          return false;
        }
        break;
      case 'DOCX':
        if (!['docx', 'doc'].includes(fileExtension)) {
          setError('Please select a valid DOCX/DOC file');
          return false;
        }
        break;
      default:
        setError('Invalid file type');
        return false;
    }

    return true;
  };

  // Handle file selection (drag & drop or click)
  const handleFileSelect = (files) => {
    const file = files[0];
    if (!file) return;

    setError('');
    
    if (validateFile(file)) {
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  // Handle file type change
  const handleFileTypeChange = (newType) => {
    setFileType(newType);
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  // Handle manual file input click
  const handleClick = () => {
    if (inputRef.current && !isUploading) {
      inputRef.current.click();
    }
  };

  // Get icon for file type
  const getFileTypeIcon = (type) => {
    const config = FILE_TYPE_OPTIONS.find(opt => opt.value === type);
    const IconComponent = config?.icon || File;
    return <IconComponent className="w-5 h-5 mr-2" />;
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    multiple: false,
    accept: selectedFileTypeConfig?.accept,
    maxSize: selectedFileTypeConfig?.maxSize,
    disabled: isUploading,
    noClick: true, // We handle clicks manually
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block mb-4 font-semibold text-gray-700 dark:text-gray-200 text-sm">
          {label}
        </label>
      )}

      {/* File Type Selection - Only show if multiple types available */}
      {availableTypes.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {availableTypes.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFileTypeChange(option.value)}
              disabled={isUploading}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                fileType === option.value 
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg transform scale-105' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              {getFileTypeIcon(option.value)}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 min-h-[200px] ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${
          isUploading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <input 
          {...getInputProps()} 
          ref={inputRef}
          type="file"
          accept={Object.keys(selectedFileTypeConfig?.accept || {}).join(',')}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) handleFileSelect(files);
          }}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          /* Selected File Display */
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Selected File
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-sm text-red-600 hover:text-red-700 hover:underline"
                disabled={isUploading}
              >
                Clear
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                {getFileTypeIcon(fileType)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Unknown type'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                disabled={isUploading}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className="mt-4 w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change File
            </button>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Drag & drop a file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              or{' '}
              <span className="text-primary-600 underline cursor-pointer hover:text-primary-700">
                click to select
              </span>
            </p>
            {selectedFileTypeConfig && (
              <div className="text-xs text-gray-400 space-y-1">
                <p>Accepted: {selectedFileTypeConfig.label} files</p>
                <p>Max size: {(selectedFileTypeConfig.maxSize / (1024 * 1024)).toFixed(0)}MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* File Type Info */}
      {selectedFileTypeConfig && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <strong>{selectedFileTypeConfig.label}</strong> files accepted • 
            Max size: {(selectedFileTypeConfig.maxSize / (1024 * 1024)).toFixed(0)}MB
          </p>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;
