import { motion } from "framer-motion";

const Loading = ({ className = "" }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50 ${className}`}>
      <div className="text-center space-y-6 max-w-md">
        {/* Loading Spinner */}
        <motion.div
          className="relative w-16 h-16 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-purple-600"></div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-900">Loading DropZone</h3>
          <p className="text-gray-600">Preparing your file upload experience...</p>
        </motion.div>

        {/* Shimmer Placeholder */}
        <motion.div
          className="w-full max-w-sm mx-auto space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Drop Zone Placeholder */}
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl shimmer"></div>
          
          {/* File List Placeholder */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg shimmer"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded shimmer"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;