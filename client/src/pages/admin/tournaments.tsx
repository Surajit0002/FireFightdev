import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Plus, Edit, Trash2, Users } from "lucide-react";

export default function AdminTournaments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-primary text-primary-foreground';
      case 'upcoming':
        return 'bg-accent text-background';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-orbitron text-4xl font-bold mb-2">Tournament Management</h1>
            <p className="text-muted-foreground text-lg">Create and manage tournaments</p>
          </div>
          <Button className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Create Tournament
          </Button>
        </div>

        {tournaments && tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament: any) => (
              <Card key={tournament.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    <Badge className={getStatusColor(tournament.status)}>
                      {tournament.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-semibold capitalize">{tournament.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entry Fee:</span>
                      <span className="neon-green font-semibold">₹{tournament.entryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prize Pool:</span>
                      <span className="neon-blue font-semibold">₹{tournament.prizePool}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-semibold">
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </span>
                    </div>
                    
                    {tournament.roomId && (
                      <div className="bg-muted rounded-lg p-3 mt-3">
                        <div className="text-xs text-muted-foreground mb-1">Room Details</div>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-muted-foreground">ID:</span>{" "}
                            <span className="font-mono neon-green">{tournament.roomId}</span>
                          </div>
                          {tournament.roomPassword && (
                            <div>
                              <span className="text-muted-foreground">Pass:</span>{" "}
                              <span className="font-mono neon-green">{tournament.roomPassword}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Users className="mr-1 h-3 w-3" />
                        Players
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tournaments found</h3>
              <p className="text-muted-foreground mb-4">Create your first tournament to get started</p>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
