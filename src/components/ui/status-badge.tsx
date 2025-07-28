import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  LoaderIcon,
} from "lucide-react";

interface StatusBadgeProps {
  status: "success" | "error" | "pending" | "warning" | "in_progress";
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    className:
      "bg-success/10 text-success border-success/20 hover:bg-success/20",
    icon: CheckCircle,
  },
  error: {
    className: "bg-error/10 text-error border-error/20 hover:bg-error/20",
    icon: XCircle,
  },
  pending: {
    className:
      "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
    icon: Clock,
  },
  warning: {
    className:
      "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
    icon: AlertTriangle,
  },
  in_progress: {
    className:
      "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
    icon: LoaderIcon,
  },
};

export function StatusBadge({
  status,
  children,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    icon: AlertTriangle,
    className: "bg-muted text-muted-foreground",
  };

  const Icon = config.icon;

  return (
    <Badge className={cn(config.className, className)}>
      {showIcon && Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </Badge>
  );
}
