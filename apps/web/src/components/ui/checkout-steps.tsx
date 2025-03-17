import { cn } from '@/lib/utils';

interface CheckoutStepsProps {
  current: number;
  steps: { title: string }[];
}

export function CheckoutSteps({ current, steps }: CheckoutStepsProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2',
                index <= current
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-background'
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                'mt-2 text-sm font-medium',
                index <= current ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="relative w-full h-2 bg-muted rounded-full">
        <div
          className="absolute h-full bg-primary rounded-full transition-all"
          style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
