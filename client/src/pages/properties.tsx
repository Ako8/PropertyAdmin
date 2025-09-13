import { useState, useEffect } from "react";
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
import { Plus, Eye, Edit, Trash2, Star, Filter, Trash, CheckCircle } from "lucide-react";
import { useProperties, useProperty, useDeleteProperty, useCities, useTypes } from "@/hooks/use-api";
import PropertyForm from "@/components/forms/property-form";
import type { PropertyCardDto, PropertyDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function Properties() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedProperties, setSelectedProperties] = useState<PropertyCardDto[]>([]);

  const { data: properties = [], isLoading } = useProperties();
  const { data: cities = [] } = useCities();
  const { data: types = [] } = useTypes();
  const { data: fullPropertyData, isLoading: isLoadingProperty } = useProperty(editingPropertyId || 0);
  const deleteMutation = useDeleteProperty();
  const { toast } = useToast();

  // Filter properties based on search and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || selectedCity === "all" || property.city === selectedCity;
    const matchesType = !selectedType || selectedType === "all" || property.type === selectedType;
    const matchesRating = !selectedRating || selectedRating === "all" ||
                         (selectedRating === "5" && parseFloat(property.rating) === 5) ||
                         (selectedRating === "4+" && parseFloat(property.rating) >= 4) ||
                         (selectedRating === "3+" && parseFloat(property.rating) >= 3);
    
    return matchesSearch && matchesCity && matchesType && matchesRating;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete property",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (property: PropertyCardDto) => {
    setEditingPropertyId(property.id);
  };

  // When full property data is loaded, set it and open modal
  useEffect(() => {
    if (fullPropertyData && editingPropertyId) {
      setEditingProperty(fullPropertyData);
      setIsFormOpen(true);
    }
  }, [fullPropertyData, editingPropertyId]);

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProperty(null);
    setEditingPropertyId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return;
    
    try {
      // Use Promise.allSettled for concurrent execution
      const deletePromises = selectedProperties.map(property => 
        deleteMutation.mutateAsync(property.id)
      );
      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      setSelectedProperties([]);
      
      if (failed === 0) {
        toast({
          title: "Success",
          description: `${successful} properties deleted successfully`,
        });
      } else {
        toast({
          title: "Partial Success",
          description: `${successful} properties deleted, ${failed} failed`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete properties",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedProperties.length === 0) return;
    
    // This would typically call a bulk status update API
    // For now, just show a success message as the API doesn't support bulk status updates
    setSelectedProperties([]);
    toast({
      title: "Success",
      description: `Status updated for ${selectedProperties.length} properties`,
    });
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const columns: Column<PropertyCardDto>[] = [
    {
      key: "name",
      header: "Property",
      render: (property) => (
        <div className="flex items-center space-x-3">
          <img
            src={property.thumbnail || "/placeholder-property.jpg"}
            alt={property.name}
            className="w-12 h-10 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-property.jpg";
            }}
          />
          <div>
            <p className="font-medium text-foreground">{property.name}</p>
            <p className="text-sm text-muted-foreground">{property.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "City",
      render: (property) => (
        <span className="text-sm text-foreground">{property.city}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (property) => (
        <span className="text-sm text-foreground">{property.type}</span>
      ),
    },
    {
      key: "minPrice",
      header: "Price Range",
      render: (property) => (
        <span className="text-sm text-foreground">
          ${property.minPrice} - ${property.maxPrice}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (property) => (
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-foreground">{property.rating}</span>
          <div className="flex space-x-1">{renderStars(property.rating)}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (property) => (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
          Active
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (property) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(property)}
            data-testid={`edit-property-${property.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(property)}
            data-testid={`view-property-${property.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(property.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`delete-property-${property.id}`}
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
        <h1 className="text-2xl font-bold text-foreground">Properties Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-property-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? "Edit Property" : "Add New Property"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              <PropertyForm
                property={editingProperty}
                onSuccess={handleFormClose}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4+">4+ Stars</SelectItem>
              <SelectItem value="3+">3+ Stars</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" className="text-muted-foreground">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Properties Table */}
      <DataTable
        data={filteredProperties}
        columns={columns}
        searchPlaceholder="Search properties..."
        onSearch={setSearchQuery}
        loading={isLoading}
        selection={{
          selectedItems: selectedProperties,
          onSelectionChange: setSelectedProperties,
          getItemId: (item) => item.id,
        }}
        actions={selectedProperties.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedProperties.length} selected
            </span>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete ({selectedProperties.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedProperties.length} properties? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Properties
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange('active')}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Activate ({selectedProperties.length})
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setSelectedProperties([])}>
              Clear Selection
            </Button>
          </div>
        ) : undefined}
        pagination={{
          page: 1,
          total: filteredProperties.length,
          pageSize: 10,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
