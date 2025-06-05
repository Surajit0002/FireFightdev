import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import TeamCard from "@/components/teams/team-card";
import CreateTeamForm from "@/components/teams/create-team-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Users, Plus } from "lucide-react";

export default function Teams() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/teams"],
    retry: false,
  });

  if (isLoading || teamsLoading) {
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
          <h1 className="font-orbitron text-4xl font-bold mb-4">Team Management</h1>
          <p className="text-muted-foreground text-lg">Create or join teams for Duo and Squad tournaments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Create Team */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-green">
                <Plus className="mr-2 h-5 w-5" />
                Create New Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreateTeamForm />
            </CardContent>
          </Card>

          {/* My Teams */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center neon-blue">
                <Users className="mr-2 h-5 w-5" />
                My Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams && teams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teams.map((team: any) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No teams yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create your first team to join duo and squad tournaments
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
