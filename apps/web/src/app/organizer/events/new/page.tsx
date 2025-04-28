// app/organizer/events/new/page.tsx

'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, setHours, setMinutes, setSeconds, parse } from 'date-fns';
import { Edit, X } from 'lucide-react';
import { eventFormSchema, EventFormValues } from '@/lib/schemas/eventSchema';
import { ticketTypeSchema, TicketFormValues } from '@/lib/schemas/eventSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AddTicketTypeDrawer } from '../_components/AddTicketTypeDrawer';
import { DatePicker } from '@/components/DatePicker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Added shadcn Form components

import { usePlacesWidget } from 'react-google-autocomplete';
import { PlusCircle } from 'lucide-react';

const combineDateAndTime = (
  date: Date | undefined,
  time: string | undefined
): Date | null => {
  if (!date || !time) {
    return null; // Cannot combine if either is missing
  }
  try {
    // Parse time string HH:mm
    const parsedTime = parse(time, 'HH:mm', new Date());
    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    // Set hours and minutes on the date object
    let combined = setHours(date, hours);
    combined = setMinutes(combined, minutes);
    combined = setSeconds(combined, 0); // Set seconds to 00
    return combined;
  } catch (error) {
    // Should never happen
    console.error('Error parsing time:', time, error);
    return null;
  }
};

export default function CreateEventPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(
    null
  );
  const [currentTicketData, setCurrentTicketData] = useState<
    Partial<TicketFormValues> | undefined
  >(undefined);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),

    defaultValues: {
      eventName: '',
      description: '',
      organizer: '',
      startDate: undefined,
      startTime: '',
      endDate: undefined,
      endTime: '',
      venue: '',
      address: '',
      country: '',
      countryCode: '',
      latitude: null,
      longitude: null,
      tickets: [],
    },

    mode: 'onChange',
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'tickets',
  });

  const handleOpenDrawerForNew = () => {
    setEditingTicketIndex(null);
    setCurrentTicketData({ name: '', price: 0, quantity: 1 });
    setIsDrawerOpen(true);
  };

  const handleOpenDrawerForEdit = (index: number) => {
    setEditingTicketIndex(index);
    const ticketToEdit = fields[index];
    setCurrentTicketData({
      id: ticketToEdit.id,
      name: ticketToEdit.name,
      price: ticketToEdit.price,
      quantity: ticketToEdit.quantity,
      saleStartDate: ticketToEdit.saleStartDate,
      saleStartTime: ticketToEdit.saleStartTime,
      saleEndDate: ticketToEdit.saleEndDate,
      saleEndTime: ticketToEdit.saleEndTime,
      description: ticketToEdit.description,
      maxPurchasePerUser: ticketToEdit.maxPurchasePerUser,
    });
    setIsDrawerOpen(true);
  };

  const handleDrawerSubmit = (ticketData: TicketFormValues) => {
    const { id: rhfId, ...dataToSave } = ticketData;

    if (editingTicketIndex !== null) {
      update(editingTicketIndex, dataToSave);
      console.log('Updated ticket at index', editingTicketIndex, dataToSave);
    } else {
      append(dataToSave);
      console.log('Appended new ticket:', dataToSave);
    }
  };

  const handlePlaceSelected = (
    place: google.maps.places.PlaceResult | null
  ) => {
    if (!place) {
      console.warn('Autocomplete returned no place data.');
      return;
    }

    console.log('Place selected:', place);

    let country = '';
    let countryCode = '';
    let lat = 0;
    let lng = 0;

    place.address_components?.forEach((component) => {
      if (component.types.includes('country')) {
        country = component.long_name;
        countryCode = component.short_name;
      }
    });

    if (place.geometry?.location) {
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
    }

    const formattedAddress = place.formatted_address ?? place.name ?? '';

    form.setValue('address', formattedAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue('country', country || undefined, { shouldDirty: true }); // Set to undefined if empty
    form.setValue('countryCode', countryCode || undefined, {
      shouldDirty: true,
    });
    form.setValue('latitude', lat, { shouldDirty: true }); // lat/lng can be null
    form.setValue('longitude', lng, { shouldDirty: true });

    if (place.name && place.name !== formattedAddress.split(',')[0]) {
      if (!form.getValues('venue')) {
        form.setValue('venue', place.name, { shouldDirty: true });
      }
    }
  };

  const { ref: placesRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    onPlaceSelected: handlePlaceSelected,
    options: {
      componentRestrictions: { country: ['jm', 'us', 'ca', 'gb', 'tt'] },
      fields: [
        'address_components',
        'geometry.location',
        'formatted_address',
        'name',
      ],
      types: ['geocode', 'establishment'],
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const startDateTime = combineDateAndTime(data.startDate, data.startTime);
    const endDateTime = combineDateAndTime(data.endDate, data.endTime);

    const formattedStartDateTime = startDateTime
      ? format(startDateTime, 'yyyy-MM-dd HH:mm:ss')
      : null;
    const formattedEndDateTime = endDateTime
      ? format(endDateTime, 'yyyy-MM-dd HH:mm:ss')
      : null;

    const submissionData = {
      ...data,
      name: data.eventName,
      startDate: formattedStartDateTime ?? '',
      endDate: formattedEndDateTime ?? '',
      startTime: '',
      endTime: '',
    };

    Object.keys(submissionData).forEach((key) => {
      if (submissionData[key] === undefined) {
        delete submissionData[key];
      }
    });

    // TODO: Add logic to handle the creation of the event
    console.log('Publishing Event (Formatted Data):', submissionData);
  };

  // Add an error handler
  const onError = (errors: FieldErrors<EventFormValues>) => {
    console.error('Form validation errors:', errors);
    // TODO:  add a toast notification here to show errors
    alert('Form has validation errors. Check the console.');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Image</CardTitle>

              <CardDescription>
                Upload an image for your event. (Coming soon!)
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md text-muted-foreground">
                Image Upload Placeholder
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Event Form */}

        <div className="md:w-2/3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>

                  <CardDescription>
                    Enter the core information for your event.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Event Name */}

                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>

                        <FormControl>
                          <Input
                            placeholder="e.g., Annual Summer Concert"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Tell attendees about the event..."
                            rows={4}
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Troptix Events"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          This is the name of who is organizing the event and
                          will be displayed to attendees.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>

                            <FormControl>
                              <DatePicker
                                date={field.value}
                                onDateChange={field.onChange}
                                placeholder="Select start date"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Time</FormLabel>

                            <FormControl>
                              <Input
                                type="time"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>

                            <FormControl>
                              <DatePicker
                                date={field.value}
                                onDateChange={field.onChange}
                                placeholder="Select end date"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Time</FormLabel>

                            <FormControl>
                              <Input
                                type="time"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address / Location Details</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Start typing address, e.g., Hope Road, Kingston"
                            {...field}
                            ref={(el) => {
                              field.ref(el);
                              (
                                placesRef as React.MutableRefObject<HTMLInputElement | null>
                              ).current = el;
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Google Maps will suggest addresses as you type.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Venue */}

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue / Location</FormLabel>

                        <FormControl>
                          <Input
                            placeholder="e.g., Kingston Waterfront or Online"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Event Visibility</FormLabel>

                          <FormDescription>
                            When set to public, this event will be discoverable.
                            When set to private, this event will require a
                            direct link.
                          </FormDescription>
                        </div>

                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label="Event Visibility"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Total Event Capacity{' '}
                          <span className="text-xs text-muted-foreground">
                            (Optional)
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="e.g., 500"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Separator /> */}
              <Separator />

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ticket Types</CardTitle>
                      <CardDescription>
                        Manage tickets for your event.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleOpenDrawerForNew}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Ticket Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {fields.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price ($)</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">
                                {field.name}
                              </TableCell>
                              <TableCell>${field.price?.toFixed(2)}</TableCell>
                              <TableCell>{field.quantity}</TableCell>
                              <TableCell className="text-right space-x-1">
                                {/* Edit Button -> Opens drawer */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleOpenDrawerForEdit(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                {/* Remove Button -> RHF remove */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => remove(index)}
                                  type="button"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No ticket types added yet. Add one to publish.
                    </p>
                  )}
                  {/* RHF Array Error Message */}
                  {form.formState.errors.tickets &&
                    !Array.isArray(form.formState.errors.tickets) && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {form.formState.errors.tickets.message ||
                          form.formState.errors.tickets.root?.message}
                      </p>
                    )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button type="submit">Save Event</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>{' '}
      <AddTicketTypeDrawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        onSubmit={handleDrawerSubmit} // Parent function to update RHF state
        initialData={currentTicketData} // Pass data for editing/defaults for new
        ticketSchema={ticketTypeSchema} // Pass schema for validation within drawer
      />
    </div>
  );
}
