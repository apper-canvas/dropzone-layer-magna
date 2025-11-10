import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import uploadService from "@/services/api/uploadService";
import { cn } from "@/utils/cn";

const UploadControls = ({ 
  files, 
  onFilesUpdate, 
  onUploadComplete, 
  className 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const pendingFiles = files.filter(f => f.status === "pending");
  const uploadingFiles = files.filter(f => f.status === "uploading");
  const completedFiles = files.filter(f => f.status === "success");
  const errorFiles = files.filter(f => f.status === "error");

  const handleUpload = async () => {
    if (pendingFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setOverallProgress(0);

    try {
      const totalFiles = pendingFiles.length;
      let completedCount = 0;

      // Update files to uploading status
      const updatedFiles = files.map(file => 
        file.status === "pending" 
          ? { ...file, status: "uploading", progress: 0 }
          : file
      );
      onFilesUpdate(updatedFiles);

      // Upload files one by one
      for (const file of pendingFiles) {
        try {
          // Update current file progress
          const updateFileProgress = (progress) => {
            onFilesUpdate(prevFiles => 
              prevFiles.map(f => 
                f.id === file.id 
                  ? { ...f, progress }
                  : f
              )
            );
          };

          // Upload file
          await uploadService.uploadFile(file.file, updateFileProgress);

          // Mark as success
          onFilesUpdate(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id 
                ? { 
                    ...f, 
                    status: "success", 
                    progress: 100, 
                    uploadedAt: Date.now() 
                  }
                : f
            )
          );

          completedCount++;
          setOverallProgress((completedCount / totalFiles) * 100);
          
        } catch (error) {
          console.error("Upload failed for file:", file.name, error);
          
          // Mark as error
          onFilesUpdate(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id 
                ? { 
                    ...f, 
                    status: "error", 
                    error: error.message,
                    progress: 0
                  }
                : f
            )
          );
        }
      }

      // Show completion message
      const successCount = completedCount;
      const errorCount = pendingFiles.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file${successCount === 1 ? "" : "s"}!`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to upload ${errorCount} file${errorCount === 1 ? "" : "s"}`);
      }

      onUploadComplete?.({
        total: pendingFiles.length,
        success: successCount,
        error: errorCount
      });

    } catch (error) {
      console.error("Upload process failed:", error);
      toast.error("Upload process failed");
    } finally {
      setIsUploading(false);
      setOverallProgress(0);
    }
  };

  const handleClearAll = () => {
    if (isUploading) return;
    onFilesUpdate([]);
    toast.info("All files cleared");
  };

  const handleRetryErrors = async () => {
    if (errorFiles.length === 0 || isUploading) return;

    // Reset error files to pending
    const updatedFiles = files.map(file => 
      file.status === "error" 
        ? { ...file, status: "pending", error: null, progress: 0 }
        : file
    );
    onFilesUpdate(updatedFiles);
    
    toast.info("Retrying failed uploads...");
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Section */}
      {isUploading && (
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Upload" size={20} className="text-blue-600" />
            </motion.div>
            <h3 className="font-semibold text-blue-900">Uploading Files...</h3>
          </div>
          
          <ProgressBar
            value={overallProgress}
            variant="default"
            size="lg"
            showLabel
            className="mb-2"
          />
          
          <div className="flex justify-between text-sm text-blue-700">
            <span>
              {completedFiles.length + uploadingFiles.length} of {files.length} files processed
            </span>
            <span>{Math.round(overallProgress)}% complete</span>
          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{files.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingFiles.length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{completedFiles.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-red-600">{errorFiles.length}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleUpload}
          disabled={pendingFiles.length === 0 || isUploading}
          loading={isUploading}
          className="flex-1"
        >
          <ApperIcon name="Upload" size={20} className="mr-2" />
          {isUploading 
            ? "Uploading..." 
            : `Upload ${pendingFiles.length} File${pendingFiles.length === 1 ? "" : "s"}`
          }
        </Button>

        {errorFiles.length > 0 && (
          <Button
            variant="secondary"
            size="lg"
            onClick={handleRetryErrors}
            disabled={isUploading}
          >
            <ApperIcon name="RotateCcw" size={20} className="mr-2" />
            Retry Failed
          </Button>
        )}

        <Button
          variant="ghost"
          size="lg"
          onClick={handleClearAll}
          disabled={isUploading}
        >
          <ApperIcon name="Trash2" size={20} className="mr-2" />
          Clear All
        </Button>
      </div>

      {/* Upload Tips */}
      {!isUploading && pendingFiles.length > 0 && (
        <motion.div
          className="bg-purple-50 p-4 rounded-lg border border-purple-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-700">
              <p className="font-medium mb-1">Ready to upload</p>
              <p>
                Make sure your internet connection is stable. Large files may take longer to upload.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadControls;