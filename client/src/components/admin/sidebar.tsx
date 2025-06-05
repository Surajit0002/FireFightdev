
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Trophy, 
  CreditCard, 
  Users, 
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  Menu
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: Home,
    color: "bg-blue-600 hover:bg-blue-700",
    accent: "border-blue-400 shadow-blue-500/30"
  },
  { 
    name: "Tournaments", 
    href: "/admin/tournaments", 
    icon: Trophy,
    color: "bg-yellow-600 hover:bg-yellow-700",
    accent: "border-yellow-400 shadow-yellow-500/30"
  },
  { 
    name: "Payments", 
    href: "/admin/payments", 
    icon: CreditCard,
    color: "bg-green-600 hover:bg-green-700",
    accent: "border-green-400 shadow-green-500/30"
  },
  { 
    name: "Users", 
    href: "/admin/users", 
    icon: Users,
    color: "bg-purple-600 hover:bg-purple-700",
    accent: "border-purple-400 shadow-purple-500/30"
  },
  { 
    name: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3,
    color: "bg-red-600 hover:bg-red-700",
    accent: "border-red-400 shadow-red-500/30"
  },
];

export default function AdminSidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowExpanded = !isCollapsed || isHovered;

  return (
    <div 
      className={cn(
        "relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 min-h-screen transition-all duration-300 ease-in-out",
        shouldShowExpanded ? "w-72" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="relative p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-3 transition-opacity duration-200",
            shouldShowExpanded ? "opacity-100" : "opacity-0"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-bold text-lg font-orbitron">FF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-orbitron">Fire Fight</h1>
              <p className="text-gray-400 text-xs">Admin Control</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 shadow-lg"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Stats Bar */}
        {shouldShowExpanded && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
              <div className="text-xs text-gray-400">Active</div>
              <div className="text-sm font-bold text-green-400">Online</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
              <div className="text-xs text-gray-400">Alerts</div>
              <div className="text-sm font-bold text-yellow-400">3</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="px-3 py-4 space-y-2">
        <div className={cn(
          "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 transition-opacity duration-200",
          shouldShowExpanded ? "opacity-100" : "opacity-0"
        )}>
          Navigation
        </div>

        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105",
                  isActive
                    ? `${item.color} text-white shadow-lg ${item.accent} border-l-4`
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Icon Container */}
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isActive ? "bg-white/20" : "bg-gray-800/30 group-hover:bg-gray-700/50"
                )}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Text Label */}
                <span className={cn(
                  "font-medium transition-all duration-200",
                  shouldShowExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                )}>
                  {item.name}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}

                {/* Hover Tooltip for Collapsed State */}
                {!shouldShowExpanded && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings Section */}
      <div className="px-3 py-4">
        <div className={cn(
          "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 transition-opacity duration-200",
          shouldShowExpanded ? "opacity-100" : "opacity-0"
        )}>
          System
        </div>

        <div className="space-y-2">
          <button className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200">
            <div className="p-2 rounded-lg bg-gray-800/30 group-hover:bg-gray-700/50 transition-all duration-200">
              <Settings className="h-5 w-5" />
            </div>
            <span className={cn(
              "transition-all duration-200",
              shouldShowExpanded ? "opacity-100" : "opacity-0"
            )}>
              Settings
            </span>
          </button>

          <button className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200">
            <div className="p-2 rounded-lg bg-gray-800/30 group-hover:bg-gray-700/50 transition-all duration-200 relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className={cn(
              "transition-all duration-200",
              shouldShowExpanded ? "opacity-100" : "opacity-0"
            )}>
              Notifications
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/50 to-transparent">
        <a
          href="/api/logout"
          className="group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 w-full border border-transparent hover:border-red-500/30"
        >
          <div className="p-2 rounded-lg bg-gray-800/30 group-hover:bg-red-600/20 transition-all duration-200">
            <LogOut className="h-5 w-5" />
          </div>
          <span className={cn(
            "font-medium transition-all duration-200",
            shouldShowExpanded ? "opacity-100" : "opacity-0"
          )}>
            Logout
          </span>
        </a>

        {/* Admin Profile */}
        {shouldShowExpanded && (
          <div className="mt-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
