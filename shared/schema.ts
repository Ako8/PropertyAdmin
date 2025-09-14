import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for external authentication integration)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password"), // Optional since we use external authentication
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// API Entity Types (based on Resorter360 API documentation)
export interface PropertyCardDto {
  id: number;
  name: string;
  slug: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  thumbnail: string;
  rating: string;
  type: string;
  orderIndex: number;
  createdAt: string;
}

export interface PropertyDto extends PropertyCardDto {
  cityId: number;
  kuulaEmbedCode?: string;
  mapUrl?: string;
  hostName?: string;
  hostNumber?: string;
  hostFacebookUrl?: string;
  hostInstagramUrl?: string;
  hostYoutubeUrl?: string;
  typeId: number;
  rooms: RoomDto[];
  language: LanguageDto;
}

export interface PropertyCreateDto {
  name: string;
  slug: string;
  cityId: number;
  kuulaEmbedCode?: string;
  mapUrl?: string;
  hostName?: string;
  hostNumber?: string;
  hostFacebookUrl?: string;
  hostInstagramUrl?: string;
  hostYoutubeUrl?: string;
  typeId: number;
  rating?: string;
  language: LanguageDto;
  rooms: RoomCreateDto[];
}

export interface RoomDto {
  id: number;
  name: string;
  sqft: number;
  amountOfPeople: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  kuulaEmbedCode?: string;
  iCalLink?: string;
}

export interface RoomCreateDto {
  name: string;
  sqft: number;
  amountOfPeople: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  kuulaEmbedCode?: string;
  iCalLink?: string;
}

export interface LanguageDto {
  ka?: string; // Georgian
  en?: string; // English
  ru?: string; // Russian
}

export interface Language extends LanguageDto {
  id?: number;
  tableName: string;
  refId: number;
}

export interface CityDto {
  id: number;
  name: string;
  regionId: number;
  language: LanguageDto;
}

export interface RegionDto {
  id: number;
  name: string;
  language: LanguageDto;
}

export interface PlaceDto {
  id: number;
  name: string;
  slug: string;
  cityId: number;
  kuulaEmbedCode?: string;
  mapLink?: string;
  language: LanguageDto;
}

export interface PlaceDetailsDto extends PlaceDto {
  nearbyProperties?: PropertyCardDto[];
}

export interface PlaceCreateDto {
  name: string;
  slug: string;
  cityId: number;
  kuulaEmbedCode?: string;
  mapLink?: string;
  language: LanguageDto;
}

export interface BlogDto {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string;
  mapLink?: string;
  description: LanguageDto;
  createdAt: string;
}

export interface BlogCreateDto {
  title: string;
  slug: string;
  thumbnail?: string;
  mapLink?: string;
  description: LanguageDto;
}

export interface TypeDto {
  id: number;
  name: string;
  image?: string;
}

export interface StorageDto {
  id: number;
  name: string;
  link: string;
  refId: number;
  tableName: string;
  isThumbnail: boolean;
}

export interface ImageUploadResponseDto {
  url: string;
  fileName: string;
}

export interface ContactRequestDto {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface PropertyOrderDto {
  propertyId: number;
  orderIndex: number;
}

export interface ICalendarPropertyDto {
  id: number;
  ownerName: string;
  iCalLink: string;
}

// Form validation schemas
export const propertyCreateSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  slug: z.string().min(1, "Slug is required"),
  cityId: z.number().min(1, "City is required"),
  typeId: z.number().min(1, "Property type is required"),
  kuulaEmbedCode: z.string().optional(),
  mapUrl: z.string().url().optional().or(z.literal("")),
  hostName: z.string().optional(),
  hostNumber: z.string().optional(),
  hostFacebookUrl: z.string().url().optional().or(z.literal("")),
  hostInstagramUrl: z.string().url().optional().or(z.literal("")),
  hostYoutubeUrl: z.string().url().optional().or(z.literal("")),
  rating: z.string().optional(),
  language: z.object({
    ka: z.string().optional(),
    en: z.string().optional(),
    ru: z.string().optional(),
  }),
  rooms: z.array(z.object({
    name: z.string().min(1, "Room name is required"),
    sqft: z.number().min(1, "Square feet is required"),
    amountOfPeople: z.number().min(1, "Number of people is required"),
    bedrooms: z.number().min(0, "Bedrooms must be 0 or more"),
    bathrooms: z.number().min(0, "Bathrooms must be 0 or more"),
    price: z.number().min(0, "Price must be 0 or more"),
    kuulaEmbedCode: z.string().optional(),
    iCalLink: z.string().url().optional().or(z.literal("")),
  })).min(1, "At least one room is required"),
});

export const cityCreateSchema = z.object({
  name: z.string().min(1, "City name is required"),
  regionId: z.number().min(1, "Region is required"),
  language: z.object({
    ka: z.string().optional(),
    en: z.string().optional(),
    ru: z.string().optional(),
  }),
});

export const regionCreateSchema = z.object({
  name: z.string().min(1, "Region name is required"),
  language: z.object({
    ka: z.string().optional(),
    en: z.string().optional(),
    ru: z.string().optional(),
  }),
});

export const placeCreateSchema = z.object({
  name: z.string().min(1, "Place name is required"),
  slug: z.string().min(1, "Slug is required"),
  cityId: z.number().min(1, "City is required"),
  kuulaEmbedCode: z.string().optional(),
  mapLink: z.string().url().optional().or(z.literal("")),
  language: z.object({
    ka: z.string().optional(),
    en: z.string().optional(),
    ru: z.string().optional(),
  }),
});

export const blogCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  thumbnail: z.string().optional(),
  mapLink: z.string().url().optional().or(z.literal("")),
  description: z.object({
    ka: z.string().optional(),
    en: z.string().optional(),
    ru: z.string().optional(),
  }),
});

export const typeCreateSchema = z.object({
  name: z.string().min(1, "Type name is required"),
  image: z.string().optional(),
});

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
export type CityCreateInput = z.infer<typeof cityCreateSchema>;
export type RegionCreateInput = z.infer<typeof regionCreateSchema>;
export type PlaceCreateInput = z.infer<typeof placeCreateSchema>;
export type BlogCreateInput = z.infer<typeof blogCreateSchema>;
export type TypeCreateInput = z.infer<typeof typeCreateSchema>;
