import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50">
      <motion.div
        className="text-center space-y-8 max-w-md px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Icon */}
        <motion.div
          className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name="FileX" size={48} className="text-white" />
        </motion.div>

        {/* Error Content */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Home" size={18} />
            <span>Go Home</span>
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-200 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          className="text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Need help? Try going back to the homepage and start fresh.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;