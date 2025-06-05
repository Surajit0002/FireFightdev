import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, Eye, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/sidebar";
import { useState } from "react";

export default function AdminPayments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/admin/payments"],
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      await apiRequest(`/api/admin/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, adminNotes }),
      });
    },
    onSuccess: () => {
      toast({ title: "Payment status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      setSelectedPayment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating payment",
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
          <div className="animate-pulse">Loading payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-orbitron">Payment Management</h1>
          <p className="text-gray-400 mt-2">Review and approve QR payment proofs</p>
        </div>

        <div className="grid gap-6">
          {payments?.map((payment: any) => (
            <Card key={payment.id} className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      ₹{payment.amount}
                      <Badge 
                        variant={
                          payment.status === 'approved' ? 'default' : 
                          payment.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                        className={
                          payment.status === 'approved' ? 'bg-green-600' :
                          payment.status === 'rejected' ? 'bg-red-600' :
                          'bg-yellow-600'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-400 mt-1">
                      {payment.paymentMethod} • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Payment Screenshot</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                          <img 
                            src={payment.screenshotUrl} 
                            alt="Payment Screenshot" 
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {payment.status === 'pending' && (
                      <>
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updatePaymentMutation.mutate({ 
                            id: payment.id, 
                            status: 'approved' 
                          })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="text-white font-medium">{payment.userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Transaction ID</p>
                    <p className="text-white font-medium">{payment.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p className="text-white font-medium">{payment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Submitted</p>
                    <p className="text-white font-medium">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {payment.adminNotes && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Admin Notes</p>
                    <p className="text-white">{payment.adminNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Reject Payment</DialogTitle>
              </DialogHeader>
              <RejectPaymentForm 
                payment={selectedPayment}
                onSubmit={(adminNotes) => {
                  updatePaymentMutation.mutate({ 
                    id: selectedPayment.id, 
                    status: 'rejected',
                    adminNotes 
                  });
                }}
                isLoading={updatePaymentMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

function RejectPaymentForm({ payment, onSubmit, isLoading }: any) {
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(adminNotes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-gray-400 mb-2">
          Rejecting payment of ₹{payment.amount} from user {payment.userId}
        </p>
      </div>
      
      <div>
        <label className="text-white block mb-2">Reason for rejection</label>
        <Textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="Please provide a reason for rejecting this payment..."
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          variant="destructive" 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Rejecting..." : "Reject Payment"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setAdminNotes("")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}