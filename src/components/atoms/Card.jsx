import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hoverable = false,
  ...props 
}, ref) => {
  const baseStyles = "rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-200";
  
  const variants = {
    default: "shadow-sm hover:shadow-md",
    elevated: "shadow-lg hover:shadow-xl",
    outline: "border-2 shadow-none hover:shadow-sm",
    ghost: "border-transparent bg-transparent shadow-none hover:bg-gray-50/50"
  };

  const hoverStyles = hoverable ? "hover:scale-[1.02] cursor-pointer" : "";

  return (
    <motion.div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      whileHover={hoverable ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;