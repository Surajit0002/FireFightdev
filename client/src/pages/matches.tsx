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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
              My Matches
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your tournament history, performance statistics, and upcoming match schedules
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button
            onClick={() => setStatusFilter("upcoming")}
            variant={statusFilter === "upcoming" ? "default" : "outline"}
            className={`transition-all duration-300 ${statusFilter === "upcoming" ? "bg-blue-600 text-white shadow-lg scale-105" : "hover:scale-105"}`}
          >
            <Clock className="mr-2 h-4 w-4" />
            Upcoming
          </Button>
          <Button
            onClick={() => setStatusFilter("live")}
            variant={statusFilter === "live" ? "default" : "outline"}
            className={`transition-all duration-300 ${statusFilter === "live" ? "bg-red-600 text-white shadow-lg scale-105" : "hover:scale-105"}`}
          >
            <Play className="mr-2 h-4 w-4" />
            Live
          </Button>
          <Button
            onClick={() => setStatusFilter("completed")}
            variant={statusFilter === "completed" ? "default" : "outline"}
            className={`transition-all duration-300 ${statusFilter === "completed" ? "bg-green-600 text-white shadow-lg scale-105" : "hover:scale-105"}`}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </Button>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center">
              {statusFilter === 'upcoming' && <Clock className="w-10 h-10 text-gray-400" />}
              {statusFilter === 'live' && <Play className="w-10 h-10 text-gray-400" />}
              {statusFilter === 'completed' && <CheckCircle className="w-10 h-10 text-gray-400" />}
            </div>
            <h3 className="text-xl font-semibold mb-2">No {statusFilter} matches</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {statusFilter === 'upcoming' && "Join a tournament to see upcoming matches and start competing"}
              {statusFilter === 'live' && "No live matches at the moment. Check back soon for active tournaments"}
              {statusFilter === 'completed' && "Complete some matches to see your history and performance statistics"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
