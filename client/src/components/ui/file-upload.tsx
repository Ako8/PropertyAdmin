import { useState, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUploadFile, useProperties, useCities, useRegions, usePlaces, useBlogPosts, useTypes } from "@/hooks/use-api";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete?: (url: string, fileName: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  showEntityForm?: boolean;
  children?: ReactNode;
  className?: string;
}

export function FileUpload({
  onUploadComplete,
  accept = "image/*",
  multiple = true,
  maxSize = 10,
  showEntityForm = true,
  children,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [tableName, setTableName] = useState<string>("");
  const [refId, setRefId] = useState<string>("");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [isThumbnail, setIsThumbnail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFile();

  // Fetch entities based on selected table type
  const { data: properties = [] } = useProperties();
  const { data: cities = [] } = useCities();
  const { data: regions = [] } = useRegions();
  const { data: places = [] } = usePlaces();
  const { data: blogPosts = [] } = useBlogPosts();
  const { data: types = [] } = useTypes();

  // Get entities based on selected table type
  const getEntitiesForTableType = () => {
    switch (tableName) {
      case "Property":
        return properties.map(p => ({ id: p.id, name: p.name }));
      case "City":
        return cities.map(c => ({ id: c.id, name: c.name }));
      case "Region":
        return regions.map(r => ({ id: r.id, name: r.name }));
      case "Place":
        return places.map(p => ({ id: p.id, name: p.name }));
      case "Blog":
        return blogPosts.map(b => ({ id: b.id, name: b.title }));
      case "Type":
        return types.map(t => ({ id: t.id, name: t.name }));
      default:
        return [];
    }
  };

  const availableEntities = getEntitiesForTableType();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter files by type and size
    const validFiles = newFiles.filter((file) => {
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        return false;
      }
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (showEntityForm && (!tableName || !refId)) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append("File", file);
      if (showEntityForm) {
        formData.append("TableName", tableName);
        formData.append("RefId", refId);
        formData.append("IsThumbnail", isThumbnail.toString());
      }

      try {
        const result = await uploadMutation.mutateAsync(formData);
        onUploadComplete?.(result.url, result.fileName);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    // Reset form
    setFiles([]);
    setTableName("");
    setRefId("");
    setSelectedEntityId("");
    setIsThumbnail(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Entity Association Form */}
      {showEntityForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="tableName">Entity Type</Label>
            <Select value={tableName} onValueChange={(value) => {
              setTableName(value);
              setSelectedEntityId(""); // Reset entity selection when table type changes
              setRefId("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Property">Property</SelectItem>
                <SelectItem value="City">City</SelectItem>
                <SelectItem value="Region">Region</SelectItem>
                <SelectItem value="Place">Place</SelectItem>
                <SelectItem value="Blog">Blog</SelectItem>
                <SelectItem value="Type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="entitySelect">Select {tableName || "Entity"}</Label>
            <Select
              value={selectedEntityId}
              onValueChange={(value) => {
                setSelectedEntityId(value);
                setRefId(value);
              }}
              disabled={!tableName}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={tableName ? `Select ${tableName.toLowerCase()}` : "First select entity type"} 
                />
              </SelectTrigger>
              <SelectContent>
                {availableEntities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name} (ID: {entity.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isThumbnail"
                checked={isThumbnail}
                onCheckedChange={(checked) => setIsThumbnail(!!checked)}
              />
              <Label htmlFor="isThumbnail">Set as thumbnail</Label>
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={cn(
          "file-drop-zone rounded-lg p-8 text-center transition-all",
          dragActive && "drag-over",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-testid="file-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          data-testid="file-input"
        />

        {children || (
          <>
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop files here to upload
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              data-testid="browse-files-button"
            >
              <FileImage className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {accept.toUpperCase()} up to {maxSize}MB
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files</Label>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <FileImage className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  data-testid={`remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={
            uploadMutation.isPending ||
            (showEntityForm && (!tableName || !refId))
          }
          className="w-full"
          data-testid="upload-button"
        >
          {uploadMutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Upload {files.length} File{files.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}
