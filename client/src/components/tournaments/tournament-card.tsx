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
    <Card className={`${theme.bg} ${theme.text} rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 border-0 overflow-hidden group relative`}>
      {/* Compact Header */}
      <div className="relative p-3">
        {/* Status Badge */}
        <Badge className={`${statusBadge.class} absolute top-2 left-2 z-10 font-bold text-xs px-2 py-0.5 rounded-full`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusBadge.text}
        </Badge>

        {/* Type Icon */}
        <div className="flex justify-center mt-6 mb-2">
          <div className={`w-10 h-10 rounded-lg ${theme.text === 'text-white' ? 'bg-white/20' : 'bg-black/20'} flex items-center justify-center`}>
            <TypeIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      <CardContent className="px-3 pb-3 space-y-3">
        {/* Compact Title */}
        <div className="text-center">
          <h3 className={`font-black text-sm ${theme.text} leading-tight line-clamp-2 mb-1`}>
            {tournament.name}
          </h3>
          <Badge className={`${theme.text === 'text-white' ? 'bg-white/20 text-white' : 'bg-black/20 text-black'} font-bold text-xs px-2 py-0.5`}>
            {tournament.type.toUpperCase()}
          </Badge>
        </div>

        {/* Compact Prize Info */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`${theme.text === 'text-white' ? 'bg-white/10' : 'bg-black/10'} rounded-lg p-2 text-center`}>
            <p className={`text-xs ${theme.accent} font-semibold`}>Entry</p>
            <p className={`text-sm font-black ${theme.text}`}>
              {tournament.entryFee === "0" ? "FREE" : `₹${tournament.entryFee}`}
            </p>
          </div>
          <div className={`${theme.text === 'text-white' ? 'bg-white/10' : 'bg-black/10'} rounded-lg p-2 text-center`}>
            <p className={`text-xs ${theme.accent} font-semibold`}>Prize</p>
            <p className={`text-sm font-black ${theme.text}`}>₹{tournament.prizePool}</p>
          </div>
        </div>

        {/* Compact Players Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${theme.accent} font-semibold flex items-center`}>
              <Users className="w-3 h-3 mr-1" />
              Players
            </span>
            <span className={`text-xs font-bold ${theme.text}`}>
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>
          
          {/* Compact Progress Bar */}
          <div className={`w-full ${theme.text === 'text-white' ? 'bg-white/20' : 'bg-black/20'} rounded-full h-1.5 overflow-hidden`}>
            <div 
              className={`h-full transition-all duration-500 ${
                isAlmostFull ? 'bg-red-400' : 
                participationPercentage > 50 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${participationPercentage}%` }}
            />
          </div>
        </div>

        {/* Compact Time Info */}
        <div className="text-center">
          <p className={`text-xs ${theme.accent} font-semibold`}>Starts In</p>
          <p className={`text-sm font-bold ${theme.text}`}>
            {formatTimeLeft(tournament.startTime)}
          </p>
        </div>

        {/* Compact CTA Button */}
        <Button 
          className={`w-full ${theme.button} font-black text-xs py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 uppercase tracking-wide`}
          disabled={isFull}
        >
          {isFull ? (
            "FULL"
          ) : tournament.status === 'live' ? (
            <>
              <Zap className="w-3 h-3 mr-1" />
              JOIN LIVE
            </>
          ) : (
            <>
              <Crown className="w-3 h-3 mr-1" />
              ENTER
            </>
          )}
        </Button>

        {/* Compact Footer */}
        <div className="flex justify-between items-center text-xs">
          <div className={`${theme.text === 'text-white' ? 'bg-white/15' : 'bg-black/15'} rounded px-2 py-0.5 flex items-center`}>
            <Star className="w-3 h-3 mr-1" />
            <span className={`font-bold ${theme.text}`}>+50 XP</span>
          </div>
          {isAlmostFull && (
            <span className={`font-black ${theme.text} animate-pulse`}>
              🔥 Filling Fast!
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}