import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Ban, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/sidebar";
import { useState } from "react";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: string }) => {
      await apiRequest(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
    },
    onSuccess: () => {
      toast({ title: "User updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter((user: any) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-orbitron">User Management</h1>
          <p className="text-gray-400 mt-2">Manage Fire Fight platform users</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredUsers?.map((user: any) => (
            <Card key={user.id} className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback className="bg-gray-700 text-white">
                        {user.firstName?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.email
                        }
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Banned'}
                        </Badge>
                      </CardTitle>
                      <p className="text-gray-400 mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.isActive ? (
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => updateUserMutation.mutate({ 
                          userId: user.id, 
                          action: 'ban' 
                        })}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Ban User
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserMutation.mutate({ 
                          userId: user.id, 
                          action: 'unban' 
                        })}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Unban User
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="text-white font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Joined</p>
                    <p className="text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Tournaments Joined</p>
                    <p className="text-white font-medium">{user.tournamentsJoined || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Winnings</p>
                    <p className="text-green-400 font-medium">₹{user.totalWinnings || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}