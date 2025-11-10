import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class UploadService {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  // Get upload configuration from database
  async loadConfig() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) return null;

      const response = await apperClient.fetchRecords('upload_config_c', {
        fields: [
          {"field": {"Name": "max_file_size_c"}},
          {"field": {"Name": "allowed_types_c"}},
          {"field": {"Name": "max_files_c"}},
          {"field": {"Name": "compression_enabled_c"}}
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (response.success && response.data && response.data.length > 0) {
        const configData = response.data[0];
        this.config = {
          maxFileSize: configData.max_file_size_c || 10485760,
          allowedTypes: configData.allowed_types_c ? configData.allowed_types_c.split(',') : [
            "image/jpeg", "image/png", "image/gif", "application/pdf",
            "text/plain", "text/csv", "application/zip"
          ],
          maxFiles: configData.max_files_c || 10,
          compressionEnabled: configData.compression_enabled_c || false
        };
      } else {
        // Default configuration
        this.config = {
          maxFileSize: 10485760,
          allowedTypes: [
            "image/jpeg", "image/png", "image/gif", "application/pdf",
            "text/plain", "text/csv", "application/zip"
          ],
          maxFiles: 10,
          compressionEnabled: false
        };
      }
    } catch (error) {
      console.error("Error loading upload config:", error);
      // Use default configuration
      this.config = {
        maxFileSize: 10485760,
        allowedTypes: [
          "image/jpeg", "image/png", "image/gif", "application/pdf",
          "text/plain", "text/csv", "application/zip"
        ],
        maxFiles: 10,
        compressionEnabled: false
      };
    }
  }

  // Get upload configuration
  async getUploadConfig() {
    if (!this.config) {
      await this.loadConfig();
    }
    return { ...this.config };
  }

  // Validate file before upload
  validateFile(file) {
    if (!this.config) return { isValid: false, errors: ["Configuration not loaded"] };

    const errors = [];

    // Check file size
    if (file.size > this.config.maxFileSize) {
      const maxSizeMB = (this.config.maxFileSize / 1024 / 1024).toFixed(1);
      errors.push(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get file type category
  getFileCategory(mimeType) {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("pdf")) return "document";
    if (mimeType.includes("word") || mimeType.includes("document")) return "document";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "document";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "document";
    if (mimeType.includes("text")) return "document";
    if (mimeType.includes("zip")) return "archive";
    return "other";
  }

  // Generate file preview (for images)
  generatePreview(file) {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Upload file to database
  async uploadFile(file, onProgress) {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress > 95) progress = 95;
      onProgress?.(Math.floor(progress));
    }, 300);

    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("Database client not available");
      }

      // Simulate upload duration
      const uploadDuration = 1000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, uploadDuration));

      // Create file record in database
      const fileRecord = {
        name_c: file.name,
        size_c: file.size,
        type_c: file.type,
        uploaded_at_c: new Date().toISOString(),
        url_c: URL.createObjectURL(file) // In production, this would be actual file storage URL
      };

      const response = await apperClient.createRecord('uploaded_file_c', {
        records: [fileRecord]
      });

      clearInterval(progressInterval);
      onProgress?.(100);

      if (!response.success) {
        throw new Error(response.message || "Upload failed");
      }

      if (response.results && response.results[0]?.success) {
        const savedRecord = response.results[0].data;
        return {
          id: savedRecord.Id.toString(),
          name: savedRecord.name_c,
          size: savedRecord.size_c,
          type: savedRecord.type_c,
          uploadedAt: new Date(savedRecord.uploaded_at_c).getTime(),
          url: savedRecord.url_c
        };
      } else {
        throw new Error("Failed to save file record");
      }

    } catch (error) {
      clearInterval(progressInterval);
      console.error("Upload failed:", error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadFiles(files, onProgress) {
    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadFile(file, (fileProgress) => {
          const overallProgress = ((i * 100) + fileProgress) / total;
          onProgress?.(Math.floor(overallProgress), i, file.name);
        });
        
        results.push({ success: true, file, result });
      } catch (error) {
        results.push({ success: false, file, error: error.message });
      }
    }

    return results;
  }

  // Get uploaded files from database
  async getUploadedFiles(limit = 50, offset = 0) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) return [];

      const response = await apperClient.fetchRecords('uploaded_file_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}],
        pagingInfo: { limit, offset }
      });

      if (response.success && response.data) {
        return response.data.map(record => ({
          id: record.Id.toString(),
          name: record.name_c,
          size: record.size_c,
          type: record.type_c,
          uploadedAt: new Date(record.uploaded_at_c).getTime(),
          url: record.url_c,
          status: "success"
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      return [];
    }
  }

  // Delete uploaded file
  async deleteUploadedFile(fileId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("Database client not available");

      const response = await apperClient.deleteRecord('uploaded_file_c', {
        RecordIds: [parseInt(fileId)]
      });

      if (!response.success) {
        throw new Error(response.message || "Delete failed");
      }

      return response.success;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  // Get supported file extensions for display
  getSupportedExtensions() {
    if (!this.config) return [];

    const extensionMap = {
      "image/jpeg": ["jpg", "jpeg"],
      "image/png": ["png"],
      "image/gif": ["gif"],
      "image/webp": ["webp"],
      "image/svg+xml": ["svg"],
      "application/pdf": ["pdf"],
      "application/msword": ["doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
      "application/vnd.ms-excel": ["xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
      "application/vnd.ms-powerpoint": ["ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
      "text/plain": ["txt"],
      "text/csv": ["csv"],
      "video/mp4": ["mp4"],
      "video/avi": ["avi"],
      "video/mov": ["mov"],
      "video/wmv": ["wmv"],
      "video/quicktime": ["mov"],
      "audio/mp3": ["mp3"],
      "audio/wav": ["wav"],
      "audio/mpeg": ["mp3"],
      "application/zip": ["zip"],
      "application/x-zip-compressed": ["zip"]
    };

    const extensions = [];
    this.config.allowedTypes.forEach(type => {
      if (extensionMap[type]) {
        extensions.push(...extensionMap[type]);
      }
    });

    return [...new Set(extensions)].sort();
  }

  // Filter files by category
  filterFilesByCategory(files, category) {
    if (category === "all") return files;
    
    return files.filter(file => {
      const fileCategory = this.getFileCategory(file.type);
      
      switch (category) {
        case "images":
          return fileCategory === "image";
        case "documents":
          return fileCategory === "document";
        case "videos":
          return fileCategory === "video";
        case "audio":
          return fileCategory === "audio";
        default:
          return false;
      }
});
  }

  // Format conversion utilities for ApperFileFieldComponent integration
  
  // Convert API format (uppercase properties) to UI format (lowercase properties)
  convertApiToUiFormat(apiFiles) {
    if (!Array.isArray(apiFiles)) return [];
    
    return apiFiles.map(file => ({
      id: file.Id?.toString() || file.id?.toString(),
      name: file.Name || file.name,
      size: file.Size || file.size,
      type: file.Type || file.type,
      uploadedAt: file.UploadedAt || file.uploadedAt,
      url: file.Url || file.url,
      status: file.Status || file.status || 'success'
    }));
  }

  // Convert UI format (lowercase properties) to API format (uppercase properties)
  convertUiToApiFormat(uiFiles) {
    if (!Array.isArray(uiFiles)) return [];
    
    return uiFiles.map(file => ({
      Id: parseInt(file.id) || file.Id,
      Name: file.name || file.Name,
      Size: file.size || file.Size,
      Type: file.type || file.Type,
      UploadedAt: file.uploadedAt || file.UploadedAt,
      Url: file.url || file.Url,
      Status: file.status || file.Status || 'success'
    }));
  }

  // Enhanced file validation with format support
  validateFileWithFormat(file, format = 'ui') {
    // Normalize file object based on format
    const normalizedFile = format === 'api' ? {
      size: file.Size || file.size,
      type: file.Type || file.type,
      name: file.Name || file.name
    } : {
      size: file.size || file.Size,
      type: file.type || file.Type,
      name: file.name || file.Name
    };

    return this.validateFile(normalizedFile);
  }

  // Utility to check if format conversion is needed
  needsFormatConversion(files, targetFormat = 'ui') {
    if (!Array.isArray(files) || files.length === 0) return false;
    
    const firstFile = files[0];
    
    if (targetFormat === 'ui') {
      // Check if it's in API format (has uppercase properties)
      return firstFile.hasOwnProperty('Id') || firstFile.hasOwnProperty('Name') || firstFile.hasOwnProperty('Size');
    } else {
      // Check if it's in UI format (has lowercase properties)
      return firstFile.hasOwnProperty('id') || firstFile.hasOwnProperty('name') || firstFile.hasOwnProperty('size');
    }
  }
}

export default new UploadService();