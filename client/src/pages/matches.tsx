import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import MatchCard from "@/components/matches/match-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Clock, Play, CheckCircle } from "lucide-react";

export default function Matches() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("upcoming");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  // Mock data - in real app this would come from API
  const mockMatches = [
    {
      id: '1',
      tournamentName: 'Elite Solo Championship',
      type: 'solo',
      entryFee: '50',
      status: 'upcoming',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      roomId: null,
      password: null,
    },
    {
      id: '2',
      tournamentName: 'Duo Clash Arena',
      type: 'duo',
      entryFee: '100',
      status: 'live',
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      roomId: '748392847',
      password: 'fire2024',
    },
    {
      id: '3',
      tournamentName: 'Squad Supremacy',
      type: 'squad',
      entryFee: '200',
      status: 'completed',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      roomId: '123456789',
      password: 'squad123',
      rank: 3,
      kills: 8,
      earning: '600',
    },
  ];

  const filteredMatches = mockMatches.filter(match => match.status === statusFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold mb-4">My Matches</h1>
          <p className="text-muted-foreground text-lg">Track your tournament history and performance</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button
            onClick={() => setStatusFilter("upcoming")}
            variant={statusFilter === "upcoming" ? "default" : "outline"}
            className={statusFilter === "upcoming" ? "bg-accent text-background" : ""}
          >
            <Clock className="mr-2 h-4 w-4" />
            Upcoming
          </Button>
          <Button
            onClick={() => setStatusFilter("live")}
            variant={statusFilter === "live" ? "default" : "outline"}
            className={statusFilter === "live" ? "bg-primary text-primary-foreground" : ""}
          >
            <Play className="mr-2 h-4 w-4" />
            Live
          </Button>
          <Button
            onClick={() => setStatusFilter("completed")}
            variant={statusFilter === "completed" ? "default" : "outline"}
            className={statusFilter === "completed" ? "bg-destructive text-destructive-foreground" : ""}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </Button>
        </div>

        {/* Matches List */}
        {filteredMatches.length > 0 ? (
          <div className="space-y-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {statusFilter === 'upcoming' && '⏰'}
              {statusFilter === 'live' && '🎮'}
              {statusFilter === 'completed' && '🏆'}
            </div>
            <h3 className="text-xl font-semibold mb-2">No {statusFilter} matches</h3>
            <p className="text-muted-foreground">
              {statusFilter === 'upcoming' && "Join a tournament to see upcoming matches"}
              {statusFilter === 'live' && "No live matches at the moment"}
              {statusFilter === 'completed' && "Complete some matches to see your history"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
