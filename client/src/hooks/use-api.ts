import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  propertiesApi,
  citiesApi,
  regionsApi,
  placesApi,
  blogApi,
  typesApi,
  storageApi,
  languagesApi,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type {
  PropertyCreateInput,
  CityCreateInput,
  RegionCreateInput,
  PlaceCreateInput,
  BlogCreateInput,
  TypeCreateInput,
} from "@/types/api";

// Properties hooks
export function useProperties(numberOf?: number) {
  return useQuery({
    queryKey: ["/api/properties", numberOf],
    queryFn: () => propertiesApi.getAll(numberOf),
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: ["/api/properties", id],
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: PropertyCreateInput) => propertiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Success",
        description: "Property created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PropertyCreateInput }) =>
      propertiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties", id] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => propertiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete property",
        variant: "destructive",
      });
    },
  });
}

// Cities hooks
export function useCities() {
  return useQuery({
    queryKey: ["/api/cities"],
    queryFn: () => citiesApi.getAll(),
  });
}

export function useCity(id: number) {
  return useQuery({
    queryKey: ["/api/cities", id],
    queryFn: () => citiesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CityCreateInput) => citiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      toast({
        title: "Success",
        description: "City created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create city",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CityCreateInput }) =>
      citiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cities", id] });
      toast({
        title: "Success",
        description: "City updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update city",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => citiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      toast({
        title: "Success",
        description: "City deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete city",
        variant: "destructive",
      });
    },
  });
}

// Regions hooks
export function useRegions(numberOf?: number) {
  return useQuery({
    queryKey: ["/api/regions", numberOf],
    queryFn: () => regionsApi.getAll(numberOf),
  });
}

export function useRegion(id: number) {
  return useQuery({
    queryKey: ["/api/regions", id],
    queryFn: () => regionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegionCreateInput) => regionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regions"] });
      toast({
        title: "Success",
        description: "Region created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create region",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateRegion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RegionCreateInput }) =>
      regionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/regions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/regions", id] });
      toast({
        title: "Success",
        description: "Region updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update region",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteRegion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => regionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regions"] });
      toast({
        title: "Success",
        description: "Region deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete region",
        variant: "destructive",
      });
    },
  });
}

// Places hooks
export function usePlaces(filters?: {
  category?: string;
  search?: string;
  cityId?: number;
  regionId?: number;
}) {
  return useQuery({
    queryKey: ["/api/places", filters],
    queryFn: () => placesApi.getAll(filters),
  });
}

export function usePlace(id: number) {
  return useQuery({
    queryKey: ["/api/places", id],
    queryFn: () => placesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: PlaceCreateInput) => placesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/places"] });
      toast({
        title: "Success",
        description: "Place created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create place",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePlace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PlaceCreateInput }) =>
      placesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/places"] });
      queryClient.invalidateQueries({ queryKey: ["/api/places", id] });
      toast({
        title: "Success",
        description: "Place updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update place",
        variant: "destructive",
      });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => placesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/places"] });
      toast({
        title: "Success",
        description: "Place deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete place",
        variant: "destructive",
      });
    },
  });
}

// Blog hooks
export function useBlogPosts() {
  return useQuery({
    queryKey: ["/api/blog"],
    queryFn: () => blogApi.getAll(),
  });
}

export function useBlogPost(id: number) {
  return useQuery({
    queryKey: ["/api/blog", id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: BlogCreateInput) => blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BlogCreateInput }) =>
      blogApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog", id] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog post",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });
}

// Types hooks
export function useTypes() {
  return useQuery({
    queryKey: ["/api/types"],
    queryFn: () => typesApi.getAll(),
  });
}

export function useType(id: number) {
  return useQuery({
    queryKey: ["/api/types", id],
    queryFn: () => typesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: TypeCreateInput) => typesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/types"] });
      toast({
        title: "Success",
        description: "Property type created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property type",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TypeCreateInput }) =>
      typesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/types", id] });
      toast({
        title: "Success",
        description: "Property type updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property type",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => typesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/types"] });
      toast({
        title: "Success",
        description: "Property type deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete property type",
        variant: "destructive",
      });
    },
  });
}

// Storage hooks
export function useStorageItems() {
  return useQuery({
    queryKey: ["/api/storage"],
    queryFn: () => storageApi.getAll(),
  });
}

export function usePropertyImages(propertyId: number) {
  return useQuery({
    queryKey: ["/api/storage", "property", propertyId],
    queryFn: () => storageApi.getPropertyImages(propertyId),
    enabled: !!propertyId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => storageApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/storage"] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    },
  });
}

// Languages hooks
export function useLanguages() {
  return useQuery({
    queryKey: ["/api/languages"],
    queryFn: () => languagesApi.getAll(),
  });
}

export function useLanguageByReference(tableName: string, refId: number) {
  return useQuery({
    queryKey: ["/api/languages", "by-reference", tableName, refId],
    queryFn: () => languagesApi.getByReference(tableName, refId),
    enabled: !!tableName && !!refId,
  });
}
