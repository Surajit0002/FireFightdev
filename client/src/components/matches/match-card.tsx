import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "@/components/ui/countdown-timer";
import { Clock, Play, CheckCircle, Copy, Trophy, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface MatchCardProps {
  match: {
    id: string;
    tournamentName: string;
    type: string;
    entryFee: string;
    status: 'upcoming' | 'live' | 'completed';
    startTime: string;
    roomId?: string | null;
    password?: string | null;
    rank?: number;
    kills?: number;
    earning?: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (match.status) {
      case 'upcoming':
        return <Clock className="h-5 w-5 text-accent" />;
      case 'live':
        return <Play className="h-5 w-5 text-primary animate-pulse-neon" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'upcoming':
        return 'border-accent/20';
      case 'live':
        return 'border-primary animate-pulse-neon';
      case 'completed':
        return 'border-border';
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const isRoomCodeAvailable = match.status === 'live' && match.roomId;

  return (
    <Card className={`bg-card border ${getStatusColor()} transition-all`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          {/* Match Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{match.tournamentName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {match.type} Tournament • Entry: ₹{match.entryFee}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(match.startTime), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>

          {/* Status Specific Content */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {match.status === 'upcoming' && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Starts in</div>
                <CountdownTimer 
                  targetDate={match.startTime}
                  className="font-mono neon-blue font-bold"
                />
              </div>
            )}

            {match.status === 'live' && isRoomCodeAvailable && (
              <div className="bg-muted rounded-lg p-3 min-w-48">
                <div className="text-xs text-muted-foreground mb-2">Room Details</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono neon-green text-sm">{match.roomId}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(match.roomId!, "Room ID")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {match.password && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pass:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono neon-green text-sm">{match.password}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(match.password!, "Password")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {match.status === 'completed' && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                  <div className="font-bold neon-blue">#{match.rank}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Kills</div>
                  <div className="font-bold neon-red">{match.kills}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Earning</div>
                  <div className="font-bold neon-green">₹{match.earning}</div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div>
              {match.status === 'upcoming' && (
                <Badge className="bg-accent text-background">
                  <Clock className="mr-1 h-3 w-3" />
                  Waiting
                </Badge>
              )}
              
              {match.status === 'live' && (
                <Button className="bg-primary text-primary-foreground hover:shadow-neon-green">
                  <Target className="mr-2 h-4 w-4" />
                  Join Now
                </Button>
              )}
              
              {match.status === 'completed' && (
                <Button variant="outline" className="border-border hover:border-accent">
                  <Trophy className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Live Status Banner */}
        {match.status === 'live' && (
          <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-2">
            <div className="text-center text-sm">
              <span className="neon-green font-semibold">🔴 LIVE</span>
              <span className="text-muted-foreground ml-2">
                Match is currently in progress
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
