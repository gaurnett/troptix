'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Menu, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

// Check if email is platform owner
const isPlatformOwner = (email?: string): boolean => {
  if (!email) return false;
  return email.endsWith('@usetroptix.com');
};

const getLinks = (userEmail?: string) => {
  const baseLinks = [
    { name: 'Dashboard', href: '/organizer', icon: Home },
    { name: 'Events', href: '/organizer/events', icon: Calendar },
  ];

  if (isPlatformOwner(userEmail)) {
    return [
      ...baseLinks,
      {
        name: 'Platform Events',
        href: '/organizer/platform/events',
        icon: Shield,
      },
    ];
  }

  return baseLinks;
};

// Returns true if the link should be active for the current pathname
const isActiveLink = (linkHref: string, pathname: string): boolean => {
  if (linkHref === '/organizer') {
    return pathname === '/organizer';
  }
  if (linkHref === '/organizer/platform/events') {
    return pathname?.startsWith('/organizer/platform');
  }
  return pathname?.startsWith(linkHref);
};

export function OrganizerHeader({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const links = getLinks(userEmail);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/organizer" className="text-2xl font-bold text-primary">
          TropTix
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActiveLink(link.href, currentPath)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex justify-between items-center mb-8">
                <Link
                  href="/organizer"
                  className="text-2xl font-bold text-primary"
                >
                  TropTix
                </Link>
              </div>
              <nav className="grid gap-4">
                {links.map((link) => (
                  <SheetClose asChild key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-lg font-medium transition-colors',
                        isActiveLink(link.href, currentPath)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
