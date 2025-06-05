import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "@/components/ui/countdown-timer";
import { Trophy, Users, Target, Clock } from "lucide-react";

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    type: string;
    entryFee: string;
    prizePool: string;
    maxParticipants: number;
    currentParticipants: number;
    status: string;
    startTime: string;
    imageUrl?: string;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);

  const joinTournamentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tournaments/${tournament.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success!",
        description: "Successfully joined the tournament",
      });
      setIsJoining(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to join tournament. Please try again.",
        variant: "destructive",
      });
      setIsJoining(false);
    },
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solo':
        return 'bg-primary text-primary-foreground';
      case 'duo':
        return 'bg-accent text-background';
      case 'squad':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-primary text-primary-foreground animate-pulse-neon';
      case 'upcoming':
        return 'bg-accent text-background';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleJoin = () => {
    setIsJoining(true);
    joinTournamentMutation.mutate();
  };

  const isFull = tournament.currentParticipants >= tournament.maxParticipants;
  const isUpcoming = tournament.status === 'upcoming';

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon-green/20 hover:shadow-lg">
      <CardHeader className="pb-3">
        {/* Tournament Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {tournament.imageUrl ? (
            <img 
              src={tournament.imageUrl} 
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tournament Arena</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg leading-tight">{tournament.name}</h3>
          <Badge className={getTypeColor(tournament.type)}>
            {tournament.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tournament Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Entry Fee:</span>
            <span className="neon-green font-semibold">₹{tournament.entryFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prize Pool:</span>
            <span className="neon-blue font-semibold">₹{tournament.prizePool}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Players:</span>
            <span className="text-foreground font-semibold">
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className={getStatusColor(tournament.status)}>
            {tournament.status === 'live' && <Target className="mr-1 h-3 w-3" />}
            {tournament.status === 'upcoming' && <Clock className="mr-1 h-3 w-3" />}
            {tournament.status.toUpperCase()}
          </Badge>
        </div>
        
        {/* Countdown Timer */}
        {isUpcoming && (
          <div className="bg-muted rounded-lg p-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Starts in</div>
              <CountdownTimer 
                targetDate={tournament.startTime}
                className="font-mono neon-red font-bold"
              />
            </div>
          </div>
        )}
        
        {/* Join Button */}
        <Button
          className={`w-full font-bold transition-all ${
            tournament.status === 'live' 
              ? 'bg-primary text-primary-foreground hover:shadow-neon-green'
              : tournament.status === 'upcoming'
              ? 'bg-accent text-background hover:shadow-neon-blue'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          onClick={handleJoin}
          disabled={
            !isUpcoming || 
            isFull || 
            isJoining || 
            joinTournamentMutation.isPending
          }
        >
          {isJoining || joinTournamentMutation.isPending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Joining...
            </div>
          ) : isFull ? (
            <>
              <Users className="mr-2 h-4 w-4" />
              Tournament Full
            </>
          ) : tournament.status === 'live' ? (
            <>
              <Target className="mr-2 h-4 w-4" />
              Join Live
            </>
          ) : tournament.status === 'upcoming' ? (
            <>
              <Trophy className="mr-2 h-4 w-4" />
              Join Tournament
            </>
          ) : (
            'Tournament Ended'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
