// app/organizer/events/new/page.tsx

'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, X } from 'lucide-react';
import { eventFormSchema, EventFormValues } from '@/lib/schemas/eventSchema';
import {
  ticketTypeSchema,
  TicketTypeFormValues,
} from '@/lib/schemas/ticketSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AddTicketTypeDrawer } from '../_components/AddTicketTypeDrawer';
import { DatePicker } from '@/components/DatePicker';
import { formatTime, combineDateTime } from '@/lib/dateUtils';
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

import EventForm from '../_components/EventForm';
import { BackButton } from '@/components/ui/back-button';

export default function CreateEventPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-semibold">Create Event</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Define the details for a new event.
      </p>
      <EventForm initialData={null} />
    </div>
  );
}
