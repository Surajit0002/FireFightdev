import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/ui/file-upload";
import { QrCode, Upload } from "lucide-react";

const paymentProofSchema = z.object({
  amount: z.string().min(1, "Amount is required").transform(val => parseFloat(val)),
  paymentMethod: z.enum(["UPI", "Paytm", "PhonePe", "GPay"], { 
    required_error: "Please select a payment method" 
  }),
  transactionId: z.string().optional(),
  screenshotUrl: z.string().min(1, "Payment screenshot is required"),
});

type PaymentProofFormValues = z.infer<typeof paymentProofSchema>;

export default function PaymentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentProofFormValues>({
    resolver: zodResolver(paymentProofSchema),
    defaultValues: {
      amount: "" as any,
      paymentMethod: undefined,
      transactionId: "",
      screenshotUrl: "",
    },
  });

  const submitPaymentMutation = useMutation({
    mutationFn: async (data: PaymentProofFormValues) => {
      await apiRequest("POST", "/api/payments/proof", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      toast({
        title: "Payment Proof Submitted!",
        description: "Your payment will be verified within 5-15 minutes",
      });
      form.reset();
      setIsSubmitting(false);
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
        description: "Failed to submit payment proof. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: PaymentProofFormValues) => {
    setIsSubmitting(true);
    submitPaymentMutation.mutate(data);
  };

  const handleScreenshotUpload = (url: string) => {
    form.setValue("screenshotUrl", url);
    toast({
      title: "Screenshot uploaded",
      description: "Payment screenshot has been uploaded successfully",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* QR Code Section */}
      <Card className="bg-muted border-border">
        <CardHeader>
          <CardTitle className="flex items-center neon-green">
            <QrCode className="mr-2 h-5 w-5" />
            Scan & Pay
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white p-6 rounded-lg inline-block mb-4">
            {/* QR Code placeholder - in real app this would be admin uploaded */}
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-400 rounded flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-600" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>UPI ID: firefight@paytm</p>
            <p>Name: Fire Fight Gaming</p>
            <p className="text-xs text-yellow-500 mt-2">
              ⚠️ Please scan this QR code to make payment
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form Section */}
      <Card className="bg-muted border-border">
        <CardHeader>
          <CardTitle className="flex items-center neon-blue">
            <Upload className="mr-2 h-5 w-5" />
            Upload Payment Proof
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        className="bg-background border-border focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border focus:border-primary">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Paytm">Paytm</SelectItem>
                        <SelectItem value="PhonePe">PhonePe</SelectItem>
                        <SelectItem value="GPay">GPay</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI Transaction ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Transaction ID"
                        className="bg-background border-border focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="screenshotUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Screenshot</FormLabel>
                    <FormControl>
                      <FileUpload
                        onUpload={handleScreenshotUpload}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024} // 5MB
                        className="border-dashed border-2 border-border hover:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:shadow-neon-green font-bold"
                disabled={isSubmitting || submitPaymentMutation.isPending}
              >
                {isSubmitting || submitPaymentMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Payment Proof"
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Verification typically takes 5-15 minutes
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
