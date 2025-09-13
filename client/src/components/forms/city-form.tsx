import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateCity, useUpdateCity, useRegions } from "@/hooks/use-api";
import { cityCreateSchema, type CityCreateInput } from "@shared/schema";
import type { CityDto } from "@/types/api";

interface CityFormProps {
  city?: CityDto | null;
  onSuccess?: () => void;
}

export default function CityForm({ city, onSuccess }: CityFormProps) {
  const { data: regions = [] } = useRegions();
  const createMutation = useCreateCity();
  const updateMutation = useUpdateCity();
  const isEditing = !!city;

  const form = useForm<CityCreateInput>({
    resolver: zodResolver(cityCreateSchema),
    defaultValues: {
      name: city?.name || "",
      regionId: city?.regionId || 0,
      language: city?.language || {
        ka: "",
        en: "",
        ru: "",
      },
    },
  });

  const onSubmit = async (data: CityCreateInput) => {
    try {
      if (isEditing && city) {
        await updateMutation.mutateAsync({ id: city.id, data });
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
                <FormLabel>City Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city name" {...field} data-testid="city-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger data-testid="region-select">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
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
                      placeholder={`Enter city description in ${language === 'en' ? 'English' : language === 'ka' ? 'Georgian' : 'Russian'}...`}
                      rows={3}
                      data-testid={`city-description-${language}`}
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
          <Button type="submit" disabled={isLoading} data-testid="save-city">
            {isLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update City" : "Save City"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
