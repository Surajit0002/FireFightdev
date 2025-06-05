
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, Target, Clock, TrendingUp, Star, Zap, Crown, Flame, Shield, Gamepad2, Award } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-border"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 bg-gradient-to-r from-red-500/20 to-orange-500/20"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Wallet Balance",
      value: `₹${(walletBalance as any)?.balance || "0.00"}`,
      icon: Target,
      gradient: "bg-gradient-to-r from-emerald-500 to-green-600",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-100",
      shadowColor: "shadow-emerald-500/30",
      textColor: "text-emerald-700"
    },
    {
      title: "Total Matches",
      value: (user as any)?.totalMatches || 0,
      icon: Gamepad2,
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
      bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-100",
      shadowColor: "shadow-blue-500/30",
      textColor: "text-blue-700"
    },
    {
      title: "Total Wins",
      value: (user as any)?.totalWins || 0,
      icon: Crown,
      gradient: "bg-gradient-to-r from-yellow-500 to-amber-600",
      bgPattern: "bg-gradient-to-br from-yellow-50 to-amber-100",
      shadowColor: "shadow-yellow-500/30",
      textColor: "text-yellow-700"
    },
    {
      title: "Total Earnings",
      value: `₹${(user as any)?.totalEarnings || "0.00"}`,
      icon: TrendingUp,
      gradient: "bg-gradient-to-r from-purple-500 to-pink-600",
      bgPattern: "bg-gradient-to-br from-purple-50 to-pink-100",
      shadowColor: "shadow-purple-500/30",
      textColor: "text-purple-700"
    }
  ];

  const quickActions = [
    {
      title: "Browse Tournaments",
      description: "Find your next challenge",
      icon: Trophy,
      href: "/tournaments",
      gradient: "bg-gradient-to-r from-red-500 to-orange-600",
      hoverGradient: "hover:from-red-600 hover:to-orange-700",
      shadowColor: "shadow-red-500/40"
    },
    {
      title: "Manage Teams",
      description: "Build your squad",
      icon: Users,
      href: "/teams",
      gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
      hoverGradient: "hover:from-blue-600 hover:to-indigo-700",
      shadowColor: "shadow-blue-500/40"
    },
    {
      title: "Add Money",
      description: "Fund your battles",
      icon: Zap,
      href: "/wallet",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
      hoverGradient: "hover:from-green-600 hover:to-emerald-700",
      shadowColor: "shadow-green-500/40"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-orange-600 p-4 sm:p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="font-orbitron text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Fire Fight
                </h1>
              </div>
              <p className="text-white/90 text-sm sm:text-base mt-2">
                Elite Gaming Arena
              </p>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">{(user as any)?.displayName || "Gamer"}</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Ready to dominate the battlefield? Check your stats, join tournaments, and rise through the ranks
            </p>
          </div>
        </div>

        {/* Stats Grid - Enhanced Mobile Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`${stat.bgPattern} border-0 shadow-lg ${stat.shadowColor} hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.title}</p>
                      <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid - Advanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Quick Actions - Spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 shadow-2xl backdrop-blur-sm">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-white">
                  <Shield className="mr-3 h-6 w-6 text-orange-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.title} href={action.href}>
                        <div className={`${action.gradient} ${action.hoverGradient} p-4 sm:p-6 rounded-xl shadow-lg ${action.shadowColor} hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                          <div className="text-center space-y-3">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors duration-300">
                              <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-sm sm:text-base">{action.title}</h3>
                              <p className="text-white/80 text-xs sm:text-sm">{action.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Tournaments Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-900/90 border-indigo-700/50 shadow-2xl backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl font-bold text-white">
                  <Clock className="mr-2 h-5 w-5 text-cyan-400" />
                  Live Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(tournaments) && tournaments.length > 0 ? (
                  <div className="space-y-3">
                    {tournaments.slice(0, 3).map((tournament: any, index) => (
                      <div key={tournament.id} className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs text-cyan-300 font-medium">LIVE</span>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-2">{tournament.name}</h4>
                        <div className="text-xs text-gray-300 mb-3">
                          Entry: <span className="text-green-400 font-bold">₹{tournament.entryFee}</span> • 
                          Prize: <span className="text-yellow-400 font-bold">₹{tournament.prizePool}</span>
                        </div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                          Join Now
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 mb-4">No live tournaments</p>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold" asChild>
                      <Link href="/tournaments">Browse All</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity - Full Width */}
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-white">
              <TrendingUp className="mr-3 h-6 w-6 text-green-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 sm:py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No recent activity</h3>
              <p className="text-gray-400 mb-6">Join a tournament to start building your gaming legacy</p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/tournaments">Start Playing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
