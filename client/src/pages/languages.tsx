import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { useLanguages } from "@/hooks/use-api";
import type { Language, TranslationQueue, LanguageProgress } from "@/types/api";

export default function Languages() {
  const { data: languages = [], isLoading } = useLanguages();

  // Mock data for language progress and translation queue
  // In a real implementation, these would come from the API
  const languageProgress: LanguageProgress[] = [
    {
      language: "en",
      properties: { completed: 342, total: 342 },
      cities: { completed: 28, total: 28 },
      places: { completed: 156, total: 156 },
    },
    {
      language: "ka", 
      properties: { completed: 298, total: 342 },
      cities: { completed: 28, total: 28 },
      places: { completed: 134, total: 156 },
    },
    {
      language: "ru",
      properties: { completed: 267, total: 342 },
      cities: { completed: 25, total: 28 },
      places: { completed: 89, total: 156 },
    },
  ];

  const translationQueue: TranslationQueue[] = [
    {
      entityType: "Property",
      entityId: 156,
      entityName: "Seaside Resort Batumi",
      missingLanguages: ["ru"],
      priority: "high",
    },
    {
      entityType: "Place",
      entityId: 89,
      entityName: "Narikala Fortress",
      missingLanguages: ["ka", "ru"],
      priority: "medium",
    },
  ];

  const getLanguageIcon = (lang: string) => {
    const icons: Record<string, string> = {
      en: "🇺🇸",
      ka: "🇬🇪", 
      ru: "🇷🇺",
    };
    return icons[lang] || "🏳️";
  };

  const getLanguageName = (lang: string) => {
    const names: Record<string, string> = {
      en: "English",
      ka: "ქართული",
      ru: "Русский",
    };
    return names[lang] || lang;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-destructive/10 text-destructive",
      medium: "bg-amber-500/10 text-amber-500", 
      low: "bg-muted text-muted-foreground",
    };
    return colors[priority] || colors.low;
  };

  const queueColumns: Column<TranslationQueue>[] = [
    {
      key: "entityType",
      header: "Entity",
      render: (item) => (
        <Badge 
          variant="outline"
          className={
            item.entityType === "Property" ? "bg-primary/10 text-primary" :
            item.entityType === "Place" ? "bg-purple-500/10 text-purple-500" :
            "bg-secondary"
          }
        >
          {item.entityType}
        </Badge>
      ),
    },
    {
      key: "entityId",
      header: "ID",
      render: (item) => (
        <span className="text-sm text-foreground">#{item.entityId}</span>
      ),
    },
    {
      key: "entityName",
      header: "Name",
      render: (item) => (
        <span className="text-sm text-foreground">{item.entityName}</span>
      ),
    },
    {
      key: "missingLanguages",
      header: "Missing Languages",
      render: (item) => (
        <div className="flex space-x-1">
          {item.missingLanguages.map((lang) => (
            <span key={lang} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
              {getLanguageIcon(lang)} {lang.toUpperCase()}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (item) => (
        <Badge className={getPriorityColor(item.priority)}>
          {item.priority}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <Button size="sm" variant="default">
          Translate
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Language Management</h1>
        <Button data-testid="add-translation-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Translation
        </Button>
      </div>

      {/* Language Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {languageProgress.map((lang) => (
          <Card key={lang.language}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{getLanguageIcon(lang.language)}</span>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {getLanguageName(lang.language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang.language === "en" ? "Primary language" : "Translation"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Properties</span>
                  <span className="font-medium text-foreground">
                    {lang.properties.completed}/{lang.properties.total}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cities</span>
                  <span className="font-medium text-foreground">
                    {lang.cities.completed}/{lang.cities.total}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Places</span>
                  <span className="font-medium text-foreground">
                    {lang.places.completed}/{lang.places.total}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Translation Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Queue</CardTitle>
          <p className="text-sm text-muted-foreground">Items requiring translation</p>
        </CardHeader>
        <CardContent>
          <DataTable
            data={translationQueue}
            columns={queueColumns}
            loading={false}
          />
        </CardContent>
      </Card>

      {/* All Language Entries */}
      <Card>
        <CardHeader>
          <CardTitle>All Language Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : languages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No language entries found
            </div>
          ) : (
            <div className="space-y-4">
              {languages.map((language, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Badge variant="outline">{language.tableName}</Badge>
                      <span className="ml-2 text-sm text-muted-foreground">
                        Ref ID: {language.refId}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {language.en && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">🇺🇸 English</p>
                        <p className="text-sm">{language.en}</p>
                      </div>
                    )}
                    {language.ka && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">🇬🇪 Georgian</p>
                        <p className="text-sm">{language.ka}</p>
                      </div>
                    )}
                    {language.ru && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">🇷🇺 Russian</p>
                        <p className="text-sm">{language.ru}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
