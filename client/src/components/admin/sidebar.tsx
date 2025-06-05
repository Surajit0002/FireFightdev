import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Trophy, 
  CreditCard, 
  Users, 
  Settings,
  Home,
  Shield
} from "lucide-react";

export default function AdminSidebar() {
  const [location] = useLocation();

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-accent" />
          <div>
            <h2 className="font-orbitron text-xl font-bold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Fire Fight</p>
          </div>
        </Link>
      </div>

      <Separator />

      <nav className="p-4 space-y-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.href) 
                    ? "bg-primary text-primary-foreground hover:shadow-neon-green" 
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="mx-4" />

      <div className="p-4 space-y-2">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start hover:bg-muted">
            <Home className="mr-3 h-4 w-4" />
            Back to Site
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button variant="ghost" className="w-full justify-start hover:bg-muted">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}
