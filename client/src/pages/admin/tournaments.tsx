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
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Tournament</DialogTitle>
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
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Tournament</DialogTitle>
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-white">Tournament Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="type" className="text-white">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solo">Solo</SelectItem>
              <SelectItem value="Duo">Duo</SelectItem>
              <SelectItem value="Squad">Squad</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entryFee" className="text-white">Entry Fee (₹)</Label>
          <Input
            id="entryFee"
            type="number"
            value={formData.entryFee}
            onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="prizePool" className="text-white">Prize Pool (₹)</Label>
          <Input
            id="prizePool"
            type="number"
            value={formData.prizePool}
            onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxParticipants" className="text-white">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="startTime" className="text-white">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rules" className="text-white">Rules</Label>
        <Textarea
          id="rules"
          value={formData.rules}
          onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
          className="bg-gray-800 border-gray-600 text-white"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
        {isLoading ? "Saving..." : tournament ? "Update Tournament" : "Create Tournament"}
      </Button>
    </form>
  );
}