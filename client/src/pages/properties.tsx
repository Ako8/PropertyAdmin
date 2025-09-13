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
import { Plus, Eye, Edit, Trash2, Star, Filter } from "lucide-react";
import { useProperties, useDeleteProperty, useCities, useTypes } from "@/hooks/use-api";
import PropertyForm from "@/components/forms/property-form";
import type { PropertyCardDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function Properties() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyCardDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");

  const { data: properties = [], isLoading } = useProperties();
  const { data: cities = [] } = useCities();
  const { data: types = [] } = useTypes();
  const deleteMutation = useDeleteProperty();
  const { toast } = useToast();

  // Filter properties based on search and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || property.city === selectedCity;
    const matchesType = !selectedType || property.type === selectedType;
    const matchesRating = !selectedRating || 
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
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProperty(null);
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
              <SelectItem value="">All Cities</SelectItem>
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
              <SelectItem value="">All Types</SelectItem>
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
              <SelectItem value="">All Ratings</SelectItem>
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
