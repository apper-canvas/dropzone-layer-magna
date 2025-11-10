import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FileDropZone from "@/components/organisms/FileDropZone";
import FileList from "@/components/organisms/FileList";
import UploadControls from "@/components/organisms/UploadControls";
import FileTypeFilter from "@/components/molecules/FileTypeFilter";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import uploadService from "@/services/api/uploadService";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load upload configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const uploadConfig = await uploadService.getUploadConfig();
        setConfig(uploadConfig);
      } catch (err) {
        console.error("Failed to load upload config:", err);
        setError(err.message || "Failed to load upload configuration");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Filter files when filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredFiles(files);
    } else {
      const filtered = uploadService.filterFilesByCategory(files, activeFilter);
      setFilteredFiles(filtered);
    }
  }, [files, activeFilter]);

  const handleFilesSelected = (newFiles) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    toast.info("File removed");
  };

  const handleUploadComplete = (results) => {
    console.log("Upload completed:", results);
    
    if (results.success > 0 && results.error === 0) {
      // Auto-clear successful uploads after a delay
      setTimeout(() => {
        setFiles(prevFiles => prevFiles.filter(file => file.status !== "success"));
      }, 3000);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    // Reload the page essentially
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={handleRetry} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Upload" size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-4">
            DropZone
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload files quickly with visual feedback and validation. 
            Drag, drop, and watch your files upload seamlessly.
          </p>

          {/* Upload Stats */}
          <motion.div
            className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" size={16} />
              <span>Secure uploads</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Zap" size={16} />
              <span>Lightning fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={16} />
              <span>Multiple formats</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Drop Zone */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileDropZone
              onFilesSelected={handleFilesSelected}
              maxFiles={config?.maxFiles || 10}
              accept={config?.allowedTypes?.join(",") || ""}
            />
          </motion.div>

          {/* Upload Controls Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* File Type Filter */}
            {files.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Filter" size={16} className="mr-2" />
                  Filter Files
                </h3>
                <FileTypeFilter
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div>
            )}

            {/* Upload Controls */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm">
              <UploadControls
                files={files}
                onFilesUpdate={setFiles}
                onUploadComplete={handleUploadComplete}
              />
            </div>

            {/* Upload Limits Info */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <ApperIcon name="Info" size={16} className="mr-2" />
                Upload Limits
              </h3>
              <div className="space-y-2 text-sm text-purple-700">
                <div className="flex justify-between">
                  <span>Max file size:</span>
                  <span className="font-medium">
                    {config ? (config.maxFileSize / 1024 / 1024).toFixed(1) : "10"} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max files:</span>
                  <span className="font-medium">{config?.maxFiles || 10}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compression:</span>
                  <span className="font-medium">
                    {config?.compressionEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
</div>
            </div>
          </motion.div>
        </div>
        {/* File List */}
        {filteredFiles.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FileList
              files={filteredFiles}
              onRemoveFile={handleRemoveFile}
            />
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Lock" size={14} />
              <span>Files are processed securely</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Trash2" size={14} />
              <span>No files stored permanently</span>
            </div>
          </div>
          <p className="mt-4">
            Built with React, Tailwind CSS, and Framer Motion for a premium upload experience.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;