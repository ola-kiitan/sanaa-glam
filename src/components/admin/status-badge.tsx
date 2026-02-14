import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
};

const STATUS_STYLES: Record<StatusBadgeProps["status"], string> = {
  CONFIRMED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
  NO_SHOW: "bg-amber-100 text-amber-800 hover:bg-amber-100",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={STATUS_STYLES[status]}>{status.replace("_", " ")}</Badge>;
}
