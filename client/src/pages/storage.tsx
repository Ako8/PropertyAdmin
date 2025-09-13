import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Grid, List, Eye, Download, Trash2, Upload } from "lucide-react";
import { useStorageItems } from "@/hooks/use-api";
import type { StorageDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function Storage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: storageItems = [], isLoading } = useStorageItems();
  const { toast } = useToast();

  // Filter storage items by type
  const filteredItems = storageItems.filter((item) => {
    return !selectedType || item.tableName === selectedType;
  });

  const handleUploadComplete = (url: string, fileName: string) => {
    toast({
      title: "Success",
      description: `File ${fileName} uploaded successfully`,
    });
  };

  const handleDownload = (item: StorageDto) => {
    // Open the file in a new tab for download
    window.open(item.link, '_blank');
  };

  const handleDelete = (item: StorageDto) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      // TODO: Implement delete functionality when API supports it
      toast({
        title: "Info",
        description: "Delete functionality not yet implemented",
      });
    }
  };

  const getTypeColor = (tableName: string) => {
    const colors: Record<string, string> = {
      Property: "bg-primary text-primary-foreground",
      City: "bg-amber-500 text-white",
      Region: "bg-emerald-500 text-white",
      Place: "bg-purple-500 text-white",
      Blog: "bg-green-500 text-white",
    };
    return colors[tableName] || "bg-gray-500 text-white";
  };

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="group relative">
          <img
            src={item.link}
            alt={item.name}
            className="w-full h-32 object-cover rounded-lg border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.open(item.link, '_blank')}
                data-testid={`view-file-${item.id}`}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleDownload(item)}
                data-testid={`download-file-${item.id}`}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item)}
                data-testid={`delete-file-${item.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="absolute top-2 left-2">
            <Badge className={getTypeColor(item.tableName)}>
              {item.tableName}
            </Badge>
          </div>

          {item.isThumbnail && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge className="bg-emerald-500 text-white">
                Thumbnail
              </Badge>
            </div>
          )}

          <div className="mt-2">
            <p className="text-xs text-muted-foreground truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">Ref ID: {item.refId}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <img
              src={item.link}
              alt={item.name}
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
              }}
            />
            <div>
              <p className="font-medium text-foreground">{item.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getTypeColor(item.tableName)}>
                  {item.tableName}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Ref ID: {item.refId}
                </span>
                {item.isThumbnail && (
                  <Badge className="bg-emerald-500 text-white">
                    Thumbnail
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(item.link, '_blank')}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(item)}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Storage Management</h1>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUploadComplete={handleUploadComplete}
            showEntityForm={true}
            multiple={true}
            maxSize={10}
          />
        </CardContent>
      </Card>

      {/* File Gallery */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">File Gallery</h3>
            <div className="flex items-center space-x-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Property">Property</SelectItem>
                  <SelectItem value="City">City</SelectItem>
                  <SelectItem value="Region">Region</SelectItem>
                  <SelectItem value="Place">Place</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="grid-view-button"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="list-view-button"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No files found
            </div>
          ) : viewMode === "grid" ? (
            <GridView />
          ) : (
            <ListView />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
