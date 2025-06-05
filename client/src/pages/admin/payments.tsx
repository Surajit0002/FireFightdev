import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminSidebar from "@/components/admin/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Check, X, Eye } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminPayments() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

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

  const { data: payments } = useQuery({
    queryKey: ["/api/admin/payments"],
    retry: false,
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      await apiRequest("PATCH", `/api/admin/payments/${id}`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
      setSelectedPayment(null);
      setAdminNotes("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleApprove = (payment: any) => {
    updatePaymentMutation.mutate({
      id: payment.id,
      status: 'approved',
      adminNotes,
    });
  };

  const handleReject = (payment: any) => {
    updatePaymentMutation.mutate({
      id: payment.id,
      status: 'rejected',
      adminNotes,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-orbitron text-4xl font-bold mb-2">Payment Management</h1>
          <p className="text-muted-foreground text-lg">Review and approve payment submissions</p>
        </div>

        {payments && payments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {payments.map((payment: any) => (
              <Card key={payment.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Payment Verification</CardTitle>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">{payment.userId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="neon-green font-semibold">₹{payment.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-semibold">{payment.paymentMethod}</span>
                    </div>
                    {payment.transactionId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <span className="font-mono">{payment.transactionId}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span>{format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    
                    {payment.screenshotUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">Payment Screenshot:</p>
                        <div className="bg-muted rounded-lg p-2">
                          <img 
                            src={payment.screenshotUrl} 
                            alt="Payment proof" 
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjMUYyOTM3Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjQiIGZpbGw9IiM2NTZENzYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UGF5bWVudCBQcm9vZjwvdGV4dD4KPC9zdmc+';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {payment.status === 'pending' && (
                      <div className="space-y-3 mt-4">
                        <Textarea
                          placeholder="Add admin notes (optional)"
                          value={selectedPayment?.id === payment.id ? adminNotes : ""}
                          onChange={(e) => {
                            setSelectedPayment(payment);
                            setAdminNotes(e.target.value);
                          }}
                          className="bg-muted border-border"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-primary text-primary-foreground"
                            onClick={() => handleApprove(payment)}
                            disabled={updatePaymentMutation.isPending}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleReject(payment)}
                            disabled={updatePaymentMutation.isPending}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {payment.adminNotes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Admin Notes:</p>
                        <p className="text-sm">{payment.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment submissions</h3>
              <p className="text-muted-foreground">Payment proofs will appear here for review</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
