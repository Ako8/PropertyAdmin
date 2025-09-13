import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateRegion, useUpdateRegion } from "@/hooks/use-api";
import { regionCreateSchema, type RegionCreateInput } from "@shared/schema";
import type { RegionDto } from "@/types/api";

interface RegionFormProps {
  region?: RegionDto | null;
  onSuccess?: () => void;
}

export default function RegionForm({ region, onSuccess }: RegionFormProps) {
  const createMutation = useCreateRegion();
  const updateMutation = useUpdateRegion();
  const isEditing = !!region;

  const form = useForm<RegionCreateInput>({
    resolver: zodResolver(regionCreateSchema),
    defaultValues: {
      name: region?.name || "",
      language: region?.language || {
        ka: "",
        en: "",
        ru: "",
      },
    },
  });

  const onSubmit = async (data: RegionCreateInput) => {
    try {
      if (isEditing && region) {
        await updateMutation.mutateAsync({ id: region.id, data });
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter region name" {...field} data-testid="region-name" />
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
                      placeholder={`Enter region description in ${language === 'en' ? 'English' : language === 'ka' ? 'Georgian' : 'Russian'}...`}
                      rows={3}
                      data-testid={`region-description-${language}`}
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
          <Button type="submit" disabled={isLoading} data-testid="save-region">
            {isLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Region" : "Save Region"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
