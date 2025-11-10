import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import uploadService from "@/services/api/uploadService";
import { cn } from "@/utils/cn";

const FileDropZone = ({ 
  onFilesSelected, 
  maxFiles = 10, 
  accept = "",
  disabled = false,
  className 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = useCallback(async (files) => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    const processedFiles = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file
        const validation = uploadService.validateFile(file);
        
        const processedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          status: validation.isValid ? "pending" : "error",
          progress: 0,
          preview: null,
          error: validation.isValid ? null : validation.errors[0],
          uploadedAt: null
        };

        // Generate preview for images
        if (validation.isValid && file.type.startsWith("image/")) {
          try {
            processedFile.preview = await uploadService.generatePreview(file);
          } catch (error) {
            console.warn("Failed to generate preview:", error);
          }
        }

        processedFiles.push(processedFile);
      }

      onFilesSelected?.(processedFiles);

      if (processedFiles.some(f => f.status === "error")) {
        toast.warning("Some files have validation errors");
      } else {
        toast.success(`${processedFiles.length} file${processedFiles.length === 1 ? "" : "s"} ready for upload`);
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files");
    } finally {
      setIsProcessing(false);
    }
  }, [disabled, isProcessing, onFilesSelected]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isProcessing) {
      setIsDragOver(true);
    }
  }, [disabled, isProcessing]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || isProcessing) return;

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    processFiles(files);
  }, [disabled, isProcessing, maxFiles, processFiles]);

  const handleFileSelect = useCallback((e) => {
    if (disabled || isProcessing) return;

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    processFiles(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [disabled, isProcessing, processFiles]);

  const openFileDialog = useCallback(() => {
    if (disabled || isProcessing) return;
    fileInputRef.current?.click();
  }, [disabled, isProcessing]);

  return (
    <div className={cn("relative", className)}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone */}
      <motion.div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer",
          isDragOver
            ? "border-purple-400 bg-purple-50/50 scale-[1.02]"
            : "border-gray-300 bg-gray-50/30 hover:border-purple-300 hover:bg-purple-50/30",
          disabled && "opacity-50 cursor-not-allowed",
          isProcessing && "cursor-wait"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={!disabled && !isProcessing ? { scale: 1.01 } : {}}
        animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
      >
        {/* Upload Icon */}
        <motion.div
          className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center",
            isDragOver
              ? "bg-gradient-to-br from-purple-200 to-purple-300"
              : "bg-gradient-to-br from-gray-200 to-gray-300"
          )}
          animate={isProcessing ? { rotate: 360 } : { rotate: 0 }}
          transition={isProcessing ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
        >
          <ApperIcon 
            name={isProcessing ? "Loader" : isDragOver ? "Download" : "Upload"} 
            size={36} 
            className={cn(
              isDragOver ? "text-purple-600" : "text-gray-500"
            )}
          />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                Processing Files...
              </h3>
              <p className="text-gray-600">
                Please wait while we prepare your files
              </p>
            </motion.div>
          ) : isDragOver ? (
            <motion.div
              key="dragover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h3 className="text-xl font-semibold text-purple-700">
                Drop Files Here
              </h3>
              <p className="text-purple-600">
                Release to add files to your upload queue
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Support for images, documents, videos and more. 
                Maximum {maxFiles} files, up to 10MB each.
              </p>
              
              <Button
                variant="primary"
                size="lg"
                className="mt-6"
                disabled={disabled}
              >
                <ApperIcon name="FolderOpen" size={20} className="mr-2" />
                Choose Files
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supported Formats */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-500 mb-3 font-medium">Supported formats:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["JPG", "PNG", "GIF", "PDF", "DOC", "MP4", "ZIP"].map((format) => (
              <span
                key={format}
                className="px-2 py-1 bg-white text-gray-600 rounded-full text-xs font-medium border border-gray-200"
              >
                {format}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FileDropZone;