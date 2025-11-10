import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No files selected", 
  description = "Drag and drop files here or click to browse", 
  onAction,
  actionLabel = "Browse Files",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      <motion.div
        className="text-center space-y-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Empty Icon */}
        <motion.div
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name="Upload" size={36} className="text-purple-600" />
        </motion.div>

        {/* Empty Message */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>

        {/* Action Button */}
        {onAction && (
          <motion.button
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="FolderOpen" size={18} />
            <span>{actionLabel}</span>
          </motion.button>
        )}

        {/* Supported Formats */}
        <motion.div
          className="text-xs text-gray-500 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-medium">Supported formats:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["JPG", "PNG", "GIF", "PDF", "DOC", "MP4"].map((format) => (
              <span
                key={format}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
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

export default Empty;