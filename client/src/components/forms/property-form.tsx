import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LanguageTabs } from "@/components/ui/language-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useCreateProperty, useUpdateProperty, useCities, useTypes } from "@/hooks/use-api";
import { propertyCreateSchema, type PropertyCreateInput } from "@shared/schema";
import type { PropertyDto, LanguageDto } from "@/types/api";
import { useState, useEffect } from "react";

interface PropertyFormProps {
  property?: PropertyDto | null;
  onSuccess?: () => void;
}

interface Room {
  name: string;
  sqft: number;
  amountOfPeople: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  kuulaEmbedCode?: string;
  iCalLink?: string;
}

export default function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const { data: cities = [] } = useCities();
  const { data: types = [] } = useTypes();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const isEditing = !!property;
  
  const [rooms, setRooms] = useState<Room[]>(property?.rooms || [
    {
      name: "",
      sqft: 0,
      amountOfPeople: 1,
      bedrooms: 1,
      bathrooms: 1,
      price: 0,
      kuulaEmbedCode: "",
      iCalLink: "",
    },
  ]);

  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema),
    defaultValues: {
      name: property?.name || "",
      slug: property?.slug || "",
      cityId: property?.cityId || 0,
      typeId: property?.typeId || 0,
      kuulaEmbedCode: property?.kuulaEmbedCode || "",
      mapUrl: property?.mapUrl || "",
      hostName: property?.hostName || "",
      hostNumber: property?.hostNumber || "",
      hostFacebookUrl: property?.hostFacebookUrl || "",
      hostInstagramUrl: property?.hostInstagramUrl || "",
      hostYoutubeUrl: property?.hostYoutubeUrl || "",
      rating: property?.rating || "",
      language: property?.language || {
        ka: "",
        en: "",
        ru: "",
      },
      rooms: property?.rooms || rooms,
    },
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName && !isEditing) {
      form.setValue("slug", generateSlug(watchName));
    }
  }, [watchName, form, isEditing]);

  // Update form when rooms change
  useEffect(() => {
    form.setValue("rooms", rooms);
  }, [rooms, form]);

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        name: "",
        sqft: 0,
        amountOfPeople: 1,
        bedrooms: 1,
        bathrooms: 1,
        price: 0,
        kuulaEmbedCode: "",
        iCalLink: "",
      },
    ]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const updateRoom = (index: number, field: keyof Room, value: string | number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value,
    };
    setRooms(updatedRooms);
  };

  const onSubmit = async (data: PropertyCreateInput) => {
    try {
      if (isEditing && property) {
        await updateMutation.mutateAsync({ id: property.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property name" {...field} data-testid="property-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="property-slug" {...field} data-testid="property-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="city-select">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="type-select">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="4.5"
                        {...field}
                        data-testid="property-rating"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Host name" {...field} data-testid="host-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+995 555 123 456"
                        {...field}
                        data-testid="host-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Multilingual Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <LanguageTabs
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {(language, value, onChange) => (
                      <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter property description in ${language === 'en' ? 'English' : language === 'ka' ? 'Georgian' : 'Russian'}...`}
                        rows={4}
                        data-testid={`description-${language}`}
                      />
                    )}
                  </LanguageTabs>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Virtual Tour & Media */}
        <Card>
          <CardHeader>
            <CardTitle>Virtual Tour & Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="kuulaEmbedCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuula Embed Code</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="font-mono text-sm"
                      placeholder="<iframe width='100%' height='480' src='https://kuula.co/share/collection/...' frameborder='0'></iframe>"
                      {...field}
                      data-testid="kuula-embed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mapUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://maps.google.com/embed?pb=..."
                      {...field}
                      data-testid="map-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Rooms Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rooms</CardTitle>
              <Button type="button" variant="outline" onClick={addRoom} data-testid="add-room">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room, index) => (
              <Card key={index} className="border border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Room {index + 1}</CardTitle>
                    {rooms.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoom(index)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`remove-room-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Room Name</Label>
                      <Input
                        placeholder="Standard Room"
                        value={room.name}
                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                        data-testid={`room-name-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Square Feet</Label>
                      <Input
                        type="number"
                        placeholder="250"
                        value={room.sqft || ''}
                        onChange={(e) => updateRoom(index, 'sqft', parseInt(e.target.value) || 0)}
                        data-testid={`room-sqft-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Price per Night</Label>
                      <Input
                        type="number"
                        placeholder="150"
                        value={room.price || ''}
                        onChange={(e) => updateRoom(index, 'price', parseInt(e.target.value) || 0)}
                        data-testid={`room-price-${index}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Max People</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={room.amountOfPeople || ''}
                        onChange={(e) => updateRoom(index, 'amountOfPeople', parseInt(e.target.value) || 1)}
                        data-testid={`room-people-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Bedrooms</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={room.bedrooms || ''}
                        onChange={(e) => updateRoom(index, 'bedrooms', parseInt(e.target.value) || 1)}
                        data-testid={`room-bedrooms-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={room.bathrooms || ''}
                        onChange={(e) => updateRoom(index, 'bathrooms', parseInt(e.target.value) || 1)}
                        data-testid={`room-bathrooms-${index}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Room Tour Embed</Label>
                      <Textarea
                        rows={2}
                        className="font-mono text-sm"
                        placeholder="<iframe src='https://kuula.co/room1'></iframe>"
                        value={room.kuulaEmbedCode || ''}
                        onChange={(e) => updateRoom(index, 'kuulaEmbedCode', e.target.value)}
                        data-testid={`room-kuula-${index}`}
                      />
                    </div>
                    <div>
                      <Label>iCal Calendar Link</Label>
                      <Input
                        type="url"
                        placeholder="https://calendar.google.com/calendar/ical/room1.ics"
                        value={room.iCalLink || ''}
                        onChange={(e) => updateRoom(index, 'iCalLink', e.target.value)}
                        data-testid={`room-ical-${index}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Host Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hostFacebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://facebook.com/username"
                        {...field}
                        data-testid="facebook-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostInstagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://instagram.com/username"
                        {...field}
                        data-testid="instagram-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostYoutubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://youtube.com/channel"
                        {...field}
                        data-testid="youtube-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} data-testid="save-property">
            {isLoading && <div className="loading-spinner w-4 h-4 mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update Property" : "Save Property"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
