import { useState } from "react";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useCities, useDeleteCity, useRegions } from "@/hooks/use-api";
import CityForm from "@/components/forms/city-form";
import type { CityDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function Cities() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const { data: cities = [], isLoading } = useCities();
  const { data: regions = [] } = useRegions();
  const deleteMutation = useDeleteCity();
  const { toast } = useToast();

  // Filter cities based on search and filters
  const filteredCities = cities.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || selectedRegion === "all" || city.regionId.toString() === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete city",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (city: CityDto) => {
    setEditingCity(city);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCity(null);
  };

  const getRegionName = (regionId: number) => {
    const region = regions.find(r => r.id === regionId);
    return region?.name || "Unknown Region";
  };

  const columns: Column<CityDto>[] = [
    {
      key: "name",
      header: "City",
      render: (city) => (
        <div>
          <p className="font-medium text-foreground">{city.name}</p>
          <p className="text-sm text-muted-foreground">ID: {city.id}</p>
        </div>
      ),
    },
    {
      key: "regionId",
      header: "Region",
      render: (city) => (
        <span className="text-sm text-foreground">{getRegionName(city.regionId)}</span>
      ),
    },
    {
      key: "languages",
      header: "Languages",
      render: (city) => (
        <div className="flex space-x-1">
          {city.language.en && <span className="text-xs">🇺🇸</span>}
          {city.language.ka && <span className="text-xs">🇬🇪</span>}
          {city.language.ru && <span className="text-xs">🇷🇺</span>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
          Active
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (city) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(city)}
            data-testid={`view-city-${city.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(city)}
            data-testid={`edit-city-${city.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(city.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`delete-city-${city.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Cities Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-city-button">
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCity ? "Edit City" : "Add New City"}
              </DialogTitle>
            </DialogHeader>
            <CityForm
              city={editingCity}
              onSuccess={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cities Table */}
      <DataTable
        data={filteredCities}
        columns={columns}
        searchPlaceholder="Search cities..."
        onSearch={setSearchQuery}
        loading={isLoading}
        pagination={{
          page: 1,
          total: filteredCities.length,
          pageSize: 10,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
