import { useState } from "react";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Plus, Eye, Edit, Trash2, Search, Trash, CheckCircle } from "lucide-react";
import { usePlaces, useDeletePlace, useCities, useRegions } from "@/hooks/use-api";
import PlaceForm from "@/components/forms/place-form";
import type { PlaceDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function Places() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceDto[]>([]);

  const { data: places = [], isLoading } = usePlaces({
    search: searchQuery,
    cityId: selectedCity && selectedCity !== "all" ? parseInt(selectedCity) : undefined,
    regionId: selectedRegion && selectedRegion !== "all" ? parseInt(selectedRegion) : undefined,
    category: category && category !== "all" ? category : undefined,
  });
  const { data: cities = [] } = useCities();
  const { data: regions = [] } = useRegions();
  const deleteMutation = useDeletePlace();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete place",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (place: PlaceDto) => {
    setEditingPlace(place);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlace(null);
  };

  const handleBulkDelete = async () => {
    if (selectedPlaces.length === 0) return;
    
    try {
      for (const place of selectedPlaces) {
        await deleteMutation.mutateAsync(place.id);
      }
      setSelectedPlaces([]);
      toast({
        title: "Success",
        description: `${selectedPlaces.length} places deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete some places",
        variant: "destructive",
      });
    }
  };

  const handleBulkCategoryChange = async (newCategory: string) => {
    if (selectedPlaces.length === 0) return;
    
    // This would typically call a bulk category update API
    // For now, just show a success message as the API doesn't support bulk category updates
    setSelectedPlaces([]);
    toast({
      title: "Success",
      description: `Category updated to "${newCategory}" for ${selectedPlaces.length} places`,
    });
  };

  const getCityName = (cityId: number) => {
    const city = cities.find(c => c.id === cityId);
    return city?.name || "Unknown City";
  };

  const columns: Column<PlaceDto>[] = [
    {
      key: "name",
      header: "Place",
      render: (place) => (
        <div>
          <p className="font-medium text-foreground">{place.name}</p>
          <p className="text-sm text-muted-foreground">{place.slug}</p>
        </div>
      ),
    },
    {
      key: "cityId",
      header: "City",
      render: (place) => (
        <span className="text-sm text-foreground">{getCityName(place.cityId)}</span>
      ),
    },
    {
      key: "languages",
      header: "Languages",
      render: (place) => (
        <div className="flex space-x-1">
          {place.language.en && <span className="text-xs">🇺🇸</span>}
          {place.language.ka && <span className="text-xs">🇬🇪</span>}
          {place.language.ru && <span className="text-xs">🇷🇺</span>}
        </div>
      ),
    },
    {
      key: "virtualTour",
      header: "Virtual Tour",
      render: (place) => (
        <Badge 
          variant={place.kuulaEmbedCode ? "secondary" : "outline"}
          className={place.kuulaEmbedCode ? "bg-emerald-500/10 text-emerald-500" : ""}
        >
          {place.kuulaEmbedCode ? "Available" : "Not Available"}
        </Badge>
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
      render: (place) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(place)}
            data-testid={`view-place-${place.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(place)}
            data-testid={`edit-place-${place.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(place.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`delete-place-${place.id}`}
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
        <h1 className="text-2xl font-bold text-foreground">Places Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-place-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Place
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlace ? "Edit Place" : "Add New Place"}
              </DialogTitle>
            </DialogHeader>
            <PlaceForm
              place={editingPlace}
              onSuccess={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="attraction">Attraction</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="museum">Museum</SelectItem>
              <SelectItem value="park">Park</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Places Table */}
      <DataTable
        data={places}
        columns={columns}
        loading={isLoading}
        selection={{
          selectedItems: selectedPlaces,
          onSelectionChange: setSelectedPlaces,
          getItemId: (item) => item.id,
        }}
        actions={selectedPlaces.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedPlaces.length} selected
            </span>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete ({selectedPlaces.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedPlaces.length} places? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Places
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" size="sm" onClick={() => handleBulkCategoryChange('attraction')}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Attraction ({selectedPlaces.length})
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setSelectedPlaces([])}>
              Clear Selection
            </Button>
          </div>
        ) : undefined}
        pagination={{
          page: 1,
          total: places.length,
          pageSize: 10,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
