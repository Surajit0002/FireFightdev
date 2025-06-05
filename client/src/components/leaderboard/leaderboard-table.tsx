import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardTableProps {
  data: any[];
  type: 'players' | 'teams';
  showEarnings: boolean;
}

export default function LeaderboardTable({ data, type, showEarnings }: LeaderboardTableProps) {
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-background';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-background';
      case 2:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 10).map((item, index) => (
        <div key={item.id || index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(index)}`}>
              {index + 1}
            </div>
            
            <div className="flex items-center space-x-2">
              {type === 'players' ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.profileImageUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {item.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-background text-xs font-bold">
                    {item.name?.charAt(0) || 'T'}
                  </span>
                </div>
              )}
              
              <div>
                <p className="font-semibold text-sm">
                  {type === 'players' ? item.displayName : item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {type === 'players' 
                    ? `${item.totalMatches || 0} matches` 
                    : `${item.type || 'team'} team`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {showEarnings ? (
              <>
                <p className="font-bold neon-green text-sm">₹{item.totalEarnings || "0.00"}</p>
                <p className="text-xs text-muted-foreground">
                  Win: {item.totalWins && item.totalMatches 
                    ? Math.round((item.totalWins / item.totalMatches) * 100) 
                    : 0}%
                </p>
              </>
            ) : (
              <>
                <p className="font-bold neon-blue text-sm">
                  {item.totalMatches || item.memberCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {type === 'players' ? 'Matches' : 'Members'}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
