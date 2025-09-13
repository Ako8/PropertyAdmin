import { apiRequest } from "./queryClient";
import type {
  PropertyCardDto,
  PropertyDto,
  PropertyCreateInput,
  CityDto,
  CityCreateInput,
  RegionDto,
  RegionCreateInput,
  PlaceDto,
  PlaceCreateInput,
  BlogDto,
  BlogCreateInput,
  TypeDto,
  TypeCreateInput,
  StorageDto,
  ImageUploadResponseDto,
  Language,
  ICalendarPropertyDto,
  PropertyOrderDto,
} from "@/types/api";

// Properties API
export const propertiesApi = {
  getAll: async (numberOf?: number): Promise<PropertyCardDto[]> => {
    const url = numberOf ? `/api/properties?numberOf=${numberOf}` : "/api/properties";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  getById: async (id: number): Promise<PropertyDto> => {
    const response = await apiRequest("GET", `/api/properties/${id}`);
    return response.json();
  },

  create: async (data: PropertyCreateInput): Promise<PropertyDto> => {
    const response = await apiRequest("POST", "/api/properties", data);
    return response.json();
  },

  update: async (id: number, data: PropertyCreateInput): Promise<PropertyDto> => {
    const response = await apiRequest("PUT", `/api/properties/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/properties/${id}`);
  },

  updateOrder: async (orderData: PropertyOrderDto[]): Promise<void> => {
    await apiRequest("POST", "/api/properties/order", orderData);
  },
};

// Cities API
export const citiesApi = {
  getAll: async (): Promise<CityDto[]> => {
    const response = await apiRequest("GET", "/api/cities");
    return response.json();
  },

  getById: async (id: number): Promise<CityDto> => {
    const response = await apiRequest("GET", `/api/cities/${id}`);
    return response.json();
  },

  create: async (data: CityCreateInput): Promise<CityDto> => {
    const response = await apiRequest("POST", "/api/cities", data);
    return response.json();
  },

  update: async (id: number, data: CityCreateInput): Promise<CityDto> => {
    const response = await apiRequest("PUT", `/api/cities/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/cities/${id}`);
  },
};

// Regions API
export const regionsApi = {
  getAll: async (numberOf?: number): Promise<RegionDto[]> => {
    const url = numberOf ? `/api/regions?numberOf=${numberOf}` : "/api/regions";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  getById: async (id: number): Promise<RegionDto> => {
    const response = await apiRequest("GET", `/api/regions/${id}`);
    return response.json();
  },

  create: async (data: RegionCreateInput): Promise<RegionDto> => {
    const response = await apiRequest("POST", "/api/regions", data);
    return response.json();
  },

  update: async (id: number, data: RegionCreateInput): Promise<RegionDto> => {
    const response = await apiRequest("PUT", `/api/regions/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/regions/${id}`);
  },
};

// Places API
export const placesApi = {
  getAll: async (filters?: {
    category?: string;
    search?: string;
    cityId?: number;
    regionId?: number;
  }): Promise<PlaceDto[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.cityId) params.append("cityId", filters.cityId.toString());
    if (filters?.regionId) params.append("regionId", filters.regionId.toString());

    const url = `/api/places${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  getById: async (id: number): Promise<PlaceDto> => {
    const response = await apiRequest("GET", `/api/places/${id}`);
    return response.json();
  },

  create: async (data: PlaceCreateInput): Promise<PlaceDto> => {
    const response = await apiRequest("POST", "/api/places", data);
    return response.json();
  },

  update: async (id: number, data: PlaceCreateInput): Promise<PlaceDto> => {
    const response = await apiRequest("PUT", `/api/places/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/places/${id}`);
  },
};

// Blog API
export const blogApi = {
  getAll: async (): Promise<BlogDto[]> => {
    const response = await apiRequest("GET", "/api/blog");
    return response.json();
  },

  getById: async (id: number): Promise<BlogDto> => {
    const response = await apiRequest("GET", `/api/blog/${id}`);
    return response.json();
  },

  create: async (data: BlogCreateInput): Promise<BlogDto> => {
    const response = await apiRequest("POST", "/api/blog", data);
    return response.json();
  },

  update: async (id: number, data: BlogCreateInput): Promise<BlogDto> => {
    const response = await apiRequest("PUT", `/api/blog/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/blog/${id}`);
  },
};

// Types API
export const typesApi = {
  getAll: async (): Promise<TypeDto[]> => {
    const response = await apiRequest("GET", "/api/types");
    return response.json();
  },

  getById: async (id: number): Promise<TypeDto> => {
    const response = await apiRequest("GET", `/api/types/${id}`);
    return response.json();
  },

  create: async (data: TypeCreateInput): Promise<TypeDto> => {
    const response = await apiRequest("POST", "/api/types", data);
    return response.json();
  },

  update: async (id: number, data: TypeCreateInput): Promise<TypeDto> => {
    const response = await apiRequest("PUT", `/api/types/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/types/${id}`);
  },
};

// Storage API
export const storageApi = {
  getAll: async (): Promise<StorageDto[]> => {
    const response = await apiRequest("GET", "/api/storage");
    return response.json();
  },

  getPropertyImages: async (propertyId: number): Promise<StorageDto[]> => {
    const response = await apiRequest("GET", `/api/storage/property/${propertyId}`);
    return response.json();
  },

  upload: async (formData: FormData): Promise<ImageUploadResponseDto> => {
    // Note: This would need special handling for file uploads
    // In a real implementation, you'd use fetch directly for FormData
    const response = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    return response.json();
  },
};

// Languages API
export const languagesApi = {
  getAll: async (): Promise<Language[]> => {
    const response = await apiRequest("GET", "/api/languages");
    return response.json();
  },

  getByReference: async (tableName: string, refId: number): Promise<Language> => {
    const response = await apiRequest("GET", `/api/languages/by-reference?tableName=${tableName}&refId=${refId}`);
    return response.json();
  },

  create: async (data: Language): Promise<Language> => {
    const response = await apiRequest("POST", "/api/languages", data);
    return response.json();
  },
};

// Calendar API
export const calendarApi = {
  getEvents: async (icalUrl: string): Promise<any[]> => {
    const response = await apiRequest("GET", `/api/calendar/events?icalUrl=${encodeURIComponent(icalUrl)}`);
    return response.json();
  },

  getProperties: async (): Promise<ICalendarPropertyDto[]> => {
    const response = await apiRequest("GET", "/api/calendar/properties");
    return response.json();
  },
};

// Exchange API
export const exchangeApi = {
  convert: async (fromCurrency: string, toCurrency: string, amount: number): Promise<any> => {
    const response = await apiRequest("GET", `/api/exchange/convert?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`);
    return response.json();
  },
};

// Notifications API
export const notificationsApi = {
  sendWelcome: async (email: string): Promise<void> => {
    await apiRequest("POST", `/api/notifications/welcome?email=${email}`);
  },

  sendContact: async (data: any): Promise<void> => {
    await apiRequest("POST", "/api/notifications", data);
  },
};
