// app/organizer/events/new/_components/AddTicketTypeDrawer.tsx
'use client';

import React, { useEffect } from 'react'; // Removed useState for inputs
import { useForm, Controller } from 'react-hook-form'; // Import useForm, Controller
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DatePicker } from '@/components/DatePicker';
import { ChevronsUpDown } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Import RHF/Shadcn form components
import { ticketTypeSchema, TicketFormValues } from '@/lib/schemas/eventSchema';
import { Select } from '@/components/ui/select';
interface AddTicketTypeDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: TicketFormValues) => void;
  initialData?: Partial<TicketFormValues> & { id?: string };
  ticketSchema: z.ZodType<TicketFormValues>;
}

export function AddTicketTypeDrawer({
  open,
  setOpen,
  onSubmit: onSubmitProp,
  initialData,
}: AddTicketTypeDrawerProps) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: initialData || { name: '', price: 0, quantity: 1 },
  });

  // Reset form when drawer opens or initialData changes
  useEffect(() => {
    if (open) {
      console.log('Resetting drawer form with:', initialData);
      form.reset(initialData || { name: '', price: 0, quantity: 1 });
    }
  }, [initialData, open, form]); // form.reset is stable

  const onValidSubmit = (data: TicketFormValues) => {
    console.log('Submitting validated data from drawer:', data);
    const dataToSubmit = initialData?.id
      ? { ...data, id: initialData.id }
      : data;
    onSubmitProp(dataToSubmit);
    setOpen(false);
  };

  const onInvalidSubmit = (errors: any) => {
    console.error('Drawer form validation errors:', errors);
    // Errors are displayed inline via <FormMessage />
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="fit-content flex flex-col h-full">
        <SheetHeader className="text-left">
          <SheetTitle>
            {initialData?.id ? 'Edit Ticket Type' : 'Add New Ticket Type'}
          </SheetTitle>
          <SheetDescription>
            Configure ticket details. Click save when done.
          </SheetDescription>
        </SheetHeader>

        {/* Wrap drawer content in RHF Form Provider */}
        <Form {...form}>
          {/* Add form tag for submission trigger */}
          <form
            id="drawer-ticket-form"
            onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
            className="px-4 py-2 space-y-4 overflow-y-auto flex-grow"
          >
            {/* Use FormField for all inputs */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., General Admission" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description (Moved Here) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Includes access to main stage"
                      rows={2}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Collapsible Advanced Options */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm -ml-1"
                >
                  <ChevronsUpDown className="h-4 w-4 mr-1" /> Advanced Options
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 pt-4 border-t">
                {/* Sale Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="saleStartDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sale Starts Date *</FormLabel>
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
                    name="saleStartTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sale Starts Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value ?? ''}
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
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sale Ends Date *</FormLabel>
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
                    name="saleEndTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sale Ends Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Max Per User */}
                <FormField
                  control={form.control}
                  name="maxPurchasePerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Max Tickets Per Order{' '}
                        <span className="text-xs text-muted-foreground">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="e.g., 4"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.value
                            )
                          }
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ticketingFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticketing Fee Structure</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value: string) =>
                            field.onChange(value)
                          }
                        ></Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
            {/* Form submission is handled by the button in DrawerFooter */}
          </form>
        </Form>

        <SheetFooter className="pt-2 border-t justify-end gap-2">
          {/* Button now submits the internal drawer form */}
          <Button type="submit" form="drawer-ticket-form">
            {initialData?.id ? 'Save Changes' : 'Add Ticket Type'}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
