import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "default", 
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 focus:ring-purple-500 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 focus:ring-purple-500 shadow-lg hover:shadow-xl",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-400 text-white hover:from-red-600 hover:to-red-500 focus:ring-red-500 shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-green-500 to-green-400 text-white hover:from-green-600 hover:to-green-500 focus:ring-green-500 shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    default: "px-6 py-3 text-base h-11",
    lg: "px-8 py-4 text-lg h-12"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:transform-none",
        className
      )}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;