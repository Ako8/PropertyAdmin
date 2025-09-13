import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Building,
  MapPin,
  Map,
  Compass,
  Edit3,
  Image,
  Tag,
  Calendar,
  Globe,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building },
  { name: "Cities", href: "/cities", icon: MapPin },
  { name: "Regions", href: "/regions", icon: Map },
  { name: "Places", href: "/places", icon: Compass },
  { name: "Blog", href: "/blog", icon: Edit3 },
  { name: "Storage", href: "/storage", icon: Image },
];

const secondaryNavigation = [
  { name: "Property Types", href: "/types", icon: Tag },
  { name: "Languages", href: "/languages", icon: Globe },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 sidebar-transition">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">Resorter360</h1>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <div
                key={item.name}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                )}
                onClick={() => setLocation(item.href)}
                role="link"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLocation(item.href);
                  }
                }}
                tabIndex={0}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            );
          })}

          <div className="pt-4 border-t border-border mt-4">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  )}
                  onClick={() => setLocation(item.href)}
                  role="link"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLocation(item.href);
                    }
                  }}
                  tabIndex={0}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@resorter360.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
