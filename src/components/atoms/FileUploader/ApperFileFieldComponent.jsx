import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ErrorView from '@/components/ui/ErrorView';
import Loading from '@/components/ui/Loading';
import { cn } from '@/utils/cn';

/**
 * ApperFileFieldComponent - File upload component using ApperSDK
 * 
 * Props:
 * - elementId: Unique identifier (use pattern: ${baseName}-${recordId} for lists)
 * - config: Object containing:
 *   - fieldKey: Unique field identifier in database
 *   - tableName: Database table name
 *   - fieldName: Database field name
 *   - apperProjectId: Apper project ID
 *   - apperPublicKey: Apper public key
 *   - existingFiles: Array of previously uploaded files
 *   - fileCount: Maximum allowed files
 *   - purpose: Upload purpose (e.g., 'RecordAttachment')
 * - className: CSS class for styling
 * - style: Inline styles object
 */
const ApperFileFieldComponent = ({ 
  elementId, 
  config, 
  className = '', 
  style = {},
  onFilesChange,
  onError
}) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [sdkError, setSDKError] = useState(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const maxLoadingAttempts = 50; // 50 attempts * 100ms = 5 seconds max wait

  // Validate required props
  useEffect(() => {
    if (!elementId) {
      setSDKError('elementId is required');
      return;
    }
    
    if (!config) {
      setSDKError('config is required');
      return;
    }

    const { fieldKey, tableName, fieldName, apperProjectId, apperPublicKey, purpose } = config;
    
    if (!fieldKey || !tableName || !fieldName || !apperProjectId || !apperPublicKey || !purpose) {
      setSDKError('Missing required config properties: fieldKey, tableName, fieldName, apperProjectId, apperPublicKey, purpose');
      return;
    }
  }, [elementId, config]);

  // Wait for ApperSDK to load
  useEffect(() => {
    let attempts = 0;
    const checkSDK = () => {
      attempts++;
      setLoadingAttempts(attempts);

      if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
        setIsSDKLoaded(true);
        setSDKError(null);
        return;
      }

      if (attempts >= maxLoadingAttempts) {
        setSDKError('ApperSDK failed to load within 5 seconds. Please refresh the page.');
        return;
      }

      // Continue checking
      setTimeout(checkSDK, 100);
    };

    checkSDK();
  }, []);

  // Mount ApperFileUploader.FileField when SDK is ready
  useEffect(() => {
    if (!isSDKLoaded || !containerRef.current || sdkError) return;

    const mountFileField = async () => {
      try {
        // Ensure we have a clean container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Prepare config with format conversion for existingFiles
        const mountConfig = {
          ...config,
          existingFiles: config.existingFiles ? convertUiToApiFormat(config.existingFiles) : []
        };

        // Mount the FileField component
        await window.ApperSDK.ApperFileUploader.FileField.mount(elementId, mountConfig);
        
        if (mountedRef.current) {
          setIsComponentMounted(true);
          setSDKError(null);
        }
      } catch (error) {
        console.error('Failed to mount ApperFileUploader.FileField:', error);
        if (mountedRef.current) {
          setSDKError(`Failed to initialize file uploader: ${error.message}`);
          onError?.(error);
        }
      }
    };

    mountedRef.current = true;
    mountFileField();

    return () => {
      mountedRef.current = false;
    };
  }, [isSDKLoaded, elementId, config, sdkError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isComponentMounted && window.ApperSDK?.ApperFileUploader?.FileField) {
        try {
          window.ApperSDK.ApperFileUploader.FileField.unmount?.(elementId);
        } catch (error) {
          console.error('Error during FileField unmount:', error);
        }
      }
      mountedRef.current = false;
    };
  }, [elementId, isComponentMounted]);

  // Format conversion utilities
  const convertApiToUiFormat = (apiFiles) => {
    if (!Array.isArray(apiFiles)) return [];
    
    return apiFiles.map(file => ({
      id: file.Id?.toString() || file.id?.toString(),
      name: file.Name || file.name,
      size: file.Size || file.size,
      type: file.Type || file.type,
      uploadedAt: file.UploadedAt || file.uploadedAt,
      url: file.Url || file.url,
      status: file.Status || file.status || 'success'
    }));
  };

  const convertUiToApiFormat = (uiFiles) => {
    if (!Array.isArray(uiFiles)) return [];
    
    return uiFiles.map(file => ({
      Id: parseInt(file.id) || file.Id,
      Name: file.name || file.Name,
      Size: file.size || file.Size,
      Type: file.type || file.Type,
      UploadedAt: file.uploadedAt || file.UploadedAt,
      Url: file.url || file.Url,
      Status: file.status || file.Status || 'success'
    }));
  };

  // Get files from the component
  const getFiles = (fieldKey) => {
    if (!isComponentMounted || !window.ApperSDK?.ApperFileUploader?.FileField) {
      return [];
    }

    try {
      const files = window.ApperSDK.ApperFileUploader.FileField.getFiles(fieldKey);
      return convertApiToUiFormat(files);
    } catch (error) {
      console.error('Error getting files:', error);
      onError?.(error);
      return [];
    }
  };

  // Handle retry
  const handleRetry = () => {
    setSDKError(null);
    setLoadingAttempts(0);
    setIsSDKLoaded(false);
    setIsComponentMounted(false);
  };

  // Loading state
  if (!isSDKLoaded && !sdkError) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300', className)} style={style}>
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loading className="w-8 h-8 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Loading File Uploader</h3>
            <p className="text-sm text-gray-600">
              Initializing ApperSDK... ({loadingAttempts}/{maxLoadingAttempts})
            </p>
            <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
              <motion.div
                className="bg-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(loadingAttempts / maxLoadingAttempts) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (sdkError) {
    return (
      <div className={cn('', className)} style={style}>
        <ErrorView 
          error={sdkError}
          onRetry={handleRetry}
          className="min-h-64"
        />
      </div>
    );
  }

  // Success state - show the mounted component
  return (
    <motion.div
      className={cn('file-field-container', className)}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Container for ApperSDK FileField */}
      <div 
        ref={containerRef}
        id={elementId}
        className="w-full"
      />
      
      {/* Loading overlay while mounting */}
      <AnimatePresence>
        {isSDKLoaded && !isComponentMounted && (
          <motion.div
            className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center space-y-3">
              <Loading className="w-6 h-6 mx-auto" />
              <p className="text-sm text-gray-600">Mounting file field...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success indicator when fully mounted */}
      <AnimatePresence>
        {isComponentMounted && (
          <motion.div
            className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <ApperIcon name="Check" size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Export getFiles utility for external access
ApperFileFieldComponent.getFiles = (fieldKey) => {
  if (!window.ApperSDK?.ApperFileUploader?.FileField) {
    console.warn('ApperSDK not available');
    return [];
  }

  try {
    const files = window.ApperSDK.ApperFileUploader.FileField.getFiles(fieldKey);
    
    // Convert API format to UI format
    if (!Array.isArray(files)) return [];
    
    return files.map(file => ({
      id: file.Id?.toString() || file.id?.toString(),
      name: file.Name || file.name,
      size: file.Size || file.size,
      type: file.Type || file.type,
      uploadedAt: file.UploadedAt || file.uploadedAt,
      url: file.Url || file.url,
      status: file.Status || file.status || 'success'
    }));
  } catch (error) {
    console.error('Error getting files:', error);
    return [];
  }
};

export default ApperFileFieldComponent;