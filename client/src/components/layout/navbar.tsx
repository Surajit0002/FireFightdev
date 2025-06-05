import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import MobileNav from "./mobile-nav";
import { 
  Trophy, 
  Users, 
  Wallet, 
  Target, 
  Crown, 
  Menu,
  LogOut,
  Settings,
  Shield
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: walletBalance } = useQuery({
    queryKey: ["/api/wallet/balance"],
    retry: false,
  });

  const navItems = [
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/matches", label: "My Matches", icon: Target },
    { href: "/leaderboard", label: "Leaderboard", icon: Crown },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="font-orbitron text-2xl font-bold neon-green">
              🔥 Fire Fight
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`hover:text-primary transition-colors ${
                      isActive(item.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {/* Wallet Balance */}
            <Link href="/wallet">
              <Button
                variant="outline" 
                className="border-primary/20 hover:border-primary hover:shadow-neon-green transition-all"
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span className="text-sm">Wallet:</span>
                <span className="font-semibold neon-green ml-1">
                  ₹{walletBalance?.balance || "0.00"}
                </span>
              </Button>
            </Link>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage 
                      src={user?.profileImageUrl || undefined} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.displayName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {user?.isAdmin && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-accent">
                      <Shield className="h-2 w-2" />
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.displayName || "Gamer"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="cursor-pointer">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-accent">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        walletBalance={walletBalance?.balance || "0.00"}
      />
    </nav>
  );
}
