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
import FileUpload from "@/components/ui/file-upload";

const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(50, "Team name must be less than 50 characters"),
  type: z.enum(["duo", "squad"], { required_error: "Please select a team type" }),
  logoUrl: z.string().optional(),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeamForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      type: undefined,
      logoUrl: "",
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: CreateTeamFormValues) => {
      const teamData = {
        ...data,
        maxMembers: data.type === "duo" ? 2 : 4,
      };
      await apiRequest("POST", "/api/teams", teamData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Success!",
        description: "Team created successfully",
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
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CreateTeamFormValues) => {
    setIsSubmitting(true);
    createTeamMutation.mutate(data);
  };

  const handleLogoUpload = (url: string) => {
    form.setValue("logoUrl", url);
    toast({
      title: "Logo uploaded",
      description: "Team logo has been uploaded successfully",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter team name"
                  className="bg-muted border-border focus:border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-muted border-border focus:border-primary">
                    <SelectValue placeholder="Select team type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="duo">Duo (2 players)</SelectItem>
                  <SelectItem value="squad">Squad (4 players)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Logo (Optional)</FormLabel>
              <FormControl>
                <FileUpload
                  onUpload={handleLogoUpload}
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
          disabled={isSubmitting || createTeamMutation.isPending}
        >
          {isSubmitting || createTeamMutation.isPending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Creating Team...
            </div>
          ) : (
            "Create Team"
          )}
        </Button>
      </form>
    </Form>
  );
}
