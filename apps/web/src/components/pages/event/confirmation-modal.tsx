// Create a new file, e.g., components/checkout/AdjustmentConfirmationModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ValidationResponse } from '@/types/checkout';
import { getFormattedCurrency } from '@/lib/utils'; // Adjust path

interface AdjustmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  response: ValidationResponse | null;
}

export function AdjustmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  response,
}: AdjustmentConfirmationModalProps) {
  if (!response) return null; // Don't render if no data

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {' '}
      <DialogContent className="sm:max-w-lg">
        {' '}
        <DialogHeader>
          <DialogTitle>Confirm Cart Changes</DialogTitle>
          <DialogDescription>
            Some items in your cart were adjusted due to availability. Please
            review the updated details below.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-4 max-h-60 overflow-y-auto p-1">
          <h4 className="font-semibold mb-2">Updated Items:</h4>
          {response.validatedItems
            .filter((item) => item.validatedQuantity > 0)
            .map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm py-2"
              >
                <span>
                  {item.validatedQuantity} x {item.name}
                </span>
                <span>
                  {getFormattedCurrency(
                    item.pricePerTicket * item.validatedQuantity
                  )}
                </span>
              </div>
            ))}
          <div
            style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }}
            className="my-4"
          />
          <div className="pt-2 font-semibold flex justify-between text-base">
            {' '}
            <span>New Total:</span>
            <span>{getFormattedCurrency(response.total)}</span>
          </div>
        </div>
        <DialogFooter className="sm:justify-between pt-4">
          {' '}
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel Order
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm & Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
