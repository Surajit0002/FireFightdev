import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import TournamentCard from "@/components/tournaments/tournament-card";
import TournamentFilters from "@/components/tournaments/tournament-filters";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Tournaments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [typeFilter, setTypeFilter] = useState("all");

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

  const { data: tournaments, isLoading: tournamentsLoading } = useQuery({
    queryKey: [`/api/tournaments${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`],
    retry: false,
  });

  const filteredTournaments = tournaments?.filter((tournament: any) => {
    if (typeFilter === 'all') return true;
    return tournament.type === typeFilter;
  }) || [];

  if (isLoading || tournamentsLoading) {
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
          <h1 className="font-orbitron text-4xl font-bold mb-4">Tournaments</h1>
          <p className="text-muted-foreground text-lg">Join live tournaments and compete for real money prizes</p>
        </div>

        <TournamentFilters
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
        />

        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament: any) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground">
              {typeFilter !== 'all' || statusFilter !== 'upcoming' 
                ? "Try adjusting your filters"
                : "Check back later for new tournaments"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
