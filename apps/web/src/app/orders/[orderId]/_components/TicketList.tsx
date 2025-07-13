'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For row click navigation
import { Eye, Download, Save, Info, X, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { EnrichedOrder, EnrichedTicket } from '../page';

interface TicketListInteractiveProps {
  order: EnrichedOrder;
}

export default function TicketListInteractive({
  order,
}: TicketListInteractiveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<EnrichedTicket | null>(
    null
  );
  const router = useRouter();
  const { event, tickets } = order;

  const handleViewTicketClick = (
    ticket: EnrichedTicket,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent row click from firing
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleRowClick = (ticketId: string) => {
    router.push(`/orders/${order.id}/tickets?ticketId=${ticketId}`);
  };

  const handleSaveTicket = () => {
    alert('Save Ticket functionality coming soon!');
  };

  const handleAddToWallet = () => {
    alert('Add to Wallet functionality coming soon!');
  };

  if (!tickets || tickets.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm sm:text-base">
        No individual tickets found in this order.
      </p>
    );
  }

  const ticketName = (ticket: EnrichedTicket) =>
    ticket.ticketsType === 'COMPLEMENTARY'
      ? 'Complementary'
      : ticket.ticketType?.name || 'Standard';

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="pl-4 pr-2 py-3 text-xs sm:text-sm">
                Ticket Holder
              </TableHead>
              <TableHead className="px-2 py-3 text-xs sm:text-sm">
                Type
              </TableHead>
              <TableHead className="px-2 py-3 text-xs sm:text-sm hidden md:table-cell">
                Email
              </TableHead>
              <TableHead className="pl-2 pr-4 py-3 text-xs sm:text-sm text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => handleRowClick(ticket.id)}
              >
                <TableCell className="pl-4 pr-2 py-4 font-medium text-xs sm:text-sm">
                  {ticket.firstName || '-'} {ticket.lastName || ''}
                </TableCell>
                <TableCell className="px-2 py-4 text-xs sm:text-sm">
                  {ticketName(ticket)}
                </TableCell>
                <TableCell className="px-2 py-4 text-xs sm:text-sm hidden md:table-cell">
                  {ticket.email || '-'}
                </TableCell>
                <TableCell className="pl-2 pr-4 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 group"
                    onClick={(e) => handleViewTicketClick(ticket, e)}
                    aria-label={`View ticket for ${ticket.firstName || ''} ${ticket.lastName || ''}`}
                  >
                    <Eye className="h-4 w-4 sm:mr-0 lg:mr-1 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="hidden lg:inline text-xs ml-1">
                      Preview
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedTicket && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className="sm:max-w-md md:max-w-lg p-0"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-xl sm:text-2xl">
                Ticket Preview
              </DialogTitle>
              <DialogDescription>
                This is your digital ticket for {event.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg text-center border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center">
                <QRCodeSVG
                  value={selectedTicket.id}
                  size={160}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'L'}
                  marginSize={2}
                />
                <p className="text-xs text-muted-foreground mt-3 tracking-wider">
                  {selectedTicket.id}
                </p>
              </div>
            </div>
            <DialogFooter className="p-6 pt-4 border-t bg-slate-50 dark:bg-slate-800/50 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveTicket}
                className="w-full"
              >
                <Download className="mr-1.5 h-4 w-4" /> Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToWallet}
                className="w-full"
              >
                <Smartphone className="mr-1.5 h-4 w-4" /> Wallet
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
                className="w-full sm:col-span-2"
              >
                <Link
                  href={`/orders/${order.id}/tickets?ticketId=${selectedTicket.id}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  <Info className="mr-1.5 h-4 w-4" /> Full Details
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
