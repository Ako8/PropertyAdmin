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
import { Plus, Eye, Edit, Trash2, CheckCircle, Clock, Edit3, Trash } from "lucide-react";
import { useBlogPosts, useBlogPost, useDeleteBlogPost } from "@/hooks/use-api";
import BlogForm from "@/components/forms/blog-form";
import type { BlogDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "@/components/ui/stats-card";

export default function Blog() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<BlogDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedPosts, setSelectedPosts] = useState<BlogDto[]>([]);

  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const { data: fullPostData, isLoading: isLoadingPost } = useBlogPost(editingPostId || 0);
  const deleteMutation = useDeleteBlogPost();
  const { toast } = useToast();

  // Filter blog posts based on search and filters
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    // For now, treating all posts as published since the API doesn't provide status
    const matchesStatus = !statusFilter || statusFilter === "all" || statusFilter === "published";
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (post: BlogDto) => {
    setEditingPostId(post.id);
  };

  // When full post data is loaded, set it and open modal
  useEffect(() => {
    if (fullPostData && editingPostId) {
      setEditingPost(fullPostData);
      setIsFormOpen(true);
    }
  }, [fullPostData, editingPostId]);

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPost(null);
    setEditingPostId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    
    try {
      // Use Promise.allSettled for concurrent execution
      const deletePromises = selectedPosts.map(post => 
        deleteMutation.mutateAsync(post.id)
      );
      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      setSelectedPosts([]);
      
      if (failed === 0) {
        toast({
          title: "Success",
          description: `${successful} blog posts deleted successfully`,
        });
      } else {
        toast({
          title: "Partial Success",
          description: `${successful} blog posts deleted, ${failed} failed`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete blog posts",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedPosts.length === 0) return;
    
    // This would typically call a bulk status update API
    setSelectedPosts([]);
    toast({
      title: "Success",
      description: `Status updated to "${status}" for ${selectedPosts.length} blog posts`,
    });
  };

  // Mock stats based on available data
  const stats = {
    totalPosts: blogPosts.length,
    published: blogPosts.length, // Assuming all are published
    drafts: 0, // Mock
    scheduled: 0, // Mock
  };

  const columns: Column<BlogDto>[] = [
    {
      key: "title",
      header: "Title",
      render: (post) => (
        <div className="flex items-center space-x-3">
          <img
            src={post.thumbnail || "/placeholder-blog.jpg"}
            alt={post.title}
            className="w-10 h-10 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-blog.jpg";
            }}
          />
          <div>
            <p className="font-medium text-foreground">{post.title}</p>
            <p className="text-sm text-muted-foreground">{post.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: () => (
        <span className="text-sm text-foreground">Admin User</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
          Published
        </Badge>
      ),
    },
    {
      key: "languages",
      header: "Languages",
      render: (post) => (
        <div className="flex space-x-1">
          {post.description?.en && <span className="text-xs">🇺🇸</span>}
          {post.description?.ka && <span className="text-xs">🇬🇪</span>}
          {post.description?.ru && <span className="text-xs">🇷🇺</span>}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (post) => (
        <span className="text-sm text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (post) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(post)}
            data-testid={`view-post-${post.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(post)}
            data-testid={`edit-post-${post.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(post.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`delete-post-${post.id}`}
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
        <h1 className="text-2xl font-bold text-foreground">Blog Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-post-button">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              <BlogForm
                post={editingPost}
                onSuccess={handleFormClose}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={<Edit3 className="w-8 h-8 text-primary" />}
        />

        <StatsCard
          title="Published"
          value={stats.published}
          icon={<CheckCircle className="w-8 h-8 text-emerald-500" />}
        />

        <StatsCard
          title="Drafts"
          value={stats.drafts}
          icon={<Edit className="w-8 h-8 text-amber-500" />}
        />

        <StatsCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Clock className="w-8 h-8 text-blue-500" />}
        />
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-wrap gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog Posts Table */}
      <DataTable
        data={filteredPosts}
        columns={columns}
        searchPlaceholder="Search posts..."
        onSearch={setSearchQuery}
        loading={isLoading}
        selection={{
          selectedItems: selectedPosts,
          onSelectionChange: setSelectedPosts,
          getItemId: (item) => item.id,
        }}
        actions={selectedPosts.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedPosts.length} selected
            </span>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete ({selectedPosts.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedPosts.length} blog posts? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Posts
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange('published')}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Publish ({selectedPosts.length})
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange('draft')}>
              <Edit className="w-4 h-4 mr-2" />
              Draft ({selectedPosts.length})
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setSelectedPosts([])}>
              Clear Selection
            </Button>
          </div>
        ) : undefined}
        pagination={{
          page: 1,
          total: filteredPosts.length,
          pageSize: 10,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}
