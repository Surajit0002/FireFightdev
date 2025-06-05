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

  const filteredTournaments = Array.isArray(tournaments) ? tournaments.filter((tournament: any) => {
    if (typeFilter === 'all') return true;
    return tournament.type === typeFilter;
  }) : [];

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Tournaments
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join live tournaments and compete for real money prizes in the ultimate Fire Fight experience
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <TournamentFilters
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
          />
        </div>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTournaments.map((tournament: any) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {typeFilter !== 'all' || statusFilter !== 'upcoming' 
                ? "Try adjusting your filters to see more tournaments"
                : "New tournaments are coming soon. Check back later for exciting matches"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
