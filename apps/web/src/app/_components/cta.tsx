'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  CalculatorIcon,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { ContactForm } from './contact-form';
import Link from 'next/link';
import { useFeatureFlagEnabled } from 'posthog-js/react';

export default function CTA() {
  const showCreateEvent = useFeatureFlagEnabled('show-create-event-button');

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to create your next event?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of organizers who trust TropTix to deliver
              exceptional ticketing experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {showCreateEvent && (
                <Link href="/organizer/events/new">
                  <Button size="lg" className="group">
                    <Calendar className="mr-2 h-5 w-5" />
                    Create Event
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
              <Link
                href="https://calendar.app.google/dFkiNqFHyauhMRTFA"
                target="_blank"
              >
                <Button size="lg" className="group">
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                  Book a Demo
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center lg:justify-start">
              <MessageCircle className="h-4 w-4" />
              <span>Or get in touch to learn more</span>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
