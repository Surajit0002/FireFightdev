import { Button } from "@/components/ui/button";
import { Trophy, Users, Target, Gamepad2 } from "lucide-react";

interface TournamentFiltersProps {
  statusFilter: string;
  typeFilter: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
}

export default function TournamentFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
}: TournamentFiltersProps) {
  const statusFilters = [
    { value: "upcoming", label: "Upcoming", icon: Trophy },
    { value: "live", label: "Live", icon: Target },
    { value: "completed", label: "Completed", icon: Users },
    { value: "all", label: "All", icon: Gamepad2 },
  ];

  const typeFilters = [
    { value: "all", label: "All Types" },
    { value: "solo", label: "Solo" },
    { value: "duo", label: "Duo" },
    { value: "squad", label: "Squad" },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Tournament Status</h3>
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(filter.value)}
                className={
                  statusFilter === filter.value
                    ? "bg-primary text-primary-foreground hover:shadow-neon-green"
                    : "border-border hover:border-primary/50"
                }
              >
                <Icon className="mr-2 h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Tournament Type</h3>
        <div className="flex flex-wrap gap-3">
          {typeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={typeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(filter.value)}
              className={
                typeFilter === filter.value
                  ? "bg-accent text-background hover:shadow-neon-blue"
                  : "border-border hover:border-accent/50"
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
