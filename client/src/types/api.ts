export * from "@shared/schema";

export interface ApiError {
  error: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  totalProperties: number;
  totalCities: number;
  totalPlaces: number;
  totalBlogPosts: number;
  activeTours: number;
  propertiesThisMonth: number;
  citiesThisMonth: number;
  placesThisWeek: number;
  blogPostsThisWeek: number;
}

export interface RecentActivity {
  id: string;
  type: 'property' | 'city' | 'place' | 'blog';
  action: 'created' | 'updated' | 'deleted';
  entity: string;
  timestamp: string;
}

export interface LanguageProgress {
  language: 'en' | 'ka' | 'ru';
  properties: { completed: number; total: number };
  cities: { completed: number; total: number };
  places: { completed: number; total: number };
}

export interface TranslationQueue {
  entityType: string;
  entityId: number;
  entityName: string;
  missingLanguages: string[];
  priority: 'high' | 'medium' | 'low';
}
