import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import PaymentForm from "@/components/wallet/payment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-primary" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary/20 text-primary';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'failed':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold mb-4">Wallet</h1>
          <p className="text-muted-foreground text-lg">Add money and manage your tournament funds</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-card border-primary/20 mb-8">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-sm text-muted-foreground mb-2">Current Balance</h2>
            <p className="text-4xl font-bold neon-green">₹{walletBalance?.balance || "0.00"}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Money */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="neon-green">Add Money to Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm />
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="neon-blue">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-semibold capitalize">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {transaction.type === 'withdrawal' ? '-' : '+'}₹{transaction.amount}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add money to see your transaction history
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
