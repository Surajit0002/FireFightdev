import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, LogOut, Settings, Shield } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  walletBalance: string;
}

export default function MobileNav({ isOpen, onClose, navItems, walletBalance }: MobileNavProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-card border-t border-border">
      <div className="px-4 py-4 space-y-4">
        {/* User Profile */}
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage 
              src={user?.profileImageUrl || undefined} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.displayName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user?.displayName || "Gamer"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          {user?.isAdmin && (
            <Badge className="bg-accent/20 text-accent">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>

        {/* Wallet Balance */}
        <Link href="/wallet" onClick={onClose}>
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
            </div>
            <span className="font-semibold neon-green">₹{walletBalance}</span>
          </div>
        </Link>

        <Separator />

        {/* Navigation Items */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-muted"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator />

        {/* Profile & Admin Links */}
        <div className="space-y-2">
          <Link href="/profile" onClick={onClose}>
            <Button variant="ghost" className="w-full justify-start hover:bg-muted">
              <Settings className="mr-3 h-4 w-4" />
              Profile Settings
            </Button>
          </Link>

          {user?.isAdmin && (
            <Link href="/admin" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start hover:bg-muted text-accent">
                <Shield className="mr-3 h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-muted text-destructive"
            onClick={() => window.location.href = "/api/logout"}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
