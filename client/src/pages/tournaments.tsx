<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23f97316&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;4&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import TournamentCard from "@/components/tournaments/tournament-card";
import TournamentFilters from "@/components/tournaments/tournament-filters";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Trophy, 
  Users, 
  Clock, 
  Target, 
  Shield, 
  Star,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  Flame,
  Settings,
  Zap
} from "lucide-react";

export default function Tournaments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [prizeFilter, setPrizeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to view tournaments",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: tournaments, isLoading: tournamentsLoading } = useQuery({
    queryKey: [`/api/tournaments${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`],
    retry: false,
  });

  // Enhanced filtering and sorting
  const filteredTournaments = Array.isArray(tournaments) ? tournaments
    .filter((tournament: any) => {
      // Type filter
      if (typeFilter !== 'all' && tournament.type !== typeFilter) return false;
      
      // Search query
      if (searchQuery && !tournament.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Prize filter
      if (prizeFilter !== 'all') {
        const prize = parseInt(tournament.prizePool);
        switch (prizeFilter) {
          case 'low': return prize < 1000;
          case 'medium': return prize >= 1000 && prize < 5000;
          case 'high': return prize >= 5000 && prize < 10000;
          case 'premium': return prize >= 10000;
          default: return true;
        }
      }
      
      return true;
    })
    .sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'prizePool':
          aValue = parseInt(a.prizePool);
          bValue = parseInt(b.prizePool);
          break;
        case 'entryFee':
          aValue = parseInt(a.entryFee);
          bValue = parseInt(b.entryFee);
          break;
        case 'participants':
          aValue = a.currentParticipants;
          bValue = b.currentParticipants;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default: // startTime
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    }) : [];

  const getStatusStats = () => {
    if (!Array.isArray(tournaments)) return { total: 0, live: 0, upcoming: 0, completed: 0 };
    
    return {
      total: tournaments.length,
      live: tournaments.filter(t => t.status === 'live').length,
      upcoming: tournaments.filter(t => t.status === 'upcoming').length,
      completed: tournaments.filter(t => t.status === 'completed').length,
    };
  };

  const stats = getStatusStats();

  if (isLoading || tournamentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
            <p className="text-lg font-semibold text-gray-600">Loading Epic Tournaments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23f97316&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;4&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" /><div className="absolute inset-0 bg-[url(&#39;data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.15&quot;%3E%3Cpath d=&quot;M30 30l15-15v30l-15-15zM15 15l15 15-15 15V15z&quot;/&gt;%3C/g%3E%3C/g%3E%3C/svg%3E&#39;)] opacity-40" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                <Trophy className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div className="text-left">
                <h1 className="font-orbitron text-5xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  TOURNAMENTS
                </h1>
                <p className="text-gray-600 font-semibold tracking-wide">FIRE FIGHT CHAMPIONSHIP</p>
              </div>
            </div>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Join epic tournaments and compete for massive cash prizes in the ultimate Free Fire battle arena. 
              <span className="text-orange-600 font-semibold"> Prove your skills and claim victory!</span>
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-blue-700">{stats.total}</p>
              <p className="text-sm font-semibold text-blue-600">Total Tournaments</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-red-700">{stats.live}</p>
              <p className="text-sm font-semibold text-red-600">Live Now</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-green-700">{stats.upcoming}</p>
              <p className="text-sm font-semibold text-green-600">Upcoming</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-purple-700">{stats.completed}</p>
              <p className="text-sm font-semibold text-purple-600">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardContent className="p-6">
            {/* Top Row - Search and View Toggle */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search tournaments by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="h-12 px-4"
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="h-12 px-4"
                >
                  <List className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-4"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                variant={statusFilter === 'live' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
                onClick={() => setStatusFilter('live')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Live
              </Badge>
              <Badge 
                variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm font-semibold hover:bg-green-500 hover:text-white transition-all"
                onClick={() => setStatusFilter('upcoming')}
              >
                <Clock className="h-4 w-4 mr-1" />
                Upcoming
              </Badge>
              <Badge 
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm font-semibold hover:bg-gray-500 hover:text-white transition-all"
                onClick={() => setStatusFilter('completed')}
              >
                <Star className="h-4 w-4 mr-1" />
                Completed
              </Badge>
              <Badge 
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm font-semibold hover:bg-blue-500 hover:text-white transition-all"
                onClick={() => setStatusFilter('all')}
              >
                All Tournaments
              </Badge>
            </div>

            {/* Advanced Filters - Collapsible */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Game Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Solo">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Solo
                      </div>
                    </SelectItem>
                    <SelectItem value="Duo">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Duo
                      </div>
                    </SelectItem>
                    <SelectItem value="Squad">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Squad
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Prize Range Filter */}
                <Select value={prizeFilter} onValueChange={setPrizeFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Prize Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prizes</SelectItem>
                    <SelectItem value="low">Below ₹1,000</SelectItem>
                    <SelectItem value="medium">₹1,000 - ₹5,000</SelectItem>
                    <SelectItem value="high">₹5,000 - ₹10,000</SelectItem>
                    <SelectItem value="premium">Above ₹10,000</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startTime">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Start Time
                      </div>
                    </SelectItem>
                    <SelectItem value="prizePool">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        Prize Pool
                      </div>
                    </SelectItem>
                    <SelectItem value="entryFee">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Entry Fee
                      </div>
                    </SelectItem>
                    <SelectItem value="participants">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Participants
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Order */}
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="h-11 flex items-center justify-center gap-2"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTournaments.length} Tournament{filteredTournaments.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600 font-medium">
              {searchQuery && `Searching for "${searchQuery}" • `}
              {statusFilter !== 'all' && `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} • `}
              {typeFilter !== 'all' && `${typeFilter} mode`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("upcoming");
              setTypeFilter("all");
              setPrizeFilter("all");
              setSortBy("startTime");
              setSortOrder("asc");
            }}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }>
            {filteredTournaments.map((tournament: any) => (
              <div 
                key={tournament.id}
                className={viewMode === 'list' ? 'w-full' : ''}
              >
                <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
            <CardContent>
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Tournaments Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any tournaments matching your criteria. Try adjusting your filters or check back later for new tournaments.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("upcoming");
                  setTypeFilter("all");
                  setPrizeFilter("all");
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3"
              >
                <Flame className="h-5 w-5 mr-2" />
                View All Tournaments
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
