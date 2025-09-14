// External Resorter360 API Authentication integration
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

// Function to authenticate against external Resorter360 API
async function authenticateWithExternalAPI(username: string, password: string): Promise<boolean> {
  try {
    const url = `https://api.resorter360.ge/API/User/login?login=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 5 second timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`External auth API returned ${response.status}`);
    }

    const result = await response.json();
    return result === true;
  } catch (error) {
    console.error('External authentication error:', error);
    throw new Error('Auth service unavailable');
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: "uifergwuwgaswerghnohdergno",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Authenticate against external Resorter360 API
        const isValidCredentials = await authenticateWithExternalAPI(username, password);
        
        if (!isValidCredentials) {
          return done(null, false);
        }

        // If authentication succeeds, find or create user in local storage
        let user = await storage.getUserByUsername(username);
        if (!user) {
          // Create minimal user profile for session management
          user = await storage.createUser({ username });
        }

        return done(null, user);
      } catch (error) {
        // Network/service errors should return 503
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.get("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        // Service unavailable (external API error)
        return res.status(503).json({ error: "Authentication service unavailable" });
      }
      if (!user) {
        // Invalid credentials
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.status(200).json(req.user);
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

export { authenticateWithExternalAPI };