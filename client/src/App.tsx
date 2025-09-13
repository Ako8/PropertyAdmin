import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import Cities from "@/pages/cities";
import Regions from "@/pages/regions";
import Places from "@/pages/places";
import Blog from "@/pages/blog";
import Storage from "@/pages/storage";
import Languages from "@/pages/languages";
import Types from "@/pages/types";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/properties" component={Properties} />
        <Route path="/cities" component={Cities} />
        <Route path="/regions" component={Regions} />
        <Route path="/places" component={Places} />
        <Route path="/blog" component={Blog} />
        <Route path="/storage" component={Storage} />
        <Route path="/languages" component={Languages} />
        <Route path="/types" component={Types} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
