import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Crown, Users, Target } from "lucide-react";

export default function Leaderboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [period, setPeriod] = useState("daily");

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

  const { data: topPlayers } = useQuery({
    queryKey: [`/api/leaderboard/players?period=${period}`],
    retry: false,
  });

  const { data: topTeams } = useQuery({
    queryKey: [`/api/leaderboard/teams?period=${period}`],
    retry: false,
  });

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
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Top performers across all tournament categories. See who dominates the Fire Fight arena
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button
            onClick={() => setPeriod("daily")}
            variant={period === "daily" ? "default" : "outline"}
            className={`transition-all duration-300 ${period === "daily" ? "bg-blue-600 text-white shadow-lg scale-105" : "hover:scale-105"}`}
          >
            Daily
          </Button>
          <Button
            onClick={() => setPeriod("weekly")}
            variant={period === "weekly" ? "default" : "outline"}
            className={`transition-all duration-300 ${period === "weekly" ? "bg-purple-600 text-white shadow-lg scale-105" : "hover:scale-105"}`}
          >
            Weekly
          </Button>
          <Button
            onClick={() => setPeriod("alltime")}
            variant={period === "alltime" ? "default" : "outline"}
            className={`transition-all duration-300 ${period === "alltime" ? "bg-orange-600 text-white shadow-lg scale-105" : "hover:scale-105"}`}
          >
            All Time
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Top Players */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-green">
                <Crown className="mr-2 h-5 w-5" />
                Top Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                data={Array.isArray(topPlayers) ? topPlayers : []} 
                type="players"
                showEarnings={true}
              />
            </CardContent>
          </Card>

          {/* Top Teams */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-blue">
                <Users className="mr-2 h-5 w-5" />
                Top Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                data={Array.isArray(topTeams) ? topTeams : []} 
                type="teams"
                showEarnings={false}
              />
            </CardContent>
          </Card>

          {/* Top Killers - Mock data for now */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-red">
                <Target className="mr-2 h-5 w-5" />
                Top Killers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "HEADSHOT_KING", kills: 1247, matches: 98, avgKills: 12.7 },
                  { rank: 2, name: "SNIPER_PRO", kills: 1156, matches: 87, avgKills: 13.3 },
                  { rank: 3, name: "KILL_MACHINE", kills: 1098, matches: 92, avgKills: 11.9 },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        player.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-background' :
                        player.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-background' :
                        'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-semibold">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.matches} matches</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold neon-red">{player.kills}</p>
                      <p className="text-xs text-muted-foreground">Avg: {player.avgKills}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
