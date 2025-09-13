import { useState, useEffect } from "react";
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
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useTypes, useType, useDeleteType } from "@/hooks/use-api";
import TypeForm from "@/components/forms/type-form";
import type { TypeDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function Types() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<TypeDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: types = [], isLoading } = useTypes();
  const { data: fullTypeData, isLoading: isLoadingType } = useType(editingTypeId || 0);
  const deleteMutation = useDeleteType();
  const { toast } = useToast();

  // Filter types based on search
  const filteredTypes = types.filter((type) => {
    return type.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this property type?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete property type",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (type: TypeDto) => {
    setEditingTypeId(type.id);
  };

  // When full type data is loaded, set it and open modal
  useEffect(() => {
    if (fullTypeData && editingTypeId) {
      setEditingType(fullTypeData);
      setIsFormOpen(true);
    }
  }, [fullTypeData, editingTypeId]);

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingType(null);
    setEditingTypeId(null);
  };

  const columns: Column<TypeDto>[] = [
    {
      key: "name",
      header: "Property Type",
      render: (type) => (
        <div className="flex items-center space-x-3">
          <img
            src={type.image || "/placeholder-type.jpg"}
            alt={type.name}
            className="w-10 h-10 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-type.jpg";
            }}
          />
          <div>
            <p className="font-medium text-foreground">{type.name}</p>
            <p className="text-sm text-muted-foreground">ID: {type.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "image",
      header: "Image",
      render: (type) => (
        <Badge 
          variant={type.image ? "secondary" : "outline"}
          className={type.image ? "bg-emerald-500/10 text-emerald-500" : ""}
        >
          {type.image ? "Available" : "Not Set"}
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
      render: (type) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(type)}
            data-testid={`view-type-${type.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(type)}
            data-testid={`edit-type-${type.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(type.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`delete-type-${type.id}`}
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
        <h1 className="text-2xl font-bold text-foreground">Property Types Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-type-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingType ? "Edit Property Type" : "Add New Property Type"}
              </DialogTitle>
            </DialogHeader>
            <TypeForm
              type={editingType}
              onSuccess={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Types Table */}
      <DataTable
        data={filteredTypes}
        columns={columns}
        searchPlaceholder="Search property types..."
        onSearch={setSearchQuery}
        loading={isLoading}
        pagination={{
          page: 1,
          total: filteredTypes.length,
          pageSize: 10,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
