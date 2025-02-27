import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AlertProps {
  title?: string;
  children: ReactNode;
  variant?: "default" | "destructive";
  className?: string;
  icon?: ReactNode;
}

export function Alert({
  title,
  children,
  variant = "default",
  className,
  icon = <AlertCircle className="h-4 w-4" />,
}: AlertProps) {
  const variantStyles = {
    default: "bg-blue-50 border-blue-300 text-blue-700",
    destructive: "bg-red-50 border-red-300 text-red-700",
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-md flex items-start gap-2",
        variantStyles[variant],
        className
      )}
    >
      <span className="mt-1">{icon}</span>
      <div>
        {title && <div className="font-medium">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function AlertDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("text-sm", className)}>{children}</p>;
}
