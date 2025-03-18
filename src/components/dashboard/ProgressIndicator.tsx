import React from "react";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  progress?: number; // 0-100
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

const ProgressIndicator = ({
  progress = 0,
  size = "md",
  showPercentage = true,
  className,
}: ProgressIndicatorProps) => {
  // Ensure progress is between 0-100
  const validProgress = Math.max(0, Math.min(100, progress));

  // Determine color based on progress
  const getProgressColor = () => {
    if (validProgress < 25) return "bg-red-500";
    if (validProgress < 50) return "bg-orange-500";
    if (validProgress < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Determine height based on size
  const getHeight = () => {
    switch (size) {
      case "sm":
        return "h-2";
      case "lg":
        return "h-4";
      default:
        return "h-3";
    }
  };

  return (
    <div className={cn("flex flex-col gap-1 w-full bg-background", className)}>
      <Progress
        value={validProgress}
        className={cn(getHeight(), "w-full")}
        indicatorClassName={getProgressColor()}
      />
      {showPercentage && (
        <div className="text-xs font-medium text-right">{validProgress}%</div>
      )}
    </div>
  );
};

export default ProgressIndicator;
