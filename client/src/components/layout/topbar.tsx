import { Bell, Settings, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/properties": "Properties",
  "/cities": "Cities",
  "/regions": "Regions", 
  "/places": "Places",
  "/blog": "Blog",
  "/storage": "Storage",
  "/languages": "Languages",
  "/types": "Property Types",
};

export default function TopBar() {
  const [location] = useLocation();

  const currentPage = breadcrumbMap[location] || "Page";

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <nav className="hidden md:flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Dashboard</span>
          {location !== "/" && (
            <>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{currentPage}</span>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <Select defaultValue="en">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">🇺🇸 English</SelectItem>
            <SelectItem value="ka">🇬🇪 ქართული</SelectItem>
            <SelectItem value="ru">🇷🇺 Русский</SelectItem>
          </SelectContent>
        </Select>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          data-testid="notifications-button"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm" data-testid="settings-button">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
