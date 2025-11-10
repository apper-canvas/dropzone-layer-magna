import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FileTypeFilter = ({ activeFilter, onFilterChange, className }) => {
  const filters = [
    { id: "all", label: "All Files", icon: "Files" },
    { id: "images", label: "Images", icon: "Image" },
    { id: "documents", label: "Documents", icon: "FileText" },
    { id: "videos", label: "Videos", icon: "Video" }
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeFilter === filter.id
              ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name={filter.icon} size={16} />
          <span>{filter.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default FileTypeFilter;