import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useCreatePlace, useUpdatePlace, useCities } from "@/hooks/use-api";
import { placeCreateSchema, type PlaceCreateInput } from "@shared/schema";
import type { PlaceDto } from "@/types/api";

interface PlaceFormProps {
  place?: PlaceDto | null;
  onSuccess?: () => void;
}

export default function PlaceForm({ place, onSuccess }: PlaceFormProps) {
  const { data: cities = [] } = useCities();
  const createMutation = useCreatePlace();
  const updateMutation = useUpdatePlace();
  const isEditing = !!place;

  const form = useForm<PlaceCreateInput>({
    resolver: zodResolver(placeCreateSchema),
    defaultValues: {
      name: place?.name || "",
      slug: place?.slug || "",
      cityId: place?.cityId || 0,
      kuulaEmbedCode: place?.kuulaEmbedCode || "",
      mapLink: place?.mapLink || "",
      language: place?.language || {
        ka: "",
        en: "",
        ru: "",
      },
    },
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName && !isEditing) {
      form.setValue("slug", generateSlug(watchName));
    }
  }, [watchName, form, isEditing]);

  const onSubmit = async (data: PlaceCreateInput) => {
    try {
      if (isEditing && place) {
        await updateMutation.mutateAsync({ id: place.id, data });
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter place name" {...field} data-testid="place-name" />
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
                    <Input placeholder="place-slug" {...field} data-testid="place-slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger data-testid="city-select">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kuulaEmbedCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Virtual Tour Embed Code</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    className="font-mono text-sm"
                    placeholder="<iframe src='https://kuula.co/place'></iframe>"
                    {...field}
                    data-testid="kuula-embed"
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
                    placeholder="https://maps.google.com/place"
                    {...field}
                    data-testid="map-link"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descriptions</FormLabel>
                <LanguageTabs
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(language, value, onChange) => (
                    <Textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={`Enter place description in ${language === 'en' ? 'English' : language === 'ka' ? 'Georgian' : 'Russian'}...`}
                      rows={4}
                      data-testid={`place-description-${language}`}
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
          <Button type="submit" disabled={isLoading} data-testid="save-place">
            {isLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Place" : "Save Place"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
