import uploadConfigData from "@/services/mockData/uploadConfig.json";

class UploadService {
  constructor() {
    this.config = { ...uploadConfigData };
  }

  // Simulate delay for realistic experience
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get upload configuration
  async getUploadConfig() {
    await this.delay(200);
    return { ...this.config };
  }

  // Validate file before upload
  validateFile(file) {
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

  // Simulate file upload with progress
  async uploadFile(file, onProgress) {
    await this.delay(100);

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

    // Random upload duration between 2-5 seconds
    const uploadDuration = 2000 + Math.random() * 3000;
    await this.delay(uploadDuration);

    clearInterval(progressInterval);
    onProgress?.(100);

    // Small chance of failure for testing
    if (Math.random() < 0.1) {
      throw new Error("Upload failed due to network error");
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: Date.now(),
      url: URL.createObjectURL(file) // In real app, this would be server URL
    };
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

  // Get supported file extensions for display
  getSupportedExtensions() {
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
}

export default new UploadService();