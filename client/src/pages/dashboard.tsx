import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Eye, Edit3, Plus } from "lucide-react";
import { Link } from "wouter";
import { useProperties, useCities, usePlaces, useBlogPosts } from "@/hooks/use-api";

export default function Dashboard() {
  const { data: properties = [] } = useProperties();
  const { data: cities = [] } = useCities();
  const { data: places = [] } = usePlaces();
  const { data: blogPosts = [] } = useBlogPosts();

  // Calculate stats from actual data
  const stats = {
    totalProperties: properties.length,
    totalCities: cities.length,
    totalPlaces: places.length,
    totalBlogPosts: blogPosts.length,
    activeTours: properties.filter(p => p.thumbnail).length, // Properties with images
    propertiesThisMonth: Math.floor(properties.length * 0.1), // Mock calculation
    citiesThisMonth: Math.floor(cities.length * 0.05), // Mock calculation
    placesThisWeek: Math.floor(places.length * 0.15), // Mock calculation
    blogPostsThisWeek: Math.floor(blogPosts.length * 0.08), // Mock calculation
  };

  const recentActivities = [
    {
      id: "1",
      type: "property" as const,
      action: "created" as const,
      entity: "New property added",
      timestamp: "2 hours ago",
      color: "bg-emerald-500",
    },
    {
      id: "2", 
      type: "city" as const,
      action: "updated" as const,
      entity: "Virtual tour updated",
      timestamp: "4 hours ago",
      color: "bg-blue-500",
    },
    {
      id: "3",
      type: "blog" as const,
      action: "created" as const,
      entity: "New blog post published",
      timestamp: "1 day ago",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <Link href="/properties">
          <Button data-testid="quick-add-property">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add Property
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={<Building className="w-6 h-6 text-primary" />}
          trend={{
            value: `+${stats.propertiesThisMonth}`,
            isPositive: true,
            period: "this month",
          }}
        />

        <StatsCard
          title="Cities"
          value={stats.totalCities}
          icon={<MapPin className="w-6 h-6 text-emerald-500" />}
          trend={{
            value: `+${stats.citiesThisMonth}`,
            isPositive: true,
            period: "this month",
          }}
        />

        <StatsCard
          title="Active Tours"
          value={stats.activeTours}
          icon={<Eye className="w-6 h-6 text-amber-500" />}
          trend={{
            value: `+${stats.placesThisWeek}`,
            isPositive: true,
            period: "this week",
          }}
        />

        <StatsCard
          title="Blog Posts"
          value={stats.totalBlogPosts}
          icon={<Edit3 className="w-6 h-6 text-purple-500" />}
          trend={{
            value: `+${stats.blogPostsThisWeek}`,
            isPositive: true,
            period: "this week",
          }}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-muted/50 rounded-md"
                >
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.entity}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
