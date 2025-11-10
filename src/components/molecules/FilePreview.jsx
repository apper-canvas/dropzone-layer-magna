import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilePreview = ({ file, onRemove, className }) => {
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("video/")) return "Video";
    if (mimeType.startsWith("audio/")) return "Music";
    if (mimeType.includes("pdf")) return "FileText";
    if (mimeType.includes("word") || mimeType.includes("document")) return "FileText";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "Calculator";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "Presentation";
    if (mimeType.includes("zip")) return "Archive";
    return "File";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "uploading":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "uploading":
        return "Loader";
      default:
        return "Clock";
    }
  };

  return (
    <motion.div
      className={cn(
        "flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -1 }}
    >
      {/* File Thumbnail/Icon */}
      <div className="flex-shrink-0">
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <ApperIcon 
              name={getFileIcon(file.type)} 
              size={24} 
              className="text-purple-600" 
            />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <div className="flex items-center space-x-2">
            {/* Status Icon */}
            <motion.div
              className={getStatusColor(file.status)}
              animate={file.status === "uploading" ? { rotate: 360 } : {}}
              transition={file.status === "uploading" ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <ApperIcon name={getStatusIcon(file.status)} size={16} />
            </motion.div>

            {/* Remove Button */}
            {onRemove && file.status !== "uploading" && (
              <motion.button
                onClick={() => onRemove(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ApperIcon name="X" size={16} />
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          
          {file.status === "uploading" && (
            <p className="text-xs text-blue-600 font-medium">
              {file.progress || 0}%
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {file.status === "uploading" && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${file.progress || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {file.status === "error" && file.error && (
          <p className="text-xs text-red-500 mt-1">
            {file.error}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default FilePreview;