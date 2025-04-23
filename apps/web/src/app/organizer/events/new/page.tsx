// app/organizer/events/new/page.tsx
'use client'; // This page requires client-side interactivity

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form'; // Import RHF elements (we'll use useState for now)
// import { addDays, format } from 'date-fns'; // Added for Date Range Picker
// import { Calendar as CalendarIcon, X } from 'lucide-react'; // Added CalendarIcon, keep X
// import type { DateRange } from 'react-day-picker'; // Added for Date Range Picker type

import { cn } from '@/lib/utils'; // Added for cn utility
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar'; // Added for Date Range Picker
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // Added for Date Range Picker
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// === Date Range Picker Component ===
// interface DatePickerWithRangeProps
//   extends React.HTMLAttributes<HTMLDivElement> {
//   date: DateRange | undefined;
//   onDateChange: (date: DateRange | undefined) => void;
//   className?: string;
// }

// function DatePickerWithRange({
//   className,
//   date,
//   onDateChange,
// }: DatePickerWithRangeProps) {
//   return (
//     <div className={cn('grid gap-2', className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={'outline'}
//             className={cn(
//               'w-full justify-start text-left font-normal', // Changed width to full
//               !date && 'text-muted-foreground'
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" /> {/* Added margin */}
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, 'LLL dd, y')} -{' '}
//                   {format(date.to, 'LLL dd, y')}
//                 </>
//               ) : (
//                 format(date.from, 'LLL dd, y')
//               )
//             ) : (
//               <span>Pick a date range</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={onDateChange} // Use the passed setter
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
// ===================================

// Define type for quick-add tickets
interface QuickTicketType {
  id: number; // Simple ID for list key
  name: string;
  price: number;
  quantity: number;
}

export default function CreateEventPage() {
  // === State Management ===
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  //   const [dateRange, setDateRange] = useState<DateRange | undefined>(); // Added dateRange state
  const [venue, setVenue] = useState('');
  // --- Settings State ---
  const [isPublic, setIsPublic] = useState(true);
  const [listOnSite, setListOnSite] = useState(true);
  const [capacity, setCapacity] = useState<number | string>('');
  // --- Quick Add Tickets State ---
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState<number | string>('');
  const [ticketQuantity, setTicketQuantity] = useState<number | string>('');
  const [addedTickets, setAddedTickets] = useState<QuickTicketType[]>([]);
  // ============================================================

  // === Quick Add Ticket Handlers ===
  const handleAddTicket = () => {
    const priceNum = parseFloat(String(ticketPrice));
    const quantityNum = parseInt(String(ticketQuantity), 10);

    if (
      ticketName &&
      !isNaN(priceNum) &&
      priceNum >= 0 &&
      !isNaN(quantityNum) &&
      quantityNum > 0
    ) {
      setAddedTickets([
        ...addedTickets,
        {
          id: Date.now(), // Simple unique key for list rendering
          name: ticketName,
          price: priceNum,
          quantity: quantityNum,
        },
      ]);
      // Reset fields
      setTicketName('');
      setTicketPrice('');
      setTicketQuantity('');
    } else {
      // Basic validation feedback (replace with RHF validation later)
      alert(
        'Please enter valid ticket name, non-negative price, and positive quantity.'
      );
    }
  };

  const handleRemoveTicket = (idToRemove: number) => {
    setAddedTickets(addedTickets.filter((ticket) => ticket.id !== idToRemove));
  };
  // ==================================

  // === Form Submission (Placeholder) ===
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving Draft...', {
      eventName,
      description,
      dateRange,
      addedTickets,
    });
    alert('Save Draft clicked (check console)');
    // Implement actual save logic here
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Publishing Event...', {
      eventName,
      description,
      dateRange,
      addedTickets,
    });
    alert('Publish Event clicked (check console)');
    // Implement actual publish logic + validation here
  };
  // =====================================

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>

      {/* Use form tag - handleSubmit will be added with RHF */}
      <form className="space-y-8" onSubmit={handlePublish}>
        {' '}
        {/* Main Content: Details */}
        {/* Adjusted grid: Removed flyer column, details take full width on larger screens */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Enter the core information for your event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g., Annual Summer Concert"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell attendees about the event..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="eventDateRange">Date Range</Label>
              {/* <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                className="mt-1" // Add margin if needed
              /> */}
            </div>
            <div>
              <Label htmlFor="venue">Venue / Location</Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Kingston Waterfront or Online"
                required
              />
            </div>
            {/* Optional Category Select Here */}
          </CardContent>
        </Card>
        {/* Separator remains */}
        <Separator />
        {/* Event Settings Card remains */}
        <Card>
          <CardHeader>
            <CardTitle>Event Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="isPublic" className="flex flex-col space-y-1">
                <span>Event Visibility</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Public events are discoverable. Private events require a
                  direct link.
                </span>
              </Label>
              {/* Replace with <Controller> for RHF */}
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                aria-label="Event Visibility"
              />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="listOnSite" className="flex flex-col space-y-1">
                <span>List on Troptix</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow this event to be featured on the main Troptix site (if
                  public).
                </span>
              </Label>
              {/* Replace with <Controller> for RHF */}
              <Switch
                id="listOnSite"
                checked={listOnSite}
                onCheckedChange={setListOnSite}
                aria-label="List on Troptix"
              />
            </div>
            <div>
              <Label htmlFor="capacity">
                Total Event Capacity{' '}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g., 500"
                min="0"
              />
            </div>
          </CardContent>
        </Card>
        {/* Separator remains */}
        <Separator />
        {/* Quick Add Ticket Types Card remains */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Types</CardTitle>
            <CardDescription>
              Add at least one ticket type to sell. You can add more details
              later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-7">
              <div className="sm:col-span-3">
                <Label htmlFor="ticketName">Ticket Name</Label>
                <Input
                  id="ticketName"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="e.g., General Admission"
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="ticketPrice">Price ($)</Label>
                <Input
                  id="ticketPrice"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 25.00"
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="ticketQuantity">Quantity</Label>
                <Input
                  id="ticketQuantity"
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="sm:col-span-2 flex items-end">
                <Button
                  type="button"
                  onClick={handleAddTicket}
                  className="w-full sm:w-auto"
                >
                  Add Ticket Type
                </Button>
              </div>
            </div>

            {/* List Added Tickets */}
            {addedTickets.length > 0 && (
              <div className="mt-6 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addedTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          {ticket.name}
                        </TableCell>
                        <TableCell>${ticket.price.toFixed(2)}</TableCell>
                        <TableCell>{ticket.quantity}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemoveTicket(ticket.id)}
                            type="button"
                          >
                            {/* <X className="h-4 w-4" /> */}
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Separator remains */}
        <Separator />
        {/* Action Buttons remain */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button type="submit">Publish Event</Button>{' '}
          {/* Default form submit */}
        </div>
      </form>
    </div>
  );
}
