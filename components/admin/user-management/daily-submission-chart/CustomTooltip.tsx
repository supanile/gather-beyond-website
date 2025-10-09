import { DailySubmissionData } from "@/types/admin/user-missions";

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload?: DailySubmissionData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-sm font-medium mb-2 text-popover-foreground">
          {label}
        </p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <p
            key={index}
            className="text-sm text-muted-foreground"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
