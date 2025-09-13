import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageDto } from "@/types/api";

interface LanguageTabsProps {
  value: LanguageDto;
  onChange: (value: LanguageDto) => void;
  children: (language: 'en' | 'ka' | 'ru', value: string, onChange: (value: string) => void) => ReactNode;
  defaultLanguage?: 'en' | 'ka' | 'ru';
}

const languageLabels = {
  en: "🇺🇸 English",
  ka: "🇬🇪 ქართული",
  ru: "🇷🇺 Русский",
};

export function LanguageTabs({ 
  value, 
  onChange, 
  children, 
  defaultLanguage = 'en' 
}: LanguageTabsProps) {
  const handleLanguageChange = (language: 'en' | 'ka' | 'ru', newValue: string) => {
    onChange({
      ...value,
      [language]: newValue,
    });
  };

  return (
    <Tabs defaultValue={defaultLanguage} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {Object.entries(languageLabels).map(([lang, label]) => (
          <TabsTrigger
            key={lang}
            value={lang}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.keys(languageLabels).map((lang) => {
        const langKey = lang as 'en' | 'ka' | 'ru';
        return (
          <TabsContent key={lang} value={lang} className="mt-4">
            {children(
              langKey,
              value[langKey] || "",
              (newValue) => handleLanguageChange(langKey, newValue)
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
