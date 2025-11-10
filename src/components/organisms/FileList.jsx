import { motion, AnimatePresence } from "framer-motion";
import FilePreview from "@/components/molecules/FilePreview";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const FileList = ({ files, onRemoveFile, className }) => {
  if (!files || files.length === 0) {
    return (
      <Empty
        title="No files selected"
        description="Your uploaded files will appear here"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Selected Files ({files.length})
        </h3>
        
        {files.length > 0 && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              Total: {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
          >
            <FilePreview
              file={file}
              onRemove={onRemoveFile}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FileList;