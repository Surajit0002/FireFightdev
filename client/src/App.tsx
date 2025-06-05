import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Tournaments from "@/pages/tournaments";
import Teams from "@/pages/teams";
import Wallet from "@/pages/wallet";
import Matches from "@/pages/matches";
import Leaderboard from "@/pages/leaderboard";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTournaments from "@/pages/admin/tournaments";
import AdminPayments from "@/pages/admin/payments";
import AdminUsers from "@/pages/admin/users";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/teams" component={Teams} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/matches" component={Matches} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/tournaments" component={AdminTournaments} />
          <Route path="/admin/payments" component={AdminPayments} />
          <Route path="/admin/users" component={AdminUsers} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
