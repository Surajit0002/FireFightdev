
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users, Upload, Image as ImageIcon, Calendar, Clock, Trophy, Settings, ChevronDown, ChevronUp, Save, X } from "lucide-react";
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
      toast({ 
        title: "🎉 Tournament Created!", 
        description: "Epic tournament added successfully!",
        className: "bg-green-900 border-green-500 text-green-100"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tournaments"] });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Creation Failed",
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
      toast({ 
        title: "✅ Tournament Updated!", 
        description: "Changes saved successfully!",
        className: "bg-blue-900 border-blue-500 text-blue-100"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tournaments"] });
      setEditingTournament(null);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Update Failed",
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
      toast({ 
        title: "🗑️ Tournament Deleted", 
        description: "Tournament removed successfully",
        className: "bg-red-900 border-red-500 text-red-100"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tournaments"] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Deletion Failed",
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
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
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
              <Button className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 hover:from-green-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl transform transition hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] border border-green-400/30">
                <Plus className="h-6 w-6 mr-3" />
                ⚡ Create Epic Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] max-w-6xl w-[98vw] max-h-[98vh] p-0 overflow-hidden">
              <AdvancedTournamentModal 
                onSubmit={createMutation.mutate} 
                isLoading={createMutation.isPending}
                onClose={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {tournaments?.map((tournament: any) => (
            <Card key={tournament.id} className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {tournament.name}
                      <Badge variant={tournament.status === 'live' ? 'destructive' : 'secondary'} className="animate-pulse">
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
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
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
            <DialogContent className="bg-black/95 border-2 border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.3)] max-w-6xl w-[98vw] max-h-[98vh] p-0 overflow-hidden">
              <AdvancedTournamentModal 
                tournament={editingTournament}
                onSubmit={(data) => updateMutation.mutate({ id: editingTournament.id, data })}
                isLoading={updateMutation.isPending}
                onClose={() => setEditingTournament(null)}
                isEdit={true}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

function AdvancedTournamentModal({ tournament, onSubmit, isLoading, onClose, isEdit = false }: any) {
  const [activeTab, setActiveTab] = useState("general");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(tournament?.bannerUrl || "");
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    type: tournament?.type || "Solo",
    platform: tournament?.platform || "Mobile",
    entryFee: tournament?.entryFee || "",
    prizePool: tournament?.prizePool || "",
    maxParticipants: tournament?.maxParticipants || "",
    startTime: tournament?.startTime || "",
    description: tournament?.description || "",
    gameMode: tournament?.gameMode || "Battle Royale",
    mapName: tournament?.mapName || "Bermuda",
    matchFormat: tournament?.matchFormat || "Classic",
    spectatorAllowed: tournament?.spectatorAllowed || true,
    autoJoinLimit: tournament?.autoJoinLimit || true,
    rules: tournament?.rules || "",
    firstPrize: tournament?.firstPrize || "",
    secondPrize: tournament?.secondPrize || "",
    thirdPrize: tournament?.thirdPrize || "",
    roomCodeRevealTime: tournament?.roomCodeRevealTime || "5",
    registrationDeadline: tournament?.registrationDeadline || "",
    customInstructions: tournament?.customInstructions || "",
    enableCountdown: tournament?.enableCountdown || true,
    autoPrizeDistribution: tournament?.autoPrizeDistribution || false,
    autoRoomGeneration: tournament?.autoRoomGeneration || false,
  });

  const [prizeError, setPrizeError] = useState("");

  // Auto-calculate prize total
  const calculatePrizeTotal = () => {
    const first = parseFloat(formData.firstPrize) || 0;
    const second = parseFloat(formData.secondPrize) || 0;
    const third = parseFloat(formData.thirdPrize) || 0;
    return first + second + third;
  };

  const handlePrizeChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Validate prize breakdown
    const total = parseFloat(newData.firstPrize || "0") + parseFloat(newData.secondPrize || "0") + parseFloat(newData.thirdPrize || "0");
    const prizePool = parseFloat(newData.prizePool || "0");
    
    if (total > prizePool) {
      setPrizeError("Prize breakdown exceeds total prize pool!");
    } else {
      setPrizeError("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prizeError) {
      alert("Please fix prize breakdown errors before submitting");
      return;
    }
    
    const submissionData = {
      ...formData,
      bannerUrl: bannerPreview,
      matchId: `FF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Sticky Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 p-6 border-b border-purple-500/30">
        <div className="flex justify-between items-center">
          <div>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              {isEdit ? "✏️ Edit Tournament" : "🏆 Create Epic Tournament"}
            </DialogTitle>
            <p className="text-white/80 text-sm mt-1">Build the ultimate Fire Fight tournament experience</p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !!prizeError}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Update Tournament" : "Create Tournament"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border-b border-gray-700 rounded-none h-14">
            <TabsTrigger value="general" className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4" />
              General Info
            </TabsTrigger>
            <TabsTrigger value="datetime" className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Date & Time
            </TabsTrigger>
            <TabsTrigger value="match" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Match Info
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4" />
              Rules & Media
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Info Tab */}
              <TabsContent value="general" className="m-0 space-y-6">
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30 shadow-lg">
                  <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center gap-2">
                    🎯 Tournament Details
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-blue-200 font-medium">Tournament Title *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-blue-900/30 border-blue-500/50 text-white placeholder-blue-300/50 focus:border-blue-400 h-12"
                        placeholder="Fire Fight Championship 2024"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type" className="text-blue-200 font-medium">Game Mode *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger className="bg-blue-900/30 border-blue-500/50 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="Solo">🎮 Solo</SelectItem>
                          <SelectItem value="Duo">👥 Duo</SelectItem>
                          <SelectItem value="Squad">🔥 Squad</SelectItem>
                          <SelectItem value="1v1">⚔️ 1v1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="platform" className="text-blue-200 font-medium">Platform *</Label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                        <SelectTrigger className="bg-blue-900/30 border-blue-500/50 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="Mobile">📱 Mobile</SelectItem>
                          <SelectItem value="Emulator">💻 Emulator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="maxParticipants" className="text-blue-200 font-medium">Max Players *</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        className="bg-blue-900/30 border-blue-500/50 text-white h-12"
                        placeholder="50"
                        min="2"
                        max="100"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="entryFee" className="text-blue-200 font-medium">Entry Fee (₹) *</Label>
                      <Input
                        id="entryFee"
                        type="number"
                        value={formData.entryFee}
                        onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                        className="bg-blue-900/30 border-blue-500/50 text-white h-12"
                        placeholder="25"
                        min="0"
                        required
                      />
                      {formData.entryFee === "0" && (
                        <Badge className="mt-2 bg-green-600 text-white">🎉 Free Entry</Badge>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="prizePool" className="text-blue-200 font-medium">Prize Pool (₹) *</Label>
                      <Input
                        id="prizePool"
                        type="number"
                        value={formData.prizePool}
                        onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                        className="bg-blue-900/30 border-blue-500/50 text-white h-12"
                        placeholder="1000"
                        min="0"
                        required
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor="description" className="text-blue-200 font-medium">Tournament Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-blue-900/30 border-blue-500/50 text-white placeholder-blue-300/50 min-h-[100px]"
                        placeholder="Describe what makes this tournament special..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Date & Time Tab */}
              <TabsContent value="datetime" className="m-0 space-y-6">
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30 shadow-lg">
                  <h3 className="text-xl font-bold text-green-300 mb-6 flex items-center gap-2">
                    📅 Schedule Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startTime" className="text-green-200 font-medium">Tournament Start Time *</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="bg-green-900/30 border-green-500/50 text-white h-12"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="registrationDeadline" className="text-green-200 font-medium">Registration Deadline</Label>
                      <Input
                        id="registrationDeadline"
                        type="datetime-local"
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                        className="bg-green-900/30 border-green-500/50 text-white h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="roomCodeRevealTime" className="text-green-200 font-medium">Room Code Reveal (minutes before)</Label>
                      <Input
                        id="roomCodeRevealTime"
                        type="number"
                        value={formData.roomCodeRevealTime}
                        onChange={(e) => setFormData({ ...formData, roomCodeRevealTime: e.target.value })}
                        className="bg-green-900/30 border-green-500/50 text-white h-12"
                        placeholder="5"
                        min="1"
                        max="60"
                      />
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-900/20 rounded-lg">
                      <Switch
                        id="enableCountdown"
                        checked={formData.enableCountdown}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableCountdown: checked })}
                      />
                      <Label htmlFor="enableCountdown" className="text-green-200">Enable Live Match Countdown Timer</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Match Info Tab */}
              <TabsContent value="match" className="m-0 space-y-6">
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 p-6 rounded-xl border border-purple-500/30 shadow-lg">
                  <h3 className="text-xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                    🎮 Game Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="gameMode" className="text-purple-200 font-medium">Game Mode *</Label>
                      <Select value={formData.gameMode} onValueChange={(value) => setFormData({ ...formData, gameMode: value })}>
                        <SelectTrigger className="bg-purple-900/30 border-purple-500/50 text-white h-12">
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
                      <Label htmlFor="mapName" className="text-purple-200 font-medium">Map Selection *</Label>
                      <Select value={formData.mapName} onValueChange={(value) => setFormData({ ...formData, mapName: value })}>
                        <SelectTrigger className="bg-purple-900/30 border-purple-500/50 text-white h-12">
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
                      <Label htmlFor="matchFormat" className="text-purple-200 font-medium">Match Format *</Label>
                      <Select value={formData.matchFormat} onValueChange={(value) => setFormData({ ...formData, matchFormat: value })}>
                        <SelectTrigger className="bg-purple-900/30 border-purple-500/50 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="Classic">🎯 Classic</SelectItem>
                          <SelectItem value="Clash Squad">⚔️ Clash Squad</SelectItem>
                          <SelectItem value="Custom Room">🏠 Custom Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-purple-900/20 rounded-lg">
                      <Switch
                        id="spectatorAllowed"
                        checked={formData.spectatorAllowed}
                        onCheckedChange={(checked) => setFormData({ ...formData, spectatorAllowed: checked })}
                      />
                      <Label htmlFor="spectatorAllowed" className="text-purple-200">Spectators Allowed</Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-purple-900/20 rounded-lg">
                      <Switch
                        id="autoJoinLimit"
                        checked={formData.autoJoinLimit}
                        onCheckedChange={(checked) => setFormData({ ...formData, autoJoinLimit: checked })}
                      />
                      <Label htmlFor="autoJoinLimit" className="text-purple-200">Auto Join Limit Lock</Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-purple-900/20 rounded-lg">
                      <Switch
                        id="autoRoomGeneration"
                        checked={formData.autoRoomGeneration}
                        onCheckedChange={(checked) => setFormData({ ...formData, autoRoomGeneration: checked })}
                      />
                      <Label htmlFor="autoRoomGeneration" className="text-purple-200">Auto Room ID/Password</Label>
                    </div>
                  </div>

                  {/* Advanced Settings Toggle */}
                  <div className="mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                      {showAdvanced ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                    </Button>

                    {showAdvanced && (
                      <div className="mt-6 p-6 bg-purple-900/10 rounded-lg border border-purple-500/20">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="customInstructions" className="text-purple-200 font-medium">Custom Join Instructions</Label>
                            <Textarea
                              id="customInstructions"
                              value={formData.customInstructions}
                              onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                              className="bg-purple-900/30 border-purple-500/50 text-white placeholder-purple-300/50"
                              placeholder="Special instructions for participants..."
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-purple-900/20 rounded-lg">
                            <Switch
                              id="autoPrizeDistribution"
                              checked={formData.autoPrizeDistribution}
                              onCheckedChange={(checked) => setFormData({ ...formData, autoPrizeDistribution: checked })}
                            />
                            <Label htmlFor="autoPrizeDistribution" className="text-purple-200">Auto Prize Distribution</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Rules & Media Tab */}
              <TabsContent value="rules" className="m-0 space-y-6">
                {/* Banner Upload Section */}
                <div className="bg-gradient-to-r from-orange-600/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30 shadow-lg">
                  <h3 className="text-xl font-bold text-orange-300 mb-6 flex items-center gap-2">
                    🎨 Tournament Banner
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="banner" className="text-orange-200 font-medium">Upload Tournament Banner</Label>
                      <div className="mt-2">
                        <input
                          id="banner"
                          type="file"
                          accept="image/png,image/jpg,image/jpeg"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="banner"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-500/50 border-dashed rounded-lg cursor-pointer bg-orange-900/20 hover:bg-orange-800/30 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-orange-300" />
                            <p className="mb-2 text-sm text-orange-200">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-orange-300">PNG, JPG up to 5MB</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Live Preview */}
                    {bannerPreview && (
                      <div className="mt-4">
                        <p className="text-orange-200 font-medium mb-2">Live Preview:</p>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-orange-500/30">
                          <img
                            src={bannerPreview}
                            alt="Banner Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <h4 className="font-bold text-lg">{formData.name || "Tournament Name"}</h4>
                            <p className="text-sm opacity-90">{formData.type} • ₹{formData.prizePool} Prize Pool</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prize Breakdown Section */}
                <div className="bg-gradient-to-r from-yellow-600/20 to-amber-500/20 p-6 rounded-xl border border-yellow-500/30 shadow-lg">
                  <h3 className="text-xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
                    💰 Prize Breakdown
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="firstPrize" className="text-yellow-200 font-medium">1st Place (₹)</Label>
                      <Input
                        id="firstPrize"
                        type="number"
                        value={formData.firstPrize}
                        onChange={(e) => handlePrizeChange('firstPrize', e.target.value)}
                        className="bg-yellow-900/30 border-yellow-500/50 text-white h-12"
                        placeholder="600"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="secondPrize" className="text-yellow-200 font-medium">2nd Place (₹)</Label>
                      <Input
                        id="secondPrize"
                        type="number"
                        value={formData.secondPrize}
                        onChange={(e) => handlePrizeChange('secondPrize', e.target.value)}
                        className="bg-yellow-900/30 border-yellow-500/50 text-white h-12"
                        placeholder="300"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="thirdPrize" className="text-yellow-200 font-medium">3rd Place (₹)</Label>
                      <Input
                        id="thirdPrize"
                        type="number"
                        value={formData.thirdPrize}
                        onChange={(e) => handlePrizeChange('thirdPrize', e.target.value)}
                        className="bg-yellow-900/30 border-yellow-500/50 text-white h-12"
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Auto-calculation display */}
                  <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-200">Total Prize Distribution:</span>
                      <span className="text-yellow-100 font-bold">₹{calculatePrizeTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-yellow-200">Prize Pool:</span>
                      <span className="text-yellow-100 font-bold">₹{formData.prizePool || 0}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-yellow-200">Remaining:</span>
                      <span className={`font-bold ${(parseFloat(formData.prizePool || "0") - calculatePrizeTotal()) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{parseFloat(formData.prizePool || "0") - calculatePrizeTotal()}
                      </span>
                    </div>
                    {prizeError && (
                      <p className="text-red-400 text-sm mt-2 font-medium">⚠️ {prizeError}</p>
                    )}
                  </div>
                </div>

                {/* Rules Section */}
                <div className="bg-gradient-to-r from-red-600/20 to-pink-500/20 p-6 rounded-xl border border-red-500/30 shadow-lg">
                  <h3 className="text-xl font-bold text-red-300 mb-6 flex items-center gap-2">
                    📋 Tournament Rules & Guidelines
                  </h3>
                  
                  <div>
                    <Label htmlFor="rules" className="text-red-200 font-medium">Tournament Rules *</Label>
                    <Textarea
                      id="rules"
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                      className="bg-red-900/30 border-red-500/50 text-white placeholder-red-300/50 min-h-[120px]"
                      rows={6}
                      placeholder="• No Emulators allowed&#10;• No Hacks or Cheats&#10;• Kills will be counted&#10;• UID must match registration&#10;• Follow fair play rules"
                    />
                  </div>
                </div>
              </TabsContent>
            </form>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
