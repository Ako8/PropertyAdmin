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
import { Plus, Eye, Edit, Trash2, ChevronDown, Map, MapPin, Trash } from "lucide-react";
import { useRegions, useDeleteRegion, useCities } from "@/hooks/use-api";
import RegionForm from "@/components/forms/region-form";
import type { RegionDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Regions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<RegionDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<number>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<RegionDto[]>([]);

  const { data: regions = [], isLoading } = useRegions();
  const { data: cities = [] } = useCities();
  const deleteMutation = useDeleteRegion();
  const { toast } = useToast();

  // Filter regions based on search
  const filteredRegions = regions.filter((region) => {
    return region.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this region?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete region",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (region: RegionDto) => {
    setEditingRegion(region);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRegion(null);
  };

  const handleBulkDelete = async () => {
    if (selectedRegions.length === 0) return;
    
    try {
      // Use Promise.allSettled for concurrent execution
      const deletePromises = selectedRegions.map(region => 
        deleteMutation.mutateAsync(region.id)
      );
      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      setSelectedRegions([]);
      
      if (failed === 0) {
        toast({
          title: "Success",
          description: `${successful} regions deleted successfully`,
        });
      } else {
        toast({
          title: "Partial Success",
          description: `${successful} regions deleted, ${failed} failed`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete regions",
        variant: "destructive",
      });
    }
  };

  const getCitiesInRegion = (regionId: number) => {
    return cities.filter(city => city.regionId === regionId);
  };

  const toggleRegionExpansion = (regionId: number) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId);
    } else {
      newExpanded.add(regionId);
    }
    setExpandedRegions(newExpanded);
  };

  const columns: Column<RegionDto>[] = [
    {
      key: "name",
      header: "Region",
      render: (region) => (
        <div>
          <p className="font-medium text-foreground">{region.name}</p>
          <p className="text-sm text-muted-foreground">ID: {region.id}</p>
        </div>
      ),
    },
    {
      key: "cities",
      header: "Cities Count",
      render: (region) => {
        const citiesCount = getCitiesInRegion(region.id).length;
        return (
          <span className="text-sm text-foreground">{citiesCount} cities</span>
        );
      },
    },
    {
      key: "languages",
      header: "Languages",
      render: (region) => (
        <div className="flex space-x-1">
          {region.language?.en && <span className="text-xs">🇺🇸</span>}
          {region.language?.ka && <span className="text-xs">🇬🇪</span>}
          {region.language?.ru && <span className="text-xs">🇷🇺</span>}
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
      render: (region) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(region)}
            data-testid={`view-region-${region.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(region)}
            data-testid={`edit-region-${region.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(region.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`delete-region-${region.id}`}
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
        <h1 className="text-2xl font-bold text-foreground">Regions Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-region-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Region
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRegion ? "Edit Region" : "Add New Region"}
              </DialogTitle>
            </DialogHeader>
            <RegionForm
              region={editingRegion}
              onSuccess={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Hierarchical View */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Hierarchical View</h3>
          <div className="space-y-4">
            {filteredRegions.map((region) => {
              const regionCities = getCitiesInRegion(region.id);
              const isExpanded = expandedRegions.has(region.id);
              
              return (
                <Collapsible key={region.id}>
                  <div className="border border-border rounded-lg">
                    <div className="flex items-center justify-between p-4 bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <CollapsibleTrigger
                          onClick={() => toggleRegionExpansion(region.id)}
                        >
                          <Button variant="ghost" size="sm">
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <Map className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-foreground">{region.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {regionCities.length} cities
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(region)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(region.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      {regionCities.length > 0 && (
                        <div className="border-t border-border">
                          {regionCities.map((city, index) => (
                            <div
                              key={city.id}
                              className={`flex items-center justify-between p-4 pl-12 ${
                                index < regionCities.length - 1 ? 'border-b border-border' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-amber-500" />
                                <div>
                                  <h5 className="font-medium text-foreground">{city.name}</h5>
                                  <p className="text-sm text-muted-foreground">ID: {city.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                                  Active
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Regions Table */}
      <DataTable
        data={filteredRegions}
        columns={columns}
        searchPlaceholder="Search regions..."
        onSearch={setSearchQuery}
        loading={isLoading}
        selection={{
          selectedItems: selectedRegions,
          onSelectionChange: setSelectedRegions,
          getItemId: (item) => item.id,
        }}
        actions={selectedRegions.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedRegions.length} selected
            </span>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete ({selectedRegions.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedRegions.length} regions? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Regions
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="ghost" size="sm" onClick={() => setSelectedRegions([])}>
              Clear Selection
            </Button>
          </div>
        ) : undefined}
        pagination={{
          page: 1,
          total: filteredRegions.length,
          pageSize: 10,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
