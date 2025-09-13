import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { propertyCreateSchema, cityCreateSchema, regionCreateSchema, placeCreateSchema, blogCreateSchema, typeCreateSchema } from "@shared/schema";
import type { 
  PropertyCreateInput, 
  CityCreateInput, 
  RegionCreateInput, 
  PlaceCreateInput, 
  BlogCreateInput, 
  TypeCreateInput 
} from "@shared/schema";

const API_BASE_URL = process.env.API_BASE_URL || "https://api.resorter360.ge";

// Configure multer for file uploads (memory storage for proxy)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // CORS middleware for external API
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      const { numberOf } = req.query;
      const endpoint = numberOf ? `/api/Properties?numberOf=${numberOf}` : "/api/Properties";
      const response = await apiRequest(endpoint);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/Properties/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = propertyCreateSchema.parse(req.body);
      const response = await apiRequest("/api/Properties", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("validation")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create property" });
      }
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const validatedData = propertyCreateSchema.parse(req.body);
      const response = await apiRequest(`/api/Properties/${req.params.id}`, {
        method: "PUT",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      await apiRequest(`/api/Properties/${req.params.id}`, {
        method: "DELETE",
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete property" });
    }
  });

  app.post("/api/properties/order", async (req, res) => {
    try {
      const response = await apiRequest("/api/Properties/order", {
        method: "POST",
        body: JSON.stringify(req.body),
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update property order" });
    }
  });

  // Cities endpoints
  app.get("/api/cities", async (req, res) => {
    try {
      const response = await apiRequest("/api/City");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/City/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch city" });
    }
  });

  app.post("/api/cities", async (req, res) => {
    try {
      const validatedData = cityCreateSchema.parse(req.body);
      const response = await apiRequest("/api/City", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create city" });
    }
  });

  app.put("/api/cities/:id", async (req, res) => {
    try {
      const validatedData = cityCreateSchema.parse(req.body);
      const response = await apiRequest(`/api/City/${req.params.id}`, {
        method: "PUT",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update city" });
    }
  });

  app.delete("/api/cities/:id", async (req, res) => {
    try {
      await apiRequest(`/api/City/${req.params.id}`, {
        method: "DELETE",
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete city" });
    }
  });

  // Regions endpoints
  app.get("/api/regions", async (req, res) => {
    try {
      const { numberOf } = req.query;
      const endpoint = numberOf ? `/api/Region?numberOf=${numberOf}` : "/api/Region";
      const response = await apiRequest(endpoint);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch regions" });
    }
  });

  app.get("/api/regions/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/Region/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch region" });
    }
  });

  app.post("/api/regions", async (req, res) => {
    try {
      const validatedData = regionCreateSchema.parse(req.body);
      const response = await apiRequest("/api/Region", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create region" });
    }
  });

  app.put("/api/regions/:id", async (req, res) => {
    try {
      const validatedData = regionCreateSchema.parse(req.body);
      const response = await apiRequest(`/api/Region/${req.params.id}`, {
        method: "PUT",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update region" });
    }
  });

  app.delete("/api/regions/:id", async (req, res) => {
    try {
      await apiRequest(`/api/Region/${req.params.id}`, {
        method: "DELETE",
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete region" });
    }
  });

  // Places endpoints
  app.get("/api/places", async (req, res) => {
    try {
      const { category, search, cityId, regionId } = req.query;
      const params = new URLSearchParams();
      if (category) params.append("category", category as string);
      if (search) params.append("search", search as string);
      if (cityId) params.append("cityId", cityId as string);
      if (regionId) params.append("regionId", regionId as string);
      
      const endpoint = `/api/Places${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiRequest(endpoint);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch places" });
    }
  });

  app.get("/api/places/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/Places/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch place" });
    }
  });

  app.post("/api/places", async (req, res) => {
    try {
      const validatedData = placeCreateSchema.parse(req.body);
      const response = await apiRequest("/api/Places", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create place" });
    }
  });

  app.put("/api/places/:id", async (req, res) => {
    try {
      const validatedData = placeCreateSchema.parse(req.body);
      const response = await apiRequest(`/api/Places/${req.params.id}`, {
        method: "PUT",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update place" });
    }
  });

  app.delete("/api/places/:id", async (req, res) => {
    try {
      await apiRequest(`/api/Places/${req.params.id}`, {
        method: "DELETE",
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete place" });
    }
  });

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const response = await apiRequest("/api/Blog");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/Blog/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validatedData = blogCreateSchema.parse(req.body);
      const response = await apiRequest("/api/Blog", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create blog post" });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const validatedData = blogCreateSchema.parse(req.body);
      const response = await apiRequest(`/api/Blog/${req.params.id}`, {
        method: "PUT",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      await apiRequest(`/api/Blog/${req.params.id}`, {
        method: "DELETE",
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete blog post" });
    }
  });

  // Property Types endpoints
  app.get("/api/types", async (req, res) => {
    try {
      const response = await apiRequest("/api/Types");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch types" });
    }
  });

  app.get("/api/types/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/Types/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch type" });
    }
  });

  app.post("/api/types", async (req, res) => {
    try {
      const validatedData = typeCreateSchema.parse(req.body);
      const response = await apiRequest("/api/Types", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create type" });
    }
  });

  app.put("/api/types/:id", async (req, res) => {
    try {
      const validatedData = typeCreateSchema.parse(req.body);
      const response = await apiRequest(`/api/Types/${req.params.id}`, {
        method: "PUT",
        body: JSON.stringify(validatedData),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update type" });
    }
  });

  app.delete("/api/types/:id", async (req, res) => {
    try {
      await apiRequest(`/api/Types/${req.params.id}`, {
        method: "DELETE",
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete type" });
    }
  });

  // Storage endpoints
  app.get("/api/storage", async (req, res) => {
    try {
      const response = await apiRequest("/api/Storage");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch storage items" });
    }
  });

  app.get("/api/storage/property/:id", async (req, res) => {
    try {
      const response = await apiRequest(`/api/Storage/property/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch property images" });
    }
  });

  // Multer error handler middleware for upload endpoint
  const handleMulterErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err?.message === 'Only image files are allowed') {
      return res.status(400).json({ error: 'Only image files are allowed. Please upload a valid image.' });
    }
    next(err);
  };

  // File upload endpoint (proxy to external API)
  app.post("/api/storage/upload", upload.single('File'), handleMulterErrors, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Create FormData to forward to external API
      const formData = new FormData();
      
      // Add the file as a Blob
      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('File', fileBlob, req.file.originalname);
      
      // Validate and add other form fields
      const tableName = req.body.TableName;
      const refId = req.body.RefId;
      const isThumbnail = req.body.IsThumbnail;
      
      // Validate TableName
      const validTableNames = ['Property', 'City', 'Region', 'Place', 'Blog', 'Type'];
      if (tableName && !validTableNames.includes(tableName)) {
        return res.status(400).json({ error: 'Invalid entity type. Must be one of: ' + validTableNames.join(', ') });
      }
      
      // Validate RefId as integer
      if (refId && (isNaN(parseInt(refId)) || parseInt(refId) <= 0)) {
        return res.status(400).json({ error: 'Reference ID must be a positive integer.' });
      }
      
      // Add validated form fields
      if (tableName) formData.append('TableName', tableName);
      if (refId) formData.append('RefId', refId);
      if (isThumbnail !== undefined) formData.append('IsThumbnail', isThumbnail.toString());

      // Forward to external API
      const response = await fetch(`${API_BASE_URL}/api/Storage/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Invalid response from upload service');
      }

      // Ensure response matches expected format
      const uploadResponse = {
        url: data.url || data.link || '',
        fileName: data.fileName || data.name || req.file?.originalname || 'unknown',
        id: data.id,
        ...data // Include any additional fields
      };
      
      res.json(uploadResponse);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to upload file" });
    }
  });

  // Languages endpoints
  app.get("/api/languages", async (req, res) => {
    try {
      const response = await apiRequest("/api/Languages");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch languages" });
    }
  });

  app.get("/api/languages/by-reference", async (req, res) => {
    try {
      const { tableName, refId } = req.query;
      const response = await apiRequest(`/api/Languages/by-reference?tableName=${tableName}&refId=${refId}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch language content" });
    }
  });

  app.post("/api/languages", async (req, res) => {
    try {
      const response = await apiRequest("/api/Languages", {
        method: "POST",
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create language entry" });
    }
  });

  // Calendar endpoints
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const { icalUrl } = req.query;
      const response = await apiRequest(`/api/ICalendar/events?icalUrl=${icalUrl}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch calendar events" });
    }
  });

  app.get("/api/calendar/properties", async (req, res) => {
    try {
      const response = await apiRequest("/api/ICalendarProperty");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch calendar properties" });
    }
  });

  // Exchange rate endpoint
  app.get("/api/exchange/convert", async (req, res) => {
    try {
      const { fromCurrency, toCurrency, amount } = req.query;
      const response = await apiRequest(`/api/ExchangeRate/convert?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to convert currency" });
    }
  });

  // Notifications endpoints
  app.post("/api/notifications/welcome", async (req, res) => {
    try {
      const { email } = req.query;
      const response = await apiRequest(`/api/Notifications/welcome?email=${email}`, {
        method: "POST",
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send welcome email" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const response = await apiRequest("/api/Notifications", {
        method: "POST",
        body: JSON.stringify(req.body),
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
