import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminTournaments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["/api/admin/tournaments"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("/api/admin/tournaments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Tournament created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tournaments"] });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating tournament",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest(`/api/admin/tournaments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Tournament updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tournaments"] });
      setEditingTournament(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating tournament",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/tournaments/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({ title: "Tournament deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tournaments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting tournament",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">Loading tournaments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-orbitron">Tournament Management</h1>
            <p className="text-gray-400 mt-2">Create and manage Fire Fight tournaments</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                ⚡ Create Epic Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 border-gray-700 max-w-5xl w-[95vw] max-h-[95vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  🏆 Create New Tournament
                </DialogTitle>
              </DialogHeader>
              <TournamentForm 
                onSubmit={createMutation.mutate} 
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {tournaments?.map((tournament: any) => (
            <Card key={tournament.id} className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {tournament.name}
                      <Badge variant={tournament.status === 'live' ? 'destructive' : 'secondary'}>
                        {tournament.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-400 mt-1">{tournament.type} Tournament</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingTournament(tournament)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(tournament.id)}
                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Entry Fee</p>
                    <p className="text-white font-medium">₹{tournament.entryFee}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Prize Pool</p>
                    <p className="text-green-400 font-medium">₹{tournament.prizePool}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Participants</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Start Time</p>
                    <p className="text-white font-medium">
                      {new Date(tournament.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingTournament && (
          <Dialog open={!!editingTournament} onOpenChange={() => setEditingTournament(null)}>
            <DialogContent className="bg-gray-900/95 border-gray-700 max-w-5xl w-[95vw] max-h-[95vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  ✏️ Edit Tournament
                </DialogTitle>
              </DialogHeader>
              <TournamentForm 
                tournament={editingTournament}
                onSubmit={(data) => updateMutation.mutate({ id: editingTournament.id, data })}
                isLoading={updateMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

function TournamentForm({ tournament, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    type: tournament?.type || "Solo",
    entryFee: tournament?.entryFee || "",
    prizePool: tournament?.prizePool || "",
    maxParticipants: tournament?.maxParticipants || "",
    startTime: tournament?.startTime || "",
    rules: tournament?.rules || "",
    description: tournament?.description || "",
    gameMode: tournament?.gameMode || "Battle Royale",
    mapName: tournament?.mapName || "Bermuda",
    difficulty: tournament?.difficulty || "Medium",
    eliminationRule: tournament?.eliminationRule || "Single",
    roundDuration: tournament?.roundDuration || "20",
    registrationDeadline: tournament?.registrationDeadline || "",
    streamLink: tournament?.streamLink || "",
    discordLink: tournament?.discordLink || "",
    sponsorName: tournament?.sponsorName || "",
    specialRewards: tournament?.specialRewards || "",
    entryRequirements: tournament?.entryRequirements || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-white text-center">🏆 Advanced Tournament Creator</h3>
        <p className="text-white/80 text-center text-sm mt-1">Create epic Fire Fight tournaments with detailed configurations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-4 rounded-lg border border-blue-500/30">
          <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
            🎯 Basic Tournament Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-blue-200 font-medium">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-blue-900/30 border-blue-500/50 text-white placeholder-blue-300/50 focus:border-blue-400"
                placeholder="e.g., Fire Fight Champions League"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-blue-200 font-medium">Tournament Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-blue-900/30 border-blue-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="Solo">🎮 Solo Battle</SelectItem>
                  <SelectItem value="Duo">👥 Duo Challenge</SelectItem>
                  <SelectItem value="Squad">🔥 Squad Warfare</SelectItem>
                  <SelectItem value="Custom">⚡ Custom Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-blue-200 font-medium">Tournament Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-blue-900/30 border-blue-500/50 text-white placeholder-blue-300/50"
                placeholder="Describe what makes this tournament special..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Game Configuration Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-500/20 p-4 rounded-lg border border-green-500/30">
          <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
            🎮 Game Configuration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gameMode" className="text-green-200 font-medium">Game Mode</Label>
              <Select value={formData.gameMode} onValueChange={(value) => setFormData({ ...formData, gameMode: value })}>
                <SelectTrigger className="bg-green-900/30 border-green-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="Battle Royale">🏝️ Battle Royale</SelectItem>
                  <SelectItem value="Clash Squad">⚔️ Clash Squad</SelectItem>
                  <SelectItem value="Rush Mode">💨 Rush Mode</SelectItem>
                  <SelectItem value="Custom Room">🏠 Custom Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mapName" className="text-green-200 font-medium">Map Selection</Label>
              <Select value={formData.mapName} onValueChange={(value) => setFormData({ ...formData, mapName: value })}>
                <SelectTrigger className="bg-green-900/30 border-green-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="Bermuda">🏝️ Bermuda</SelectItem>
                  <SelectItem value="Purgatory">🔥 Purgatory</SelectItem>
                  <SelectItem value="Kalahari">🏜️ Kalahari</SelectItem>
                  <SelectItem value="Alpine">🏔️ Alpine</SelectItem>
                  <SelectItem value="Nexterra">🌆 Nexterra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty" className="text-green-200 font-medium">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger className="bg-green-900/30 border-green-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="Easy">🟢 Easy</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Hard">🟠 Hard</SelectItem>
                  <SelectItem value="Expert">🔴 Expert</SelectItem>
                  <SelectItem value="Legendary">🟣 Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eliminationRule" className="text-green-200 font-medium">Elimination Rule</Label>
              <Select value={formData.eliminationRule} onValueChange={(value) => setFormData({ ...formData, eliminationRule: value })}>
                <SelectTrigger className="bg-green-900/30 border-green-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="Single">⚡ Single Elimination</SelectItem>
                  <SelectItem value="Double">🔄 Double Elimination</SelectItem>
                  <SelectItem value="Round Robin">🔄 Round Robin</SelectItem>
                  <SelectItem value="Swiss">🎯 Swiss System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="roundDuration" className="text-green-200 font-medium">Round Duration (min)</Label>
              <Input
                id="roundDuration"
                type="number"
                value={formData.roundDuration}
                onChange={(e) => setFormData({ ...formData, roundDuration: e.target.value })}
                className="bg-green-900/30 border-green-500/50 text-white"
                placeholder="20"
                min="5"
                max="60"
              />
            </div>
          </div>
        </div>

        {/* Prize & Participation Section */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30">
          <h4 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
            💰 Prize & Participation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="entryFee" className="text-yellow-200 font-medium">Entry Fee (₹)</Label>
              <Input
                id="entryFee"
                type="number"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                className="bg-yellow-900/30 border-yellow-500/50 text-white"
                placeholder="25"
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="prizePool" className="text-yellow-200 font-medium">Prize Pool (₹)</Label>
              <Input
                id="prizePool"
                type="number"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="bg-yellow-900/30 border-yellow-500/50 text-white"
                placeholder="1000"
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="maxParticipants" className="text-yellow-200 font-medium">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="bg-yellow-900/30 border-yellow-500/50 text-white"
                placeholder="100"
                min="2"
                required
              />
            </div>
            <div>
              <Label htmlFor="specialRewards" className="text-yellow-200 font-medium">Special Rewards</Label>
              <Input
                id="specialRewards"
                value={formData.specialRewards}
                onChange={(e) => setFormData({ ...formData, specialRewards: e.target.value })}
                className="bg-yellow-900/30 border-yellow-500/50 text-white"
                placeholder="MVP Award, Skins, etc."
              />
            </div>
            <div>
              <Label htmlFor="sponsorName" className="text-yellow-200 font-medium">Sponsor Name</Label>
              <Input
                id="sponsorName"
                value={formData.sponsorName}
                onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                className="bg-yellow-900/30 border-yellow-500/50 text-white"
                placeholder="Company/Brand Name"
              />
            </div>
            <div>
              <Label htmlFor="entryRequirements" className="text-yellow-200 font-medium">Entry Requirements</Label>
              <Input
                id="entryRequirements"
                value={formData.entryRequirements}
                onChange={(e) => setFormData({ ...formData, entryRequirements: e.target.value })}
                className="bg-yellow-900/30 border-yellow-500/50 text-white"
                placeholder="Rank: Gold+, Level: 30+"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Links Section */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-500/20 p-4 rounded-lg border border-purple-500/30">
          <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
            📅 Schedule & Communication
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-purple-200 font-medium">Tournament Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="bg-purple-900/30 border-purple-500/50 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="registrationDeadline" className="text-purple-200 font-medium">Registration Deadline</Label>
              <Input
                id="registrationDeadline"
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="bg-purple-900/30 border-purple-500/50 text-white"
              />
            </div>
            <div>
              <Label htmlFor="streamLink" className="text-purple-200 font-medium">Live Stream Link</Label>
              <Input
                id="streamLink"
                type="url"
                value={formData.streamLink}
                onChange={(e) => setFormData({ ...formData, streamLink: e.target.value })}
                className="bg-purple-900/30 border-purple-500/50 text-white"
                placeholder="https://youtube.com/live/..."
              />
            </div>
            <div>
              <Label htmlFor="discordLink" className="text-purple-200 font-medium">Discord Server Link</Label>
              <Input
                id="discordLink"
                type="url"
                value={formData.discordLink}
                onChange={(e) => setFormData({ ...formData, discordLink: e.target.value })}
                className="bg-purple-900/30 border-purple-500/50 text-white"
                placeholder="https://discord.gg/..."
              />
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="bg-gradient-to-r from-red-600/20 to-pink-500/20 p-4 rounded-lg border border-red-500/30">
          <h4 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
            📋 Tournament Rules & Guidelines
          </h4>
          <div>
            <Label htmlFor="rules" className="text-red-200 font-medium">Tournament Rules</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="bg-red-900/30 border-red-500/50 text-white placeholder-red-300/50"
              rows={4}
              placeholder="Enter detailed tournament rules, regulations, and guidelines..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 hover:from-green-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Tournament...
              </div>
            ) : tournament ? (
              <div className="flex items-center gap-2">
                ✨ Update Tournament
              </div>
            ) : (
              <div className="flex items-center gap-2">
                🚀 Create Epic Tournament
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}