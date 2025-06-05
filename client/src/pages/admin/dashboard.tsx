import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminSidebar from "@/components/admin/sidebar";
import StatsCards from "@/components/admin/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, CreditCard, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: pendingPayments } = useQuery({
    queryKey: ["/api/admin/payments?status=pending"],
    retry: false,
  });

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
          <h1 className="font-orbitron text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Comprehensive tournament and user management</p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Tournament Management */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-green">
                <Trophy className="mr-2 h-5 w-5" />
                Tournament Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Elite Solo Championship</span>
                    <Badge className="bg-primary text-primary-foreground">LIVE</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Players: 48/50</div>
                    <div>Prize: ₹2,500</div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      End
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full bg-primary text-primary-foreground">
                  Create New Tournament
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Approvals */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-blue">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayments && pendingPayments.length > 0 ? (
                  pendingPayments.slice(0, 2).map((payment: any) => (
                    <div key={payment.id} className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold">User Payment</span>
                          <div className="text-sm text-muted-foreground">₹{payment.amount} • {payment.paymentMethod}</div>
                        </div>
                        <Badge variant="secondary">PENDING</Badge>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="bg-primary text-primary-foreground">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No pending payments</p>
                  </div>
                )}
                
                {pendingPayments && pendingPayments.length > 2 && (
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">{pendingPayments.length - 2} more pending approvals</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center neon-red">
                <TrendingUp className="mr-2 h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-lg font-bold neon-green">₹45,230</div>
                    <div className="text-xs text-muted-foreground">Today's Revenue</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-lg font-bold neon-blue">2,847</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-2">Tournament Performance</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Entry Fees:</span>
                      <span className="neon-green">₹123,450</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payouts:</span>
                      <span className="neon-red">₹98,760</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Profit:</span>
                      <span className="neon-blue">₹24,690</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
