import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LanguageTabs } from "@/components/ui/language-tabs";
import { Save } from "lucide-react";
import { useCreateBlogPost, useUpdateBlogPost } from "@/hooks/use-api";
import { blogCreateSchema, type BlogCreateInput } from "@shared/schema";
import type { BlogDto } from "@/types/api";

interface BlogFormProps {
  post?: BlogDto | null;
  onSuccess?: () => void;
}

export default function BlogForm({ post, onSuccess }: BlogFormProps) {
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const isEditing = !!post;

  const form = useForm<BlogCreateInput>({
    resolver: zodResolver(blogCreateSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      thumbnail: post?.thumbnail || "",
      mapLink: post?.mapLink || "",
      description: post?.description || {
        ka: "",
        en: "",
        ru: "",
      },
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && !isEditing) {
      form.setValue("slug", generateSlug(watchTitle));
    }
  }, [watchTitle, form, isEditing]);

  const onSubmit = async (data: BlogCreateInput) => {
    try {
      if (isEditing && post) {
        await updateMutation.mutateAsync({ id: post.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} data-testid="blog-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="blog-slug" {...field} data-testid="blog-slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/thumbnail.jpg"
                    {...field}
                    data-testid="blog-thumbnail"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mapLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Map Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://maps.google.com/location"
                    {...field}
                    data-testid="blog-map-link"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <LanguageTabs
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(language, value, onChange) => (
                    <Textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={`Enter blog content in ${language === 'en' ? 'English' : language === 'ka' ? 'Georgian' : 'Russian'}...`}
                      rows={8}
                      data-testid={`blog-content-${language}`}
                    />
                  )}
                </LanguageTabs>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} data-testid="save-blog">
            {isLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Post" : "Save Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
