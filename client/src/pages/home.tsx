import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, Target, Clock, TrendingUp, Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments?status=upcoming"],
    retry: false,
  });

  const { data: walletBalance } = useQuery({
    queryKey: ["/api/wallet/balance"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Fire Fight Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Welcome back, <span className="font-bold text-orange-500">{user?.displayName || "Gamer"}</span>
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to dominate the battlefield? Check your stats, join tournaments, and manage your Fire Fight career
          </p>
        </div>

        {/* Enhanced Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold neon-green">
                    ₹{walletBalance?.balance || "0.00"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Matches</p>
                  <p className="text-2xl font-bold neon-blue">{user?.totalMatches || 0}</p>
                </div>
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Wins</p>
                  <p className="text-2xl font-bold neon-red">{user?.totalWins || 0}</p>
                </div>
                <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{user?.totalEarnings || "0.00"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/tournaments">
                <Button className="w-full bg-primary text-primary-foreground hover:shadow-neon-green">
                  <Trophy className="mr-2 h-4 w-4" />
                  Browse Tournaments
                </Button>
              </Link>
              <Link href="/teams">
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-background">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Teams
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  Add Money
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-accent" />
                Live Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tournaments && tournaments.length > 0 ? (
                <div className="space-y-3">
                  {tournaments.slice(0, 3).map((tournament: any) => (
                    <div key={tournament.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold">{tournament.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Entry: ₹{tournament.entryFee} • Prize: ₹{tournament.prizePool}
                        </p>
                      </div>
                      <Button size="sm" className="bg-primary text-primary-foreground">
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No live tournaments available</p>
                  <Button className="mt-4" asChild>
                    <Link href="/tournaments">Browse All Tournaments</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-2">
                Join a tournament to see your activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
