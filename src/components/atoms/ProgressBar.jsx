import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = forwardRef(({ 
  value = 0, 
  max = 100,
  className,
  showLabel = false,
  size = "default",
  variant = "default",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-1.5",
    default: "h-2",
    lg: "h-3"
  };

  const variants = {
    default: "bg-gradient-to-r from-purple-600 to-purple-500",
    success: "bg-gradient-to-r from-green-500 to-green-400",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    danger: "bg-gradient-to-r from-red-500 to-red-400"
  };

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizes[size]
      )}>
        <motion.div
          className={cn("h-full rounded-full", variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;