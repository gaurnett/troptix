'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
} from '@/components/ui/form';
import {
  ticketTypeSchema,
  TicketTypeFormValues,
  TicketFeeStructure,
} from '@/lib/schemas/ticketSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { combineDateTime } from '@/lib/dateUtils';
import { formatTime } from '@/lib/dateUtils';
import { TicketType } from '@prisma/client';

interface AddTicketTypeDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: TicketTypeFormValues) => void;
  initialData?: Partial<TicketTypeFormValues> & { id?: string };
  ticketSchema: z.ZodType<TicketTypeFormValues>;
  eventStartDate: Date;
}

export function AddTicketTypeDrawer({
  open,
  setOpen,
  onSubmit: onSubmitProp,
  initialData,
  eventStartDate,
}: AddTicketTypeDrawerProps) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const defaultValues = {
    name: 'Default Ticket',
    price: 0,
    quantity: 100,
    maxPurchasePerUser: 10,
    ticketingFees: 'PASS_TICKET_FEES' as const,
    saleStartDateTime: today,
    saleEndDateTime: eventStartDate || tomorrow,
  };
  console.log('initialData', initialData);
  const form = useForm<TicketTypeFormValues>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: initialData || defaultValues,
  });

  const onValidSubmit = (data: TicketTypeFormValues) => {
    console.log('Submitting validated data from drawer:', data);
    const dataToSubmit = initialData?.id
      ? { ...data, id: initialData.id }
      : data;
    onSubmitProp(dataToSubmit);
    setOpen(false);
  };

  const onInvalidSubmit = (errors: any) => {
    console.error('Drawer form validation errors:', errors);
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

        <Form {...form}>
          <form
            id="drawer-ticket-form"
            onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
            className="px-4 py-2 space-y-4 overflow-y-auto flex-grow"
          >
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
                <div>
                  <FormField
                    control={form.control}
                    name="saleStartDateTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sale Starts *</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            {/* DatePicker handles the date part */}
                            <DatePicker
                              date={field.value}
                              onDateChange={(newDate) => {
                                const currentTime = formatTime(field.value);
                                const combined = combineDateTime(
                                  newDate,
                                  currentTime
                                );
                                field.onChange(combined);
                              }}
                              placeholder="Select start date"
                            />
                          </FormControl>
                          <FormControl>
                            {/* Separate input for time */}
                            <Input
                              type="time"
                              defaultValue={formatTime(field.value)}
                              onChange={(e) => {
                                const time = e.target.value;
                                const currentDate = field.value;
                                const combined = combineDateTime(
                                  currentDate,
                                  time
                                );
                                field.onChange(combined);
                              }}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="pt-1">
                          When tickets become available.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="saleEndDateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Sale Ends *</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          {/* DatePicker handles the date part */}
                          <DatePicker
                            date={field.value}
                            onDateChange={(newDate) => {
                              const currentTime = formatTime(field.value);
                              const combined = combineDateTime(
                                newDate,
                                currentTime
                              );
                              field.onChange(combined);
                            }}
                            placeholder="Select end date"
                          />
                        </FormControl>
                        <FormControl>
                          {/* Separate input for time */}
                          <Input
                            type="time"
                            defaultValue={formatTime(field.value)}
                            onChange={(e) => {
                              const time = e.target.value;
                              const currentDate = field.value;
                              const combined = combineDateTime(
                                currentDate,
                                time
                              );
                              field.onChange(combined);
                            }}
                            className="w-[120px]"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="pt-1">
                        When ticket sales stop.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fee handling" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PASS_TICKET_FEES">
                              Pass fees on to buyer (Recommended)
                            </SelectItem>
                            <SelectItem value="ABSORB_TICKET_FEES">
                              Absorb fees into ticket price
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Choose how ticketing platform fees are handled.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
          </form>
        </Form>

        <SheetFooter className="pt-2 border-t justify-end gap-2">
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
