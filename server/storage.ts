import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// Keep the existing interface but extend for admin functionality
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin session management
  getAdminSession(sessionId: string): Promise<{ userId: string; isAdmin: boolean } | undefined>;
  createAdminSession(userId: string): Promise<string>;
  deleteAdminSession(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private adminSessions: Map<string, { userId: string; isAdmin: boolean; createdAt: Date }>;

  constructor() {
    this.users = new Map();
    this.adminSessions = new Map();
    
    // Create default admin user
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "admin123", // In production, this should be hashed
    };
    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAdminSession(sessionId: string): Promise<{ userId: string; isAdmin: boolean } | undefined> {
    const session = this.adminSessions.get(sessionId);
    if (!session) return undefined;
    
    // Check if session is still valid (24 hours)
    const now = new Date();
    const sessionAge = now.getTime() - session.createdAt.getTime();
    if (sessionAge > 24 * 60 * 60 * 1000) {
      this.adminSessions.delete(sessionId);
      return undefined;
    }
    
    return { userId: session.userId, isAdmin: session.isAdmin };
  }

  async createAdminSession(userId: string): Promise<string> {
    const sessionId = randomUUID();
    this.adminSessions.set(sessionId, {
      userId,
      isAdmin: true,
      createdAt: new Date(),
    });
    return sessionId;
  }

  async deleteAdminSession(sessionId: string): Promise<void> {
    this.adminSessions.delete(sessionId);
  }
}

export const storage = new MemStorage();
