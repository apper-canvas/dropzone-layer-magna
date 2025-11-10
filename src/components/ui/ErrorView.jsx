import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 ${className}`}>
      <motion.div
        className="text-center space-y-6 max-w-md px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">Upload Error</h2>
          <p className="text-gray-600 leading-relaxed">
            {error}
          </p>
        </motion.div>

        {/* Retry Button */}
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="RotateCcw" size={18} />
            <span>Try Again</span>
          </motion.button>
        )}

        {/* Help Text */}
        <motion.div
          className="text-sm text-gray-500 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>If the problem persists, try:</p>
          <ul className="text-left space-y-1 text-xs">
            <li>• Check your internet connection</li>
            <li>• Ensure files are under size limit</li>
            <li>• Verify file types are supported</li>
            <li>• Refresh the page and try again</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorView;