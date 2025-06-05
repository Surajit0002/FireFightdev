
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import PaymentForm from "@/components/wallet/payment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  TrendingUp, 
  DollarSign,
  CreditCard,
  Zap,
  Shield,
  Plus,
  Minus,
  Eye,
  Download,
  RefreshCw,
  Star,
  Gift
} from "lucide-react";
import { format } from "date-fns";

export default function WalletPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: walletBalance } = useQuery({
    queryKey: ["/api/wallet/balance"],
    retry: false,
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/wallet/transactions"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="h-4 w-4 text-emerald-500" />;
      case 'withdrawal':
        return <Minus className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const quickActions = [
    { icon: Plus, label: "Add Money", color: "from-emerald-500 to-green-600" },
    { icon: ArrowUpRight, label: "Withdraw", color: "from-red-500 to-pink-600" },
    { icon: Download, label: "Statement", color: "from-blue-500 to-cyan-600" },
    { icon: RefreshCw, label: "Refresh", color: "from-purple-500 to-violet-600" },
  ];

  const walletStats = [
    {
      title: "Available Balance",
      value: `₹${(walletBalance as any)?.balance || "0.00"}`,
      icon: Wallet,
      color: "from-emerald-500 to-green-600",
      bg: "from-emerald-500/10 to-green-600/10"
    },
    {
      title: "Total Deposits",
      value: "₹2,500.00",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
      bg: "from-blue-500/10 to-cyan-600/10"
    },
    {
      title: "Total Spent",
      value: "₹1,200.00",
      icon: DollarSign,
      color: "from-purple-500 to-violet-600",
      bg: "from-purple-500/10 to-violet-600/10"
    },
    {
      title: "Rewards Earned",
      value: "₹150.00",
      icon: Gift,
      color: "from-amber-500 to-orange-600",
      bg: "from-amber-500/10 to-orange-600/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Wallet Hub
            </h1>
          </div>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Your gaming treasury awaits. Add funds, track spending, and dominate tournaments
          </p>
        </div>

        {/* Main Balance Card - Mobile First */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-green-600/20 to-emerald-700/20 border-emerald-500/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-600/5"></div>
          <CardContent className="relative p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <Wallet className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-lg text-gray-300 mb-3 font-medium">Available Balance</h2>
            <p className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-2">
              ₹{(walletBalance as any)?.balance || "0.00"}
            </p>
            <p className="text-sm text-emerald-400 font-medium flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Secured & Ready for tournaments
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              className={`h-20 sm:h-24 bg-gradient-to-r ${action.color} hover:scale-105 transform transition-all duration-300 shadow-lg border-0 flex flex-col items-center justify-center gap-2`}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Wallet Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {walletStats.map((stat, index) => (
            <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bg} border-gray-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <h3 className="text-sm text-gray-400 mb-1">{stat.title}</h3>
                <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Add Money Section */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                Fund Your Wallet
              </CardTitle>
              <p className="text-gray-400">Add money securely to participate in tournaments</p>
            </CardHeader>
            <CardContent>
              <PaymentForm />
            </CardContent>
          </Card>

          {/* Transaction History Section */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                Recent Activity
              </CardTitle>
              <p className="text-gray-400">Track all your wallet transactions</p>
            </CardHeader>
            <CardContent>
              {Array.isArray(transactions) && transactions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/30 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-semibold capitalize text-white text-base">{transaction.type}</p>
                          <p className="text-sm text-gray-400">
                            {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-white">
                          {transaction.type === 'withdrawal' ? '-' : '+'}₹{transaction.amount}
                        </p>
                        <Badge className={`${getStatusColor(transaction.status)} border text-xs`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
                    <Clock className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">No Activity Yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Start by adding money to your wallet and join exciting tournaments
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-6 py-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Secure Payments</h3>
              <p className="text-gray-400 text-sm">Bank-grade encryption for all transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Instant Processing</h3>
              <p className="text-gray-400 text-sm">Lightning-fast transaction processing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Rewards Program</h3>
              <p className="text-gray-400 text-sm">Earn cashback on every transaction</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
