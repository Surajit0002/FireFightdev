import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, CreditCard, TrendingUp } from "lucide-react";
import AdminSidebar from "@/components/admin/sidebar";
import StatsCards from "@/components/admin/stats-cards";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-orbitron">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Fire Fight Tournament Platform Management</p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentTournaments?.map((tournament: any) => (
                  <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">{tournament.name}</h3>
                      <p className="text-gray-400 text-sm">{tournament.type} • ₹{tournament.entryFee}</p>
                    </div>
                    <Badge variant={tournament.status === 'live' ? 'destructive' : 'secondary'}>
                      {tournament.status}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-400">No recent tournaments</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.pendingPayments?.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">₹{payment.amount}</h3>
                      <p className="text-gray-400 text-sm">{payment.paymentMethod}</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      Pending
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-400">No pending payments</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}