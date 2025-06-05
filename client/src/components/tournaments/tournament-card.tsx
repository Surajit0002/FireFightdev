import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  Trophy, 
  Target, 
  Shield, 
  MapPin,
  Flame,
  Zap,
  CheckCircle,
  Timer,
  Crown,
  Star
} from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  type: string;
  status: string;
  entryFee: string;
  prizePool: string;
  currentParticipants: number;
  maxParticipants: number;
  startTime: string;
  map?: string;
  gameMode?: string;
}

interface TournamentCardProps {
  tournament: Tournament;
}

const getCardTheme = (id: string) => {
  const themes = [
    { bg: "bg-red-500", text: "text-white", accent: "text-red-100", button: "bg-white text-red-500 hover:bg-red-50" },
    { bg: "bg-purple-600", text: "text-white", accent: "text-purple-100", button: "bg-neon-green-400 text-black hover:bg-neon-green-300" },
    { bg: "bg-blue-600", text: "text-white", accent: "text-blue-100", button: "bg-yellow-400 text-blue-800 hover:bg-yellow-300" },
    { bg: "bg-green-500", text: "text-black", accent: "text-green-800", button: "bg-black text-green-400 hover:bg-gray-800" },
    { bg: "bg-orange-500", text: "text-white", accent: "text-orange-100", button: "bg-white text-orange-600 hover:bg-orange-50" },
    { bg: "bg-yellow-400", text: "text-black", accent: "text-yellow-800", button: "bg-purple-600 text-white hover:bg-purple-700" }
  ];

  const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return themes[hash % themes.length];
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'live':
      return { icon: Flame, text: "🔥 LIVE", class: "bg-red-500 text-white animate-pulse" };
    case 'upcoming':
      return { icon: Zap, text: "⚡ UPCOMING", class: "bg-green-500 text-white" };
    case 'completed':
      return { icon: CheckCircle, text: "🏁 FINISHED", class: "bg-gray-500 text-white" };
    default:
      return { icon: Clock, text: "PENDING", class: "bg-yellow-500 text-black" };
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'solo':
      return Target;
    case 'duo':
      return Users;
    case 'squad':
      return Shield;
    default:
      return Trophy;
  }
};

const formatTimeLeft = (startTime: string) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const diff = start - now;

  if (diff <= 0) return "Starting Soon";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h ${minutes}m`;
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const theme = getCardTheme(tournament.id);
  const statusBadge = getStatusBadge(tournament.status);
  const TypeIcon = getTypeIcon(tournament.type);
  const StatusIcon = statusBadge.icon;

  const participationPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;
  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;
  const isFull = spotsLeft === 0;
  const isAlmostFull = participationPercentage >= 80;

  return (
    <Card className={`${theme.bg} ${theme.text} rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden group relative`}>
      {/* Header Banner */}
      <div className="relative p-4 pb-2">
        {/* Status Badge */}
        <Badge className={`${statusBadge.class} absolute top-3 left-3 z-10 font-bold text-xs px-3 py-1 rounded-full shadow-lg`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusBadge.text}
        </Badge>

        {/* Admin Actions (if needed) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add admin icons here if needed */}
        </div>

        {/* Tournament Image/Icon Area */}
        <div className="mt-8 mb-4 flex justify-center">
          <div className={`w-16 h-16 rounded-xl ${theme.text === 'text-white' ? 'bg-white/20' : 'bg-black/20'} flex items-center justify-center shadow-lg`}>
            <TypeIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      <CardContent className="px-4 pb-4 space-y-4">
        {/* Title + Info */}
        <div className="space-y-2">
          <h3 className={`font-black text-xl ${theme.text} font-orbitron leading-tight`}>
            {tournament.name}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${theme.text === 'text-white' ? 'bg-white/20 text-white' : 'bg-black/20 text-black'} font-bold text-xs px-2 py-1`}>
              {tournament.type.toUpperCase()}
            </Badge>
            {tournament.map && (
              <Badge className={`${theme.text === 'text-white' ? 'bg-white/15 text-white' : 'bg-black/15 text-black'} font-medium text-xs px-2 py-1`}>
                <MapPin className="w-3 h-3 mr-1" />
                {tournament.map}
              </Badge>
            )}
          </div>
        </div>

        {/* Entry & Prize */}
        <div className={`${theme.text === 'text-white' ? 'bg-white/10' : 'bg-black/10'} rounded-xl p-3 space-y-2`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs font-semibold ${theme.accent} uppercase tracking-wide`}>Entry Fee</p>
              <p className={`text-lg font-black ${theme.text}`}>
                {tournament.entryFee === "0" ? "FREE" : `₹${tournament.entryFee}`}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${theme.accent} uppercase tracking-wide`}>Prize Pool</p>
              <p className={`text-lg font-black ${theme.text} flex items-center`}>
                <Trophy className="w-4 h-4 mr-1" />
                ₹{tournament.prizePool}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className={`text-xs font-bold ${theme.accent}`}>💰 Top 3 Paid</p>
          </div>
        </div>

        {/* Time & Slot */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs font-semibold ${theme.accent} uppercase tracking-wide`}>Starts In</p>
              <p className={`text-sm font-bold ${theme.text} flex items-center`}>
                <Timer className="w-4 h-4 mr-1" />
                {formatTimeLeft(tournament.startTime)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${theme.accent} uppercase tracking-wide`}>Players</p>
              <p className={`text-sm font-bold ${theme.text} flex items-center justify-end`}>
                <Users className="w-4 h-4 mr-1" />
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className={`w-full ${theme.text === 'text-white' ? 'bg-white/20' : 'bg-black/20'} rounded-full h-2 overflow-hidden`}>
              <div 
                className={`h-full transition-all duration-500 ${
                  isAlmostFull ? 'bg-red-400 animate-pulse' : 
                  participationPercentage > 50 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${participationPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className={`text-xs font-bold ${theme.accent}`}>
                {spotsLeft} SPOTS LEFT
              </p>
              <p className={`text-xs font-bold ${theme.accent}`}>
                {Math.round(participationPercentage)}% filled
              </p>
            </div>
            {isAlmostFull && (
              <p className={`text-xs font-black ${theme.text} text-center animate-pulse`}>
                🔥 Filling Fast!
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Button 
            className={`w-full ${theme.button} font-black text-sm py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 uppercase tracking-wide`}
            disabled={isFull}
          >
            {isFull ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                TOURNAMENT FULL
              </>
            ) : tournament.status === 'live' ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                JOIN LIVE
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                ENTER TOURNAMENT
              </>
            )}
          </Button>
        </div>

        {/* Bonus XP Badge */}
        <div className="flex justify-between items-center pt-1">
          <div className={`${theme.text === 'text-white' ? 'bg-white/15' : 'bg-black/15'} rounded-lg px-2 py-1 flex items-center`}>
            <Star className="w-3 h-3 mr-1" />
            <span className={`text-xs font-bold ${theme.text}`}>+50 XP</span>
          </div>
          <div className={`text-xs font-semibold ${theme.accent}`}>
            {new Date(tournament.startTime).toLocaleDateString()} • {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}