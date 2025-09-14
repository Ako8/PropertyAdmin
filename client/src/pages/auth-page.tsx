// Basic Username/Password Authentication integration
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building, Shield, Database, Users } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Redirect if already logged in (after all hooks)
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Resorter360</h1>
            <p className="text-muted-foreground">Admin Panel Access</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your credentials to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    required
                    data-testid="input-login-username"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    data-testid="input-login-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <Building className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Resorter360 Admin Panel</h2>
          <p className="text-blue-100 mb-8">
            Manage your properties, cities, regions, places, and blog content with our comprehensive admin interface.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Data Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Property Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>User Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}