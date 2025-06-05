import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Target, DollarSign, Play, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-orbitron text-2xl font-bold neon-green">
                🔥 Fire Fight
              </h1>
            </div>
            <Button
              onClick={() => window.location.href = "/api/login"}
              className="bg-neon-green text-background hover:shadow-neon-green font-bold"
            >
              Login to Play
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-6">
            <span className="text-foreground">FIRE</span>{" "}
            <span className="neon-green">FIGHT</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join competitive Free Fire tournaments, win real money, and dominate the battlefield with players across India
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => window.location.href = "/api/login"}
              className="bg-neon-green text-background px-8 py-4 text-lg font-bold hover:shadow-neon-green transform hover:scale-105 transition-all"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Join Tournament
            </Button>
            <Button
              variant="outline"
              className="border-2 border-accent text-accent px-8 py-4 text-lg font-bold hover:bg-accent hover:text-background transition-all"
            >
              <Users className="mr-2 h-5 w-5" />
              Create Team
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="glass-effect border-border">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold neon-green">12,547</div>
                <div className="text-sm text-muted-foreground">Active Players</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold neon-blue">₹2.4M</div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold neon-red">48</div>
                <div className="text-sm text-muted-foreground">Live Tournaments</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground">8,392</div>
                <div className="text-sm text-muted-foreground">Matches Played</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-4xl font-bold mb-4">Why Choose Fire Fight?</h2>
            <p className="text-muted-foreground text-lg">The ultimate Free Fire tournament platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-accent transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-background" />
                </div>
                <h3 className="font-bold text-xl mb-2">Real Money Rewards</h3>
                <p className="text-muted-foreground">Win actual cash prizes in competitive tournaments</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Play className="h-6 w-6 text-background" />
                </div>
                <h3 className="font-bold text-xl mb-2">Live Tournaments</h3>
                <p className="text-muted-foreground">Join live matches with real-time room codes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:border-destructive transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-destructive rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-destructive-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-2">Secure Platform</h3>
                <p className="text-muted-foreground">Safe and verified payment processing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-orbitron text-4xl font-bold mb-4">Ready to Start Winning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of players competing for real money prizes
          </p>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary text-primary-foreground px-8 py-4 text-lg font-bold hover:shadow-neon-green transform hover:scale-105 transition-all"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-orbitron text-2xl font-bold neon-green mb-4">
              🔥 Fire Fight
            </h3>
            <p className="text-muted-foreground text-sm">
              © 2024 Fire Fight Gaming Platform. All rights reserved. | Play responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
