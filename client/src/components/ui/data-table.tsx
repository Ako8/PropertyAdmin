import { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  selection?: {
    selectedItems: T[];
    onSelectionChange: (items: T[]) => void;
    getItemId: (item: T) => string | number;
  };
  actions?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  loading = false,
  pagination,
  selection,
  actions,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;
    
    if (checked) {
      selection.onSelectionChange(data);
    } else {
      selection.onSelectionChange([]);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (!selection) return;
    
    const itemId = selection.getItemId(item);
    const currentSelection = selection.selectedItems;
    
    if (checked) {
      selection.onSelectionChange([...currentSelection, item]);
    } else {
      selection.onSelectionChange(
        currentSelection.filter(i => selection.getItemId(i) !== itemId)
      );
    }
  };

  const isAllSelected = selection && data.length > 0 && 
    data.every(item => 
      selection.selectedItems.some(selected => 
        selection.getItemId(selected) === selection.getItemId(item)
      )
    );

  const isItemSelected = (item: T) => {
    if (!selection) return false;
    return selection.selectedItems.some(selected => 
      selection.getItemId(selected) === selection.getItemId(item)
    );
  };

  return (
    <div className={cn("bg-card rounded-lg border border-border overflow-hidden", className)}>
      {/* Header with search and actions */}
      {(onSearch || actions) && (
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onSearch && (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-64"
                  data-testid="table-search"
                />
              </div>
            )}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selection && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                    data-testid="select-all-checkbox"
                  />
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead key={index} className="font-medium text-foreground">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selection ? 1 : 0)} 
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selection ? 1 : 0)} 
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="table-row">
                  {selection && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isItemSelected(item)}
                        onChange={(e) => handleSelectItem(item, e.target.checked)}
                        className="rounded border-border"
                        data-testid={`select-item-${rowIndex}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.render 
                        ? column.render(item)
                        : String((item as any)[column.key] ?? "")
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Showing</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => pagination.onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              of {pagination.total} results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              data-testid="prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-1">
              {/* Simple pagination - could be enhanced with page numbers */}
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              data-testid="next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
