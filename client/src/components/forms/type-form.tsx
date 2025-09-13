import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save } from "lucide-react";
import { useCreateType, useUpdateType } from "@/hooks/use-api";
import { typeCreateSchema, type TypeCreateInput } from "@shared/schema";
import type { TypeDto } from "@/types/api";

interface TypeFormProps {
  type?: TypeDto | null;
  onSuccess?: () => void;
}

export default function TypeForm({ type, onSuccess }: TypeFormProps) {
  const createMutation = useCreateType();
  const updateMutation = useUpdateType();
  const isEditing = !!type;

  const form = useForm<TypeCreateInput>({
    resolver: zodResolver(typeCreateSchema),
    defaultValues: {
      name: type?.name || "",
      image: type?.image || "",
    },
  });

  const onSubmit = async (data: TypeCreateInput) => {
    try {
      if (isEditing && type) {
        await updateMutation.mutateAsync({ id: type.id, data });
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
                <FormLabel>Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter property type name" {...field} data-testid="type-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/type-icon.jpg"
                    {...field}
                    data-testid="type-image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} data-testid="save-type">
            {isLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Type" : "Save Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
