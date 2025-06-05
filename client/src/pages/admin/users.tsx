import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, Shield, Ban, Edit, Eye } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Mock users data - in real app this would come from API
  const mockUsers = [
    {
      id: "1",
      displayName: "ProGamer_01",
      email: "progamer@example.com",
      gameId: "123456789",
      walletBalance: "1250.00",
      totalMatches: 45,
      totalWins: 32,
      totalEarnings: "8500.00",
      isBanned: false,
      isAdmin: false,
      createdAt: "2024-01-15T10:30:00Z",
      profileImageUrl: null,
    },
    {
      id: "2", 
      displayName: "GAMING_BEAST",
      email: "beast@example.com",
      gameId: "987654321",
      walletBalance: "750.50",
      totalMatches: 38,
      totalWins: 25,
      totalEarnings: "6200.00",
      isBanned: false,
      isAdmin: false,
      createdAt: "2024-01-20T14:15:00Z",
      profileImageUrl: null,
    },
    {
      id: "3",
      displayName: "BANNED_USER",
      email: "banned@example.com", 
      gameId: "555666777",
      walletBalance: "0.00",
      totalMatches: 12,
      totalWins: 2,
      totalEarnings: "150.00",
      isBanned: true,
      isAdmin: false,
      createdAt: "2024-02-01T09:00:00Z",
      profileImageUrl: null,
    },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.gameId.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-orbitron text-4xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground text-lg">Manage users, KYC approvals, and account settings</p>
        </div>

        {/* Search */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username, email, or Free Fire UID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <Card key={userData.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userData.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userData.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-lg flex items-center space-x-2">
                        <span>{userData.displayName}</span>
                        {userData.isAdmin && (
                          <Shield className="h-4 w-4 text-accent" />
                        )}
                        {userData.isBanned && (
                          <Ban className="h-4 w-4 text-destructive" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Free Fire UID: <span className="font-mono">{userData.gameId}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet</p>
                      <p className="font-bold neon-green">₹{userData.walletBalance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Matches</p>
                      <p className="font-bold text-foreground">{userData.totalMatches}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <p className="font-bold neon-blue">{userData.totalWins}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Earnings</p>
                      <p className="font-bold neon-red">₹{userData.totalEarnings}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant={userData.isBanned ? "default" : "destructive"}
                      className={userData.isBanned ? "bg-primary text-primary-foreground" : ""}
                    >
                      {userData.isBanned ? "Unban" : "Ban"}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Joined: {new Date(userData.createdAt).toLocaleDateString()}
                  </Badge>
                  <Badge 
                    className={userData.isBanned ? 
                      "bg-destructive text-destructive-foreground" : 
                      "bg-primary/20 text-primary"
                    }
                  >
                    {userData.isBanned ? "Banned" : "Active"}
                  </Badge>
                  {userData.isAdmin && (
                    <Badge className="bg-accent/20 text-accent">Admin</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No users registered yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
